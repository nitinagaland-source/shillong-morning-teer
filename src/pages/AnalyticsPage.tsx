import React, { useState, useMemo } from 'react';
import { TeerResult, SiteSettings } from '../types';
import { ArrowLeft, BarChart2, TrendingUp, Search, Calendar, Activity, Zap } from 'lucide-react';
import { Footer } from '../components/Footer';
import { InfoModal } from '../components/InfoModal';

interface AnalyticsPageProps {
  settings: SiteSettings;
  results: TeerResult[];
  onBack: () => void;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({
  settings,
  results,
  onBack,
}) => {
  const [timeRange, setTimeRange] = useState<'7' | '30' | 'all'>('30');
  const [searchNumber, setSearchNumber] = useState('');
  const [activeModal, setActiveModal] = useState<'about' | 'terms' | 'privacy' | 'contact' | null>(null);

  // Filter results by range
  const scopedResults = useMemo(() => {
    if (timeRange === '7') return results.slice(0, 7);
    if (timeRange === '30') return results.slice(0, 30);
    return results;
  }, [results, timeRange]);

  // Compute Frequency Stats
  const stats = useMemo(() => {
    const frCounts: Record<string, number> = {};
    const srCounts: Record<string, number> = {};
    const totalCounts: Record<string, number> = {};
    const houseCounts: Record<string, number> = {};
    const endingCounts: Record<string, number> = {};
    let oddCount = 0;
    let evenCount = 0;
    let totalRounds = 0;

    scopedResults.forEach((r) => {
      const fr = r.round_1_number?.trim();
      const sr = r.round_2_number?.trim();

      if (fr && !isNaN(Number(fr))) {
        frCounts[fr] = (frCounts[fr] || 0) + 1;
        totalCounts[fr] = (totalCounts[fr] || 0) + 1;
        totalRounds++;
        const num = parseInt(fr, 10);
        if (num % 2 === 0) evenCount++;
        else oddCount++;

        const house = fr.charAt(0);
        const ending = fr.charAt(fr.length - 1);
        houseCounts[house] = (houseCounts[house] || 0) + 1;
        endingCounts[ending] = (endingCounts[ending] || 0) + 1;
      }

      if (sr && !isNaN(Number(sr))) {
        srCounts[sr] = (srCounts[sr] || 0) + 1;
        totalCounts[sr] = (totalCounts[sr] || 0) + 1;
        totalRounds++;
        const num = parseInt(sr, 10);
        if (num % 2 === 0) evenCount++;
        else oddCount++;

        const house = sr.charAt(0);
        const ending = sr.charAt(sr.length - 1);
        houseCounts[house] = (houseCounts[house] || 0) + 1;
        endingCounts[ending] = (endingCounts[ending] || 0) + 1;
      }
    });

    // Sort top frequent
    const topNumbers = Object.entries(totalCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);

    // House 0-9
    const houseList = Array.from({ length: 10 }, (_, i) => ({
      digit: i.toString(),
      count: houseCounts[i.toString()] || 0,
    }));

    // Ending 0-9
    const endingList = Array.from({ length: 10 }, (_, i) => ({
      digit: i.toString(),
      count: endingCounts[i.toString()] || 0,
    }));

    const oddPercent = totalRounds > 0 ? Math.round((oddCount / totalRounds) * 100) : 50;
    const evenPercent = 100 - oddPercent;

    return {
      topNumbers,
      houseList,
      endingList,
      oddPercent,
      evenPercent,
      totalRounds,
    };
  }, [scopedResults]);

  // Lookup single number
  const lookupData = useMemo(() => {
    const q = searchNumber.trim();
    if (!q) return null;
    let frHits = 0;
    let srHits = 0;
    let lastSeen: string | null = null;

    for (const r of results) {
      if (r.round_1_number === q) {
        frHits++;
        if (!lastSeen) lastSeen = `${r.date} (F/R)`;
      }
      if (r.round_2_number === q) {
        srHits++;
        if (!lastSeen) lastSeen = `${r.date} (S/R)`;
      }
    }

    return {
      number: q,
      totalHits: frHits + srHits,
      frHits,
      srHits,
      lastSeen: lastSeen || 'Not appeared in recorded archives',
    };
  }, [results, searchNumber]);

  return (
    <div className="w-full min-h-screen bg-gray-50 pb-16">
      {/* Top Bar Header */}
      <div
        className="sticky top-0 z-30 px-4 py-3 border-b border-[#48c9c0]/10 shadow-xs flex items-center justify-between"
        style={{ backgroundColor: '#48c9c0' }}
      >
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-[#111827] font-normal text-sm hover:opacity-80 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Home</span>
        </button>

        <h1 className="text-base sm:text-lg font-medium text-[#111827] font-sans uppercase tracking-tight">
          Archery Analytics
        </h1>

        <div className="w-12"></div>
      </div>

      <div className="max-w-md mx-auto px-4 pt-4 space-y-4">
        {/* Intro Card & Time Filters */}
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#b8e8e3] text-[#111827] flex items-center justify-center font-normal">
                <BarChart2 className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-medium text-[#111827] leading-tight">
                  Historical Statistical Analysis
                </h2>
                <p className="text-xs text-gray-500 font-medium">
                  Frequency matrices from official rounds
                </p>
              </div>
            </div>
          </div>

          {/* Time Filter Pills */}
          <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
            <span className="text-xs font-bold text-gray-500">Period:</span>
            {(['7', '30', 'all'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  timeRange === r
                    ? 'bg-[#48c9c0] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {r === '7' ? 'Last 7 Days' : r === '30' ? 'Last 30 Days' : 'All Time'}
              </button>
            ))}
          </div>
        </div>

        {/* 1. Quick Number Lookup */}
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-2xs space-y-2.5">
          <label className="block text-xs font-bold text-gray-700">
            Number Frequency Lookup (00-99)
          </label>
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              maxLength={2}
              value={searchNumber}
              onChange={(e) => setSearchNumber(e.target.value)}
              placeholder="Enter number (e.g. 76 or 44)..."
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm font-bold font-mono focus:outline-hidden focus:ring-2 focus:ring-[#48c9c0]"
            />
          </div>

          {lookupData && (
            <div className="bg-[#b8e8e3]/70 p-3 rounded-xl border border-[#48c9c0] text-xs space-y-1.5 animate-in fade-in duration-150">
              <div className="flex items-center justify-between font-normal text-gray-900">
                <span>Target #{lookupData.number}</span>
                <span className="text-[#111827]">Appeared {lookupData.totalHits} times</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-600 pt-1">
                <div>First Round (F/R): <b className="text-gray-900">{lookupData.frHits}</b></div>
                <div>Second Round (S/R): <b className="text-gray-900">{lookupData.srHits}</b></div>
              </div>
              <div className="text-[11px] text-gray-500 pt-1 border-t border-[#48c9c0]/60">
                Last seen: <b className="text-gray-800">{lookupData.lastSeen}</b>
              </div>
            </div>
          )}
        </div>

        {/* 2. Top Hit Numbers Grid */}
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <h3 className="text-sm font-medium text-gray-900 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-[#111827]" />
              Highest Frequency Targets
            </h3>
            <span className="text-[11px] text-gray-400 font-medium">Top Repeaters</span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {stats.topNumbers.map(([num, count]) => (
              <div
                key={num}
                className="bg-gray-50 border border-gray-200 rounded-xl p-2 text-center hover:bg-[#b8e8e3] hover:border-[#48c9c0] transition-colors"
              >
                <span className="text-2xl font-normal text-gray-900 font-sans tabular-nums block">
                  {num}
                </span>
                <span className="text-[10px] font-bold text-[#111827] bg-[#b8e8e3]/70 px-1.5 py-0.5 rounded-full inline-block mt-1">
                  {count} hits
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Odd vs Even Distribution */}
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-2xs space-y-3">
          <h3 className="text-sm font-medium text-gray-900 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-[#111827]" />
            Odd vs. Even Ratio
          </h3>

          <div className="space-y-2">
            <div className="w-full h-4 rounded-full overflow-hidden flex bg-gray-200">
              <div
                style={{ width: `${stats.oddPercent}%` }}
                className="bg-amber-500 h-full flex items-center justify-center text-[9px] font-normal text-white"
              >
                {stats.oddPercent}% Odd
              </div>
              <div
                style={{ width: `${stats.evenPercent}%` }}
                className="bg-[#48c9c0] h-full flex items-center justify-center text-[9px] font-normal text-white"
              >
                {stats.evenPercent}% Even
              </div>
            </div>

            <div className="flex justify-between text-xs font-bold text-gray-600 px-1">
              <span className="text-amber-700">Odd Digits (1, 3, 5, 7, 9)</span>
              <span className="text-[#111827]">Even Digits (0, 2, 4, 6, 8)</span>
            </div>
          </div>
        </div>

        {/* 4. House Frequency Distribution (0 to 9) */}
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <h3 className="text-sm font-medium text-gray-900">
              House Distribution (First Digit)
            </h3>
            <span className="text-[11px] text-gray-400">0 - 9</span>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {stats.houseList.map((h) => (
              <div
                key={h.digit}
                className="bg-gray-50 border border-gray-200 rounded-xl p-2 text-center"
              >
                <span className="text-xs font-bold text-gray-500 block">House</span>
                <span className="text-lg font-normal text-gray-900">{h.digit}</span>
                <span className="text-[10px] text-gray-500 block mt-0.5">{h.count} hits</span>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Ending Frequency Distribution (0 to 9) */}
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <h3 className="text-sm font-medium text-gray-900">
              Ending Distribution (Last Digit)
            </h3>
            <span className="text-[11px] text-gray-400">0 - 9</span>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {stats.endingList.map((e) => (
              <div
                key={e.digit}
                className="bg-gray-50 border border-gray-200 rounded-xl p-2 text-center"
              >
                <span className="text-xs font-bold text-gray-500 block">Ending</span>
                <span className="text-lg font-normal text-gray-900">{e.digit}</span>
                <span className="text-[10px] text-gray-500 block mt-0.5">{e.count} hits</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Aesthetic Pastel Footer */}
      <Footer
        onNavigateHome={onBack}
        onOpenModal={(type) => setActiveModal(type)}
      />

      {/* Info Modals */}
      <InfoModal type={activeModal} onClose={() => setActiveModal(null)} />
    </div>
  );
};







