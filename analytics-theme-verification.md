# Analytics and theme verification

The standalone dashboard now loads Chart.js from the jsDelivr CDN and renders two interactive canvas charts on Overview: a risk-band doughnut and exposure-by-stage bar chart. The browser element inventory confirms both canvases are present.

The topbar includes a persistent theme toggle. Clicking it changes the document theme to dark, swaps the control icon to light mode, rerenders the charts using dark palette colors, and persists the selection in localStorage under `zv_theme`.

The dark-mode screenshot confirms readable light typography, dark translucent glass cards, tinted glass controls, and chart contrast. The existing navigation and dashboard content remain present.

After a full reload, the dark theme preference persisted and the toggle continued to show `light_mode`. Both chart canvases remained present after reload. The browser console reported no Chart.js or application runtime errors.
