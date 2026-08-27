"""Contract tests for the modular LandGuard backend.

These tests intentionally target stable boundaries instead of implementation
details: configuration, domain metadata, demo RBAC, and monitoring math. They
provide a fast safety net while the service evolves toward a managed database
and production identity provider.
"""

from __future__ import annotations

import asyncio
import tempfile
import unittest
from pathlib import Path

from backend.app import get_features, health
from backend.core.config import DEFAULT_FRONTEND_ORIGINS
from backend.core.domain import CATEGORICAL_COLS, NUMERIC_COLS, VALID_VALUES
from backend.infrastructure.database import calculate_accuracy, initialize_database
from backend.services.authentication import authenticate, issue_session


class BackendContractTests(unittest.TestCase):
    """Verify critical public contracts and edge behavior."""

    def test_each_categorical_model_field_has_options(self) -> None:
        self.assertTrue(DEFAULT_FRONTEND_ORIGINS)
        self.assertTrue(NUMERIC_COLS)
        self.assertTrue(CATEGORICAL_COLS)
        self.assertTrue(all(VALID_VALUES[field] for field in CATEGORICAL_COLS))

    def test_demo_permission_is_enforced(self) -> None:
        token, user = issue_session("reviewer")
        self.assertEqual(user["id"], "reviewer")
        self.assertEqual(authenticate(f"Bearer {token}", "assess")["id"], "reviewer")
        with self.assertRaises(Exception):
            authenticate(f"Bearer {token}", "view_audit")

    def test_fastapi_composition_root_exposes_health_and_features(self) -> None:
        health_result = asyncio.run(health())
        feature_result = asyncio.run(get_features())
        self.assertEqual(health_result["status"], "healthy")
        self.assertTrue(feature_result["features"])

    def test_empty_accuracy_dataset_is_explicit(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            database_path = Path(directory) / "contract.db"
            initialize_database(database_path)
            result = calculate_accuracy(database_path)
            self.assertEqual(result["resolved_cases"], 0)
            self.assertIsNone(result["mean_absolute_error_days"])
            self.assertEqual(result["cases"], [])


if __name__ == "__main__":
    unittest.main()
