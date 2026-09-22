import React from 'react';

interface CategoryGridProps {
  onNavigate: (path: string, isLive: boolean, title: string) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ onNavigate }) => {
  return (
    <section id="categories-section" className="w-full">
      <h2
        id="all-categories-heading"
        className="text-lg sm:text-xl font-medium tracking-tight text-gray-900 mb-3 font-sans"
      >
        All Categories
      </h2>

      {/* 3x2 Grid on all viewports matching exact reference screenshot */}
      <div
        id="categories-grid"
        className="grid grid-cols-3 gap-2.5 sm:gap-3.5 w-full"
      >
        {/* 1. Common Number */}
        <button
          id="cat-tile-common-number"
          onClick={() => onNavigate('/common-number', true, 'Common Number')}
          className="group relative aspect-square rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:scale-[1.025] active:scale-[0.975] transition-all duration-200 cursor-pointer focus:outline-hidden p-0 border border-black/10"
          title="Common Number"
        >
          <svg viewBox="0 0 200 200" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="cn-bg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f3614c" />
                <stop offset="100%" stopColor="#d83f2b" />
              </linearGradient>
              <filter id="cn-shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="3.5" stdDeviation="3.5" floodColor="#000000" floodOpacity="0.35" />
              </filter>
            </defs>
            {/* Background */}
            <rect width="200" height="200" rx="20" fill="url(#cn-bg)" />
            <rect x="2" y="2" width="196" height="196" rx="18" fill="none" stroke="#ffffff" strokeOpacity="0.15" strokeWidth="2" />

            {/* Centered Large Black Circled 'C' Archery Badge */}
            <g filter="url(#cn-shadow)">
              {/* Outer thick black ring */}
              <circle cx="100" cy="80" r="42" fill="none" stroke="#18181b" strokeWidth="12" />
              {/* Inner 'C' */}
              <text
                x="100"
                y="97"
                fontFamily="system-ui, -apple-system, sans-serif"
                fontSize="50"
                fontWeight="900"
                textAnchor="middle"
                fill="#18181b"
              >
                C
              </text>
            </g>

            {/* Title: Common Number */}
            <text
              x="100"
              y="152"
              fontFamily="system-ui, -apple-system, sans-serif"
              fontSize="18"
              fontWeight="800"
              textAnchor="middle"
              fill="#ffffff"
              letterSpacing="-0.3"
            >
              Common Number
            </text>

            {/* Decorative Star Line */}
            <line x1="45" y1="165" x2="90" y2="165" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="1.2" />
            <circle cx="100" cy="165" r="2.5" fill="#ffffff" fillOpacity="0.95" />
            <line x1="110" y1="165" x2="155" y2="165" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="1.2" />

            {/* Subtitle */}
            <text
              x="100"
              y="180"
              fontFamily="system-ui, -apple-system, sans-serif"
              fontSize="8.5"
              fontWeight="600"
              textAnchor="middle"
              fill="#ffffff"
              fillOpacity="0.85"
              letterSpacing="0.4"
            >
              © shillongmorningteer.com
            </text>
          </svg>
        </button>

        {/* 2. DEAL (4 Hanging 3D Tags) */}
        <button
          id="cat-tile-deal"
          onClick={() => onNavigate('/deal', true, 'Deal')}
          className="group relative aspect-square rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:scale-[1.025] active:scale-[0.975] transition-all duration-200 cursor-pointer focus:outline-hidden p-0 border border-orange-300"
          title="DEAL"
        >
          <svg viewBox="0 0 200 200" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="deal-tag-shadow" x="-30%" y="-20%" width="160%" height="150%">
                <feDropShadow dx="1" dy="4" stdDeviation="3.5" floodColor="#000000" floodOpacity="0.25" />
              </filter>
              <linearGradient id="tag-green" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#4ade80" />
                <stop offset="100%" stopColor="#15803d" />
              </linearGradient>
              <linearGradient id="tag-blue" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#1d4ed8" />
              </linearGradient>
              <linearGradient id="tag-red" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#f87171" />
                <stop offset="100%" stopColor="#b91c1c" />
              </linearGradient>
              <linearGradient id="tag-orange" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#fb923c" />
                <stop offset="100%" stopColor="#c2410c" />
              </linearGradient>
            </defs>

            {/* Card Background: Clean White with 2.5px Orange Border */}
            <rect width="200" height="200" rx="20" fill="#ffffff" />
            <rect x="2" y="2" width="196" height="196" rx="18" fill="none" stroke="#f25842" strokeWidth="3" />

            {/* Suspended Strings from top edge */}
            <line x1="46" y1="0" x2="46" y2="40" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="1.5 1.5" />
            <line x1="82" y1="0" x2="82" y2="28" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="1.5 1.5" />
            <line x1="118" y1="0" x2="118" y2="38" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="1.5 1.5" />
            <line x1="154" y1="0" x2="154" y2="26" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="1.5 1.5" />

            {/* Tag 1: D (Emerald Green) */}
            <g filter="url(#deal-tag-shadow)">
              <path d="M34,48 L42,38 L50,38 L58,48 L58,124 L34,124 Z" fill="url(#tag-green)" />
              {/* Bevel highlight */}
              <line x1="35" y1="49" x2="35" y2="123" stroke="#ffffff" strokeOpacity="0.3" strokeWidth="1" />
              <circle cx="46" cy="44" r="3.5" fill="#f1f5f9" stroke="#64748b" strokeWidth="1" />
              <text x="46" y="94" fontFamily="system-ui, sans-serif" fontSize="28" fontWeight="900" textAnchor="middle" fill="#ffffff">
                D
              </text>
            </g>

            {/* Tag 2: E (Royal Blue) */}
            <g filter="url(#deal-tag-shadow)">
              <path d="M70,36 L78,26 L86,26 L94,36 L94,116 L70,116 Z" fill="url(#tag-blue)" />
              <line x1="71" y1="37" x2="71" y2="115" stroke="#ffffff" strokeOpacity="0.3" strokeWidth="1" />
              <circle cx="82" cy="32" r="3.5" fill="#f1f5f9" stroke="#64748b" strokeWidth="1" />
              <text x="82" y="84" fontFamily="system-ui, sans-serif" fontSize="28" fontWeight="900" textAnchor="middle" fill="#ffffff">
                E
              </text>
            </g>

            {/* Tag 3: A (Crimson Red) */}
            <g filter="url(#deal-tag-shadow)">
              <path d="M106,46 L114,36 L122,36 L130,46 L130,122 L106,122 Z" fill="url(#tag-red)" />
              <line x1="107" y1="47" x2="107" y2="121" stroke="#ffffff" strokeOpacity="0.3" strokeWidth="1" />
              <circle cx="118" cy="42" r="3.5" fill="#f1f5f9" stroke="#64748b" strokeWidth="1" />
              <text x="118" y="92" fontFamily="system-ui, sans-serif" fontSize="28" fontWeight="900" textAnchor="middle" fill="#ffffff">
                A
              </text>
            </g>

            {/* Tag 4: L (Sunny Orange) */}
            <g filter="url(#deal-tag-shadow)">
              <path d="M142,34 L150,24 L158,24 L166,34 L166,116 L142,116 Z" fill="url(#tag-orange)" />
              <line x1="143" y1="35" x2="143" y2="115" stroke="#ffffff" strokeOpacity="0.3" strokeWidth="1" />
              <circle cx="154" cy="30" r="3.5" fill="#f1f5f9" stroke="#64748b" strokeWidth="1" />
              <text x="154" y="82" fontFamily="system-ui, sans-serif" fontSize="28" fontWeight="900" textAnchor="middle" fill="#ffffff">
                L
              </text>
            </g>

            {/* Title: DEAL */}
            <text
              x="100"
              y="158"
              fontFamily="system-ui, -apple-system, sans-serif"
              fontSize="20"
              fontWeight="900"
              textAnchor="middle"
              fill="#ea580c"
              letterSpacing="1.5"
            >
              DEAL
            </text>
            <text
              x="100"
              y="180"
              fontFamily="system-ui, -apple-system, sans-serif"
              fontSize="8.5"
              fontWeight="600"
              textAnchor="middle"
              fill="#94a3b8"
              letterSpacing="0.4"
            >
              © shillongmorningteer.com
            </text>
          </svg>
        </button>

        {/* 3. Dream Number (Sleeping Silhouette & Dream Bubble Cloud) */}
        <button
          id="cat-tile-dream-number"
          onClick={() => onNavigate('/dream-number', true, 'Dream Number')}
          className="group relative aspect-square rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:scale-[1.025] active:scale-[0.975] transition-all duration-200 cursor-pointer focus:outline-hidden p-0 border border-black/10"
          title="Dream Number"
        >
          <svg viewBox="0 0 200 200" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="dn-bg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f3614c" />
                <stop offset="100%" stopColor="#d83f2b" />
              </linearGradient>
              <filter id="dn-shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="3.5" stdDeviation="3.5" floodColor="#000000" floodOpacity="0.35" />
              </filter>
            </defs>
            <rect width="200" height="200" rx="20" fill="url(#dn-bg)" />
            <rect x="2" y="2" width="196" height="196" rx="18" fill="none" stroke="#ffffff" strokeOpacity="0.15" strokeWidth="2" />

            {/* Dream Sleeping Silhouette in Solid Black */}
            <g filter="url(#dn-shadow)">
              {/* Outer Room / Bed Frame */}
              <rect x="74" y="44" width="46" height="52" rx="4" fill="none" stroke="#18181b" strokeWidth="6" />

              {/* Pillow */}
              <path d="M80,68 C76,64 88,58 98,66 C98,72 82,74 80,68 Z" fill="#18181b" />

              {/* Head & Sleeping Body */}
              <circle cx="94" cy="74" r="6.5" fill="#18181b" />
              <path d="M86,83 C86,76 102,76 106,83 L106,94 L98,94 L98,87 L92,87 L92,94 L86,94 Z" fill="#18181b" />

              {/* Ascending Thought Bubbles */}
              <circle cx="118" cy="46" r="2.2" fill="#18181b" />
              <circle cx="122" cy="40" r="3.2" fill="#18181b" />
              <circle cx="128" cy="34" r="4.2" fill="#18181b" />

              {/* Fluffy Thought Cloud */}
              <path
                d="M126,27 C124,24 126,18 132,18 C135,14 143,14 146,18 C151,17 155,21 154,26 C157,29 156,35 150,37 C147,40 138,40 134,37 C128,38 123,32 126,27 Z"
                fill="#18181b"
              />
            </g>

            {/* Title: Dream Number */}
            <text
              x="100"
              y="152"
              fontFamily="system-ui, -apple-system, sans-serif"
              fontSize="18"
              fontWeight="800"
              textAnchor="middle"
              fill="#ffffff"
              letterSpacing="-0.3"
            >
              Dream Number
            </text>

            {/* Decorative Star Line */}
            <line x1="45" y1="165" x2="90" y2="165" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="1.2" />
            <circle cx="100" cy="165" r="2.5" fill="#ffffff" fillOpacity="0.95" />
            <line x1="110" y1="165" x2="155" y2="165" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="1.2" />

            <text
              x="100"
              y="180"
              fontFamily="system-ui, -apple-system, sans-serif"
              fontSize="8.5"
              fontWeight="600"
              textAnchor="middle"
              fill="#ffffff"
              fillOpacity="0.85"
              letterSpacing="0.4"
            >
              © shillongmorningteer.com
            </text>
          </svg>
        </button>

        {/* 4. Analytics (3D Glossy Pie Chart & Upward Bar Graph) */}
        <button
          id="cat-tile-analytics"
          onClick={() => onNavigate('/analytics', true, 'Analytics')}
          className="group relative aspect-square rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:scale-[1.025] active:scale-[0.975] transition-all duration-200 cursor-pointer focus:outline-hidden p-0 border border-blue-900/50"
          title="Analytics"
        >
          <svg viewBox="0 0 200 200" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="an-bg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#15497f" />
                <stop offset="100%" stopColor="#08203c" />
              </linearGradient>
              <filter id="pie-3d-shadow" x="-20%" y="-20%" width="140%" height="150%">
                <feDropShadow dx="0" dy="5" stdDeviation="4.5" floodColor="#000000" floodOpacity="0.5" />
              </filter>
              <linearGradient id="pie-top" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>
              <linearGradient id="pie-right" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#c084fc" />
                <stop offset="100%" stopColor="#7e22ce" />
              </linearGradient>
              <linearGradient id="pie-bottom" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#4ade80" />
                <stop offset="100%" stopColor="#16a34a" />
              </linearGradient>
              <linearGradient id="pie-left" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#fb923c" />
                <stop offset="100%" stopColor="#ea580c" />
              </linearGradient>
              <linearGradient id="pie-red" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#f87171" />
                <stop offset="100%" stopColor="#dc2626" />
              </linearGradient>
            </defs>

            <rect width="200" height="200" rx="20" fill="url(#an-bg)" />
            <rect x="2" y="2" width="196" height="196" rx="18" fill="none" stroke="#ffffff" strokeOpacity="0.1" strokeWidth="2" />

            {/* 3D Bar Graph with Trend Line in upper-left corner */}
            <g opacity="0.95">
              <line x1="28" y1="26" x2="28" y2="68" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="1.5" />
              <line x1="28" y1="68" x2="78" y2="68" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="1.5" />
              <rect x="34" y="52" width="6" height="16" rx="1" fill="#ffffff" fillOpacity="0.7" />
              <rect x="43" y="44" width="6" height="24" rx="1" fill="#ffffff" fillOpacity="0.8" />
              <rect x="52" y="36" width="6" height="32" rx="1" fill="#ffffff" fillOpacity="0.9" />
              <rect x="61" y="28" width="6" height="40" rx="1" fill="#38bdf8" />
              <polyline points="32,60 41,50 50,42 64,26" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
              <polygon points="64,22 70,29 61,28" fill="#ffffff" />
            </g>

            {/* 3D Isometric Pie Chart with Extruded Height & Percentage Labels */}
            <g filter="url(#pie-3d-shadow)">
              {/* 3D Extrusion Side Panels */}
              <path d="M125,58 L162,72 L162,82 L125,68 Z" fill="#0369a1" />
              <path d="M162,72 L142,106 L142,116 L162,82 Z" fill="#581c87" />
              <path d="M142,106 L95,108 L95,118 L142,116 Z" fill="#14532d" />
              <path d="M95,108 L72,82 L72,92 L95,118 Z" fill="#7f1d1d" />

              {/* Pie Slices Top Faces */}
              <path d="M118,78 L118,48 A45,28 0 0,1 162,72 Z" fill="url(#pie-top)" />
              <text x="138" y="66" fontFamily="system-ui, sans-serif" fontSize="10" fontWeight="900" fill="#ffffff">
                50%
              </text>

              <path d="M118,78 L162,72 A45,28 0 0,1 142,106 Z" fill="url(#pie-right)" />
              <text x="146" y="94" fontFamily="system-ui, sans-serif" fontSize="9" fontWeight="900" fill="#ffffff">
                30%
              </text>

              <path d="M118,78 L142,106 A45,28 0 0,1 95,108 Z" fill="url(#pie-bottom)" />
              <text x="115" y="103" fontFamily="system-ui, sans-serif" fontSize="9.5" fontWeight="900" fill="#ffffff">
                45%
              </text>

              <path d="M118,78 L95,108 A45,28 0 0,1 72,82 Z" fill="url(#pie-left)" />
              <text x="77" y="98" fontFamily="system-ui, sans-serif" fontSize="9" fontWeight="900" fill="#ffffff">
                25%
              </text>

              <path d="M118,78 L72,82 A45,28 0 0,1 118,48 Z" fill="url(#pie-red)" />
            </g>

            {/* Title: Analytics */}
            <text
              x="100"
              y="152"
              fontFamily="system-ui, -apple-system, sans-serif"
              fontSize="19"
              fontWeight="800"
              textAnchor="middle"
              fill="#ffffff"
              letterSpacing="-0.3"
            >
              Analytics
            </text>

            {/* Decorative Hairline */}
            <line x1="45" y1="165" x2="90" y2="165" stroke="#ffffff" strokeOpacity="0.3" strokeWidth="1.2" />
            <circle cx="100" cy="165" r="2.5" fill="#38bdf8" />
            <line x1="110" y1="165" x2="155" y2="165" stroke="#ffffff" strokeOpacity="0.3" strokeWidth="1.2" />

            <text
              x="100"
              y="180"
              fontFamily="system-ui, -apple-system, sans-serif"
              fontSize="8.5"
              fontWeight="600"
              textAnchor="middle"
              fill="#ffffff"
              fillOpacity="0.85"
              letterSpacing="0.4"
            >
              © shillongmorningteer.com
            </text>
          </svg>
        </button>

        {/* 5. Predict Target (Folded 3D Ribbons: Direct Number, House, Ending) */}
        <button
          id="cat-tile-predict-target"
          onClick={() => onNavigate('/predict-target', true, 'Predict Target')}
          className="group relative aspect-square rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:scale-[1.025] active:scale-[0.975] transition-all duration-200 cursor-pointer focus:outline-hidden p-0 border border-amber-900/40"
          title="Predict Target"
        >
          <svg viewBox="0 0 200 200" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="pt-bg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3d2a1f" />
                <stop offset="100%" stopColor="#1a0f0a" />
              </linearGradient>
              <filter id="ribbon-shadow" x="-20%" y="-20%" width="140%" height="150%">
                <feDropShadow dx="0" dy="3.5" stdDeviation="3.5" floodColor="#000000" floodOpacity="0.55" />
              </filter>
              <linearGradient id="ribbon-white" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#e2e8f0" />
              </linearGradient>
              <linearGradient id="ribbon-yellow" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
              <linearGradient id="ribbon-orange" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#fb923c" />
                <stop offset="100%" stopColor="#c2410c" />
              </linearGradient>
            </defs>

            <rect width="200" height="200" rx="20" fill="url(#pt-bg)" />
            <rect x="2" y="2" width="196" height="196" rx="18" fill="none" stroke="#fbbf24" strokeOpacity="0.15" strokeWidth="2" />

            {/* 3D Folded Arrows Stack */}
            <g filter="url(#ribbon-shadow)">
              {/* 1. Top Ribbon Arrow: Direct Number (White) */}
              <path d="M28,48 L38,40 L38,56 Z" fill="#94a3b8" />
              <path d="M38,40 L152,40 L170,48 L152,56 L38,56 Z" fill="url(#ribbon-white)" />
              <circle cx="50" cy="48" r="6" fill="#1e293b" />
              <text x="50" y="52" fontFamily="system-ui, sans-serif" fontSize="8" fontWeight="900" textAnchor="middle" fill="#ffffff">
                D
              </text>
              <text x="63" y="52" fontFamily="system-ui, sans-serif" fontSize="10.5" fontWeight="800" fill="#0f172a">
                Direct Number
              </text>

              {/* 2. Middle Ribbon Arrow: House (Golden Amber) */}
              <path d="M32,74 L42,66 L42,82 Z" fill="#92400e" />
              <path d="M42,66 L156,66 L174,74 L156,82 L42,82 Z" fill="url(#ribbon-yellow)" />
              <circle cx="54" cy="74" r="6" fill="#78350f" />
              <text x="54" y="78" fontFamily="system-ui, sans-serif" fontSize="8" fontWeight="900" textAnchor="middle" fill="#ffffff">
                H
              </text>
              <text x="67" y="78" fontFamily="system-ui, sans-serif" fontSize="11" fontWeight="800" fill="#451a03">
                House
              </text>

              {/* 3. Bottom Ribbon Arrow: Ending (Copper / Terracotta) */}
              <path d="M172,100 L162,92 L162,108 Z" fill="#7c2d12" />
              <path d="M162,92 L46,92 L28,100 L46,108 L162,108 Z" fill="url(#ribbon-orange)" />
              <circle cx="148" cy="100" r="6" fill="#431407" />
              <text x="148" y="104" fontFamily="system-ui, sans-serif" fontSize="8" fontWeight="900" textAnchor="middle" fill="#ffffff">
                E
              </text>
              <text x="136" y="104" fontFamily="system-ui, sans-serif" fontSize="11" fontWeight="800" textAnchor="end" fill="#ffffff">
                Ending
              </text>
            </g>

            {/* Title: Predict Target */}
            <text
              x="100"
              y="152"
              fontFamily="system-ui, -apple-system, sans-serif"
              fontSize="18"
              fontWeight="800"
              textAnchor="middle"
              fill="#ffffff"
              letterSpacing="-0.3"
            >
              Predict Target
            </text>

            {/* Decorative Golden Star Line */}
            <line x1="45" y1="165" x2="90" y2="165" stroke="#fbbf24" strokeOpacity="0.5" strokeWidth="1.2" />
            <circle cx="100" cy="165" r="2.5" fill="#fbbf24" />
            <line x1="110" y1="165" x2="155" y2="165" stroke="#fbbf24" strokeOpacity="0.5" strokeWidth="1.2" />

            <text
              x="100"
              y="180"
              fontFamily="system-ui, -apple-system, sans-serif"
              fontSize="8.5"
              fontWeight="600"
              textAnchor="middle"
              fill="#fbbf24"
              fillOpacity="0.85"
              letterSpacing="0.4"
            >
              © shillongmorningteer.com
            </text>
          </svg>
        </button>

        {/* 6. Previous Result (Realistic 3D Archery Target & Center Bullseye Arrow) */}
        <button
          id="cat-tile-previous-result"
          onClick={() => onNavigate('/previous-results', true, 'Previous Result')}
          className="group relative aspect-square rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:scale-[1.025] active:scale-[0.975] transition-all duration-200 cursor-pointer focus:outline-hidden p-0 border border-teal-700/40"
          title="Previous Result"
        >
          <svg viewBox="0 0 200 200" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="pr-bg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#14b8a6" />
                <stop offset="100%" stopColor="#0d766e" />
              </linearGradient>
              <filter id="target-3d-shadow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="3" dy="6" stdDeviation="4.5" floodColor="#042f2e" floodOpacity="0.5" />
              </filter>
              <linearGradient id="arrow-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#cbd5e1" />
              </linearGradient>
            </defs>

            <rect width="200" height="200" rx="20" fill="url(#pr-bg)" />
            <rect x="2" y="2" width="196" height="196" rx="18" fill="none" stroke="#ffffff" strokeOpacity="0.2" strokeWidth="2" />

            {/* Realistic 3D Archery Target & Center Bullseye Arrow */}
            <g filter="url(#target-3d-shadow)">
              {/* Outer White Ring */}
              <circle cx="100" cy="74" r="42" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
              {/* Middle Teal Ring */}
              <circle cx="100" cy="74" r="32" fill="#0d9488" />
              {/* Inner White Ring */}
              <circle cx="100" cy="74" r="22" fill="#ffffff" />
              {/* Bullseye Ring */}
              <circle cx="100" cy="74" r="12" fill="#0f766e" />

              {/* 3D Arrow Cast Shadow */}
              <path d="M102,74 L122,122 L116,122 L100,74 Z" fill="#042f2e" opacity="0.35" />

              {/* 3D Arrow Piercing Center Bullseye */}
              <rect x="98.5" y="74" width="3" height="48" rx="1.5" fill="url(#arrow-grad)" />
              <polygon points="100,66 94,76 106,76" fill="#ffffff" />
              <polygon points="98.5,116 93,123 98.5,121" fill="#ffffff" />
              <polygon points="101.5,116 107,123 101.5,121" fill="#ffffff" />
              <polygon points="98.5,108 93,115 98.5,113" fill="#ffffff" />
              <polygon points="101.5,108 107,115 101.5,113" fill="#ffffff" />
            </g>

            {/* Title: Previous Result */}
            <text
              x="100"
              y="152"
              fontFamily="system-ui, -apple-system, sans-serif"
              fontSize="18"
              fontWeight="800"
              textAnchor="middle"
              fill="#ffffff"
              letterSpacing="-0.3"
            >
              Previous Result
            </text>

            {/* Decorative Star Line */}
            <line x1="45" y1="165" x2="90" y2="165" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="1.2" />
            <circle cx="100" cy="165" r="2.5" fill="#ffffff" />
            <line x1="110" y1="165" x2="155" y2="165" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="1.2" />

            <text
              x="100"
              y="180"
              fontFamily="system-ui, -apple-system, sans-serif"
              fontSize="8.5"
              fontWeight="600"
              textAnchor="middle"
              fill="#ffffff"
              fillOpacity="0.85"
              letterSpacing="0.4"
            >
              © shillongmorningteer.com
            </text>
          </svg>
        </button>
      </div>
    </section>
  );
};
