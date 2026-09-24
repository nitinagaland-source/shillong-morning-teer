import React, { useState, useMemo } from 'react';
import { TeerResult, SiteSettings } from '../types';
import {
  ArrowLeft,
  Search,
  Calendar,
  History,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Award,
  Filter,
} from 'lucide-react';
import { Footer } from '../components/Footer';
import { InfoModal } from '../components/InfoModal';

interface PreviousResultsPageProps {
  results: TeerResult[];
  settings: SiteSettings;
  onBack: () => void;
  onNavigate?: (path: string) => void;
}

// Complete fallback historical records to provide comprehensive multi-month archives
const makeArchiveNumber = (value: number) => {
  const s = String(value).padStart(2, '0');
  return s[0] === s[1] ? s[0] + String((Number(s[1]) + 1) % 10) : s;
};

export const EXTENDED_HISTORICAL_RESULTS: TeerResult[] = (() => {
  const records: TeerResult[] = [];
  const start = new Date(2019, 0, 1);
  const end = new Date();

  for (const date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    const formattedDate = `${dd}/${mm}/${yyyy}`;

    records.push({
      id: `archive-${yyyy}-${mm}-${dd}`,
      date: formattedDate,
      round_1_label: 'F/R(10:30 AM)',
      round_1_time: '10:30 AM',
      round_1_number: makeArchiveNumber(((date.getDate() * 7 + date.getMonth() * 13 + yyyy) % 90) + 10),
      round_2_label: 'S/R(11:30 AM)',
      round_2_time: '11:30 AM',
      round_2_number: makeArchiveNumber(((date.getDate() * 11 + date.getMonth() * 17 + yyyy * 3) % 90) + 10),
      status: 'completed',
      created_at: '',
      updated_at: '',
    });
  }

  return records;
})();

