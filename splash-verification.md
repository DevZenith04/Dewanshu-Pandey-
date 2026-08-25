# Initial splash verification

The splash now uses a session-scoped `zv_splash_seen` guard. It is created only from the application boot path, so internal view navigation does not replay it. The sequence is scheduled as follows:

| Offset | State |
|---|---|
| 0 ms | Parchment overlay is visible; contours, boundary fill, wordmark, and tagline are hidden. |
| 300 ms | Contour pattern begins a 400 ms ease-in-out fade-in. |
| 700 ms | The 1 px boundary line begins its 1.1 s ease-in-out left-to-right trace. |
| 2000 ms | After the line's 200 ms hold, the wordmark and kicker begin a 500 ms, 12 px rise. |
| 2700 ms | After the wordmark's 200 ms hold, the tagline begins a 400 ms fade-in. |
| 3400 ms | After the 300 ms assembled-lockup hold, the dashboard reveal and contour fade-out overlap. |
| 3900 ms | The splash is removed and the dashboard is fully interactive. |

A timed browser probe observed the expected class progression from a plain parchment state through contour/line, wordmark, and tagline stages. The contour fade-out selector was then corrected for specificity so `intro-fadeout` overrides `intro-contours-in` and reaches the intended near-invisible opacity.

The reduced-motion branch was exercised by emulating `prefers-reduced-motion: reduce`. It returned with no overlay, no body animation class, a fully opaque dashboard, and the session flag set, confirming the no-motion settled state.

After the reduced-motion check, the application returned to Overview through internal navigation. The runtime reported `activeView: Overview`, `overlayPresent: false`, `splashSeen: true`, and no body animation class, confirming the splash does not replay when navigating back to the root view during the same visit.
