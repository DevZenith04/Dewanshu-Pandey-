import React from 'react';

interface RiskSealProps {
  score?: number | string;
  level: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const RiskSeal: React.FC<RiskSealProps> = ({
  score,
  level,
  size = 'md',
  className = '',
}) => {
  const normLevel = level ? level.toUpperCase() : 'MEDIUM';

  let colorHex = '#C79A3E'; // default medium
  if (normLevel === 'CRITICAL' || normLevel === 'HIGH') {
    colorHex = '#B0472E';
  } else if (normLevel === 'LOW' || normLevel === 'CLEAR') {
    colorHex = '#3D5A52';
  }

  let sizeClasses = 'w-14 h-14 p-1';
  let scoreTextClass = 'text-base font-bold';
  let levelTextClass = 'text-[8px] tracking-tighter';

  if (size === 'sm') {
    sizeClasses = 'w-10 h-10 p-0.5';
    scoreTextClass = 'text-xs font-bold';
    levelTextClass = 'text-[6px] tracking-tight';
  } else if (size === 'lg') {
    sizeClasses = 'w-20 h-20 p-2';
    scoreTextClass = 'text-2xl font-bold';
    levelTextClass = 'text-[9px] tracking-tight';
  }

  return (
    <div
      className={`relative inline-flex flex-col items-center justify-center rounded-full font-display border leading-none transition-none ${sizeClasses} ${className}`}
      style={{
        borderColor: colorHex,
        color: colorHex,
        backgroundColor: 'transparent',
        boxShadow: 'none',
      }}
    >
      {/* Engraved inner circular line */}
      <div
        className="absolute inset-[2px] rounded-full border border-dashed pointer-events-none opacity-40"
        style={{ borderColor: colorHex }}
      ></div>

      {score !== undefined && (
        <span className={`${scoreTextClass} leading-none font-bold font-data-mono z-10`}>
          {score}
        </span>
      )}
      <span className={`${levelTextClass} uppercase font-bold z-10 font-display mt-0.5`}>
        {normLevel}
      </span>
    </div>
  );
};
