import React from 'react';
import { TeerResult, SiteSettings } from '../types';
import { getTodayISTDateString } from '../lib/dateUtils';

interface TodayResultCardProps {
  result: TeerResult;
  settings: SiteSettings;
  isLiveUpdating?: boolean;
}

export const TodayResultCard: React.FC<TodayResultCardProps> = ({ result, settings }) => {
  const todayIST = getTodayISTDateString();
  const isCurrentDay = !result.date || result.date === todayIST;
  const isAwaiting = result.status === 'awaiting';
  const round1Number = isCurrentDay && !isAwaiting ? (result.round_1_number?.trim() || 'XX') : 'XX';
  const round2Number = isCurrentDay && !isAwaiting ? (result.round_2_number?.trim() || 'XX') : 'XX';
  const displayDate = isCurrentDay ? (result.date || todayIST) : todayIST;

  return (
    <section id="today-result-section" className="w-full">
      <div className="text-center mb-2 sm:mb-2">
        <h2 id="current-date-header" className="text-[24px] sm:text-[28px] font-bold tracking-tight text-black font-sans">
          {displayDate}
        </h2>
      </div>

      <div id="today-result-card" className="w-full bg-white border-2 border-black overflow-hidden">
        <div id="game-title-bar" className="w-full bg-[#eef1f5] py-3 sm:py-3.5 px-4 text-center border-b-2 border-black">
          <h1 className="text-[17px] sm:text-[20px] font-extrabold tracking-wide text-black uppercase font-sans">
            {settings.game_name || 'SHILLONG MORNING TEER'}
<span className="ml-1 inline-flex items-center gap-1 align-middle">
  <span className="relative inline-flex h-3.5 w-3.5">
    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75"></span>
    <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-red-600"></span>
  </span>
  <span className="text-[13px] sm:text-[14px] font-black text-red-700">LIVE</span>
</span>
          </h1>
        </div>

        <div className="grid grid-cols-2 text-center border-b-2 border-black bg-[#43cfbf]">
          <div id="fr-header-col" className="py-3 px-1 border-r-2 border-black flex items-center justify-center">
            <span className="text-[15px] sm:text-[18px] font-extrabold text-black font-sans">
              {result.round_1_label || 'F/R(10:30 AM)'}
            </span>
          </div>
          <div id="sr-header-col" className="py-3 px-1 flex items-center justify-center">
            <span className="text-[15px] sm:text-[18px] font-extrabold text-black font-sans">
              {result.round_2_label || 'S/R(11:30 AM)'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 text-center bg-white min-h-[50px] sm:min-h-[56px]">
          <div id="fr-number-col" className="px-2 border-r-2 border-black flex items-center justify-center">
            <span className="text-[32px] sm:text-[38px] leading-none font-extrabold text-black tabular-nums font-sans">{round1Number}</span>
          </div>
          <div id="sr-number-col" className="px-2 flex items-center justify-center">
            <span className="text-[32px] sm:text-[38px] leading-none font-extrabold text-black tabular-nums font-sans">{round2Number}</span>
          </div>
        </div>
      </div>
    </section>
  );
};








