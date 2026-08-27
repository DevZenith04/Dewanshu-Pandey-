"""SQLite persistence boundary for assessments and audit events.

This module owns schema initialization and all SQL statements. FastAPI routes
should call these small operations rather than opening connections, building
queries, and decoding JSON inline. Replacing SQLite later is localized here.
"""

from __future__ import annotations

import json
import sqlite3
from collections.abc import Iterable
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


def _connect(database_path: Path) -> sqlite3.Connection:
    """Open a connection with row mappings enabled for predictable reads."""
    connection = sqlite3.connect(database_path)
    connection.row_factory = sqlite3.Row
    return connection


def initialize_database(database_path: Path) -> None:
    """Create current tables and add backward-compatible columns when needed."""
    with _connect(database_path) as connection:
        connection.execute("CREATE TABLE IF NOT EXISTS assessments (id INTEGER PRIMARY KEY AUTOINCREMENT, project_name TEXT NOT NULL, payload_json TEXT NOT NULL, prediction_json TEXT NOT NULL, created_at TEXT NOT NULL)")
        existing_columns = {row["name"] for row in connection.execute("PRAGMA table_info(assessments)")}
        for name, definition in {
            "created_by": "TEXT NOT NULL DEFAULT 'demo-state-admin'",
            "actual_delay_days": "INTEGER",
            "actual_completed_at": "TEXT",
        }.items():
            if name not in existing_columns:
                connection.execute(f"ALTER TABLE assessments ADD COLUMN {name} {definition}")
        connection.execute("CREATE TABLE IF NOT EXISTS audit_log (id INTEGER PRIMARY KEY AUTOINCREMENT, actor_id TEXT NOT NULL, actor_name TEXT NOT NULL, actor_role TEXT NOT NULL, action TEXT NOT NULL, resource_type TEXT NOT NULL, resource_id TEXT, created_at TEXT NOT NULL)")
        connection.commit()


def insert_audit_event(database_path: Path, user: dict[str, Any], action: str, resource_type: str, resource_id: str | None = None) -> None:
    """Record an auditable state change with an immutable UTC timestamp."""
    with _connect(database_path) as connection:
        connection.execute(
            "INSERT INTO audit_log (actor_id, actor_name, actor_role, action, resource_type, resource_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (user["id"], user["name"], user["role"], action, resource_type, resource_id, datetime.now(timezone.utc).isoformat()),
        )
        connection.commit()


def insert_assessment(database_path: Path, project_name: str, project: dict[str, Any], prediction: dict[str, Any], created_by: str, created_at: str | None = None) -> int:
    """Persist one assessment and return its database identifier."""
    created_at = created_at or datetime.now(timezone.utc).isoformat()
    with _connect(database_path) as connection:
        cursor = connection.execute(
            "INSERT INTO assessments (project_name, payload_json, prediction_json, created_at, created_by) VALUES (?, ?, ?, ?, ?)",
            (project_name, json.dumps(project), json.dumps(prediction), created_at, created_by),
        )
        connection.commit()
        return int(cursor.lastrowid)


def list_assessments(database_path: Path, limit: int) -> list[dict[str, Any]]:
    """Return recent assessments in the public API response shape."""
    safe_limit = max(1, min(limit, 200))
    with _connect(database_path) as connection:
        rows = connection.execute(
            "SELECT id, project_name, payload_json, prediction_json, created_at, created_by, actual_delay_days, actual_completed_at FROM assessments ORDER BY id DESC LIMIT ?",
            (safe_limit,),
        ).fetchall()
    return [
        {
            "id": row["id"],
            "project_name": row["project_name"],
            "project": json.loads(row["payload_json"]),
            **json.loads(row["prediction_json"]),
            "created_at": row["created_at"],
            "created_by": row["created_by"],
            "actual_delay_days": row["actual_delay_days"],
            "actual_completed_at": row["actual_completed_at"],
        }
        for row in rows
    ]


def update_assessment_outcome(database_path: Path, assessment_id: int, actual_delay_days: int, completed_at: str) -> bool:
    """Save an observed project outcome and report whether the record existed."""
    with _connect(database_path) as connection:
        cursor = connection.execute(
            "UPDATE assessments SET actual_delay_days = ?, actual_completed_at = ? WHERE id = ?",
            (actual_delay_days, completed_at, assessment_id),
        )
        connection.commit()
        return cursor.rowcount > 0


def calculate_accuracy(database_path: Path) -> dict[str, Any]:
    """Calculate monitoring metrics from assessments with observed outcomes."""
    with _connect(database_path) as connection:
        rows = connection.execute("SELECT id, project_name, prediction_json, payload_json, actual_delay_days, actual_completed_at FROM assessments WHERE actual_delay_days IS NOT NULL ORDER BY id DESC").fetchall()

    cases: list[dict[str, Any]] = []
    for row in rows:
        prediction = json.loads(row["prediction_json"])
        payload = json.loads(row["payload_json"])
        planned_days = max(1, int(payload.get("planned_duration_days") or 1))
        predicted_days = round(planned_days * float(prediction.get("delay_probability") or 0))
        actual_days = int(row["actual_delay_days"])
        cases.append({
            "id": row["id"],
            "project_name": row["project_name"],
            "predicted_delay_days": predicted_days,
            "actual_delay_days": actual_days,
            "absolute_error_days": abs(predicted_days - actual_days),
            "actual_completed_at": row["actual_completed_at"],
        })

    mae = round(sum(case["absolute_error_days"] for case in cases) / len(cases), 1) if cases else None
    within_30 = round(sum(case["absolute_error_days"] <= 30 for case in cases) / len(cases) * 100) if cases else None
    return {"resolved_cases": len(cases), "mean_absolute_error_days": mae, "within_30_days_percent": within_30, "cases": cases}


def list_audit_events(database_path: Path, limit: int) -> list[dict[str, Any]]:
    """Return recent audit events with a bounded result size."""
    safe_limit = max(1, min(limit, 200))
    with _connect(database_path) as connection:
        rows = connection.execute(
            "SELECT id, actor_id, actor_name, actor_role, action, resource_type, resource_id, created_at FROM audit_log ORDER BY id DESC LIMIT ?",
            (safe_limit,),
        ).fetchall()
    return [dict(row) for row in rows]
