import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={`${className} overflow-visible`}
  >
    <defs>
      {/* High-Contrast Metallic Gold Gradient */}
      <linearGradient id="premiumGold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#fef3c7" />
        <stop offset="20%" stopColor="#fbbf24" />
        <stop offset="45%" stopColor="#d97706" />
        <stop offset="55%" stopColor="#fcd34d" />
        <stop offset="80%" stopColor="#b45309" />
        <stop offset="100%" stopColor="#78350f" />
      </linearGradient>
      
      {/* Sophisticated Multi-Layer Glow */}
      <filter id="premiumCoreGlow" x="-100%" y="-100%" width="300%" height="300%">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feFlood floodColor="#fbbf24" floodOpacity="0.6" result="glowColor" />
        <feComposite in="glowColor" in2="blur" operator="in" result="softGlow" />
        <feMerge>
          <feMergeNode in="softGlow" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      {/* Dynamic Glass Reflection */}
      <linearGradient id="glassReflection" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="white" stopOpacity="0.15" />
        <stop offset="45%" stopColor="white" stopOpacity="0" />
        <stop offset="55%" stopColor="white" stopOpacity="0" />
        <stop offset="100%" stopColor="white" stopOpacity="0.08" />
      </linearGradient>

      <style>
        {`
          @keyframes breathe {
            0%, 100% { transform: scale(1); opacity: 0.8; filter: brightness(1); }
            50% { transform: scale(1.15); opacity: 1; filter: brightness(1.4); }
          }
          .animate-breathe {
            animation: breathe 4s ease-in-out infinite;
            transform-origin: center;
          }
          @keyframes slow-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .animate-slow-spin {
            animation: slow-spin 24s linear infinite;
            transform-origin: center;
          }
          .animate-med-spin-reverse {
            animation: slow-spin 17s linear infinite reverse;
            transform-origin: center;
          }
          .animate-fast-spin {
            animation: slow-spin 6s linear infinite;
            transform-origin: center;
          }
        `}
      </style>
    </defs>

    {/* Outer Polished Obsidian Case - Deep Black with subtle rim */}
    <circle cx="50" cy="50" r="48" fill="#020202" />
    <circle cx="50" cy="50" r="46" stroke="url(#premiumGold)" strokeWidth="3" fill="none" />
    <circle cx="50" cy="50" r="43" stroke="rgba(251, 191, 36, 0.1)" strokeWidth="0.5" fill="none" />
    
    {/* Internal Depth Markers - Precision Engineering look */}
    <g opacity="0.2">
      {[...Array(12)].map((_, i) => (
        <line 
          key={i}
          x1="50" y1="12" x2="50" y2="16" 
          stroke="#fbbf24" 
          strokeWidth="1.5"
          transform={`rotate(${i * 30} 50 50)`} 
        />
      ))}
    </g>

    {/* Rotating Outer Logic Ring (The "Vault Door") */}
    <g className="animate-slow-spin">
      <path 
        d="M50 12 A 38 38 0 0 1 88 50" 
        stroke="url(#premiumGold)" 
        strokeWidth="2" 
        strokeLinecap="round" 
        fill="none" 
        opacity="0.9"
      />
      <circle cx="88" cy="50" r="3" fill="#fbbf24" style={{ filter: 'drop-shadow(0 0 6px #fbbf24)' }} />
    </g>

    {/* Counter-Rotating Inner Synthesis Ring */}
    <g className="animate-med-spin-reverse" opacity="0.6">
      <path 
        d="M50 82 A 32 32 0 0 1 18 50" 
        stroke="#d97706" 
        strokeWidth="1" 
        strokeDasharray="4 6" 
        fill="none" 
      />
      <circle cx="18" cy="50" r="1.5" fill="#fcd34d" />
    </g>

    {/* Precision Micro-Tick (The "Heartbeat") */}
    <g className="animate-fast-spin" opacity="0.4">
       <line x1="50" y1="50" x2="50" y2="25" stroke="#fbbf24" strokeWidth="0.5" strokeLinecap="round" />
    </g>

    {/* The Central Tourbillon Core (The "Intelligence Engine") */}
    <g filter="url(#premiumCoreGlow)" className="animate-breathe">
      {/* Layered circles for depth */}
      <circle cx="50" cy="50" r="9" fill="url(#premiumGold)" />
      <circle cx="50" cy="50" r="13" stroke="#fbbf24" strokeWidth="0.5" fill="none" opacity="0.3" />
      <circle cx="50" cy="50" r="16" stroke="#fbbf24" strokeWidth="0.25" fill="none" opacity="0.1" />
      
      {/* Mechanical Hub Detail */}
      <circle cx="50" cy="50" r="3" fill="#050505" />
      <circle cx="50" cy="50" r="1.5" fill="#fbbf24" />
    </g>

    {/* Glass Face Highlight / Surface Depth */}
    <circle cx="50" cy="50" r="44" fill="url(#glassReflection)" />

    {/* Pocket Watch Crown Hardware - The "Vault Handle" */}
    <g transform="translate(0, -2)">
      <rect x="42" y="0" width="16" height="5" rx="1" fill="url(#premiumGold)" />
      <path d="M44 5 L 56 5 L 54 9 L 46 9 Z" fill="url(#premiumGold)" />
      <circle cx="50" cy="-3" r="7" stroke="url(#premiumGold)" strokeWidth="2.5" fill="none" />
    </g>
  </svg>
);

export default Logo;