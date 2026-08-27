"""LandGuard FastAPI composition root.

This module owns only HTTP concerns: application construction, CORS wiring, and
route orchestration. Domain contracts live in ``core.domain``; configuration in
``core.config``; persistence in ``infrastructure.database``; and model,
authentication, and recommendation behavior in ``services``. That separation
keeps the public API backward-compatible while localizing future changes such
as a managed database, real identity provider, or model version.
"""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware

try:  # Supports both `uvicorn backend.app:app` and Render's app-dir command.
    from backend.core.config import settings
    from backend.core.domain import (
        AssessmentCreate,
        CATEGORICAL_COLS,
        NUMERIC_COLS,
        PredictionResponse,
        ProjectInput,
        RecommendRequest,
        RecommendResponse,
        OutcomeUpdate,
        LoginRequest,
        VALID_VALUES,
    )
    from backend.infrastructure.database import (
        calculate_accuracy,
        initialize_database,
        insert_assessment,
        insert_audit_event,
        list_assessments as fetch_assessments,
        list_audit_events,
        update_assessment_outcome,
    )
    from backend.services.authentication import authenticate, issue_session, public_accounts
    from backend.services.model_service import ModelService
    from backend.services.recommendation_service import RecommendationService
except ModuleNotFoundError:  # pragma: no cover - direct `cd backend && uvicorn app:app`
    from core.config import settings
    from core.domain import (
        AssessmentCreate,
        CATEGORICAL_COLS,
        NUMERIC_COLS,
        PredictionResponse,
        ProjectInput,
        RecommendRequest,
        RecommendResponse,
        OutcomeUpdate,
        LoginRequest,
        VALID_VALUES,
    )
    from infrastructure.database import (
        calculate_accuracy,
        initialize_database,
        insert_assessment,
        insert_audit_event,
        list_assessments as fetch_assessments,
        list_audit_events,
        update_assessment_outcome,
    )
    from services.authentication import authenticate, issue_session, public_accounts
    from services.model_service import ModelService
    from services.recommendation_service import RecommendationService


app = FastAPI(
    title="LandGuard — Land Acquisition Delay Predictor",
    description=(
        "AI-powered predictive analytics system for land acquisition delays. "
        "Submit project parameters and receive a risk category (Low / Medium / High) "
        "along with a delay probability score."
    ),
    version="1.0.0",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=list(settings.frontend_origins),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

initialize_database(settings.database_path)
model_service = ModelService(settings.model_dir)
recommendation_service = RecommendationService(settings)


@app.get("/health")
async def health() -> dict[str, Any]:
    """Report service readiness without exposing secrets or model internals."""
    return {"status": "healthy", "models_loaded": model_service.loaded, "ai_recommendations": recommendation_service.enabled}


@app.get("/api/accounts")
async def accounts() -> list[dict[str, Any]]:
    """List safe demo-account metadata for the account switcher."""
    return public_accounts()


@app.post("/api/login")
async def login(request: LoginRequest) -> dict[str, Any]:
    """Issue a temporary bearer token for one of the supported demo accounts."""
    token, user = issue_session(request.account_id)
    return {"token": token, "user": user}


@app.get("/api/features")
async def get_features() -> dict[str, list[dict[str, Any]]]:
    """Return the model field contract used by dynamic browser forms."""
    numeric_features = [{"name": column, "type": "numeric"} for column in NUMERIC_COLS]
    categorical_features = [{"name": column, "type": "categorical", "options": VALID_VALUES[column]} for column in CATEGORICAL_COLS]
    return {"features": numeric_features + categorical_features}


@app.post("/api/predict", response_model=PredictionResponse)
async def predict(project: ProjectInput) -> PredictionResponse:
    """Run the real model service and translate service failures into HTTP errors."""
    try:
        return PredictionResponse(**model_service.predict(project))
    except RuntimeError as error:
        raise HTTPException(503, str(error)) from error
    except Exception as error:
        raise HTTPException(500, f"Prediction failed: {error}") from error


@app.get("/api/assessments")
async def list_assessments(limit: int = 50, authorization: str | None = Header(default=None)) -> list[dict[str, Any]]:
    """List recent persisted assessments for an authorized user."""
    authenticate(authorization, "assess")
    return fetch_assessments(settings.database_path, limit)


@app.post("/api/assessments")
async def create_assessment(request: AssessmentCreate, authorization: str | None = Header(default=None)) -> dict[str, Any]:
    """Predict, persist, audit, and return one assessment as one transaction flow."""
    user = authenticate(authorization, "assess")
    prediction = await predict(request.project)
    created_at = datetime.now(timezone.utc).isoformat()
    assessment_id = insert_assessment(settings.database_path, request.project_name, request.project.model_dump(), prediction.model_dump(), user["id"], created_at)
    insert_audit_event(settings.database_path, user, "assessment.created", "assessment", str(assessment_id))
    return {"id": assessment_id, "project_name": request.project_name, "project": request.project.model_dump(), **prediction.model_dump(), "created_at": created_at, "created_by": user["id"]}


@app.patch("/api/assessments/{assessment_id}/outcome")
async def record_outcome(assessment_id: int, outcome: OutcomeUpdate, authorization: str | None = Header(default=None)) -> dict[str, Any]:
    """Store an observed delay and feed it into the monitoring loop."""
    user = authenticate(authorization, "record_outcome")
    completed_at = outcome.actual_completed_at or datetime.now(timezone.utc).isoformat()
    if not update_assessment_outcome(settings.database_path, assessment_id, outcome.actual_delay_days, completed_at):
        raise HTTPException(404, "Assessment not found.")
    insert_audit_event(settings.database_path, user, "assessment.outcome_recorded", "assessment", str(assessment_id))
    return {"id": assessment_id, "actual_delay_days": outcome.actual_delay_days, "actual_completed_at": completed_at}


@app.get("/api/monitoring/accuracy")
async def monitoring_accuracy(authorization: str | None = Header(default=None)) -> dict[str, Any]:
    """Return feedback-loop accuracy metrics for authorized assessors."""
    authenticate(authorization, "assess")
    return calculate_accuracy(settings.database_path)


@app.get("/api/audit-log")
async def audit_log(limit: int = 50, authorization: str | None = Header(default=None)) -> list[dict[str, Any]]:
    """Return recent audit entries for administrators with audit permission."""
    authenticate(authorization, "view_audit")
    return list_audit_events(settings.database_path, limit)


@app.post("/api/recommend", response_model=RecommendResponse)
async def recommend(request: RecommendRequest) -> RecommendResponse:
    """Generate optional AI recommendations with explicit provider failures."""
    try:
        recommendations = recommendation_service.generate(request.project, request.risk_category, request.delay_probability)
        return RecommendResponse(risk_category=request.risk_category, recommendations=recommendations)
    except RuntimeError as error:
        raise HTTPException(503, str(error)) from error
    except Exception as error:
        raise HTTPException(500, f"AI recommendation failed: {error}") from error
