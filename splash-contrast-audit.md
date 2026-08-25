# Splash and card contrast audit

The live browser session was inspected before and after the repair. Before the repair, the splash was correctly being skipped because `sessionStorage.getItem('zv_splash_seen')` returned `true`; the browser reported `prefers-reduced-motion: false`, no overlay, and a fully opaque app shell. This explains why a normal reload did not visibly replay the opening transition in that session.

After clearing the session flag and invoking the normal-motion path, the timed probe observed the intended progression: a plain parchment opening at 100 ms, contours and the line stage around 800 ms, a completed line before the wordmark stage, the wordmark and tagline states later in the sequence, and the dashboard reveal beginning around the 3.4-second mark before the overlay was removed at approximately 3.9 seconds.

The splash CSS now uses ease-in-out transitions rather than keyframes for the staged properties. The line uses a 1.1-second width transition, the contour pattern uses a 400 ms opacity transition, the wordmark/kicker use a 500 ms opacity/12 px transform transition, the tagline uses a 400 ms fade/transform transition, the overlay uses a 500 ms exit transition, and the dashboard reveal uses a 400 ms opacity/transform transition. The opening hold remains motionless for 300 ms before any contour or line state is added.

The contrast pass was reloaded into the browser and computed successfully in dark mode. The body base color is `rgb(3, 4, 5)`, while panels use `linear-gradient(145deg, rgba(28, 33, 35, 0.92), rgba(9, 11, 13, 0.86))`, a `rgba(236, 247, 247, 0.25)` border, a deep shadow, and a 26 px radius. The card/background partition is now materially clearer while preserving glass translucency.

Reduced motion was emulated by overriding the browser media-query response. The branch returned with no overlay, no animation body class, and app opacity `1`. Internal navigation back to Overview returned with no overlay and `zv_splash_seen: true`, confirming the splash remains session-scoped.

A clean session reset removed both `zv_splash_seen` and `zv_splash_version`, then re-ran the normal-motion path. The first sample showed the overlay present over `rgb(246, 244, 239)` parchment with `intro-running`, and the session keys were restored to `true` and `3`. At the reveal sample, `intro-content-reveal` and `intro-fadeout` were active with the app transitioning in; 500 ms later the overlay was removed, the body classes were clear, app opacity was `1`, and both session keys remained set.

The reduced-motion branch was then forced. It returned `reducedMotion: true`, no overlay, no body animation class, app opacity `1`, and the same session keys set, confirming an immediate settled dashboard.

The first-paint regression screenshot now shows the parchment overlay before the dashboard, with the faint contour pattern and a clearly visible in-progress hairline. A live reload using the repaired version-3 source also displayed the splash during navigation capture; after completion the runtime reported `zv_splash_seen: true`, `zv_splash_version: 3`, no overlay, and a fully opaque app shell. The refreshed dark-mode computed panel values remain the strengthened near-black glass layer and cool border documented above.

The initial implementation's elapsed-time compensation was removed. This avoids the sequence being compressed or skipped when Chart.js and external fonts delay application boot. The pre-boot overlay now holds the parchment immediately, then starts the fixed 300/700/2000/2700/3400/3900 ms sequence once the app is ready.
