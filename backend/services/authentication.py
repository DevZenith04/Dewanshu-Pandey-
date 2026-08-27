"""Demo-account authentication and authorization services.

The hackathon product intentionally uses selectable demo accounts instead of
password authentication. This module isolates that temporary identity provider
so a real identity service can replace it without changing API routes.
"""

from __future__ import annotations

import secrets
from typing import Any

from fastapi import HTTPException


DEMO_ACCOUNTS: dict[str, dict[str, Any]] = {
    "state-admin": {"id": "state-admin", "name": "Aditi Menon", "role": "State Administrator", "permissions": ["assess", "view_audit", "record_outcome"]},
    "district-officer": {"id": "district-officer", "name": "Rohan Kulkarni", "role": "District Officer", "permissions": ["assess", "record_outcome"]},
    "reviewer": {"id": "reviewer", "name": "Neha Iyer", "role": "Registry Reviewer", "permissions": ["assess"]},
}
SESSION_TOKENS: dict[str, dict[str, Any]] = {}


def public_accounts() -> list[dict[str, Any]]:
    """Return account metadata without exposing server-side token state."""
    return [dict(account) for account in DEMO_ACCOUNTS.values()]


def issue_session(account_id: str) -> tuple[str, dict[str, Any]]:
    """Issue a cryptographically random demo token for a known account."""
    user = DEMO_ACCOUNTS.get(account_id)
    if not user:
        raise HTTPException(401, "Unknown demo account.")
    token = secrets.token_urlsafe(24)
    SESSION_TOKENS[token] = user
    return token, user


def authenticate(authorization: str | None, permission: str | None = None) -> dict[str, Any]:
    """Resolve a bearer token and enforce an optional permission."""
    token = (authorization or "").removeprefix("Bearer ").strip()
    user = SESSION_TOKENS.get(token)
    if not user:
        raise HTTPException(401, "Login required.")
    if permission and permission not in user["permissions"]:
        raise HTTPException(403, "This demo account does not have that permission.")
    return user
