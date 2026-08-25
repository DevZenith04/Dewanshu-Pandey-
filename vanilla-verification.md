# Vanilla Site Verification

- `index.html`, `styles.css`, `app.js`, and `app-data.js` load from a plain HTTP server with no React or Vite runtime.
- Overview renders the sidebar, topbar, metrics, morning brief, map, priority queue, project table, and stage bottlenecks.
- Navigation to Project desk works through the sidebar and replaces the main screen without a page build step.
- Project desk renders search input, risk filters, project rows, and the selected project snapshot.
- `node --check app.js` passes.
- Inline style search in `app.js` returned no matches after the class-based CSS conversion.

## Additional Browser Check

The Risk studio route renders the national risk distribution, signal anatomy, confidence indicator, and review queue. Returning to Project desk also works, preserving the selected project snapshot and filters. The browser successfully served the vanilla site from the temporary static HTTP server.

## Modal Check

The new-assessment modal opens from Project desk using plain DOM event delegation. Its form fields, validation attributes, cancel action, and local predict-and-save path render correctly without React components or framework runtime.
