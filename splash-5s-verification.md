# Five-second Home splash verification

The splash controller no longer uses a session-scoped replay guard. Full page loads can show the splash, and the navigation handler calls `showIntro()` whenever the `dashboard`/Overview/Home item is clicked, including when Overview is already active.

The final timeline uses these offsets:

| Offset | State change |
|---:|---|
| 0 ms | Plain parchment and hidden lockup. |
| 350 ms | Contours begin a 500 ms ease-in-out fade-in. |
| 850 ms | 1px boundary trace begins with a 1.2 s ease-in-out width transition. |
| 2250 ms | Kicker and wordmark rise 12px over 600 ms. |
| 3100 ms | Tagline fades in over 450 ms. |
| 4000 ms | Dashboard fades/reveals while contours fade down and the overlay exits. |
| 5000 ms | Splash is removed and all intro classes are cleared. |

Normal-motion browser validation confirmed that a settled Home view has no overlay, Project desk navigation does not trigger the splash, the first Overview click creates an overlay with `intro-running`, and a second Overview click while already on Home creates another overlay with `intro-running`.

Reduced-motion validation in a fresh headless browser context reported no overlay, a rendered dashboard, and the reduced-motion skip marker present. The JavaScript files passed `node --check`, and `git diff --check` passed.

A live browser probe started `showIntro()` fresh and sampled 2.6 seconds later. It reported `intro-contours-in intro-line intro-wordmark`, a 100% line width, wordmark opacity `0.595474`, and a rising transform of approximately 4.85px, confirming the five-second choreography is visibly active rather than stuck on blank parchment.

The end-to-end probe waited 5.2 seconds and reported no overlay and no intro body classes. Project desk navigation stayed overlay-free. The first Overview click produced an overlay with `intro-running`, and a second Overview click while already on Overview produced another overlay with `intro-running`, confirming every Home press replays the splash.

Chart.js was changed to `defer`, and `app.js` now performs a post-load render so the initial splash can paint immediately without losing analytics hydration.
