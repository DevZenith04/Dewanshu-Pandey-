# Zameen Vivaad AI

Zameen Vivaad AI is a land-acquisition dispute and delay-risk dashboard for India. This repository now contains both halves of the application: the framework-free vanilla dashboard and the FastAPI ML service with its trained model artifacts.

## Repository layout

| Path | Purpose |
|---|---|
| `index.html`, `styles.css`, `app.js`, `app-data.js`, `chart.js` | Vanilla dashboard frontend. |
| `api.js`, `config.js` | Browser API client, backend-compatible form mapping, runtime URL configuration, and graceful fallback. |
| `app.py` | FastAPI backend exposing `/health`, `/api/features`, `/api/predict`, `/api/assessments`, and `/api/recommend`. |
| `risk_classifier.joblib` | Trained risk-category model. |
| `delay_regressor.joblib` | Trained delay-probability model. |
| `risk_label_encoder.joblib` | Trained risk-label encoder. |
| `requirements.txt` | Python dependencies for the FastAPI service and Streamlit companion. |
| `render.yaml` | Render Blueprint for the API and Streamlit service. |
| `streamlit_app.py` | Optional Streamlit backend UI. |
| `data.csv` | Backend data asset copied with the ML project. |

## Run locally

### 1. Start the FastAPI ML backend

From the repository root:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app:app --reload --host 127.0.0.1 --port 8000
```

Check the service at [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health), inspect valid categories at [http://127.0.0.1:8000/api/features](http://127.0.0.1:8000/api/features), and open the interactive API documentation at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).

### 2. Point the frontend at the backend

In local development, `config.js` automatically points to `http://127.0.0.1:8000`. On a static deployment, define `window.ZAMEEN_DEPLOYED_API_URL` before `config.js` or replace the empty deployed value with the exact public FastAPI origin, without a trailing slash:

```html
<script>window.ZAMEEN_DEPLOYED_API_URL = 'https://your-landguard-api.onrender.com';</script>
<script src="config.js"></script>
```

The browser also accepts a saved value from `localStorage` under `zv_api_base_url`. The topbar now exposes `ML API online`, `Checking ML API`, or `ML API offline` so a CORS or deployment problem is visible before a demo prediction is submitted.

### 3. Serve the static frontend

In a second terminal, from the repository root:

```bash
python3 -m http.server 8123
```

Open [http://127.0.0.1:8123](http://127.0.0.1:8123). Use the **New assessment** action from Project desk or Parcel registry. The form uses dropdowns populated from the backend feature contract and submits to `/api/assessments`, which predicts and persists the assessment in one request.

## Prediction behavior

The frontend sends all required backend fields. The form collects the core project inputs and supplies explicit temporary defaults for fields not yet exposed in the UI, including approval stage, legal-dispute status, possession status, stakeholder responsiveness, historical district delay rate, coordination issues, notification age, planned duration, and project age. For the hackathon MVP, the FastAPI service stores every successful assessment in a lightweight local SQLite database and the dashboard hydrates saved assessments on reload.

The persistence endpoints are:

```text
GET  /api/assessments       recent saved assessments
POST /api/assessments       predict and persist a new assessment
```

The `POST /api/assessments` route returns the prediction and the saved record in one response, which keeps the demo flow fast and easy to explain. The database path can be changed with `ZAMEEN_DB_PATH`; the default is `zameen.db` beside `app.py`. **Warning: the SQLite assessments table is wiped on every Render redeploy unless a persistent disk is attached.** For a multi-user production deployment, replace this SQLite adapter with PostgreSQL or another managed database.

On a successful API response, the dashboard stores the returned risk category, delay probability, and risk-probability breakdown. The displayed risk score is a weighted score derived from the model probabilities. If the backend is unavailable, the project is still saved using a clearly marked local fallback estimate so the dashboard remains usable.

## Deploy with Render

The included `render.yaml` can deploy the FastAPI service and the optional Streamlit service from this repository. In the Render dashboard, create a new Blueprint from the `DevZenith04/Dewanshu-Pandey-` repository. Set the `FRONTEND_ORIGINS` environment variable on the API service to the exact deployed frontend origin(s), separated by commas, before shipping. After the API service is live, update `config.js` with its public URL before hosting the static frontend.

The static dashboard has no build step. It can be served by any static host, including GitHub Pages, Netlify, Vercel static hosting, or an object-storage website endpoint. Because the browser calls the API directly, the backend must allow the static site’s origin through CORS. Set `FRONTEND_ORIGINS` to the exact deployed origin(s); the API no longer permits every origin by default.

## Legacy/optional Streamlit UI

The copied backend includes the original Streamlit interface as a **secondary, optional legacy surface**. The primary hackathon demo is the vanilla dashboard calling FastAPI directly. The Streamlit screen is not part of the main product flow; when it is used, keep its duplicated input fields and prediction payload aligned with `ProjectInput` in `app.py` and the mapping in `api.js`.

The Streamlit interface can be launched with:

```bash
streamlit run streamlit_app.py
```

The vanilla dashboard and FastAPI API are the primary integrated experience in this repository.
