import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={`${className} transition-all duration-500 ease-out hover:scale-110 hover:rotate-[-5deg] group-hover:drop-shadow-[0_0_25px_rgba(255,0,255,0.6)]`}
    style={{ filter: 'drop-shadow(0 0 12px rgba(255, 0, 255, 0.4))' }}
  >
    <defs>
      {/* Background Neon Pink Glow */}
      <filter id="magentaNeon" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2.5" result="blur" />
        <feColorMatrix in="blur" type="matrix" values="0 0 0 0 1  0 0 0 0 0  0 0 0 0 1  0 0 0 0 1 0" />
        <feComposite in="SourceGraphic" operator="over" />
      </filter>

      {/* Cyan Interior Glow */}
      <radialGradient id="cyanGlow" cx="50" cy="45" r="35" gradientUnits="userSpaceOnUse">
        <stop stopColor="#00ffff" stopOpacity="0.9" />
        <stop offset="0.5" stopColor="#00ffff" stopOpacity="0.3" />
        <stop offset="1" stopColor="#00ffff" stopOpacity="0" />
      </radialGradient>

      {/* Gold Particles Gradient */}
      <linearGradient id="goldCoin" x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#fbbf24" />
        <stop offset="1" stopColor="#d97706" />
      </linearGradient>

      {/* Chest Body Gradient */}
      <linearGradient id="chestBodyDark" x1="50" y1="40" x2="50" y2="90" gradientUnits="userSpaceOnUse">
        <stop stopColor="#1e1b4b" />
        <stop offset="1" stopColor="#020617" />
      </linearGradient>

      {/* Shimmer sweep for the lid */}
      <linearGradient id="lidShimmer" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="white" stopOpacity="0" />
        <stop offset="50%" stopColor="white" stopOpacity="0.3" />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </linearGradient>
    </defs>

    {/* Intense Cyan Interior Light */}
    <circle cx="50" cy="48" r="25" fill="url(#cyanGlow)" className="animate-pulse" />

    {/* Chest Lid (Pink Neon Outline) */}
    <path 
      d="M20 45 C 20 25, 80 25, 80 45 L 80 52 L 20 52 Z" 
      fill="#0f172a" 
      stroke="#ff00ff" 
      strokeWidth="3"
      filter="url(#magentaNeon)"
    />

    {/* Chest Base (Pink Neon Outline) */}
    <path 
      d="M22 55 L 78 55 L 74 85 C 74 88, 72 90, 69 90 L 31 90 C 28 90, 26 88, 26 85 Z" 
      fill="#0f172a" 
      stroke="#ff00ff" 
      strokeWidth="3"
      filter="url(#magentaNeon)"
    />

    {/* Horizontal Cyan "Opening" Glow Line */}
    <path 
      d="M22 52 L 78 52" 
      stroke="#00ffff" 
      strokeWidth="2" 
      strokeLinecap="round"
      style={{ filter: 'drop-shadow(0 0 5px #00ffff)' }}
    />

    {/* Golden Flying Particles (Coins/Data) */}
    <g>
      {/* Particle 1 */}
      <circle cx="35" cy="35" r="2" fill="url(#goldCoin)">
        <animate attributeName="cy" values="35;15;35" dur="3s" repeatCount="indefinite" />
        <animate attributeName="cx" values="35;25;35" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.2;1;0.2" dur="3s" repeatCount="indefinite" />
      </circle>
      {/* Particle 2 */}
      <circle cx="65" cy="30" r="1.5" fill="url(#goldCoin)">
        <animate attributeName="cy" values="30;10;30" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="cx" values="65;75;65" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.1;1;0.1" dur="2.5s" repeatCount="indefinite" />
      </circle>
      {/* Particle 3 (Cyan Spark) */}
      <circle cx="50" cy="25" r="1" fill="#00ffff">
        <animate attributeName="cy" values="25;5;25" dur="4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;1;0" dur="4s" repeatCount="indefinite" />
      </circle>
      {/* Particle 4 (Small gold bit) */}
      <rect x="42" y="38" width="2.5" height="2.5" rx="0.5" fill="#fbbf24" transform="rotate(45 43.25 39.25)">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
      </rect>
    </g>

    {/* Central Keyhole Glow */}
    <rect x="46" y="65" width="8" height="10" rx="2" fill="#020617" stroke="#ff00ff" strokeWidth="1" filter="url(#magentaNeon)" />
    <circle cx="50" cy="69" r="1.5" fill="#00ffff" />

    {/* Shimmer Sweep Animation Overlay */}
    <rect x="0" y="25" width="100" height="65" fill="url(#lidShimmer)" pointerEvents="none">
      <animate attributeName="x" from="-100" to="100" dur="4s" repeatCount="indefinite" />
    </rect>
  </svg>
);

export default Logo;