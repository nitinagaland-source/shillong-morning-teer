import React from 'react';

interface CategoryGridProps {
  onNavigate: (path: string, isLive: boolean, title: string) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ onNavigate }) => {
  const card =
    "relative aspect-square rounded-[16px] overflow-hidden shadow-md border cursor-pointer p-0 active:scale-[0.98] transition-transform";

  return (
    <section id="categories-section" className="w-full">
      <h2 className="text-lg sm:text-xl font-semibold text-black mb-3">
        All Categories
      </h2>

      <div className="grid grid-cols-3 gap-2 sm:gap-3">

        {/* COMMON NUMBER */}
        <button
          onClick={() => onNavigate('/common-number', true, 'Common Number')}
          className={`${card} border-[#ef8b7c] bg-[#ff6c5b]`}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <rect width="200" height="200" rx="18" fill="#ff6c5b"/>

            <circle
              cx="100"
              cy="78"
              r="46"
              fill="none"
              stroke="#333333"
              strokeWidth="6"
            />

            <text
              x="100"
              y="98"
              textAnchor="middle"
              fontFamily="Arial, sans-serif"
              fontSize="58"
              fontWeight="400"
              fill="#333333"
            >
              C
            </text>

            <text
              x="100"
              y="158"
              textAnchor="middle"
              fontFamily="Arial, sans-serif"
              fontSize="16"
              fontWeight="700"
              fill="#ffffff"
            >
              Common Number
            </text>

            <text
              x="100"
              y="180"
              textAnchor="middle"
              fontSize="7"
              fill="#ffffff"
            >
              © shillongmorningteer.com
            </text>
          </svg>
        </button>


        {/* ANALYTICS */}
        <button
          onClick={() => onNavigate('/analytics', true, 'Analytics')}
          className={`${card} border-[#315f89] bg-[#0d4574]`}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <rect width="200" height="200" rx="18" fill="#0d4574"/>

            <g>
              <line x1="35" y1="87" x2="35" y2="38" stroke="#dff3ff" strokeWidth="2"/>
              <line x1="35" y1="87" x2="78" y2="87" stroke="#dff3ff" strokeWidth="2"/>

              <rect x="43" y="69" width="6" height="18" fill="#ffffff"/>
              <rect x="53" y="59" width="6" height="28" fill="#ffffff"/>
              <rect x="63" y="48" width="6" height="39" fill="#ffffff"/>

              <polyline
                points="40,76 52,64 62,55 73,42"
                fill="none"
                stroke="#ffffff"
                strokeWidth="3"
              />
            </g>

            <g transform="translate(120 80)">
              <path d="M0,0 L0,-42 A42,42 0 0,1 40,-13 Z" fill="#02a6d7"/>
              <path d="M0,0 L40,-13 A42,42 0 0,1 27,32 Z" fill="#8343c5"/>
              <path d="M0,0 L27,32 A42,42 0 0,1 -20,35 Z" fill="#3cbd62"/>
              <path d="M0,0 L-20,35 A42,42 0 0,1 -40,-8 Z" fill="#f6a71d"/>
              <path d="M0,0 L-40,-8 A42,42 0 0,1 0,-42 Z" fill="#e94b40"/>

              <text x="15" y="-27" fill="#fff" fontSize="8" fontWeight="700">50%</text>
              <text x="27" y="15" fill="#fff" fontSize="8" fontWeight="700">30%</text>
              <text x="-3" y="31" fill="#fff" fontSize="8" fontWeight="700">45%</text>
              <text x="-35" y="15" fill="#fff" fontSize="8" fontWeight="700">25%</text>
            </g>

            <text x="100" y="158" textAnchor="middle" fontSize="18" fontWeight="700" fill="#fff">
              Analytics
            </text>

            <text x="100" y="180" textAnchor="middle" fontSize="7" fill="#fff">
              © shillongmorningteer.com
            </text>
          </svg>
        </button>


        {/* PREVIOUS RESULT */}
        <button
          onClick={() => onNavigate('/previous-results', true, 'Previous Result')}
          className={`${card} border-[#76d8d1] bg-[#2bb4aa]`}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <rect width="200" height="200" rx="18" fill="#2bb4aa"/>

            <circle cx="100" cy="76" r="46" fill="#ffffff"/>
            <circle cx="100" cy="76" r="34" fill="#199d94"/>
            <circle cx="100" cy="76" r="24" fill="#ffffff"/>
            <circle cx="100" cy="76" r="13" fill="#199d94"/>

            <path d="M100 62 L100 124" stroke="#ffffff" strokeWidth="6"/>
            <polygon points="100,57 89,73 111,73" fill="#ffffff"/>
            <polygon points="100,136 91,120 109,120" fill="#ffffff"/>

            <text x="100" y="158" textAnchor="middle" fontSize="16" fontWeight="700" fill="#fff">
              Previous Result
            </text>

            <text x="100" y="180" textAnchor="middle" fontSize="7" fill="#fff">
              © shillongmorningteer.com
            </text>
          </svg>
        </button>


        {/* PREDICT TARGET */}
        <button
          onClick={() => onNavigate('/predict-target', true, 'Predict Target')}
          className={`${card} border-[#6b5847] bg-[#4a3726]`}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <rect width="200" height="200" rx="18" fill="#4a3726"/>

            <polygon points="15,55 38,42 38,49 165,49 165,61 38,61 38,68" fill="#f2eee5"/>
            <circle cx="48" cy="55" r="7" fill="#374151"/>
            <text x="45" y="58" fill="#fff" fontSize="8" fontWeight="700">D</text>
            <text x="82" y="59" fill="#222" fontSize="10" fontWeight="700">Direct Number</text>

            <polygon points="15,84 38,71 38,78 165,78 165,90 38,90 38,97" fill="#f4ae20"/>
            <circle cx="48" cy="84" r="7" fill="#805500"/>
            <text x="45" y="87" fill="#fff" fontSize="8" fontWeight="700">H</text>
            <text x="88" y="88" fill="#402b00" fontSize="10" fontWeight="700">House</text>

            <polygon points="185,113 162,100 162,107 35,107 35,119 162,119 162,126" fill="#ef7c3c"/>
            <circle cx="151" cy="113" r="7" fill="#51200e"/>
            <text x="148" y="116" fill="#fff" fontSize="8" fontWeight="700">E</text>
            <text x="91" y="117" fill="#fff" fontSize="10" fontWeight="700">Ending</text>

            <text x="100" y="158" textAnchor="middle" fontSize="16" fontWeight="700" fill="#fff">
              Predict Target
            </text>

            <text x="100" y="180" textAnchor="middle" fontSize="7" fill="#eedb9f">
              © shillongmorningteer.com
            </text>
          </svg>
        </button>


        {/* DEAL */}
        <button
          onClick={() => onNavigate('/deal', true, 'Deal')}
          className={`${card} border-2 border-[#ef874d] bg-white`}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <rect width="200" height="200" fill="#ffffff"/>

            <line x1="48" y1="0" x2="48" y2="43" stroke="#9ca3af" strokeDasharray="2 2"/>
            <line x1="82" y1="0" x2="82" y2="31" stroke="#9ca3af" strokeDasharray="2 2"/>
            <line x1="118" y1="0" x2="118" y2="40" stroke="#9ca3af" strokeDasharray="2 2"/>
            <line x1="152" y1="0" x2="152" y2="30" stroke="#9ca3af" strokeDasharray="2 2"/>

            <path d="M35 50 L43 40 L53 40 L61 50 L61 126 L35 126 Z" fill="#35b85c"/>
            <path d="M70 38 L78 28 L88 28 L96 38 L96 117 L70 117 Z" fill="#3989e3"/>
            <path d="M105 48 L113 38 L123 38 L131 48 L131 125 L105 125 Z" fill="#df443d"/>
            <path d="M140 36 L148 26 L158 26 L166 36 L166 117 L140 117 Z" fill="#ef7d28"/>

            <text x="48" y="96" textAnchor="middle" fontSize="29" fontWeight="700" fill="#fff">D</text>
            <text x="83" y="86" textAnchor="middle" fontSize="29" fontWeight="700" fill="#fff">E</text>
            <text x="118" y="96" textAnchor="middle" fontSize="29" fontWeight="700" fill="#fff">A</text>
            <text x="153" y="86" textAnchor="middle" fontSize="29" fontWeight="700" fill="#fff">L</text>

            <text x="100" y="159" textAnchor="middle" fontSize="19" fontWeight="700" fill="#df681c">
              DEAL
            </text>

            <text x="100" y="180" textAnchor="middle" fontSize="7" fill="#8c98a8">
              © shillongmorningteer.com
            </text>
          </svg>
        </button>


        {/* DREAM NUMBER */}
        <button
          onClick={() => onNavigate('/dream-number', true, 'Dream Number')}
          className={`${card} border-[#8dc7f5] bg-[#4da6ef]`}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <rect width="200" height="200" rx="18" fill="#4da6ef"/>

            <rect x="73" y="43" width="53" height="68" fill="none" stroke="#ffffff" strokeWidth="5"/>

            <circle cx="94" cy="77" r="7" fill="#ffffff"/>
            <path
              d="M84 92 C84 81 104 81 108 92 L108 108 L99 108 L99 98 L92 98 L92 108 L84 108 Z"
              fill="#ffffff"
            />

            <circle cx="119" cy="42" r="3" fill="#ffffff"/>
            <circle cx="125" cy="34" r="5" fill="#ffffff"/>

            <path
              d="M122 24 C122 18 127 14 133 16 C137 11 146 11 151 16 C158 15 164 21 163 28 C168 31 166 39 159 41 C155 46 144 46 139 42 C132 45 124 39 125 32 C122 30 122 27 122 24 Z"
              fill="#ffffff"
            />

            <text x="100" y="158" textAnchor="middle" fontSize="16" fontWeight="700" fill="#fff">
              DREAM NUMBER
            </text>

            <text x="100" y="180" textAnchor="middle" fontSize="7" fill="#fff">
              © shillongmorningteer.com
            </text>
          </svg>
        </button>

      </div>
    </section>
  );
};


