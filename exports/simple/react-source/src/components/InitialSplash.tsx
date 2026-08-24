import React, { useEffect, useState } from 'react';

interface InitialSplashProps {
  onComplete: () => void;
}

type IntroPhase = 'line' | 'wordmark' | 'tagline' | 'fadeout';

export const InitialSplash: React.FC<InitialSplashProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<IntroPhase>('line');

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasSeenIntro = sessionStorage.getItem('zv_splash_seen') === 'true';

    if (prefersReducedMotion || hasSeenIntro) {
      sessionStorage.setItem('zv_splash_seen', 'true');
      onComplete();
      return undefined;
    }

    const wordmarkTimer = window.setTimeout(() => setPhase('wordmark'), 500);
    const taglineTimer = window.setTimeout(() => setPhase('tagline'), 800);
    const fadeoutTimer = window.setTimeout(() => setPhase('fadeout'), 1160);
    const completeTimer = window.setTimeout(() => {
      sessionStorage.setItem('zv_splash_seen', 'true');
      onComplete();
    }, 1500);

    return () => {
      window.clearTimeout(wordmarkTimer);
      window.clearTimeout(taglineTimer);
      window.clearTimeout(fadeoutTimer);
      window.clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className={`intro-overlay intro-${phase}`} aria-label="Loading Zameen Vivaad AI">
      <svg className="intro-contours" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <path d="M-80 170C170 35 275 255 528 132S930 14 1116 168s274 122 450 30" />
        <path d="M-100 270C125 155 286 352 536 237s402-86 603 35 238 145 391 44" />
        <path d="M-85 385C150 253 313 470 560 345s392-77 594 44 226 142 374 58" />
        <path d="M-90 505C120 377 320 588 565 460s409-73 606 55 211 140 358 65" />
        <path d="M-80 635C140 500 315 720 587 582s389-51 585 67 234 143 377 58" />
        <path d="M-65 770C138 624 325 846 598 702s399-35 594 68 225 134 349 67" />
        <ellipse cx="776" cy="420" rx="216" ry="142" />
        <ellipse cx="776" cy="420" rx="310" ry="204" />
        <ellipse cx="776" cy="420" rx="418" ry="282" />
      </svg>
      <div className="intro-boundary" aria-hidden="true"><span /></div>
      <div className="intro-lockup">
        <div className="intro-kicker">FIELD INTELLIGENCE · LAND ACQUISITION</div>
        <h1 className="intro-wordmark">Zameen Vivaad AI</h1>
        <p className="intro-tagline">See the delay before it becomes the story.</p>
      </div>
    </div>
  );
};
