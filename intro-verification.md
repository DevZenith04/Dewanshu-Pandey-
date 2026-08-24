Intro verification checkpoint

- The app shell mounts InitialSplash only when the initial `showIntro` state is true.
- `showIntro` is initialized from `sessionStorage.getItem('zv_splash_seen')` and `prefers-reduced-motion`, so navigation state changes do not remount the overlay.
- InitialSplash phases are timed at 0ms line, 500ms wordmark, 800ms tagline, 1160ms fadeout, and 1500ms completion.
- The session-only intro flag was cleared in the browser and the page reloaded for a fresh initial-load check.
- Production TypeScript and Vite builds passed before browser verification.

Browser verification

The restarted local app loaded successfully on port 5174. After the fresh-load window elapsed, the dashboard settled into its normal overview state. Navigating to Risk studio changed the workspace content without showing the parchment overlay again, confirming that navigation does not replay the intro in the same session. The browser-rendered app continued to show the redesigned dashboard routes after the intro completed.
