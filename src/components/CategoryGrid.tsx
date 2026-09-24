import React from 'react';

interface CategoryGridProps {
  onNavigate: (path: string, isLive: boolean, title: string) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ onNavigate }) => {
  const tileClass =
    "relative aspect-square overflow-hidden rounded-[14px] shadow-md cursor-pointer p-0 border border-black/10 focus:outline-hidden active:scale-[0.98] transition-transform";

  return (
    <section id="categories-section" className="w-full">
      <h2
        id="all-categories-heading"
        className="text-lg sm:text-xl font-medium tracking-tight text-gray-900 mb-3 font-sans"
      >
        All Categories
      </h2>

      <div
        id="categories-grid"
        className="relative left-1/2 grid w-[calc(100vw-12px)] -translate-x-1/2 grid-cols-3 gap-1.5 sm:left-auto sm:w-full sm:translate-x-0 sm:gap-3"
      >
        {/* COMMON NUMBER */}
        <button
          id="cat-tile-common-number"
          onClick={() => onNavigate('/common-number', true, 'Common Number')}
          className={tileClass}
          title="Common Number"
        >
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <rect width="200" height="200" rx="18" fill="#ff6b57" />

            <circle
              cx="100"
              cy="82"
              r="48"
              fill="none"
              stroke="#363636"
              strokeWidth="6"
            />

            <text
              x="100"
              y="102"
              textAnchor="middle"
              fontFamily="Arial, sans-serif"
              fontSize="58"
              fontWeight="400"
              fill="#363636"
            >
              C
            </text>

            <text
              x="100"
              y="166"
              textAnchor="middle"
              fontFamily="Arial, sans-serif"
              fontSize="17"
              fontWeight="700"
              fill="#ffffff"
            >
              Common Number
            </text>
          </svg>
        </button>

        {/* ANALYTICS */}
        <button
          id="cat-tile-analytics"
          onClick={() => onNavigate('/analytics', true, 'Analytics')}
          className={tileClass}
          title="Analytics"
        >
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <defs>
              <linearGradient id="analyticsBgExact" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0e507f" />
                <stop offset="100%" stopColor="#082c4e" />
              </linearGradient>
            </defs>

            <rect width="200" height="200" rx="18" fill="url(#analyticsBgExact)" />

            <g>
              <line x1="42" y1="54" x2="42" y2="95" stroke="#d9f1ff" strokeWidth="2" />
              <line x1="42" y1="95" x2="82" y2="95" stroke="#d9f1ff" strokeWidth="2" />

              <rect x="48" y="78" width="6" height="17" fill="#ffffff" />
              <rect x="58" y="68" width="6" height="27" fill="#ffffff" />
              <rect x="68" y="58" width="6" height="37" fill="#ffffff" />

              <polyline
                points="46,84 56,74 65,67 76,55"
                fill="none"
                stroke="#ffffff"
                strokeWidth="3"
              />
            </g>

            <g transform="translate(116 88)">
              <path d="M0,0 L0,-44 A44,44 0 0,1 42,-13 Z" fill="#00a3d9" />
              <path d="M0,0 L42,-13 A44,44 0 0,1 27,35 Z" fill="#8039c9" />
              <path d="M0,0 L27,35 A44,44 0 0,1 -22,38 Z" fill="#3cbf62" />
              <path d="M0,0 L-22,38 A44,44 0 0,1 -43,-8 Z" fill="#f4a51c" />
              <path d="M0,0 L-43,-8 A44,44 0 0,1 0,-44 Z" fill="#e53838" />

              <text x="15" y="-29" fill="#fff" fontSize="8" fontWeight="700">50%</text>
              <text x="29" y="15" fill="#fff" fontSize="8" fontWeight="700">30%</text>
              <text x="-4" y="35" fill="#fff" fontSize="8" fontWeight="700">45%</text>
              <text x="-38" y="17" fill="#fff" fontSize="8" fontWeight="700">25%</text>
            </g>

            <text
              x="100"
              y="166"
              textAnchor="middle"
              fontFamily="Arial, sans-serif"
              fontSize="18"
              fontWeight="700"
              fill="#ffffff"
            >
              Analytics
            </text>
          </svg>
        </button>

        {/* PREVIOUS RESULT */}
        <button
          id="cat-tile-previous-result"
          onClick={() => onNavigate('/previous-results', true, 'Previous Result')}
          className={tileClass}
          title="Previous Result"
        >
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <rect width="200" height="200" rx="18" fill="#23aea5" />

            <circle cx="100" cy="77" r="48" fill="#ffffff" />
            <circle cx="100" cy="77" r="35" fill="#159c93" />
            <circle cx="100" cy="77" r="24" fill="#ffffff" />
            <circle cx="100" cy="77" r="13" fill="#159c93" />

            <line
              x1="100"
              y1="76"
              x2="100"
              y2="134"
              stroke="#ffffff"
              strokeWidth="5"
            />
            <polygon points="100,62 91,77 109,77" fill="#ffffff" />
            <polygon points="100,136 91,123 100,127" fill="#ffffff" />
            <polygon points="100,136 109,123 100,127" fill="#ffffff" />

            <text
              x="100"
              y="166"
              textAnchor="middle"
              fontFamily="Arial, sans-serif"
              fontSize="16"
              fontWeight="700"
              fill="#ffffff"
            >
              Previous Result
            </text>
          </svg>
        </button>

        {/* PREDICT TARGET */}
        <button
          id="cat-tile-predict-target"
          onClick={() => onNavigate('/predict-target', true, 'Predict Target')}
          className={tileClass}
          title="Predict Target"
        >
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <defs>
              <linearGradient id="predictBgExact" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#62543e" />
                <stop offset="100%" stopColor="#352719" />
              </linearGradient>
            </defs>

            <rect width="200" height="200" rx="18" fill="url(#predictBgExact)" />

            <g transform="translate(10 33)">
              <polygon points="0,15 28,0 28,9 160,9 160,21 28,21 28,30" fill="#eee9dc" />
              <text x="78" y="18" fill="#3b342c" fontSize="10" fontWeight="700">
                D Direct Number
              </text>

              <polygon points="0,48 28,33 28,42 160,42 160,54 28,54 28,63" fill="#f1ac23" />
              <text x="78" y="51" fill="#43331b" fontSize="10" fontWeight="700">
                H House
              </text>

              <polygon points="180,81 152,66 152,75 20,75 20,87 152,87 152,96" fill="#f0793f" />
              <text x="86" y="84" fill="#ffffff" fontSize="10" fontWeight="700">
                Ending E
              </text>
            </g>

            <text
              x="100"
              y="166"
              textAnchor="middle"
              fontFamily="Arial, sans-serif"
              fontSize="16"
              fontWeight="700"
              fill="#ffffff"
            >
              Predict Target
            </text>
          </svg>
        </button>

        {/* DEAL */}
        <button
          id="cat-tile-deal"
          onClick={() => onNavigate('/deal', true, 'Deal')}
          className="relative aspect-square overflow-hidden rounded-[14px] shadow-md cursor-pointer p-0 border-[2px] border-[#ef8a55] bg-white focus:outline-hidden active:scale-[0.98] transition-transform"
          title="DEAL"
        >
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <rect width="200" height="200" fill="#ffffff" />

            <line x1="52" y1="0" x2="52" y2="42" stroke="#9ca3af" strokeDasharray="2 2" />
            <line x1="84" y1="0" x2="84" y2="31" stroke="#9ca3af" strokeDasharray="2 2" />
            <line x1="116" y1="0" x2="116" y2="40" stroke="#9ca3af" strokeDasharray="2 2" />
            <line x1="148" y1="0" x2="148" y2="30" stroke="#9ca3af" strokeDasharray="2 2" />

            <path d="M40 48 L48 38 L56 38 L64 48 L64 124 L40 124 Z" fill="#30b85a" />
            <path d="M72 36 L80 26 L88 26 L96 36 L96 116 L72 116 Z" fill="#398be2" />
            <path d="M104 46 L112 36 L120 36 L128 46 L128 122 L104 122 Z" fill="#df463d" />
            <path d="M136 34 L144 24 L152 24 L160 34 L160 116 L136 116 Z" fill="#eb7a28" />

            <text x="52" y="91" fill="#fff" fontSize="27" fontWeight="700" textAnchor="middle">D</text>
            <text x="84" y="80" fill="#fff" fontSize="27" fontWeight="700" textAnchor="middle">E</text>
            <text x="116" y="91" fill="#fff" fontSize="27" fontWeight="700" textAnchor="middle">A</text>
            <text x="148" y="79" fill="#fff" fontSize="27" fontWeight="700" textAnchor="middle">L</text>

            <text
              x="100"
              y="164"
              textAnchor="middle"
              fontFamily="Arial, sans-serif"
              fontSize="18"
              fontWeight="700"
              fill="#df691c"
            >
              DEAL
            </text>
          </svg>
        </button>

        {/* DREAM NUMBER */}
        <button
          id="cat-tile-dream-number"
          onClick={() => onNavigate('/dream-number', true, 'Dream Number')}
          className={tileClass}
          title="Dream Number"
        >
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <rect width="200" height="200" rx="18" fill="#48a6ef" />

            <rect
              x="72"
              y="46"
              width="56"
              height="72"
              fill="none"
              stroke="#ffffff"
              strokeWidth="5"
            />

            <circle cx="93" cy="79" r="7" fill="#ffffff" />
            <path
              d="M82 92 C82 82 104 82 108 92 L108 111 L99 111 L99 98 L92 98 L92 111 L82 111 Z"
              fill="#ffffff"
            />

            <circle cx="115" cy="43" r="3" fill="#ffffff" />
            <circle cx="121" cy="35" r="5" fill="#ffffff" />

            <path
              d="M119 24 C119 18 125 14 131 16 C135 10 145 10 150 16 C158 14 164 20 163 27 C169 31 166 40 159 42 C155 47 143 47 138 43 C130 46 121 39 123 32 C120 30 119 27 119 24 Z"
              fill="#ffffff"
            />

            <text
              x="100"
              y="166"
              textAnchor="middle"
              fontFamily="Arial, sans-serif"
              fontSize="16"
              fontWeight="700"
              fill="#ffffff"
            >
              Dream Number
            </text>
          </svg>
        </button>
      </div>
    </section>
  );
};
