# Zameen Vivaad AI architecture

Zameen Vivaad AI is a small, deployable product composed of a framework-free browser dashboard and a FastAPI service that owns ML inference and assessment persistence. The browser remains usable when the API is unavailable, but it clearly labels any local estimate as fallback output.

| Layer | Location | Responsibility |
|---|---|---|
| Static shell | `index.html` | Loads the theme, first-paint splash shell, API configuration, Chart.js, and local modules. |
| Dashboard UI | `app.js` | DOM rendering, navigation, modal workflows, project/parcel state, and assessment result transformation. |
| Design system | `styles.css` | Typography, responsive layouts, glass surfaces, light/dark themes, charts, splash motion, and provenance badges. |
| Browser API client | `api.js` | Backend URL selection, valid category normalization, payload defaults, prediction calls, persistence calls, feature loading, and fallback estimates. |
| Runtime config | `config.js` | Local or deployed FastAPI base URL. Browser `localStorage` can override it with `zv_api_base_url`. |
| Charts | `chart.js` | Chart.js lifecycle, theme-aware colors, and analytics visualizations. |
| FastAPI service | `app.py` | Model loading, `/api/features`, `/api/predict`, `/api/assessments`, `/api/recommend`, and `/health`. |
| Model assets | `*.joblib` | Risk classifier, delay regressor, and risk-label encoder loaded by `app.py`. |
| Persistence | `zameen.db` | SQLite assessment records created at runtime and ignored by Git. |
| Optional secondary UI | `streamlit_app.py` | Legacy/optional Streamlit interface using the same copied model assets and backend feature contract. |

## Assessment data flow

The New assessment modal renders category dropdowns from the backend-compatible values in `api.js`, with a feature refresh from `GET /api/features` when available. The browser fills explicit defaults for backend fields not yet exposed in the form, then sends the complete payload to `POST /api/assessments`. FastAPI calls the real models, stores the input and prediction JSON in SQLite, and returns the saved record. The browser transforms that response into the existing Project desk shape and hydrates recent saved assessments on reload using `GET /api/assessments`.

If the persistence endpoint is unavailable, the browser tries the prediction endpoint. If the service is unavailable entirely, it calculates a deterministic local estimate from the form inputs. The UI labels that result **Local fallback estimate** and shows an **API unavailable — local estimate only** warning. It never presents fallback output as a model prediction.

## Startup experience

The Home splash runs for approximately six seconds on initial page load and each explicit Overview/Home activation. It is not replayed by other internal views. The current choreography holds the parchment opening, fades in contours, traces the survey line, introduces the wordmark and tagline early enough for a longer readable hold, and overlaps the final contour fade with the dashboard reveal. Users who prefer reduced motion skip directly to the settled dashboard.

## Deployment boundary

The FastAPI service is deployed from `app.py` using `render.yaml`. `FRONTEND_ORIGINS` must contain the exact deployed static frontend origin(s), separated by commas; local defaults are limited to `http://127.0.0.1:8123` and `http://localhost:8123`. The static frontend can be hosted independently because it has no build step. The current SQLite adapter is suitable for a hackathon demo, but a managed database is required for durable multi-user production data.
