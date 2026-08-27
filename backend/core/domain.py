"""Shared domain contract for prediction, persistence, and client metadata.

The constants and Pydantic models in this module define the stable API contract.
Keeping them together prevents the FastAPI routes, model service, and secondary
interfaces from silently drifting apart as new fields are added.
"""

from __future__ import annotations

from typing import Any

from pydantic import BaseModel, Field


VALID_VALUES: dict[str, list[str]] = {
    "state": ["Bihar", "Gujarat", "Karnataka", "Madhya Pradesh", "Maharashtra", "Odisha", "Rajasthan", "Tamil Nadu", "Uttar Pradesh", "West Bengal"],
    "district": ["Ahmedabad", "Aurangabad", "Bengaluru", "Bhopal", "Bhubaneswar", "Chennai", "Coimbatore", "Cuttack", "Gaya", "Ghaziabad", "Gwalior", "Howrah", "Hubballi", "Indore", "Jabalpur", "Jaipur", "Jodhpur", "Kanpur", "Kolkata", "Kota", "Lucknow", "Madurai", "Meerut", "Muzaffarpur", "Mysuru", "Nagpur", "Nashik", "Noida", "Patna", "Pune", "Rajkot", "Rourkela", "Siliguri", "Surat", "Thane", "Udaipur", "Vadodara", "Varanasi"],
    "project_type": ["Airport Expansion", "Dam/Reservoir", "Industrial Corridor", "Irrigation Canal", "National Highway", "Power Transmission Line", "Railway Line", "SEZ Development", "State Highway", "Urban Metro"],
    "compensation_status": ["Fully Disbursed", "Not Disbursed", "Partially Disbursed"],
    "approval_stage": ["Award Declared", "Notification (Sec 11)", "Possession Complete", "Possession Initiated", "Rehabilitation Ongoing", "SIA Completed"],
    "legal_dispute_status": ["Ongoing - High Court", "Ongoing - Lower Court", "Ongoing - Supreme Court", "Resolved Against", "Resolved in Favor"],
    "possession_status": ["Fully Complete", "Not Started", "Partially Complete"],
    "inter_department_coordination_issues": ["High", "Low", "Medium"],
}

CATEGORICAL_COLS = list(VALID_VALUES)
NUMERIC_COLS = [
    "land_area_hectares", "affected_families", "compensation_disbursed_pct",
    "days_since_notification", "legal_disputes_count",
    "rehabilitation_progress_pct", "stakeholder_responsiveness_score",
    "historical_district_delay_rate", "planned_duration_days", "project_age_days",
]

FEATURE_LABELS = {
    "land_area_hectares": "Land area", "affected_families": "Affected families",
    "compensation_disbursed_pct": "Compensation disbursed", "days_since_notification": "Notification age",
    "legal_disputes_count": "Legal dispute count", "rehabilitation_progress_pct": "Rehabilitation progress",
    "stakeholder_responsiveness_score": "Stakeholder responsiveness", "historical_district_delay_rate": "Historical district delay rate",
    "planned_duration_days": "Planned duration", "project_age_days": "Project age", "state": "State",
    "district": "District", "project_type": "Project type", "compensation_status": "Compensation status",
    "approval_stage": "Approval stage", "legal_dispute_status": "Legal dispute status",
    "possession_status": "Possession status", "inter_department_coordination_issues": "Inter-department coordination",
}


class ProjectInput(BaseModel):
    """Validated model input for one land-acquisition project."""

    state: str
    district: str
    project_type: str
    land_area_hectares: float = Field(..., ge=0)
    affected_families: int = Field(..., ge=0)
    compensation_status: str
    compensation_disbursed_pct: float = Field(..., ge=0, le=100)
    approval_stage: str
    days_since_notification: int = Field(..., ge=0)
    legal_disputes_count: int = Field(..., ge=0)
    legal_dispute_status: str | None = None
    possession_status: str
    rehabilitation_progress_pct: float = Field(..., ge=0, le=100)
    stakeholder_responsiveness_score: float = Field(..., ge=0, le=10)
    historical_district_delay_rate: float = Field(..., ge=0, le=1)
    inter_department_coordination_issues: str
    planned_duration_days: int = Field(..., ge=1)
    project_age_days: int = Field(..., ge=0)


class PredictionResponse(BaseModel):
    """Stable response returned by the prediction endpoint."""

    risk_category: str
    delay_probability: float
    risk_probabilities: dict[str, float]
    model_feature_importances: list[dict[str, Any]] = Field(default_factory=list)


class AssessmentCreate(BaseModel):
    """Request body for an assessment that should be predicted and stored."""

    project_name: str = Field(..., min_length=1, max_length=180)
    project: ProjectInput


class LoginRequest(BaseModel):
    """Request body for selecting one of the demo accounts."""

    account_id: str = Field(..., min_length=1)


class OutcomeUpdate(BaseModel):
    """Observed outcome used by the monitoring feedback loop."""

    actual_delay_days: int = Field(..., ge=0)
    actual_completed_at: str | None = None


class RecommendRequest(BaseModel):
    """Prediction context supplied to the recommendation service."""

    project: ProjectInput
    risk_category: str
    delay_probability: float


class RecommendResponse(BaseModel):
    """Normalized recommendation response returned to browser clients."""

    risk_category: str
    recommendations: list[str]
