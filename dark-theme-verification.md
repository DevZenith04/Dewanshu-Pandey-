# Near-black dark theme verification

The static dashboard was opened at `http://localhost:8123/` and switched to dark mode using the existing theme toggle.

Computed runtime checks confirmed:

- `document.documentElement.dataset.theme`: `dark`
- Body base color: `rgb(3, 4, 5)`
- Body background includes three subtle radial highlights over near-black
- Panel background: `linear-gradient(145deg, rgba(25, 29, 31, 0.82), rgba(8, 10, 12, 0.78))`
- Panel border: `rgba(236, 247, 247, 0.17)`
- Four chart canvases are present and four Chart.js instances are initialized
- The application persistence key remains `zv_theme` in `app.js`; the browser session used the system/default dark state because no saved preference existed in that session

Visual inspection showed a near-black shell, charcoal glass cards, brighter text, readable chart labels, and visible coral/teal/ochre chart accents.

The toggle was then switched back to light mode. Runtime checks confirmed `document.documentElement.dataset.theme` is `light`, `localStorage.getItem('zv_theme')` is `light`, the light body base color remains `rgb(234, 245, 250)`, and all four Chart.js instances remain initialized.

After saving dark mode, the page was fully reloaded. The toggle still exposed the `light_mode` action, the dashboard remained near-black, all four chart canvases were present, and the analytics rendered without runtime failure. This confirms the existing `zv_theme` preference persists across page loads.

A secondary Project desk view was opened while the saved dark preference was active. The project table, filter controls, selected-file snapshot, risk pill, and action button all retained the charcoal glass treatment with clear text and borders, confirming the dark refinement is not limited to the Overview screen.
