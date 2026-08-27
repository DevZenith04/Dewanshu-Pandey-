# Zameen Vivaad AI — Launch Intro Code

The launch experience is not an MP4 video. It is a lightweight **HTML + inline SVG + CSS transition + JavaScript timing sequence**. This keeps the intro sharp at every screen size, avoids a large media asset, and allows it to respect `prefers-reduced-motion`.

The shipped sequence lasts **5 seconds**. The lockup appears at approximately **2 seconds**, the tagline appears at approximately **2.45 seconds**, the dashboard starts revealing at **4.95 seconds**, and the splash is removed at **5 seconds**.

## 1. HTML markup

Place this inside `frontend/index.html`, before the `#app` element. The app content must come after the overlay so it can be revealed underneath it.

```html
<a class="skip-link" href="#main">Skip to content</a>

<div id="initial-splash" class="intro-overlay" aria-hidden="true">
  <svg
    class="intro-contours"
    viewBox="0 0 1440 900"
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    <path d="M-40 210 C 220 100 330 310 620 220 S 1060 80 1480 190" />
    <path d="M-40 250 C 240 125 360 360 650 260 S 1090 120 1480 230" />
    <path d="M-40 670 C 260 560 390 820 720 670 S 1120 520 1480 620" />
    <path d="M-40 710 C 280 590 410 860 760 710 S 1160 560 1480 660" />
    <ellipse cx="1160" cy="390" rx="210" ry="120" />
    <ellipse cx="1160" cy="390" rx="280" ry="170" />
  </svg>

  <div class="intro-boundary" aria-hidden="true">
    <span></span>
  </div>

  <div class="intro-lockup">
    <div class="intro-kicker">A field intelligence system</div>
    <div class="intro-wordmark">Zameen Vivaad <em>AI</em></div>
    <div class="intro-tagline">
      See the dispute before it stalls the land.
    </div>
  </div>
</div>

<div id="app"></div>
```

## 2. Reduced-motion preflight

Place this small script in the `<head>` before the application loads. It prevents the splash from flashing or beginning its animation when the user has requested reduced motion.

```html
<script>
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.classList.add('skip-initial-splash');
    }
  } catch (error) {
    // Keep the splash available when media-query access is restricted.
  }
</script>
```

## 3. Complete intro CSS

Add the following block to `frontend/styles.css`.

