# Zameen Vivaad AI

Zameen Vivaad AI is a land-acquisition dispute and delay-risk dashboard for India. This repository now contains both halves of the application: the framework-free vanilla dashboard and the FastAPI ML service with its trained model artifacts.

## Repository layout

| Path | Purpose |
|---|---|
| `index.html`, `styles.css`, `app.js`, `app-data.js`, `chart.js` | Vanilla dashboard frontend. |
| `api.js`, `config.js` | Browser API client, backend-compatible form mapping, runtime URL configuration, and graceful fallback. |
| `app.py` | FastAPI backend exposing `/health`, `/api/features`, `/api/predict`, and `/api/recommend`. |
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

`config.js` defaults to:

```js
window.ZAMEEN_CONFIG = {
  API_BASE_URL: 'http://127.0.0.1:8000',
};
```

For a deployed service, replace the value with the public FastAPI URL, for example:

```js
window.ZAMEEN_CONFIG = {
  API_BASE_URL: 'https://your-landguard-api.onrender.com',
};
```

The browser also accepts a saved value from `localStorage` under `zv_api_base_url` when `API_BASE_URL` is not supplied.

### 3. Serve the static frontend

In a second terminal, from the repository root:

```bash
python3 -m http.server 8123
```

Open [http://127.0.0.1:8123](http://127.0.0.1:8123). Use the **New assessment** action from Project desk or Parcel registry. The form uses dropdowns populated from the backend feature contract and submits to `/api/predict`.

## Prediction behavior

The frontend sends all required backend fields. The form collects the core project inputs and supplies explicit temporary defaults for fields not yet exposed in the UI, including approval stage, legal-dispute status, possession status, stakeholder responsiveness, historical district delay rate, coordination issues, notification age, planned duration, and project age.

On a successful API response, the dashboard stores the returned risk category, delay probability, and risk-probability breakdown. The displayed risk score is a weighted score derived from the model probabilities. If the backend is unavailable, the project is still saved using a clearly marked local fallback estimate so the dashboard remains usable.

## Deploy with Render

The included `render.yaml` can deploy the FastAPI service and the optional Streamlit service from this repository. In the Render dashboard, create a new Blueprint from the `DevZenith04/Dewanshu-Pandey-` repository. After the API service is live, update `config.js` with its public URL before hosting the static frontend.

The static dashboard has no build step. It can be served by any static host, including GitHub Pages, Netlify, Vercel static hosting, or an object-storage website endpoint. Because the browser calls the API directly, the backend must allow the static site’s origin through CORS; the copied FastAPI service currently enables CORS for browser clients.

## Optional Streamlit UI

The copied backend also includes the original Streamlit interface:

```bash
streamlit run streamlit_app.py
```

The vanilla dashboard and FastAPI API are the primary integrated experience in this repository.
