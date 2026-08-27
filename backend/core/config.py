"""Application configuration for the LandGuard FastAPI service.

This module is the single source of truth for environment-backed runtime
settings. The API layer imports ``settings`` instead of reading environment
variables or constructing paths inline, which keeps deployment changes local.
"""

from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path


DEFAULT_FRONTEND_ORIGINS = (
    "http://127.0.0.1:8123",
    "http://localhost:8123",
)
DEFAULT_GROQ_MODEL = "openai/gpt-oss-120b"
DEFAULT_GROQ_TEMPERATURE = 0.4
DEFAULT_GROQ_MAX_TOKENS = 600


@dataclass(frozen=True)
class Settings:
    """Immutable runtime configuration resolved from environment variables."""

    backend_dir: Path
    project_root: Path
    model_dir: Path
    database_path: Path
    frontend_origins: tuple[str, ...]
    groq_api_key: str | None
    groq_model: str
    groq_temperature: float
    groq_max_tokens: int

    @classmethod
    def from_environment(cls) -> "Settings":
        """Build settings once, applying safe local defaults for development."""
        backend_dir = Path(__file__).resolve().parents[1]
        project_root = backend_dir.parent
        configured_origins = os.getenv("FRONTEND_ORIGINS")
        frontend_origins = tuple(
            origin.strip()
            for origin in (configured_origins or ",".join(DEFAULT_FRONTEND_ORIGINS)).split(",")
            if origin.strip()
        )
        return cls(
            backend_dir=backend_dir,
            project_root=project_root,
            model_dir=project_root / "models",
            database_path=Path(os.getenv("ZAMEEN_DB_PATH", backend_dir / "zameen.db")),
            frontend_origins=frontend_origins,
            groq_api_key=os.getenv("GROQ_API_KEY") or None,
            groq_model=os.getenv("GROQ_MODEL", DEFAULT_GROQ_MODEL),
            groq_temperature=float(os.getenv("GROQ_TEMPERATURE", DEFAULT_GROQ_TEMPERATURE)),
            groq_max_tokens=int(os.getenv("GROQ_MAX_TOKENS", DEFAULT_GROQ_MAX_TOKENS)),
        )


settings = Settings.from_environment()