```css
/* Skip the initial overlay immediately for reduced-motion users. */
.skip-initial-splash #initial-splash {
  display: none;
}

/* Dashboard starts underneath the overlay and reveals near the end. */
.app-shell {
  transition: opacity 0.55s ease-in-out,
    transform 0.55s ease-in-out;
}

body.intro-running .app-shell {
  opacity: 0;
  pointer-events: none;
  transform: translateY(8px);
}

body.intro-content-reveal .app-shell {
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0);
}

/* Full-screen parchment opening frame. */
.intro-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-items: center;
  overflow: hidden;
  isolation: isolate;
  background: #f6f4ef;
  color: #173344;
  opacity: 1;
  transition: opacity 0.45s ease-in-out;
}

.intro-overlay.intro-fadeout {
  opacity: 0;
  pointer-events: none;
}

/* Faint topographic contour artwork. */
.intro-contours {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  color: #8b8279;
  transition: opacity 0.5s ease-in-out;
}

.intro-overlay.intro-opening .intro-contours {
  opacity: 0.028;
}

.intro-overlay.intro-contours-in .intro-contours {
  opacity: 0.055;
}

.intro-contours path,
.intro-contours ellipse {
  fill: none;
  stroke: currentColor;
  stroke-width: 1;
  vector-effect: non-scaling-stroke;
}

.intro-contours ellipse {
  stroke-width: 0.75;
  stroke-dasharray: 2 7;
}

.intro-overlay.intro-fadeout .intro-contours {
  opacity: 0.018;
}

/* One-pixel survey boundary line. */
.intro-boundary {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 1px;
  overflow: hidden;
  background: rgba(23, 51, 68, 0.13);
  transform: translateY(29px);
}

.intro-boundary span {
  display: block;
  width: 0;
  height: 1px;
  background: #bd685a;
  transition: width 1.2s ease-in-out;
}

.intro-overlay.intro-line .intro-boundary span,
.intro-overlay.intro-wordmark .intro-boundary span,
.intro-overlay.intro-tagline .intro-boundary span,
.intro-overlay.intro-fadeout .intro-boundary span {
  width: 100%;
}

/* Centered wordmark lockup. */
.intro-lockup {
  position: relative;
  z-index: 1;
  width: min(700px, calc(100vw - 48px));
  padding: 0 24px;
  text-align: center;
}

.intro-kicker {
  margin-bottom: 14px;
  color: #bd685a;
  font: 600 10px/1.3 'Barlow Condensed';
  letter-spacing: 0.17em;
  text-transform: uppercase;
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.6s ease-in-out,
    transform 0.6s ease-in-out;
}

.intro-wordmark {
  margin: 0;
  color: #173344;
  font: 600 clamp(48px, 8vw, 92px) / 0.86 'Barlow Condensed';
  letter-spacing: -0.045em;
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.6s ease-in-out,
    transform 0.6s ease-in-out;
}

.intro-wordmark em {
  color: #bd685a;
  font-style: normal;
}

.intro-tagline {
  margin: 18px 0 0;
  color: #7a766f;
  font: 400 clamp(15px, 2vw, 19px) / 1.35 'Newsreader';
  opacity: 0;
  transform: translateY(4px);
  transition: opacity 0.45s ease-in-out,
    transform 0.45s ease-in-out;
}

/* Stage reveal rules. */
.intro-overlay.intro-wordmark .intro-kicker,
.intro-overlay.intro-tagline .intro-kicker,
.intro-overlay.intro-fadeout .intro-kicker,
.intro-overlay.intro-wordmark .intro-wordmark,
.intro-overlay.intro-tagline .intro-wordmark,
.intro-overlay.intro-fadeout .intro-wordmark {
  opacity: 1;
  transform: translateY(0);
}

.intro-overlay.intro-opening .intro-kicker {
  opacity: 1;
  transform: translateY(0);
}

.intro-overlay.intro-tagline .intro-tagline,
.intro-overlay.intro-fadeout .intro-tagline {
  opacity: 1;
  transform: translateY(0);
}

/* No motion at all when reduced motion is requested. */
@media (prefers-reduced-motion: reduce) {
  .app-shell,
  body.intro-running .app-shell,
  body.intro-content-reveal .app-shell {
    transition: none !important;
    opacity: 1;
    pointer-events: auto;
    transform: none;
  }

  .intro-overlay {
    transition: none !important;
  }

  .intro-overlay.intro-reduced {
    opacity: 1;
  }

  .intro-contours,
  .intro-boundary span,
  .intro-kicker,
  .intro-wordmark,
  .intro-tagline {
    transition: none !important;
  }

  .intro-contours {
    opacity: 0.018;
  }

  .intro-boundary span {
    width: 100%;
  }

  .intro-kicker,
  .intro-wordmark,
  .intro-tagline {
    opacity: 1;
    transform: none;
  }
}

@media (max-width: 760px) {
  .intro-boundary {
    left: 0;
    right: 0;
  }

  .intro-lockup {
    padding: 0 10px;
  }
}
```

## 4. Complete JavaScript lifecycle

Add this function to `frontend/app.js`. It is the complete launch controller used by the product.

