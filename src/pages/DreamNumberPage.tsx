import React, { useState, useMemo, useEffect } from 'react';
import { DreamNumberEntry, SiteSettings } from '../types';
import { ArrowLeft, ChevronDown, ChevronUp, Search, Copy, Check } from 'lucide-react';
import { Footer } from '../components/Footer';
import { InfoModal } from '../components/InfoModal';

interface DreamNumberPageProps {
  entries?: DreamNumberEntry[];
  settings: SiteSettings;
  onBack: () => void;
  onNavigate?: (path: string) => void;
}


interface DailyDreamData {
  id: string;
  date: string;
  symbol: string;
  direct_numbers: string[];
  house_number: string;
  ending_number: string;
  source: 'auto' | 'admin';
  updated_at: string;
}

export interface DreamChartRow {
  slNo: number;
  dream: string;
  direct: string;
  house: string;
  ending: string;
}

// Complete 60 official dream interpretations matching the SHILLONG MORNING TEER Dream Chart
export const OFFICIAL_DREAM_CHART: DreamChartRow[] = [
  { slNo: 1, dream: 'Quarrel b/w husband & wife', direct: '03, 08, 13', house: '0', ending: '3' },
  { slNo: 2, dream: 'Erotic dream', direct: '17, 40, 53', house: '4', ending: '7' },
  { slNo: 3, dream: 'Bathing in the open', direct: '08, 18, 28', house: '1', ending: '8' },
  { slNo: 4, dream: 'Travelling', direct: '08, 14, 18', house: '1', ending: '8' },
  { slNo: 5, dream: 'Travelling in an aeroplane', direct: '23, 43, 53', house: '4', ending: '3' },
  { slNo: 6, dream: 'Taking a walk', direct: '01, 10, 11', house: '1', ending: '1' },
  { slNo: 7, dream: 'Studying', direct: '05, 15, 25', house: '1', ending: '5' },
  { slNo: 8, dream: 'Corpse', direct: '09, 19, 99', house: '9', ending: '9' },
  { slNo: 9, dream: 'Playing', direct: '00, 27, 40', house: '2', ending: '0' },
  { slNo: 10, dream: 'Talking over phone', direct: '94, 96, 98', house: '9', ending: '8' },
  { slNo: 11, dream: 'Eating', direct: '01, 02, 05', house: '0', ending: '5' },
  { slNo: 12, dream: 'Breast Feeding', direct: '02, 03, 05', house: '0', ending: '2' },
  { slNo: 13, dream: 'Male', direct: '06, 16, 26', house: '6', ending: '6' },
  { slNo: 14, dream: 'Female', direct: '05, 15, 25', house: '5', ending: '5' },
  { slNo: 15, dream: 'Child', direct: '02, 03, 12', house: '2', ending: '3' },
  { slNo: 16, dream: 'Police', direct: '07, 08, 87', house: '8', ending: '7' },
  { slNo: 17, dream: 'Wild Pig', direct: '04, 06, 46', house: '4', ending: '6' },
  { slNo: 18, dream: 'Snake or ilea fish', direct: '09, 17, 37', house: '3', ending: '7' },
  { slNo: 19, dream: 'Cow, goat or buffalo', direct: '12, 18, 19', house: '1', ending: '2' },
  { slNo: 20, dream: 'Cow', direct: '04, 14, 24', house: '4', ending: '4' },
  { slNo: 21, dream: 'Tiger', direct: '09, 19, 29', house: '9', ending: '9' },
  { slNo: 22, dream: 'Dog', direct: '04, 05, 06', house: '4', ending: '5' },
  { slNo: 23, dream: 'Horse', direct: '08, 18, 28', house: '8', ending: '8' },
  { slNo: 24, dream: 'Bird', direct: '02, 12, 22', house: '2', ending: '2' },
  { slNo: 25, dream: 'Elephant', direct: '09, 19, 29', house: '9', ending: '9' },
  { slNo: 26, dream: 'Snail', direct: '00, 10, 20', house: '0', ending: '0' },
  { slNo: 27, dream: 'Turtle', direct: '09, 19, 29', house: '9', ending: '9' },
  { slNo: 28, dream: 'Crab', direct: '02, 06, 62', house: '6', ending: '2' },
  { slNo: 29, dream: 'Spider', direct: '06, 12, 62', house: '1', ending: '2' },
  { slNo: 30, dream: 'Honey bee', direct: '14, 24, 74', house: '7', ending: '4' },
  { slNo: 31, dream: 'Insect', direct: '13, 21, 37', house: '3', ending: '7' },
  { slNo: 32, dream: 'Sour fruits', direct: '00, 03, 11', house: '1', ending: '1' },
  { slNo: 33, dream: 'Paddy field', direct: '24, 38, 52', house: '3', ending: '4' },
  { slNo: 34, dream: 'Pumpkin', direct: '28, 35, 48', house: '3', ending: '8' },
  { slNo: 35, dream: 'Bamboo', direct: '00, 01, 10', house: '0', ending: '1' },
  { slNo: 36, dream: 'Big Tree', direct: '08, 09, 89', house: '8', ending: '9' },
  { slNo: 37, dream: 'Small tree', direct: '02, 03, 08', house: '0', ending: '2' },
  { slNo: 38, dream: 'Banana', direct: '03, 11, 31', house: '1', ending: '3' },
  { slNo: 39, dream: 'Jackfruit', direct: '04, 14, 44', house: '4', ending: '4' },
  { slNo: 40, dream: 'Papaya', direct: '01, 12, 21', house: '1', ending: '2' },
  { slNo: 41, dream: 'Orange', direct: '08, 09, 89', house: '8', ending: '9' },
  { slNo: 42, dream: 'Chilli', direct: '01, 02, 12', house: '1', ending: '2' },
  { slNo: 43, dream: 'Bamboo Shoot', direct: '01, 11, 21', house: '1', ending: '1' },
  { slNo: 44, dream: 'Tool used to cut wood', direct: '01, 57, 61', house: '5', ending: '6' },
  { slNo: 45, dream: 'Tools : cutter', direct: '07, 17, 27', house: '1', ending: '7' },
  { slNo: 46, dream: 'Tools : Fire or weapon', direct: '00, 10, 20', house: '0', ending: '0' },
  { slNo: 47, dream: 'Fire / Flame', direct: '05, 50, 55', house: '0', ending: '5' },
  { slNo: 48, dream: 'Water / River / Lake', direct: '01, 19, 91', house: '1', ending: '9' },
  { slNo: 49, dream: 'Temple / Church', direct: '02, 29, 92', house: '2', ending: '9' },
  { slNo: 50, dream: 'Money / Currency', direct: '00, 14, 40', house: '1', ending: '4' },
  { slNo: 51, dream: 'Ghost / Spirit', direct: '52, 54, 64', house: '5', ending: '4' },
  { slNo: 52, dream: 'Fishing Net', direct: '03, 30, 80', house: '3', ending: '0' },
  { slNo: 53, dream: 'Gold / Silver Jewellery', direct: '08, 18, 28', house: '8', ending: '8' },
  { slNo: 54, dream: 'Shoes / Slippers', direct: '02, 22, 42', house: '2', ending: '2' },
  { slNo: 55, dream: 'Umbrella', direct: '01, 10, 11', house: '1', ending: '1' },
  { slNo: 56, dream: 'Car / Automobile', direct: '21, 24, 42', house: '2', ending: '4' },
  { slNo: 57, dream: 'Aeroplane flying', direct: '23, 43, 53', house: '4', ending: '3' },
  { slNo: 58, dream: 'Earthquake', direct: '00, 08, 80', house: '0', ending: '8' },
  { slNo: 59, dream: 'Blood / Bleeding', direct: '05, 55, 65', house: '5', ending: '5' },
  { slNo: 60, dream: 'Marriage / Wedding', direct: '16, 61, 88', house: '1', ending: '8' },
];

