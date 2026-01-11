import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
  >
    <defs>
      {/* Metallic Gold Case Gradient */}
      <linearGradient id="caseGold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#fef3c7" />
        <stop offset="45%" stopColor="#fbbf24" />
        <stop offset="55%" stopColor="#d97706" />
        <stop offset="100%" stopColor="#78350f" />
      </linearGradient>

      {/* Liquid Gold Core Gradient */}
      <radialGradient id="liquidOrb" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fff7ed" />
        <stop offset="30%" stopColor="#fde68a" />
        <stop offset="70%" stopColor="#fbbf24" />
        <stop offset="100%" stopColor="#b45309" />
      </radialGradient>

      {/* Neon Glow Filter */}
      <filter id="goldGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>

      {/* Glass Reflection */}
      <linearGradient id="glassReflect" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="white" stopOpacity="0.2" />
        <stop offset="50%" stopColor="white" stopOpacity="0" />
        <stop offset="100%" stopColor="white" stopOpacity="0.05" />
      </linearGradient>
    </defs>

    {/* Outer Pocket Watch Case */}
    <circle cx="50" cy="50" r="46" stroke="url(#caseGold)" strokeWidth="4" fill="#050505" />
    <circle cx="50" cy="50" r="42" stroke="rgba(251, 191, 36, 0.1)" strokeWidth="1" fill="none" />

    {/* Internal Shimmer Ring */}
    <circle cx="50" cy="50" r="38" stroke="#fbbf24" strokeWidth="0.5" strokeDasharray="1 4" opacity="0.3" className="animate-[spin_20s_linear_infinite]" />

    {/* The Liquid Gold Orb */}
    <g filter="url(#goldGlow)">
      <circle cx="50" cy="50" r="22" fill="url(#liquidOrb)" className="animate-pulse">
        <animate attributeName="r" values="22;24;22" dur="4s" repeatCount="indefinite" />
      </circle>
    </g>

    {/* Satellite "Value" Particle */}
    <g className="animate-[spin_8s_linear_infinite]">
      <circle cx="82" cy="50" r="3" fill="#fbbf24" filter="url(#goldGlow)" />
      <circle cx="82" cy="50" r="6" stroke="#fbbf24" strokeWidth="0.5" fill="none" opacity="0.4" />
    </g>

    {/* Glass Cover Effect */}
    <circle cx="50" cy="50" r="44" fill="url(#glassReflect)" />

    {/* Pocket Watch Crown & Loop */}
    <rect x="44" y="0" width="12" height="6" rx="1" fill="url(#caseGold)" />
    <path d="M40 -4 L 60 -4 L 58 2 L 42 2 Z" fill="url(#caseGold)" transform="translate(0, 4)" />
    <circle cx="50" cy="-2" r="6" stroke="url(#caseGold)" strokeWidth="2" fill="none" transform="translate(0, 2)" />
  </svg>
);

export default Logo;