import React from 'react';

interface WayAILogoProps {
  variant?: 'navbar' | 'icon' | 'badge' | 'full' | 'poster' | 'compact';
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showSubtitle?: boolean;
  className?: string;
  onClick?: () => void;
}

export const WayAILogo: React.FC<WayAILogoProps> = ({
  variant = 'navbar',
  size = 'md',
  showSubtitle = true,
  className = '',
  onClick,
}) => {
  // SVG Capelo (Academic Mortarboard) matching the exact uploaded brand artwork
  const MortarboardIcon: React.FC<{ className?: string; fillDark?: boolean }> = ({
    className = 'w-full h-full',
    fillDark = true,
  }) => (
    <svg
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g>
        {/* Under-cap body / skull cap base */}
        <path
          d="M60 76C60 76 68 114 100 114C132 114 140 76 140 76C140 76 138 98 100 98C62 98 60 76 60 76Z"
          fill={fillDark ? '#090d16' : '#ffffff'}
        />
        <path
          d="M64 78C64 78 72 108 100 108C128 108 136 78 136 78C136 84 126 102 100 102C74 102 64 84 64 78Z"
          fill={fillDark ? '#020617' : '#f1f5f9'}
          opacity="0.9"
        />

        {/* Rhombus Diamond Top Panel */}
        <polygon
          points="100,26 182,66 100,102 18,66"
          fill={fillDark ? '#090d16' : '#ffffff'}
        />

        {/* Top subtle highlight rim */}
        <polyline
          points="18,66 100,102 182,66"
          stroke={fillDark ? '#38bdf8' : '#0284c7'}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.9"
        />

        {/* Button / Apex Rivet on top of the cap */}
        <ellipse
          cx="100"
          cy="64"
          rx="5"
          ry="4"
          fill={fillDark ? '#020617' : '#ffffff'}
          stroke={fillDark ? '#38bdf8' : '#0284c7'}
          strokeWidth="1.5"
        />

        {/* Tassel cord flowing from center button to left */}
        <path
          d="M100 64C82 64 54 74 48 92C44 104 43 116 38 126"
          stroke={fillDark ? '#090d16' : '#ffffff'}
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M100 64C82 64 54 74 48 92C44 104 43 116 38 126"
          stroke={fillDark ? '#38bdf8' : '#e0f2fe'}
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.75"
        />

        {/* Tassel ring / ball */}
        <circle
          cx="46"
          cy="94"
          r="6.5"
          fill={fillDark ? '#090d16' : '#ffffff'}
          stroke={fillDark ? '#38bdf8' : '#0284c7'}
          strokeWidth="1"
        />

        {/* Tassel fringe hanging down */}
        <path
          d="M44 98C44 98 48 114 42 130C40 134 32 138 28 132C26 128 32 116 38 100C40 96 44 98 44 98Z"
          fill={fillDark ? '#090d16' : '#ffffff'}
        />
      </g>
    </svg>
  );

  // Poster / Card artwork variant matching the exact user upload
  if (variant === 'poster') {
    return (
      <div
        onClick={onClick}
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#00d2ff] via-[#0080ff] to-[#0040aa] p-6 sm:p-8 flex flex-col items-center justify-center text-center shadow-2xl shadow-cyan-500/20 select-none ${className}`}
      >
        <div className="w-36 h-28 sm:w-48 sm:h-36 flex items-center justify-center drop-shadow-md mb-2">
          <MortarboardIcon className="w-full h-full" fillDark={true} />
        </div>
        <div className="text-white font-black tracking-widest text-3xl sm:text-4xl uppercase font-sans drop-shadow-sm">
          WAYAI
        </div>
        {showSubtitle && (
          <div className="mt-2 text-cyan-100 text-xs font-semibold tracking-wider uppercase opacity-90">
            Inteligência Artificial Académica • Moçambique
          </div>
        )}
      </div>
    );
  }

  // Icon / Badge only
  if (variant === 'icon' || variant === 'badge') {
    const iconSizeClasses = {
      sm: 'w-8 h-8 rounded-lg',
      md: 'w-10 h-10 rounded-xl',
      lg: 'w-12 h-12 rounded-2xl',
      xl: 'w-16 h-16 rounded-2xl',
      '2xl': 'w-24 h-24 rounded-3xl',
    }[size];

    return (
      <div
        onClick={onClick}
        className={`relative flex items-center justify-center bg-gradient-to-b from-[#00d2ff] via-[#0088ff] to-[#004ecc] p-1.5 shadow-md shadow-cyan-600/25 select-none ${iconSizeClasses} ${className}`}
      >
        <MortarboardIcon className="w-full h-full drop-shadow-sm" fillDark={true} />
      </div>
    );
  }

  // Navbar brand variant (Default)
  const navIconSizes = {
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-10 h-10 rounded-xl',
    lg: 'w-11 h-11 rounded-xl',
    xl: 'w-14 h-14 rounded-2xl',
    '2xl': 'w-18 h-18 rounded-2xl',
  }[size];

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 cursor-pointer group select-none ${className}`}
    >
      {/* Brand Icon with the exact cyan-to-blue gradient & academic cap */}
      <div
        className={`relative flex items-center justify-center bg-gradient-to-b from-[#00d2ff] via-[#0088ff] to-[#004ecc] p-1.5 shadow-md shadow-cyan-600/20 group-hover:scale-105 transition-transform duration-200 ${navIconSizes}`}
      >
        <MortarboardIcon className="w-full h-full drop-shadow-sm" fillDark={true} />
      </div>

      {/* Brand Typography */}
      <div>
        <div className="flex items-center gap-1.5">
          <span className="font-black text-lg tracking-tight text-slate-900 dark:text-white flex items-center">
            <span>WAY</span>
            <span className="text-cyan-600 dark:text-cyan-400 ml-0.5">AI</span>
          </span>
          <span className="text-[10px] uppercase font-extrabold tracking-wider px-1.5 py-0.5 rounded bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300 border border-cyan-300/40">
            MZ 🇲🇿
          </span>
        </div>
        {showSubtitle && (
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-none mt-0.5">
            A IA do Estudante Moçambicano
          </p>
        )}
      </div>
    </div>
  );
};
