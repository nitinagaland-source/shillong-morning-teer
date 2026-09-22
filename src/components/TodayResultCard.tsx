import React from 'react';
import { TeerResult, SiteSettings } from '../types';
import { getTodayISTDateString } from '../lib/dateUtils';

interface TodayResultCardProps {
  result: TeerResult;
  settings: SiteSettings;
  isLiveUpdating?: boolean;
}

export const TodayResultCard: React.FC<TodayResultCardProps> = ({
  result,
  settings,
  isLiveUpdating = true,
}) => {
  const round1Number = result.round_1_number?.trim() || 'X';
  const round2Number = result.round_2_number?.trim() || 'X';
  const displayDate = result.date || getTodayISTDateString();

  return (
    <section id="today-result-section" className="w-full">
      {/* Date Header: Clean Normal/Medium Typography */}
      <div className="text-center mb-3">
        <h2
          id="current-date-header"
          className="text-lg sm:text-xl font-medium tracking-tight text-gray-800 font-sans"
        >
          {displayDate}
        </h2>
      </div>

      {/* Result Table Container */}
      <div
        id="today-result-card"
        className="w-full rounded-xl border border-gray-300 bg-white overflow-hidden shadow-xs"
      >
        {/* Game Title Bar */}
        <div
          id="game-title-bar"
          className="w-full bg-gray-50 py-2 px-4 text-center border-b border-gray-200"
        >
          <h1 className="text-xs sm:text-sm font-medium tracking-wider text-gray-800 uppercase font-sans">
            {settings.game_name || 'SHILLONG MORNING TEER'}
          </h1>
        </div>

        {/* 2-Column Header: Clean Indigo/Blue Gradient with Normal Typography */}
        <div className="grid grid-cols-2 text-center border-b border-blue-700 bg-linear-to-r from-blue-600 via-indigo-600 to-blue-700">
          {/* Column 1: F/R */}
          <div
            id="fr-header-col"
            className="py-2 px-1 border-r border-white/20 flex items-center justify-center"
          >
            <span className="text-xs sm:text-sm font-medium text-white font-sans tracking-wide">
              {result.round_1_label || 'F/R(10:30 AM)'}
            </span>
          </div>

          {/* Column 2: S/R */}
          <div
            id="sr-header-col"
            className="py-2 px-1 flex items-center justify-center"
          >
            <span className="text-xs sm:text-sm font-medium text-white font-sans tracking-wide">
              {result.round_2_label || 'S/R(11:30 AM)'}
            </span>
          </div>
        </div>

        {/* 2-Column Numbers Row with Clean Normal Font */}
        <div className="grid grid-cols-2 text-center bg-white min-h-[76px]">
          {/* F/R Number Value */}
          <div
            id="fr-number-col"
            className="py-3 px-2 border-r border-gray-200 flex flex-col items-center justify-center"
          >
            <span className="text-3xl sm:text-4xl font-normal text-gray-900 tabular-nums tracking-normal font-sans">
              {round1Number}
            </span>
          </div>

          {/* S/R Number Value */}
          <div
            id="sr-number-col"
            className="py-3 px-2 flex flex-col items-center justify-center"
          >
            <span className="text-3xl sm:text-4xl font-normal text-gray-900 tabular-nums tracking-normal font-sans">
              {round2Number}
            </span>
          </div>
        </div>
      </div>

      {/* Live sync indicator */}
      <div className="mt-2 flex items-center justify-between text-xs text-gray-500 px-1 font-normal">
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
          </span>
          <span className="font-normal text-blue-700">Direct Ground Archery Feed</span>
        </div>
        <span className="text-gray-400 text-[11px] font-normal">Auto-refreshed instantly</span>
      </div>
    </section>
  );
};
