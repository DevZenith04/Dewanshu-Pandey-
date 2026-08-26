# Zameen Vivaad AI — Product Notes

This repository is the current **vanilla HTML/CSS/JavaScript frontend plus FastAPI ML backend** for the Zameen Vivaad AI hackathon product. It does not use React, TypeScript, Vite, AI Studio, or a port-5174 development server.

## Shipped startup experience

The Home splash runs for exactly **five seconds** when the page first loads or when the user explicitly activates Overview/Home. It does not run on Project desk, Risk studio, Parcel registry, or Archive navigation. A short opening cue appears at 120ms so the screen is not blank: the field-intelligence kicker and faint contour field establish the scene before the wordmark arrives at two seconds. The tagline follows shortly afterward, the complete lockup remains readable for the remaining three seconds, and the final contour fade overlaps the dashboard reveal. Reduced-motion users skip the animation and receive the settled dashboard immediately.

The current scheduler introduces the wordmark at 2 seconds, the tagline at 2.45 seconds, begins the dashboard reveal at 4.95 seconds, exactly 0.05 seconds before the splash completes, and removes the overlay at exactly 5 seconds. The name therefore remains visible from the two-second mark through the end of the five-second intro.

## Theme direction

The visual system uses a parchment/light mode and a near-black/dark mode. Dark mode is built from near-black page layers, charcoal glass panels, cool edge strokes, and readable coral, ochre, teal, and neutral chart accents. Cards use opaque layered glass, inset highlights, and separation shadows so surfaces remain distinct from the background at desktop and mobile widths.

## Prediction provenance

New assessments use the FastAPI model service when it is reachable. The dashboard stores the returned risk category, delay probability, and probability breakdown. When the API is unavailable, `api.js` creates a local fallback estimate and marks the project as **Local fallback estimate** rather than presenting it as a model result. Persisted FastAPI assessments are labeled **Persisted FastAPI ML assessment**.

## Runtime architecture

The frontend is static under `frontend/` and loads `frontend/api.js` and `frontend/config.js` before `frontend/app.js`. The FastAPI service lives in `backend/app.py` and loads the three `.joblib` artifacts from `models/`. The hackathon persistence layer uses `backend/zameen.db`, which is generated at runtime and intentionally ignored by Git. For production multi-user deployment, replace the SQLite adapter with a managed database.

## Shipping audit checkpoint

A clean Python 3.12 virtual environment installed the exact pinned requirements successfully and `pip check` reported no broken requirements. The clean environment started the FastAPI service with `models_loaded: true` and returned a real prediction. CORS returned `http://127.0.0.1:8123` only for the allowed local origin and emitted no allow-origin header for an unrelated origin. The live Project desk snapshot displayed `Persisted FastAPI ML assessment` for the saved model result, with no fallback warning.
