import React from 'react';

export const Logo = ({ size = 'md', showSubtitle = true, light = false }) => {
  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  return (
    <div className="flex items-center gap-3 select-none">
      {/* GV Icon Badge */}
      <div className={`
        flex items-center justify-center font-black rounded-xl shadow-md border border-olive/50 transition-transform hover:scale-105
        ${isSmall ? 'w-9 h-9 text-lg' : isLarge ? 'w-16 h-16 text-3xl rounded-2xl' : 'w-12 h-12 text-2xl'}
        bg-primary text-darkText
      `}>
        GV
      </div>

      {/* Brand Text */}
      <div className="flex flex-col">
        <h1 className={`
          font-bold tracking-tight leading-none
          ${isSmall ? 'text-base' : isLarge ? 'text-2xl' : 'text-xl'}
          ${light ? 'text-darkText' : 'text-darkText'}
        `}>
          GV HR Follow-Up
        </h1>
        {showSubtitle && (
          <span className={`
            font-medium tracking-wide mt-0.5 uppercase
            ${isSmall ? 'text-[10px]' : isLarge ? 'text-xs' : 'text-[11px]'}
            ${light ? 'text-darkText/80' : 'text-darkText/70'}
          `}>
            Placement Communication Management
          </span>
        )}
      </div>
    </div>
  );
};