```js
let introTimers = [];

function showIntro({ force = false } = {}) {
  // Normal launch is once per browser session.
  if (!force && sessionStorage.getItem('zv_intro_seen') === '1') {
    document.querySelector('#initial-splash')?.remove();
    document.body.classList.remove(
      'intro-running',
      'intro-content-reveal'
    );
    return;
  }

  sessionStorage.setItem('zv_intro_seen', '1');

  // Prevent old timers from affecting a forced replay.
  introTimers.forEach((timer) => clearTimeout(timer));
  introTimers = [];

  const existingOverlay = document.querySelector('#initial-splash');
  const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  const overlay = existingOverlay || document.createElement('div');
  overlay.className = `intro-overlay${
    reducedMotion ? ' intro-reduced' : ''
  }`;
  overlay.setAttribute('aria-hidden', 'true');

  // Forced replays may create a fresh overlay after the first one was removed.
  if (!existingOverlay) {
    overlay.innerHTML = `
      <svg
        class="intro-contours"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M-40 210 C 220 100 330 310 620 220 S 1060 80 1480 190" />
        <path d="M-40 250 C 240 125 360 360 650 260 S 1090 120 1480 230" />
        <path d="M-40 670 C 260 560 390 820 720 670 S 1120 520 1480 620" />
        <path d="M-40 710 C 280 590 410 860 760 710 S 1160 560 1480 660" />
        <ellipse cx="1160" cy="390" rx="210" ry="120" />
        <ellipse cx="1160" cy="390" rx="280" ry="170" />
      </svg>
      <div class="intro-boundary"><span></span></div>
      <div class="intro-lockup">
        <div class="intro-kicker">A field intelligence system</div>
        <div class="intro-wordmark">Zameen Vivaad <em>AI</em></div>
        <div class="intro-tagline">
          See the dispute before it stalls the land.
        </div>
      </div>
    `;
  }

  document.documentElement.classList.remove(
    'skip-initial-splash'
  );

  if (!existingOverlay) {
    document.body.appendChild(overlay);
  }

  document.body.classList.add('intro-running');

  // Reduced motion skips directly to the settled state.
  if (reducedMotion) {
    document.body.classList.add('intro-content-reveal');
    overlay.remove();
    document.body.classList.remove(
      'intro-running',
      'intro-content-reveal'
    );
    return;
  }

  const introTiming = {
    opening: 120,
    contoursIn: 220,
    line: 520,
    wordmark: 2000,
    tagline: 2450,
    reveal: 4950,
    finish: 5000,
  };

  const finish = () => {
    overlay.remove();
    document.body.classList.remove(
      'intro-running',
      'intro-content-reveal'
    );
    introTimers = [];
  };

  introTimers = [
    // Fade in the faint contour field.
    setTimeout(
      () => overlay.classList.add('intro-opening'),
      introTiming.opening
    ),

    setTimeout(
      () => overlay.classList.add('intro-contours-in'),
      introTiming.contoursIn
    ),

    // Start the deliberate left-to-right survey line.
    setTimeout(
      () => overlay.classList.add('intro-line'),
      introTiming.line
    ),

    // Reveal the wordmark after the line has been tracing.
    setTimeout(
      () => overlay.classList.add('intro-wordmark'),
      introTiming.wordmark
    ),

    // Reveal the supporting tagline.
    setTimeout(
      () => overlay.classList.add('intro-tagline'),
      introTiming.tagline
    ),

    // Reveal the dashboard while the contour field fades away.
    setTimeout(() => {
      document.body.classList.add('intro-content-reveal');
      overlay.classList.add('intro-fadeout');
    }, introTiming.reveal),

    // Remove the overlay at exactly five seconds.
    setTimeout(finish, introTiming.finish),
  ];
}
```

## 5. Startup and navigation hooks

Call `render()` first so the dashboard exists underneath the splash, then call `showIntro()` once during initial application startup.

```js
render();
showIntro();
```

The product replays the intro when the user explicitly returns to Overview/Home. The `force: true` option bypasses the session guard.

```js
app
  .querySelectorAll('[data-nav]')
  .forEach((element) => {
    element.addEventListener('click', () => {
      const nextTab = element.dataset.nav;
      const returningHome = nextTab === 'dashboard';

      state.activeTab = nextTab;
      state.mobileNavOpen = false;
      render();

      if (returningHome) {
        showIntro({ force: true });
      }
    });
  });
```

## 6. Timing table

| Time | State | Visual result |
|---:|---|---|
| `0ms` | Base | Parchment overlay covers the dashboard. The dashboard is translated down 8px and hidden. |
| `120ms` | `intro-opening` | The opening kicker begins fading into view and the contour field becomes barely visible. |
| `220ms` | `intro-contours-in` | The contour pattern reaches its readable-but-faint opacity. |
| `520ms` | `intro-line` | The 1px boundary line begins its 1.2-second left-to-right draw. |
| `2000ms` | `intro-wordmark` | The kicker and `Zameen Vivaad AI` rise 12px into place. |
| `2450ms` | `intro-tagline` | The tagline fades/slides into place. |
| `4950ms` | `intro-fadeout` | The dashboard reveals while the contour pattern fades toward near-invisible. |
| `5000ms` | Finished | The overlay is removed and normal dashboard interaction is restored. |

## 7. Reset and testing commands

To force the intro to play again during local testing, open the browser console and run:

```js
sessionStorage.removeItem('zv_intro_seen');
location.reload();
```

To test the forced Home replay without clearing the session:

```js
showIntro({ force: true });
```

To test the reduced-motion behavior in Chromium, open DevTools, use the Rendering panel, enable **Emulate CSS prefers-reduced-motion: reduce**, then reload the page. The dashboard should appear immediately and the animated sequence should not run.

## 8. Important behavior notes

The session key is `zv_intro_seen`. The first normal launch sets this key to `1`, so subsequent internal navigation does not replay the intro. The Home navigation intentionally uses `force: true`, so returning to the Overview screen replays the five-second sequence as requested.

The intro has no network dependency, no video download, and no API dependency. It is safe to run while the FastAPI service is still checking connectivity in the background.