export const DreamNumberPage: React.FC<DreamNumberPageProps> = ({
  settings,
  onBack,
  onNavigate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [activeModal, setActiveModal] = useState<'about' | 'terms' | 'privacy' | 'contact' | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [dailyDream, setDailyDream] = useState<DailyDreamData | null>(null);

  useEffect(() => {
    let mounted = true;
    const loadDailyDream = async () => {
      try {
        const res = await fetch('/api/dream-numbers/daily');
        if (!res.ok) return;
        const data = await res.json();
        if (mounted) setDailyDream(data);
      } catch {
        // Keep the static dream chart available if the API is temporarily unavailable.
      }
    };
    loadDailyDream();
    const timer = window.setInterval(loadDailyDream, 5 * 60 * 1000);
    const onStorage = (event: StorageEvent) => {
      if (event.key === 'teer-data-updated') loadDailyDream();
    };
    window.addEventListener('storage', onStorage);
    return () => {
      mounted = false;
      window.clearInterval(timer);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  // Filter dream chart entries based on search input
  const filteredRows = useMemo(() => {
    if (!searchTerm.trim()) return OFFICIAL_DREAM_CHART;
    const q = searchTerm.toLowerCase().trim();
    return OFFICIAL_DREAM_CHART.filter(
      (r) =>
        r.dream.toLowerCase().includes(q) ||
        r.direct.includes(q) ||
        r.house.includes(q) ||
        r.ending.includes(q)
    );
  }, [searchTerm]);

  const handleCopy = (slNo: number, direct: string) => {
    navigator.clipboard?.writeText(direct);
    setCopiedId(slNo);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const toggleFaq = (index: number) => {
    setOpenFaq((prev) => (prev === index ? null : index));
  };

  return (
    <div className="w-full min-h-screen bg-white text-gray-800">
      {/* Top Bar with Home Back Button */}
      <div
        className="sticky top-0 z-30 px-4 py-3 border-b border-indigo-950/10 shadow-xs flex items-center justify-between"
        style={{ backgroundColor: settings.top_bar_bg_color || '#3b82f6' }}
      >
        <button
          onClick={onBack}
          id="btn-back-home"
          className="flex items-center gap-1.5 text-indigo-950 font-bold text-sm hover:opacity-80 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Home</span>
        </button>

        <h1 className="text-base sm:text-lg font-bold text-indigo-950 tracking-tight">
          SHILLONG MORNING TEER
        </h1>

        <div className="w-12"></div>
      </div>

      {/* Main Content Container matching the website screenshot */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Main Heading */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          Shillong Morning Teer Dream Numbers
        </h1>

        {dailyDream && (
          <section className="rounded-2xl border border-indigo-200 bg-indigo-50/70 p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">Daily Dream Pick</p>
                <h2 className="text-lg font-semibold text-gray-900">{dailyDream.symbol}</h2>
              </div>
              <span className="text-xs text-gray-500">{dailyDream.date}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-white border border-indigo-100 p-3">
                <div className="text-[11px] uppercase text-gray-500 mb-1">Direct</div>
                <div className="font-semibold text-indigo-950">{dailyDream.direct_numbers.join(', ')}</div>
              </div>
              <div className="rounded-xl bg-white border border-indigo-100 p-3">
                <div className="text-[11px] uppercase text-gray-500 mb-1">House</div>
                <div className="font-semibold text-indigo-950">{dailyDream.house_number}</div>
              </div>
              <div className="rounded-xl bg-white border border-indigo-100 p-3">
                <div className="text-[11px] uppercase text-gray-500 mb-1">Ending</div>
                <div className="font-semibold text-indigo-950">{dailyDream.ending_number}</div>
              </div>
            </div>
            <p className="mt-3 text-[11px] text-gray-500">Generated once per day at 12:00 AM IST and stored for the full day.</p>
          </section>
        )}

        {/* Introductory Paragraph with clean normal font weight */}
        <p className="text-sm sm:text-base text-gray-700 font-normal leading-relaxed">
          Many people enjoy talking about{' '}
          <button
            onClick={() => window.scrollTo({ top: 400, behavior: 'smooth' })}
            className="text-blue-700 hover:underline font-semibold cursor-pointer"
          >
            Shillong Morning Teer Dream Numbers
          </button>
          . Some believe that dreams can inspire lucky number ideas. Others simply enjoy the
          tradition because it has been shared by families and friends for many years. No one
          can say that a dream will predict a number with certainty. Still, the stories and
          beliefs around dreams remain a popular part of the{' '}
          <button
            onClick={onBack}
            className="text-blue-700 hover:underline font-semibold cursor-pointer"
          >
            SHILLONG MORNING TEER
          </button>{' '}
          culture.
        </p>

        {/* Realistic Premium Graphic Banner matching the screenshot */}
        <div className="w-full rounded-2xl overflow-hidden shadow-lg border border-slate-700 relative bg-linear-to-r from-[#0d1f1c] via-[#102b23] to-[#0b1715] text-white">
          <svg
            className="w-full h-auto min-h-[220px] max-h-[360px]"
            viewBox="0 0 900 380"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <linearGradient id="bgForest" x1="0" y1="0" x2="900" y2="380" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#081814" />
                <stop offset="50%" stopColor="#122a22" />
                <stop offset="100%" stopColor="#071410" />
              </linearGradient>
              <radialGradient id="targetGlow" cx="170" cy="190" r="160" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#eab308" stopOpacity="0.35" />
                <stop offset="60%" stopColor="#059669" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#081814" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="goldText" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="40%" stopColor="#facc15" />
                <stop offset="100%" stopColor="#ca8a04" />
              </linearGradient>
              <linearGradient id="goldRibbon" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#b45309" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>
              <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Background Texture */}
            <rect width="900" height="380" fill="url(#bgForest)" />
            <circle cx="170" cy="190" r="160" fill="url(#targetGlow)" />

            {/* Subtle Pine Trees in Background */}
            <g opacity="0.18" fill="#10b981">
              <polygon points="50,280 80,180 110,280" />
              <polygon points="120,290 150,190 180,290" />
              <polygon points="760,290 800,170 840,290" />
              <polygon points="820,290 850,200 880,290" />
            </g>

            {/* Traditional Archery Target on Left */}
            <g transform="translate(160, 190)">
              {/* Outer Golden Stand Rings */}
              <circle cx="0" cy="0" r="115" fill="#1e293b" stroke="#facc15" strokeWidth="4" />
              <circle cx="0" cy="0" r="95" fill="#0f172a" stroke="#ffffff" strokeWidth="2.5" />
              <circle cx="0" cy="0" r="75" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
              <circle cx="0" cy="0" r="50" fill="#dc2626" stroke="#ffffff" strokeWidth="2" />
              <circle cx="0" cy="0" r="26" fill="#facc15" stroke="#ffffff" strokeWidth="2" />
              <circle cx="0" cy="0" r="8" fill="#ca8a04" />

              {/* Arrows in Target */}
              <line x1="-80" y1="-80" x2="-10" y2="-10" stroke="#f1f5f9" strokeWidth="3" />
              <polygon points="-12,-8 -6,-14 -16,-16" fill="#f8fafc" />
              <line x1="75" y1="-60" x2="15" y2="-8" stroke="#f1f5f9" strokeWidth="3" />
              <polygon points="17,-6 10,-12 22,-14" fill="#f8fafc" />
            </g>

            {/* Traditional Archer on Right */}
            <g transform="translate(730, 205)" opacity="0.95">
              {/* Archer Body Silhouette */}
              <circle cx="0" cy="-60" r="18" fill="#fbbf24" opacity="0.9" />
              <path d="M-15,-40 C-10,-48 10,-48 15,-40 L22,25 C10,35 -10,35 -22,25 Z" fill="#e2e8f0" opacity="0.75" />
              {/* Arm and Bow */}
              <path d="M10,-35 L45,-30 L-25,-15" stroke="#fef08a" strokeWidth="4" strokeLinecap="round" />
              {/* Bow arc */}
              <path d="M-40,-85 C-20,-30 -20,25 -40,80" stroke="#ca8a04" strokeWidth="5" fill="none" strokeLinecap="round" />
              <line x1="-40" y1="-85" x2="-40" y2="80" stroke="#f8fafc" strokeWidth="1.5" strokeDasharray="3 2" />
              {/* Arrow */}
              <line x1="45" y1="-30" x2="-70" y2="-30" stroke="#38bdf8" strokeWidth="3" />
              <polygon points="-70,-30 -60,-35 -60,-25" fill="#38bdf8" />
            </g>

            {/* Floating Lucky Number Bubbles matching screenshot */}
            {/* Bubble 27 */}
            <g transform="translate(320, 80)">
              <circle cx="0" cy="0" r="26" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" filter="url(#softGlow)" />
              <text x="0" y="8" fill="#ffffff" fontSize="22" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">27</text>
            </g>
            {/* Bubble 45 */}
            <g transform="translate(620, 75)">
              <circle cx="0" cy="0" r="26" fill="#0f172a" stroke="#fbbf24" strokeWidth="2.5" filter="url(#softGlow)" />
              <text x="0" y="8" fill="#ffffff" fontSize="22" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">45</text>
            </g>
            {/* Bubble 68 */}
            <g transform="translate(290, 290)">
              <circle cx="0" cy="0" r="26" fill="#0f172a" stroke="#34d399" strokeWidth="2.5" filter="url(#softGlow)" />
              <text x="0" y="8" fill="#ffffff" fontSize="22" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">68</text>
            </g>
            {/* Bubble 97 */}
            <g transform="translate(630, 295)">
              <circle cx="0" cy="0" r="26" fill="#0f172a" stroke="#f472b6" strokeWidth="2.5" filter="url(#softGlow)" />
              <text x="0" y="8" fill="#ffffff" fontSize="22" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">97</text>
            </g>

            {/* Laurel Leaves around Center */}
            <g opacity="0.6" stroke="#fbbf24" strokeWidth="2" fill="none">
              <path d="M330,170 C320,150 320,120 345,100" />
              <circle cx="340" cy="108" r="3" fill="#fbbf24" />
              <circle cx="327" cy="132" r="3" fill="#fbbf24" />
              <circle cx="325" cy="155" r="3" fill="#fbbf24" />

              <path d="M570,170 C580,150 580,120 555,100" />
              <circle cx="560" cy="108" r="3" fill="#fbbf24" />
              <circle cx="573" cy="132" r="3" fill="#fbbf24" />
              <circle cx="575" cy="155" r="3" fill="#fbbf24" />
            </g>

            {/* Center Typography matching screenshot */}
            <text
              x="450"
              y="125"
              fill="url(#goldText)"
              fontSize="34"
              fontWeight="900"
              letterSpacing="2"
              textAnchor="middle"
              fontFamily="ui-serif, Georgia, serif"
              filter="url(#softGlow)"
            >
              SHILLONG MORNING TEER
            </text>

            {/* Star Dream Number Ribbon */}
            <g transform="translate(325, 145)">
              <rect x="0" y="0" width="250" height="42" rx="21" fill="url(#goldRibbon)" stroke="#fef08a" strokeWidth="1.5" />
              <text
                x="125"
                y="27"
                fill="#ffffff"
                fontSize="16"
                fontWeight="800"
                letterSpacing="3"
                textAnchor="middle"
                fontFamily="sans-serif"
              >
                â˜… DREAM NUMBER â˜…
              </text>
            </g>

            {/* Badges Row */}
            <g transform="translate(230, 206)">
              {/* Badge 1: ACCURATE PREDICTION */}
              <rect x="0" y="0" width="135" height="24" rx="12" fill="#047857" opacity="0.9" />
              <text x="67" y="16" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                ACCURATE PREDICTION
              </text>

              {/* Badge 2: EVERY SUNDAY */}
              <rect x="150" y="0" width="130" height="24" rx="12" fill="#b45309" opacity="0.9" />
              <text x="215" y="16" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                EVERY SUNDAY
              </text>

              {/* Badge 3: LIVE RESULT 11:30 AM */}
              <rect x="295" y="0" width="145" height="24" rx="12" fill="#1d4ed8" opacity="0.9" />
              <text x="367" y="16" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                LIVE RESULT 11:30 AM
              </text>
            </g>

            {/* Small Footer Copyright inside banner */}
            <text
              x="450"
              y="350"
              fill="#94a3b8"
              fontSize="11"
              letterSpacing="1"
              textAnchor="middle"
              fontFamily="sans-serif"
            >
              &copy; morningsundeyteer.com
            </text>
          </svg>
        </div>

        {/* Dream Chart Table Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Shillong Morning Teer Dream Chart
          </h2>

          {/* Quick Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search dream or number..."
              className="w-full pl-9 pr-7 py-1.5 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-700"
              >
                &times;
              </button>
            )}
          </div>
        </div>

        {/* Results Counter if filtered */}
        {searchTerm && (
          <p className="text-xs text-gray-500 font-normal">
            Showing {filteredRows.length} matches for &ldquo;{searchTerm}&rdquo;
          </p>
        )}

        {/* Dream Chart Table matching the exact screenshot */}
        <div className="overflow-x-auto border border-gray-300 rounded-sm">
          <table className="w-full border-collapse text-left text-xs sm:text-sm font-normal">
            <thead>
              <tr className="bg-white border-b-2 border-gray-400 text-gray-900">
                <th className="border border-gray-300 py-2 px-2 sm:px-3 text-center font-bold w-12 sm:w-16">
                  Sl.No
                </th>
                <th className="border border-gray-300 py-2 px-3 text-left font-bold min-w-[180px]">
                  Dream
                </th>
                <th className="border border-gray-300 py-2 px-2 sm:px-3 text-center font-bold min-w-[100px]">
                  Direct
                </th>
                <th className="border border-gray-300 py-2 px-2 sm:px-3 text-center font-bold w-14 sm:w-20">
                  House
                </th>
                <th className="border border-gray-300 py-2 px-2 sm:px-3 text-center font-bold w-14 sm:w-20">
                  Ending
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr
                  key={row.slNo}
                  className="bg-white hover:bg-gray-50/70 transition-colors border-b border-gray-300"
                >
                  <td className="border border-gray-300 py-2 px-2 sm:px-3 text-center font-normal text-gray-700">
                    {row.slNo}
                  </td>
                  <td className="border border-gray-300 py-2 px-3 text-left font-normal text-gray-800">
                    {row.dream}
                  </td>
                  <td className="border border-gray-300 py-2 px-2 sm:px-3 text-center font-normal text-gray-800 group relative">
                    <span className="inline-block mr-1">{row.direct}</span>
                    <button
                      onClick={() => handleCopy(row.slNo, row.direct)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 text-gray-400 hover:text-blue-600 inline-block align-middle cursor-pointer"
                      title="Copy number"
                    >
                      {copiedId === row.slNo ? (
                        <Check className="w-3.5 h-3.5 text-green-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </td>
                  <td className="border border-gray-300 py-2 px-2 sm:px-3 text-center font-normal text-gray-700">
                    {row.house}
                  </td>
                  <td className="border border-gray-300 py-2 px-2 sm:px-3 text-center font-normal text-gray-700">
                    {row.ending}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Editorial Content Below Table exactly matching screenshot */}
        <div className="space-y-6 pt-4 text-gray-700 text-xs sm:text-sm font-normal leading-relaxed">
          {/* Section 1 */}
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 border-b border-orange-200/90 pb-1 mb-3">
              What Are Shillong Morning Teer Dream Numbers?
            </h2>
            <p className="mb-3">
              <span className="font-semibold text-gray-800">Shillong Morning Teer Dream Numbers</span> are number ideas that some people connect with dreams seen before Sunday morning. According to local traditions, different dreams may represent different number combinations. Many players enjoy checking these dream-based numbers before choosing their guesses.
            </p>
            <p>
              These numbers do not come from science. They come from stories, customs, and personal belief. Every family or community may even have different ways to explain the same dream. That variety is one reason why this tradition continues to stay interesting.
            </p>
          </div>

          {/* Section 2 */}
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 border-b border-orange-200/90 pb-1 mb-3">
              How People Use Shillong Morning Teer Dream Numbers
            </h2>
            <p className="mb-3">
              Everyone has a different approach. Some players only use dream numbers after a memorable dream. Others check{' '}
              <button
                onClick={() => window.scrollTo({ top: 400, behavior: 'smooth' })}
                className="text-blue-700 hover:underline font-semibold cursor-pointer"
              >
                dream charts
              </button>{' '}
              every Sunday regardless of whether they dreamed anything.
            </p>
            <p className="mb-3">
              Many people combine dream ideas with{' '}
              <button
                onClick={() => onNavigate?.('previous-results')}
                className="text-blue-700 hover:underline font-semibold cursor-pointer"
              >
                previous results
              </button>
              , personal feelings, or favorite numbers. Some simply enjoy comparing different interpretations before making a choice.
            </p>
            <p>
              It is important to remember that dream numbers are only traditional references. They should never be viewed as guaranteed{' '}
              <span className="font-semibold text-gray-800">winning numbers</span>.
            </p>
          </div>

          {/* Section 3 */}
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 border-b border-orange-200/90 pb-1 mb-3">
              Common Reasons People Follow Dream Numbers
            </h2>
            <p className="mb-2">Many players enjoy dream numbers for different reasons.</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>They enjoy old traditions.</li>
              <li>They like discussing dreams with family.</li>
              <li>Dreams make number selection more personal.</li>
              <li>Dream stories create excitement before the game.</li>
              <li>They enjoy comparing different interpretations.</li>
              <li>The tradition connects generations.</li>
            </ul>
            <p className="mt-3">
              These reasons explain why{' '}
              <button
                onClick={() => onNavigate?.('common-number')}
                className="text-blue-700 hover:underline font-semibold cursor-pointer"
              >
                Shillong Morning Teer Common Numbers
              </button>{' '}
              and dream interpretations continue to attract attention every week.
            </p>
          </div>

          {/* Section 4 */}
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 border-b border-orange-200/90 pb-1 mb-3">
              Popular Types of Dreams People Often Discuss
            </h2>
            <p className="mb-2">
              Many dreams appear again and again in conversations about Shillong Morning Teer Dream Numbers.
            </p>
            <p className="mb-2">People often talk about:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Animals</li>
              <li>Water</li>
              <li>Fire</li>
              <li>Trees</li>
              <li>Flying</li>
              <li>Rain</li>
              <li>Fish</li>
              <li>Birds</li>
              <li>Babies</li>
              <li>Weddings</li>
              <li>Snakes</li>
              <li>Money</li>
              <li>Temples</li>
              <li>Mountains</li>
              <li>Rivers</li>
            </ul>
            <p className="mt-3">
              These dreams are popular because they are common in everyday life. Each dream may carry several traditional meanings depending on local beliefs.
            </p>
          </div>

          {/* Section 5 */}
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 border-b border-orange-200/90 pb-1 mb-3">
              Why People Remember Sunday Morning Dreams
            </h2>
            <p className="mb-3">
              Many people believe they remember dreams better after a full night&apos;s sleep. On Sunday mornings, people often wake up without rushing to work or school. That relaxed feeling makes dream details easier to recall.
            </p>
            <p>
              This habit has naturally connected Sunday mornings with{' '}
              <span className="font-semibold text-gray-800">Shillong Morning Teer Dream Numbers</span>. Whether the dream has any deeper meaning or not, people enjoy discussing it before starting the day.
            </p>
          </div>

          {/* Section 6 */}
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 border-b border-orange-200/90 pb-1 mb-3">
              Common Myths About Shillong Morning Teer Dream Numbers
            </h2>
            <p className="mb-3">
              Many myths continue to circulate. Understanding them helps separate tradition from reality.
            </p>
            <div className="space-y-3 pl-1">
              <div>
                <p>
                  <strong className="font-bold text-gray-900">Myth:</strong> Every dream has one correct number.
                </p>
                <p>
                  <strong className="font-bold text-gray-900">Reality:</strong> Different dream charts often suggest different numbers.
                </p>
              </div>

              <div>
                <p>
                  <strong className="font-bold text-gray-900">Myth:</strong> Dream numbers guarantee success.
                </p>
                <p>
                  <strong className="font-bold text-gray-900">Reality:</strong> There is no guarantee.
                </p>
              </div>

              <div>
                <p>
                  <strong className="font-bold text-gray-900">Myth:</strong> Missing one dream means missing good luck.
                </p>
                <p>
                  <strong className="font-bold text-gray-900">Reality:</strong> Dreams are personal experiences and should not create pressure.
                </p>
              </div>
            </div>
            <p className="mt-3">
              Knowing these facts encourages a more balanced view of Shillong Morning Teer Dream Numbers.
            </p>
          </div>

          {/* Section 7 */}
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 border-b border-orange-200/90 pb-1 mb-3">
              Final Thoughts
            </h2>
            <p className="mb-3">
              <span className="font-semibold text-gray-800">Shillong Morning Teer Dream Numbers</span> remain a fascinating part of traditional dream culture. They combine storytelling, personal memories, local customs, and shared conversations into a tradition that many people continue to enjoy.
            </p>
            <p className="mb-3">
              Dreams can inspire ideas, spark discussions, and strengthen community bonds. At the same time, they should be viewed as personal interpretations rather than reliable predictions. When approached responsibly, learning about dream meanings can be both entertaining and meaningful.
            </p>
            <p>
              Whether you are new to the tradition or have followed it for years, the most valuable part is often the stories people share. Those conversations keep the tradition alive and remind us that dreams are one of the most personal and imaginative parts of human life.
            </p>
          </div>

          {/* Section 8: FAQs Accordion matching the screenshot */}
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 border-b border-orange-200/90 pb-1 mb-3">
              FAQs About Shillong Morning Teer Dream Numbers
            </h2>

            <div className="space-y-2">
              {[
                {
                  q: '1. What are Shillong Morning Teer Dream Numbers?',
                  a: 'Shillong Morning Teer Dream Numbers are traditional number interpretations associated with specific dreams and symbols shared among players before the Sunday archery round.',
                },
                {
                  q: '2. Are Shillong Morning Teer Dream Numbers scientifically proven?',
                  a: 'No, dream numbers are based purely on cultural lore, historical customs, and personal traditions, without any scientific or empirical basis.',
                },
                {
                  q: '3. Can the same dream have different meanings?',
                  a: 'Yes, dream charts and regional traditions vary. For instance, dreaming of water or birds can suggest different house or direct numbers depending on the regional interpretation.',
                },
                {
                  q: '4. Why do people keep a dream journal?',
                  a: 'Keeping a dream journal helps individuals recall intricate dream details, patterns, and emotions right after waking up on Sunday mornings.',
                },
                {
                  q: '5. Should I depend only on dream numbers?',
                  a: 'No. Dream numbers should only be enjoyed as cultural folklore and friendly conversation, never as guaranteed predictions or financial dependencies.',
                },
                {
                  q: '6. Why are Sunday morning dreams considered special?',
                  a: 'Because Sunday mornings allow for more leisurely, restful sleep without alarms, enabling clearer dream recall and shared family morning discussions.',
                },
                {
                  q: '7. Why are dream number charts different?',
                  a: 'Different clubs, elders, and communities in Meghalaya have passed down their own dream books and folklore, resulting in minor differences between charts.',
                },
              ].map((faq, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-lg overflow-hidden bg-white"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full px-4 py-3 text-left font-semibold text-xs sm:text-sm text-gray-900 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {openFaq === idx ? (
                      <ChevronUp className="w-4 h-4 text-gray-500 shrink-0 ml-2" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-500 shrink-0 ml-2" />
                    )}
                  </button>
                  {openFaq === idx && (
                    <div className="px-4 pb-3 pt-1 text-xs sm:text-sm text-gray-600 font-normal border-t border-gray-100 bg-gray-50/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 6 Category Link Banners strip before footer */}
        <div className="pt-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {[
              {
                title: 'TEER RESULT',
                color: 'from-amber-600 to-amber-800',
                action: () => onBack(),
              },
              {
                title: 'SHILLONG MORNING TEER',
                color: 'from-emerald-700 to-emerald-900',
                action: () => onBack(),
              },
              {
                title: 'DREAM NUMBER',
                color: 'from-rose-600 to-rose-800',
                action: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
              },
              {
                title: 'WIN PRIZES / DEAL',
                color: 'from-purple-700 to-indigo-900',
                action: () => onNavigate?.('deal'),
              },
              {
                title: 'COMMON NUMBER',
                color: 'from-blue-600 to-blue-800',
                action: () => onNavigate?.('common-number'),
              },
              {
                title: 'PREVIOUS RESULT',
                color: 'from-teal-600 to-teal-800',
                action: () => onNavigate?.('previous-results'),
              },
            ].map((btn, i) => (
              <button
                key={i}
                onClick={btn.action}
                className={`py-3 px-2 rounded-lg bg-linear-to-b ${btn.color} text-white font-bold text-[11px] sm:text-xs text-center shadow-xs hover:opacity-95 transition-opacity cursor-pointer flex items-center justify-center`}
              >
                {btn.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Pastel Blue Footer matching screenshot */}
      <Footer
        onNavigateHome={onBack}
        onOpenModal={(type) => setActiveModal(type)}
      />

      {/* Info Modals */}
      <InfoModal type={activeModal} onClose={() => setActiveModal(null)} />
    </div>
  );
};

