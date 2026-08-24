import React, { useEffect, useState } from 'react';

interface InitialSplashProps {
  onComplete: () => void;
}

export const InitialSplash: React.FC<InitialSplashProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'line' | 'text' | 'tagline' | 'fadeout'>('line');

  useEffect(() => {
    // Check prefers-reduced-motion or sessionStorage
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasSeenSplash = sessionStorage.getItem('zv_splash_seen');

    if (prefersReducedMotion || hasSeenSplash === 'true') {
      onComplete();
      return;
    }

    // Step 1: Draw hairline boundary line (0ms to 450ms)
    const t1 = setTimeout(() => {
      setPhase('text');
    }, 450);

    // Step 2: Fade & slide wordmark up into place (450ms to 750ms)
    const t2 = setTimeout(() => {
      setPhase('tagline');
    }, 750);

    // Step 3: Fade tagline in (750ms to 1250ms)
    const t3 = setTimeout(() => {
      setPhase('fadeout');
    }, 1250);

    // Step 4: Fade overlay out and complete (1250ms to 1500ms)
    const t4 = setTimeout(() => {
      sessionStorage.setItem('zv_splash_seen', 'true');
      onComplete();
    }, 1500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F6F4EF] text-[#001e2d] transition-opacity duration-300 font-display select-none overflow-hidden ${
        phase === 'fadeout' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Faint Topographic Contour Lines Pattern Background */}
      <svg
        className={`absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-700 ${
          phase === 'fadeout' ? 'opacity-0' : 'opacity-15'
        }`}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1000 600"
        preserveAspectRatio="xMidYMid slice"
      >
        <path
          d="M -100,100 C 200,50 400,250 700,100 C 900,0 1100,200 1200,300"
          fill="none"
          stroke="#874f43"
          strokeWidth="1"
        />
        <path
          d="M -100,200 C 150,150 350,350 650,200 C 850,100 1050,300 1200,400"
          fill="none"
          stroke="#874f43"
          strokeWidth="1"
        />
        <path
          d="M -100,300 C 100,250 300,450 600,300 C 800,200 1000,400 1200,500"
          fill="none"
          stroke="#874f43"
          strokeWidth="1"
        />
        <path
          d="M -100,400 C 50,350 250,550 550,400 C 750,300 950,500 1200,600"
          fill="none"
          stroke="#874f43"
          strokeWidth="1"
        />
        <circle cx="500" cy="300" r="120" fill="none" stroke="#874f43" strokeWidth="0.75" strokeDasharray="3,3" />
        <circle cx="500" cy="300" r="220" fill="none" stroke="#874f43" strokeWidth="0.5" strokeDasharray="4,4" />
      </svg>

      {/* Center Container */}
      <div className="relative z-10 w-full max-w-xl px-8 text-center space-y-4">
        {/* Top Emblem / Reference */}
        <div className="text-[10px] font-data-mono font-bold uppercase tracking-widest text-[#874f43] opacity-80">
          ADM CADASTRAL REGISTRY • V2.04
        </div>

        {/* Wordmark "Zameen Vivaad AI" */}
        <div className="overflow-hidden py-1">
          <h1
            className={`font-display font-bold text-4xl sm:text-5xl uppercase tracking-wider text-[#001e2d] transition-all duration-300 ease-out ${
              phase === 'line'
                ? 'opacity-0 translate-y-3'
                : 'opacity-100 translate-y-0'
            }`}
          >
            Zameen Vivaad AI
          </h1>
        </div>

        {/* Single 1px Hairline Boundary Line drawing left to right */}
        <div className="w-full h-[1px] bg-[#d7c2bd] relative overflow-hidden my-2">
          <div
            className="absolute top-0 left-0 bottom-0 bg-[#874f43] transition-all duration-500 ease-out"
            style={{
              width: phase === 'line' ? '0%' : '100%',
            }}
          ></div>
        </div>

        {/* Tagline */}
        <div className="overflow-hidden">
          <p
            className={`font-label text-sm sm:text-base italic text-[#85736f] transition-all duration-300 ease-out ${
              phase === 'tagline' || phase === 'fadeout'
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-2'
            }`}
          >
            Land Acquisition, Legal Dispute Resolution &amp; Risk Forecast Engine
          </p>
        </div>
      </div>
    </div>
  );
};
