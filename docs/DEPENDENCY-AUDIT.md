# Dependency release audit

Checked against the official PyPI JSON project metadata on 25 August 2026. The versions below are the current stable `info.version` values returned for the packages used by the copied FastAPI/ML service. Pre-releases were not selected.

| Package | Version | Python requirement reported by PyPI |
|---|---:|---|
| fastapi | 0.141.1 | >=3.10 |
| uvicorn | 0.52.4 | >=3.10 |
| streamlit | 1.62.0 | >=3.10 |
| pandas | 3.0.5 | >=3.11 |
| numpy | 2.5.2 | >=3.12 |
| scikit-learn | 1.9.0 | >=3.11 |
| xgboost | 3.4.1 | >=3.12 |
| joblib | 1.5.3 | >=3.9 |
| pydantic | 2.13.4 | >=3.9 |
| groq | 1.6.0 | >=3.10 |
| python-dotenv | 1.2.3 | >=3.10 |
| requests | 2.34.2 | >=3.10 |
| plotly | 6.9.0 | >=3.8 |

A new Python 3.12 virtual environment installed `requirements.txt` successfully with no resolver errors. The clean environment then started `app.py`, loaded all three model artifacts, returned a healthy response, and returned a real prediction from `POST /api/predict`.
