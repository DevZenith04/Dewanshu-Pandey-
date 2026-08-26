# Audit 8 local verification

The local frontend at `http://127.0.0.1:8160/?audit8=light&v=final` loaded the actual dashboard after the splash. The first focusable element is the `Skip to content` link and it points to `#main`. Four Chart.js canvases are present. Light mode shows the parchment background, navy/coral typography, glass cards, and aligned metric/chart surfaces. The dashboard reports the current date and the existing offline-demo/ML status states. The live page remains functionally intact after the CSS cleanup.

Dark mode verification also passed in the same local session. The theme toggle changed the interface to a near-black navy surface with distinct charcoal glass cards, bright readable text, purple/cyan chart accents, and the same aligned layout. The toggle label changed to `light_mode`, confirming persisted theme state behavior is active.