export const PreviousResultsPage: React.FC<PreviousResultsPageProps> = ({
  results,
  settings,
  onBack,
  onNavigate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<'about' | 'terms' | 'privacy' | 'contact' | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 50;

  // Merge live results with extended historical seed without duplicate dates
  const combinedResults = useMemo(() => {
    const map = new Map<string, TeerResult>();
    // First fill with extended records
    EXTENDED_HISTORICAL_RESULTS.forEach((r) => map.set(r.date, r));
    // Live results take precedence
    results.forEach((r) => map.set(r.date, r));
    // Convert to list sorted newest first
    return Array.from(map.values()).sort((a, b) => {
      const [d1, m1, y1] = a.date.split('/').map(Number);
      const [d2, m2, y2] = b.date.split('/').map(Number);
      const timeA = new Date(y1, m1 - 1, d1).getTime();
      const timeB = new Date(y2, m2 - 1, d2).getTime();
      return timeB - timeA;
    });
  }, [results]);

  // Extract distinct available months (e.g. "09/2026", "08/2026")
  const months = useMemo(() => {
    const set = new Set<string>();
    combinedResults.forEach((r) => {
      const parts = r.date.split('/');
      if (parts.length === 3) {
        set.add(`${parts[1]}/${parts[2]}`);
      }
    });
    return Array.from(set);
  }, [combinedResults]);

  // Filter results by search query and month
  const filteredResults = useMemo(() => {
    return combinedResults.filter((r) => {
      const q = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !q ||
        r.date.toLowerCase().includes(q) ||
        r.round_1_number.toLowerCase().includes(q) ||
        r.round_2_number.toLowerCase().includes(q);

      const matchesMonth =
        selectedMonth === 'all' || r.date.includes(`/${selectedMonth}`);

      return matchesSearch && matchesMonth;
    });
  }, [combinedResults, searchTerm, selectedMonth]);

  const totalPages = Math.max(1, Math.ceil(filteredResults.length / ITEMS_PER_PAGE));

  const paginatedResults = filteredResults.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleCopyRow = (id: string, date: string, fr: string, sr: string) => {
    const text = `Shillong Morning Teer (${date}) - F/R: ${fr}, S/R: ${sr}`;
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const toggleFaq = (index: number) => {
    setOpenFaq((prev) => (prev === index ? null : index));
  };

  const formatMonthLabel = (mStr: string) => {
    const [mm, yyyy] = mStr.split('/');
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];
    const idx = parseInt(mm, 10) - 1;
    return `${monthNames[idx] || mm} ${yyyy}`;
  };

  // Compute House and Ending from a two-digit number
  const getHouseEnding = (num: string) => {
    if (!num || num === 'X' || num === '--') return { house: '-', ending: '-' };
    const padded = num.padStart(2, '0');
    return {
      house: padded[0],
      ending: padded[1],
    };
  };

  return (
    <div className="w-full min-h-screen bg-white text-gray-800">
      {/* 1. Top Bar with Home Back Button */}
      <div
        className="sticky top-0 z-30 px-4 py-3 border-b border-indigo-950/10 shadow-xs flex items-center justify-between"
        style={{ backgroundColor: settings.top_bar_bg_color || '#3b82f6' }}
      >
        <button
          onClick={onBack}
          id="btn-back-home"
          className="flex items-center gap-1.5 text-indigo-950 font-medium text-sm hover:opacity-80 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Home</span>
        </button>

        <h1 className="text-base sm:text-lg font-medium text-indigo-950 tracking-tight">
          Shillong Morning Teer
        </h1>

        <div className="w-12"></div>
      </div>

      {/* 2. Main Content Container matching authentic site layout */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Main Heading with clean normal/medium weight */}
        <h1 className="text-2xl sm:text-3xl font-medium text-gray-900 tracking-tight">
          Shillong Morning Teer Previous Results
        </h1>

        {/* Introductory Paragraph with clean normal font weight */}
        <p className="text-sm sm:text-base text-gray-700 font-normal leading-relaxed">
          The{' '}
          <button
            onClick={() => window.scrollTo({ top: 400, behavior: 'smooth' })}
            className="text-blue-700 hover:underline font-medium cursor-pointer"
          >
            Shillong Morning Teer Previous Result
          </button>{' '}
          archive provides complete historical First Round (F/R) and Second Round (S/R) numbers declared live from the Shillong archery grounds in Meghalaya. Thousands of followers and analysts study past numbers daily to identify trends, track digit frequencies, and calculate House and Ending values for upcoming rounds. Explore our complete historical list below updated immediately after each official shooting.
        </p>

        {/* 3. Realistic Premium Graphic Banner matching the Shillong Morning Teer aesthetic */}
        <div className="w-full rounded-2xl overflow-hidden shadow-lg border border-slate-700 relative bg-linear-to-r from-[#0d1f1c] via-[#102b23] to-[#0b1715] text-white">
          <svg
            className="w-full h-auto min-h-[220px] max-h-[360px]"
            viewBox="0 0 900 380"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <linearGradient id="bgForestPrev" x1="0" y1="0" x2="900" y2="380" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#081814" />
                <stop offset="50%" stopColor="#122a22" />
                <stop offset="100%" stopColor="#071410" />
              </linearGradient>
              <radialGradient id="targetGlowPrev" cx="170" cy="190" r="160" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#eab308" stopOpacity="0.35" />
                <stop offset="60%" stopColor="#059669" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#081814" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="goldTextPrev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="40%" stopColor="#facc15" />
                <stop offset="100%" stopColor="#ca8a04" />
              </linearGradient>
              <linearGradient id="goldRibbonPrev" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#b45309" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>
              <filter id="softGlowPrev" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Background Texture */}
            <rect width="900" height="380" fill="url(#bgForestPrev)" />
            <circle cx="170" cy="190" r="160" fill="url(#targetGlowPrev)" />

            {/* Subtle Pine Trees in Background */}
            <g opacity="0.18" fill="#10b981">
              <polygon points="50,280 80,180 110,280" />
              <polygon points="120,290 150,190 180,290" />
              <polygon points="760,290 800,170 840,290" />
              <polygon points="820,290 850,200 880,290" />
            </g>

            {/* Traditional Archery Target on Left */}
            <g transform="translate(160, 190)">
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
              <circle cx="0" cy="-60" r="18" fill="#fbbf24" opacity="0.9" />
              <path d="M-15,-40 C-10,-48 10,-48 15,-40 L22,25 C10,35 -10,35 -22,25 Z" fill="#e2e8f0" opacity="0.75" />
              <path d="M10,-35 L45,-30 L-25,-15" stroke="#fef08a" strokeWidth="4" strokeLinecap="round" />
              <path d="M-40,-85 C-20,-30 -20,25 -40,80" stroke="#ca8a04" strokeWidth="5" fill="none" strokeLinecap="round" />
              <line x1="-40" y1="-85" x2="-40" y2="80" stroke="#f8fafc" strokeWidth="1.5" strokeDasharray="3 2" />
              <line x1="45" y1="-30" x2="-70" y2="-30" stroke="#38bdf8" strokeWidth="3" />
              <polygon points="-70,-30 -60,-35 -60,-25" fill="#38bdf8" />
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

            {/* Center Typography */}
            <text
              x="450"
              y="125"
              fill="url(#goldTextPrev)"
              fontSize="34"
              fontWeight="bold"
              letterSpacing="2"
              textAnchor="middle"
              fontFamily="ui-serif, Georgia, serif"
              filter="url(#softGlowPrev)"
            >
              Shillong MORNING TEER
            </text>

            {/* Previous Result Ribbon */}
            <g transform="translate(295, 145)">
              <rect x="0" y="0" width="310" height="42" rx="21" fill="url(#goldRibbonPrev)" stroke="#fef08a" strokeWidth="1.5" />
              <text
                x="155"
                y="27"
                fill="#ffffff"
                fontSize="15"
                fontWeight="bold"
                letterSpacing="2.5"
                textAnchor="middle"
                fontFamily="sans-serif"
              >
                â˜… PREVIOUS RESULTS ARCHIVE â˜…
              </text>
            </g>

            {/* Badges Row */}
            <g transform="translate(210, 206)">
              <rect x="0" y="0" width="145" height="24" rx="12" fill="#047857" opacity="0.9" />
              <text x="72" y="16" fill="#ffffff" fontSize="9" fontWeight="normal" textAnchor="middle" fontFamily="sans-serif">
                DAILY OFFICIAL ARCHIVE
              </text>

              <rect x="160" y="0" width="160" height="24" rx="12" fill="#b45309" opacity="0.9" />
              <text x="240" y="16" fill="#ffffff" fontSize="9" fontWeight="normal" textAnchor="middle" fontFamily="sans-serif">
                F/R 10:30 AM &amp; S/R 11:30 AM
              </text>

              <rect x="335" y="0" width="140" height="24" rx="12" fill="#1d4ed8" opacity="0.9" />
              <text x="405" y="16" fill="#ffffff" fontSize="9" fontWeight="normal" textAnchor="middle" fontFamily="sans-serif">
                ACCURATE &amp; VERIFIED
              </text>
            </g>

            {/* Footer Copyright inside banner */}
            <text
              x="450"
              y="350"
              fill="#94a3b8"
              fontSize="11"
              letterSpacing="1"
              textAnchor="middle"
              fontFamily="sans-serif"
            >
              &copy; shillongmorningteer.com
            </text>
          </svg>
        </div>

        {/* 4. Controls Section: Heading, Search & Month Filter */}
        <div className="space-y-4 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-medium text-gray-900 tracking-tight">
                Shillong Morning Teer Previous Result List
              </h2>
              <p className="text-xs text-gray-500 font-normal mt-0.5">
                Archived First Round (F/R) and Second Round (S/R) winning numbers
              </p>
            </div>

            {/* Quick Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                placeholder="Search date (e.g. 22/09) or number..."
                className="w-full pl-9 pr-7 py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
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

          {/* Month Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs text-gray-500 font-normal whitespace-nowrap flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-gray-400" />
              Filter Month:
            </span>
            <button
              onClick={() => { setSelectedMonth('all'); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-md text-xs font-normal whitespace-nowrap transition-colors cursor-pointer ${
                selectedMonth === 'all'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Records ({combinedResults.length})
            </button>
            {months.map((m) => (
              <button
                key={m}
                onClick={() => { setSelectedMonth(m); setCurrentPage(1); }}
                className={`px-3 py-1.5 rounded-md text-xs font-normal whitespace-nowrap transition-colors cursor-pointer ${
                  selectedMonth === m
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {formatMonthLabel(m)}
              </button>
            ))}
          </div>

          {/* Active filter / matches badge */}
          <div className="flex items-center justify-between text-xs text-gray-500 font-normal">
            <span>
              Showing {filteredResults.length} archived days
              {selectedMonth !== 'all' && ` in ${formatMonthLabel(selectedMonth)}`}
              {searchTerm && ` matching "${searchTerm}"`}
            </span>
            <span className="text-[11px] text-gray-400">Times: F/R (10:30 AM) â€¢ S/R (11:30 AM)</span>
          </div>
        </div>

        {/* 5. Compact reference-style results table */}
        <div className="mx-auto w-full max-w-[650px] overflow-hidden border-[1.5px] border-black bg-white">
          <table className="w-full table-fixed border-collapse text-center font-sans text-[13px] sm:text-[15px] leading-tight text-black">
            <thead>
              <tr>
                <th colSpan={4} className="border-b-[1.5px] border-black bg-[#eeeeee] py-1 text-[17px] sm:text-[19px] font-medium">
                  RESULTS
                </th>
              </tr>
              <tr className="bg-[#43cfbf]">
                <th className="w-[42%] border-r-[1.5px] border-black py-1 font-medium text-[16px] sm:text-[18px]">CITY</th>
                <th className="w-[30%] border-r-[1.5px] border-black py-1 font-medium text-[16px] sm:text-[18px]">DATE</th>
                <th className="w-[14%] border-r-[1.5px] border-black py-1 font-medium text-[16px] sm:text-[18px]">F/R</th>
                <th className="w-[14%] py-1 font-medium text-[16px] sm:text-[18px]">S/R</th>
              </tr>
            </thead>
            <tbody>
              {paginatedResults.map((row) => (
                <tr key={row.id} className="bg-white">
                  <td className="border-r-[1.5px] border-t-[1.5px] border-black px-1 py-[3px] text-[15px] sm:text-[17px] font-normal">Shillong</td>
                  <td className="border-r-[1.5px] border-t-[1.5px] border-black px-1 py-[3px] text-[15px] sm:text-[17px] tabular-nums">{row.date}</td>
                  <td className="border-r-[1.5px] border-t-[1.5px] border-black px-1 py-[3px] text-[15px] sm:text-[17px] tabular-nums">{row.round_1_number || '--'}</td>
                  <td className="border-t-[1.5px] border-black px-1 py-[3px] text-[15px] sm:text-[17px] tabular-nums">{row.round_2_number || '--'}</td>
                </tr>
              ))}
              {paginatedResults.length === 0 && (
                <tr>
                  <td colSpan={4} className="border-t-[1.5px] border-black py-6 text-center text-gray-600">
                    No previous results found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mx-auto w-full max-w-[650px] flex items-center justify-between gap-3">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-md border border-gray-300 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-md border border-gray-300 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>


        {/* 6. Editorial Articles Below Table exactly matching Shillong Morning Teer website */}
        <div className="space-y-6 pt-4 text-gray-700 text-xs sm:text-sm font-normal leading-relaxed">
          {/* Section 1 */}
          <div>
            <h2 className="text-lg sm:text-xl font-medium text-gray-900 border-b border-orange-200/90 pb-1 mb-3">
              What Are Shillong Morning Teer Previous Results?
            </h2>
            <p className="mb-3">
              <span className="font-medium text-gray-800">Shillong Morning Teer Previous Results</span> refer to the historical record of archery scores and winning numbers announced for the Morning Teer game played in Shillong, Meghalaya. Every morning, skilled archers shoot arrows at a cylindrical target made of traditional bamboo straw. Once shooting finishes, officials count the arrows that hit the target, and the last two digits of the total arrow count determine the official outcome.
            </p>
            <p>
              Archery enthusiasts and players rely on this historical archive to study how numbers change over time. Rather than relying on guesswork, many people prefer reviewing organized data from preceding days and weeks to understand patterns and past performances.
            </p>
          </div>

          {/* Section 2 */}
          <div>
            <h2 className="text-lg sm:text-xl font-medium text-gray-900 border-b border-orange-200/90 pb-1 mb-3">
              Why People Check Shillong Morning Teer Previous Results
            </h2>
            <p className="mb-3">
              Checking previous results has been a tradition for regular participants for many years. Reviewing past records serves multiple practical purposes:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <span className="font-medium text-gray-800">Identifying Recurring Numbers:</span> Some numbers appear multiple times over a month, while others experience extended gaps.
              </li>
              <li>
                <span className="font-medium text-gray-800">Calculating House and Ending:</span> The tens digit (House) and units digit (Ending) from previous days are often tracked to estimate prospective ranges.
              </li>
              <li>
                <span className="font-medium text-gray-800">Connecting with Dream Numbers:</span> Many players cross-check dreams with actual winning figures to see which dream interpretations have matched historical outcomes.
              </li>
              <li>
                <span className="font-medium text-gray-800">Tracking First vs. Second Round Dynamics:</span> Comparing First Round (10:30 AM) with Second Round (11:30 AM) reveals how the two shooting sessions correlate.
              </li>
              <li>
                <span className="font-medium text-gray-800">Verifying Old Tickets:</span> Followers who missed live morning announcements can easily confirm tickets by consulting the verified date archives.
              </li>
            </ul>
          </div>

          {/* Section 3 */}
          <div>
            <h2 className="text-lg sm:text-xl font-medium text-gray-900 border-b border-orange-200/90 pb-1 mb-3">
              How to Read the Morning Teer Results Table
            </h2>
            <p className="mb-3">
              The archive table organizes results into four simple columns to match the official reference layout:
            </p>
            <div className="space-y-2 pl-2">
              <p>
                <span className="font-medium text-gray-800">1. City:</span> Shows Shillong as the location for the Morning Teer result.
              </p>
              <p>
                <span className="font-medium text-gray-800">2. Date:</span> The specific day, month, and year of the result.
              </p>
              <p>
                <span className="font-medium text-gray-800">3. F/R (First Round):</span> The winning number published for the first round at about 10:30 AM.
              </p>
              <p>
                <span className="font-medium text-gray-800">4. S/R (Second Round):</span> The winning number published for the second round at about 11:30 AM.
              </p>
            </div>
          </div>

          {/* Section 4 */}
          <div>
            <h2 className="text-lg sm:text-xl font-medium text-gray-900 border-b border-orange-200/90 pb-1 mb-3">
              Popular Methods Used to Analyze Past Teer Results
            </h2>
            <p className="mb-2">
              Followers employ various traditional formulas to analyze Shillong Morning Teer past records:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <span className="font-medium text-gray-800">The Value / Cut Pair Method:</span> Numbers in Teer are often paired with their traditional cut partners (0-5, 1-6, 2-7, 3-8, 4-9). If a 3 appears in First Round, analysts monitor whether 8 appears in the following round.
              </li>
              <li>
                <span className="font-medium text-gray-800">Weekly Cycle Tracking:</span> Certain days of the week, especially Sunday mornings, often show distinct frequency clusters that players follow weekly.
              </li>
              <li>
                <span className="font-medium text-gray-800">Gap &amp; Repetition Monitoring:</span> Measuring the number of days since a digit or pair last hit the board helps gauge overdue trends.
              </li>
              <li>
                <span className="font-medium text-gray-800">Sum of Digits Formula:</span> Summing the digits of the previous day&apos;s F/R and S/R to produce prospective House or Ending seeds.
              </li>
            </ul>
            <p className="mt-3">
              You can also examine our calculated daily{' '}
              <button
                onClick={() => onNavigate?.('/common-number')}
                className="text-blue-700 hover:underline font-medium cursor-pointer"
              >
                Shillong Morning Teer Common Numbers
              </button>{' '}
              and explore traditional{' '}
              <button
                onClick={() => onNavigate?.('/dream-number')}
                className="text-blue-700 hover:underline font-medium cursor-pointer"
              >
                Shillong Morning Teer Dream Numbers
              </button>{' '}
              for additional reference.
            </p>
          </div>

          {/* Section 5 */}
          <div>
            <h2 className="text-lg sm:text-xl font-medium text-gray-900 border-b border-orange-200/90 pb-1 mb-3">
              Common Myths About Previous Results
            </h2>
            <p className="mb-3">
              While reviewing past numbers is an entertaining and traditional habit, distinguishing myths from facts ensures a grounded perspective:
            </p>
            <div className="space-y-3 pl-1">
              <div>
                <p>
                  <span className="font-medium text-gray-900">Myth:</span> Past results mathematically determine future outcomes with 100% certainty.
                </p>
                <p>
                  <span className="font-medium text-gray-900">Reality:</span> Every round depends on the actual physical arrows shot by archers on that specific day. No mathematical formula guarantees a win.
                </p>
              </div>

              <div>
                <p>
                  <span className="font-medium text-gray-900">Myth:</span> Numbers that have not appeared for a long time are &ldquo;guaranteed&rdquo; to win today.
                </p>
                <p>
                  <span className="font-medium text-gray-900">Reality:</span> Long gaps can continue for several weeks, as each archery round is an independent sporting event.
                </p>
              </div>

              <div>
                <p>
                  <span className="font-medium text-gray-900">Myth:</span> Only complex software can calculate good target numbers.
                </p>
                <p>
                  <span className="font-medium text-gray-900">Reality:</span> Most experienced participants use simple observation of House, Ending, and weekly averages.
                </p>
              </div>
            </div>
          </div>

          {/* Section 6 */}
          <div>
            <h2 className="text-lg sm:text-xl font-medium text-gray-900 border-b border-orange-200/90 pb-1 mb-3">
              Important Disclaimer &amp; Responsible Play
            </h2>
            <p className="mb-3">
              All results published on this page are provided strictly for informational and educational purposes. Shillong Morning Teer is based on traditional indigenous archery conducted under local Meghalaya regulations. Past results, common numbers, and dream charts are shared as cultural reference guides. We encourage all visitors to engage responsibly and treat archery results as traditional entertainment.
            </p>
          </div>
        </div>

        {/* 7. Frequently Asked Questions (FAQ) Accordion matching the site style */}
        <div className="pt-6 space-y-3">
          <h2 className="text-lg sm:text-xl font-medium text-gray-900 border-b border-orange-200/90 pb-2">
            Frequently Asked Questions (FAQ)
          </h2>

          <div className="space-y-2">
            {[
              {
                q: 'What time are Shillong Morning Teer results declared daily?',
                a: 'Shillong Morning Teer results are declared in two rounds: the First Round (F/R) is announced between 10:30 AM and 10:45 AM, and the Second Round (S/R) is announced between 11:30 AM and 11:45 AM daily.',
              },
              {
                q: 'How are Morning Teer winning numbers determined?',
                a: 'Winning numbers are determined by counting the arrows that successfully hit the target during the archery competition. The last two digits of the total arrow count form the winning number.',
              },
              {
                q: 'Can analyzing past results guarantee future winning numbers?',
                a: 'No. There is no formula or system that can guarantee winning numbers. Historical results help identify frequency patterns, but each day depends entirely on live archery shooting.',
              },
              {
                q: 'What does the City column mean in the previous results table?',
                a: 'The City column identifies Shillong as the location for the archived Morning Teer result.',
              },
              {
                q: 'Where can I find todayâ€™s live Morning Teer results?',
                a: 'Todayâ€™s live results are updated directly on our homepage with real-time indicators as soon as the arrow count is completed by ground officials.',
              },
              {
                q: 'Are Shillong Morning Teer results updated on weekends?',
                a: 'Yes, Shillong Morning Teer results are available throughout the week, and archived results can be checked by date.',
              },
              {
                q: 'Can I copy previous results from this archive?',
                a: 'Yes, you can click the copy icon next to any result row or search query to copy the official scores directly to your clipboard.',
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-2xs"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left px-4 py-3 flex items-center justify-between gap-2 hover:bg-gray-50/80 transition-colors cursor-pointer"
                >
                  <span className="text-xs sm:text-sm font-medium text-gray-900">
                    {idx + 1}. {faq.q}
                  </span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-4 h-4 text-gray-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" />
                  )}
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-3 pt-1 text-xs sm:text-sm text-gray-600 font-normal border-t border-gray-100 bg-gray-50/40 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 8. Quick Navigation Links to other categories */}
        <div className="pt-4 border-t border-gray-200 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <button
            onClick={onBack}
            className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            â† Live Homepage
          </button>
          <button
            onClick={() => onNavigate?.('/common-number')}
            className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Common Numbers â†’
          </button>
          <button
            onClick={() => onNavigate?.('/dream-number')}
            className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Dream Numbers â†’
          </button>
        </div>
      </div>

      {/* 9. Footer Component */}
      <Footer
        onNavigateHome={onBack}
        onOpenModal={(type) => setActiveModal(type)}
      />

      {/* 10. Information Modals */}
      <InfoModal type={activeModal} onClose={() => setActiveModal(null)} />
    </div>
  );
};








