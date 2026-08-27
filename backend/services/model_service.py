"""Model loading and inference service for the LandGuard prediction API.

``ModelService`` owns model artifacts, dataframe construction, output
normalization, and explainability. The route layer only validates input and
serializes the service result, making a future model version or provider swap
localized to this module.
"""

from __future__ import annotations

from pathlib import Path
from typing import Any

import joblib
import pandas as pd

from backend.core.domain import CATEGORICAL_COLS, FEATURE_LABELS, NUMERIC_COLS, ProjectInput


class ModelService:
    """Load the shipped pipelines and expose deterministic prediction methods."""

    def __init__(self, model_dir: Path) -> None:
        self.model_dir = model_dir
        self.risk_classifier: Any = None
        self.delay_regressor: Any = None
        self.label_encoder: Any = None
        self.loaded = False
        self._load_models()

    def _load_models(self) -> None:
        """Load all artifacts together so partial model availability is impossible."""
        try:
            self.risk_classifier = joblib.load(self.model_dir / "risk_classifier.joblib")
            self.delay_regressor = joblib.load(self.model_dir / "delay_regressor.joblib")
            if hasattr(self.delay_regressor, "steps"):
                self.delay_regressor.steps[-1][1].set_params(device="cpu")
            self.label_encoder = joblib.load(self.model_dir / "risk_label_encoder.joblib")
            self.loaded = True
        except Exception as error:  # pragma: no cover - deployment-specific artifact failures
            print(f"Warning: Could not load models: {error}")
            self.risk_classifier = self.delay_regressor = self.label_encoder = None
            self.loaded = False

    @staticmethod
    def _frame(project: ProjectInput) -> pd.DataFrame:
        """Convert the validated domain object into the model’s training schema."""
        data = {column: [getattr(project, column)] for column in NUMERIC_COLS + CATEGORICAL_COLS}
        if data["legal_dispute_status"][0] is None:
            data["legal_dispute_status"] = ["None"]
        return pd.DataFrame(data)

    def predict(self, project: ProjectInput) -> dict[str, Any]:
        """Return normalized risk, delay, class probabilities, and XAI drivers."""
        if not self.loaded:
            raise RuntimeError("Models not loaded.")
        frame = self._frame(project)
        risk_encoded = self.risk_classifier.predict(frame)[0]
        risk_probabilities = self.risk_classifier.predict_proba(frame)[0]
        risk_category = self.label_encoder.inverse_transform([risk_encoded])[0]
        probabilities = {label: round(float(value), 4) for label, value in zip(self.label_encoder.classes_, risk_probabilities)}
        delay_probability = max(0.0, min(1.0, float(self.delay_regressor.predict(frame)[0])))
        return {
            "risk_category": risk_category,
            "delay_probability": round(delay_probability, 4),
            "risk_probabilities": probabilities,
            "model_feature_importances": self.feature_importances(),
        }

    def feature_importances(self) -> list[dict[str, Any]]:
        """Group transformed pipeline importances back to source input fields."""
        if not self.loaded:
            return []
        try:
            preprocessor = self.risk_classifier.named_steps["prep"]
            model = self.risk_classifier.named_steps["model"]
            names = preprocessor.get_feature_names_out()
            grouped = {column: 0.0 for column in NUMERIC_COLS + CATEGORICAL_COLS}
            for name, score in zip(names, model.feature_importances_):
                transformed = str(name).split("__", 1)[-1]
                for column in grouped:
                    if transformed == column or transformed.startswith(f"{column}_"):
                        grouped[column] += float(score)
                        break
            ranked = sorted(grouped.items(), key=lambda item: item[1], reverse=True)
            total = sum(value for _, value in ranked) or 1.0
            return [{"feature": FEATURE_LABELS.get(name, name.replace("_", " ").title()), "importance": round(value / total, 4)} for name, value in ranked[:5] if value > 0]
        except Exception:
            return []
