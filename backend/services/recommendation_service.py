"""AI recommendation service for assessed land-acquisition projects.

This adapter keeps the external Groq contract out of the HTTP layer. The API
can therefore return a predictable 503 when the optional key is absent, while a
future recommendation provider can be added without changing request routes.
"""

from __future__ import annotations

from typing import Any

from groq import Groq

from backend.core.config import Settings
from backend.core.domain import ProjectInput


class RecommendationService:
    """Generate concise, project-specific recommendations through Groq."""

    def __init__(self, settings: Settings) -> None:
        self.settings = settings
        self.client = Groq(api_key=settings.groq_api_key) if settings.groq_api_key else None

    @property
    def enabled(self) -> bool:
        """Expose whether the optional recommendation provider is configured."""
        return self.client is not None

    @staticmethod
    def build_prompt(project: ProjectInput, risk_category: str, delay_probability: float) -> str:
        """Build a constrained prompt whose output can be parsed predictably."""
        return f"""You are an expert consultant in land acquisition, infrastructure project management, and conflict resolution in India.

A land acquisition project has been assessed by an AI system and classified as **{risk_category} Risk** with a delay probability of **{delay_probability * 100:.1f}%**.

Here are the project details:
- State: {project.state}, District: {project.district}
- Project Type: {project.project_type}
- Land Area: {project.land_area_hectares} hectares, Affected Families: {project.affected_families}
- Compensation Status: {project.compensation_status} ({project.compensation_disbursed_pct:.1f}% disbursed)
- Approval Stage: {project.approval_stage}
- Days Since Notification: {project.days_since_notification}
- Legal Disputes: {project.legal_disputes_count} ({project.legal_dispute_status or 'None'})
- Possession Status: {project.possession_status}
- Rehabilitation Progress: {project.rehabilitation_progress_pct:.1f}%
- Stakeholder Responsiveness Score: {project.stakeholder_responsiveness_score}/10
- Historical District Delay Rate: {project.historical_district_delay_rate * 100:.1f}%
- Inter-Department Coordination Issues: {project.inter_department_coordination_issues}
- Planned Duration: {project.planned_duration_days} days, Project Age: {project.project_age_days} days

Based on the **{risk_category} Risk** classification and the specific project parameters above, provide exactly 5 concise, actionable recommendations to reduce the land acquisition dispute and delay risk.

Format your response as a numbered list (1. 2. 3. 4. 5.). Each recommendation should be specific to this project's data, not generic advice. Keep each point to 1-2 sentences."""

    @staticmethod
    def _parse_recommendations(raw_text: str) -> list[str]:
        """Normalize numbered model output while retaining a safe raw fallback."""
        lines = [line.strip() for line in raw_text.splitlines() if line.strip()]
        recommendations = [line.lstrip("0123456789.-) ").strip() for line in lines if line[0].isdigit()]
        return recommendations or [raw_text]

    def generate(self, project: ProjectInput, risk_category: str, delay_probability: float) -> list[str]:
        """Call Groq and return a normalized list, raising predictable errors."""
        if not self.client:
            raise RuntimeError("Groq API key not configured. Set GROQ_API_KEY in your .env file.")
        response = self.client.chat.completions.create(
            model=self.settings.groq_model,
            messages=[
                {"role": "system", "content": "You are a land acquisition and conflict resolution expert for Indian infrastructure projects."},
                {"role": "user", "content": self.build_prompt(project, risk_category, delay_probability)},
            ],
            temperature=self.settings.groq_temperature,
            max_tokens=self.settings.groq_max_tokens,
        )
        raw_text = (response.choices[0].message.content or "").strip()
        if not raw_text:
            raise RuntimeError("Recommendation provider returned an empty response.")
        return self._parse_recommendations(raw_text)
