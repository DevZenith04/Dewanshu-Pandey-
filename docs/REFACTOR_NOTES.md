# Backend refactor notes

## Summary of current limitations

The original backend combined configuration, model loading, domain schemas, authentication, SQL persistence, feature-importance grouping, recommendation prompting, and HTTP routes in one module. That made provider changes cross-cutting, made SQL behavior difficult to test independently, and allowed deployment settings to remain mixed with application logic.

The secondary Streamlit interface remains intentionally separate because it is a legacy/optional demo surface. The FastAPI service remains the primary contract for the vanilla frontend.

## Proposed architecture

```text
backend/
├── app.py                         # FastAPI composition root and routes
├── core/
│   ├── config.py                  # typed environment-backed settings
│   └── domain.py                  # schemas, model field order, valid values
├── infrastructure/
│   └── database.py                # SQLite schema and persistence adapter
├── services/
│   ├── authentication.py          # demo identity provider and RBAC
│   ├── model_service.py           # artifacts, inference, explainability
│   └── recommendation_service.py # Groq adapter and response parsing
└── tests/
    └── test_contracts.py          # fast boundary and edge-case tests
```

## Design Decisions & Tradeoffs

The **Single Responsibility Principle** is applied by giving configuration, domain contracts, persistence, authentication, model inference, and recommendations distinct modules. The **Dependency Inversion Principle** is approximated by making the API layer depend on service interfaces and settings rather than directly constructing SQL, model paths, or Groq requests. The **Open/Closed Principle** is supported by allowing a managed database, real identity provider, or alternate recommendation provider to replace one adapter without rewriting the routes.

The project remains synchronous at the service boundaries because the shipped model artifacts and SQLite adapter are synchronous and the hackathon workload is modest. At 10x scale, the persistence adapter should move to a pooled managed database, session tokens should move to an external identity provider, and inference should be isolated behind a versioned model service. Those changes are localized to `infrastructure/database.py`, `services/authentication.py`, and `services/model_service.py`.

The import fallback in `app.py` preserves both package-style local execution (`uvicorn backend.app:app`) and the existing Render `cd backend && uvicorn app:app` command. It is deliberately kept at the composition boundary rather than duplicated in every module.

## Migration notes

The public endpoints and response shapes remain unchanged. Local startup can use `uvicorn backend.app:app --reload`; the existing Render command remains compatible. Optional recommendation settings can now be configured with `GROQ_MODEL`, `GROQ_TEMPERATURE`, and `GROQ_MAX_TOKENS`, while `GROQ_API_KEY`, `FRONTEND_ORIGINS`, and `ZAMEEN_DB_PATH` retain their existing names.

The new test scaffold runs without an additional test dependency:

```bash
python3 -m unittest discover -s backend/tests -v
```

The refactor deliberately does not rewrite `streamlit_app.py` in this pass because it is a maintained legacy/optional UI with its own presentation concerns. It should consume the same `core.domain` contract in a future focused migration; the FastAPI service remains the canonical API consumed by the production frontend.
