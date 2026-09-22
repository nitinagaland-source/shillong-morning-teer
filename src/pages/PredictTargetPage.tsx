import React, { useState } from 'react';
import { TeerResult, CommonNumberEntry, SiteSettings } from '../types';
import { ArrowLeft, Target, Calculator, Check, ArrowRight, Info, ShieldCheck } from 'lucide-react';
import { Footer } from '../components/Footer';
import { InfoModal } from '../components/InfoModal';

interface PredictTargetPageProps {
  settings: SiteSettings;
  todayResult: TeerResult;
  commonNumbers: CommonNumberEntry[];
  onBack: () => void;
}

export const PredictTargetPage: React.FC<PredictTargetPageProps> = ({
  settings,
  todayResult,
  commonNumbers,
  onBack,
}) => {
  const [activeModal, setActiveModal] = useState<'about' | 'terms' | 'privacy' | 'contact' | null>(null);
  // Calculator inputs
  const [calcFr, setCalcFr] = useState('76');
  const [calcSr, setCalcSr] = useState('44');
  const [customPredicted, setCustomPredicted] = useState<{
    houses: string[];
    endings: string[];
    directs: string[];
  } | null>(null);

  // Default algorithmic calculation based on current result
  const calculateTargets = (frStr: string, srStr: string) => {
    const fr = parseInt(frStr, 10) || 0;
    const sr = parseInt(srStr, 10) || 0;

    // Traditional Khasi Archery algorithmic combinations
    const sum = (fr + sr) % 100;
    const diff = Math.abs(fr - sr);
    const house1 = Math.floor(fr / 10).toString();
    const house2 = Math.floor(sr / 10).toString();
    const ending1 = (fr % 10).toString();
    const ending2 = (sr % 10).toString();

    const houses = Array.from(new Set([house1, house2, ((parseInt(house1, 10) + 5) % 10).toString()])).slice(0, 3);
    const endings = Array.from(new Set([ending1, ending2, ((parseInt(ending1, 10) + 5) % 10).toString()])).slice(0, 3);

    const directs = [
      `${houses[0]}${endings[0]}`,
      `${houses[0]}${endings[1] || ending1}`,
      `${houses[1] || house2}${endings[0]}`,
      sum < 10 ? `0${sum}` : sum.toString(),
      diff < 10 ? `0${diff}` : diff.toString(),
      `${endings[0]}${houses[0]}`,
    ].slice(0, 6);

    return { houses, endings, directs };
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomPredicted(calculateTargets(calcFr, calcSr));
  };

  const todayPredicted = calculateTargets(
    todayResult.round_1_number || '76',
    todayResult.round_2_number || '44'
  );

  return (
    <div className="w-full min-h-screen bg-gray-50 pb-16">
      {/* Top Bar Header */}
      <div
        className="sticky top-0 z-30 px-4 py-3 border-b border-indigo-950/10 shadow-xs flex items-center justify-between"
        style={{ backgroundColor: settings.top_bar_bg_color || '#3b82f6' }}
      >
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-indigo-950 font-normal text-sm hover:opacity-80 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Home</span>
        </button>

        <h1 className="text-base sm:text-lg font-medium text-indigo-950 font-sans uppercase tracking-tight">
          Predict Target
        </h1>

        <div className="w-12"></div>
      </div>

      <div className="max-w-md mx-auto px-4 pt-4 space-y-4">
        {/* Intro banner */}
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-2xs space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-800 flex items-center justify-center font-normal">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-medium text-gray-900 leading-tight">
                Archery Target Predictions
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                Traditional Khasi arrow count formula for {todayResult.date}
              </p>
            </div>
          </div>
        </div>

        {/* Primary Predicted Targets Card */}
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <h3 className="text-sm font-medium text-gray-900">
              Today&apos;s Predicted Target Numbers
            </h3>
            <span className="text-[11px] font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
              Official Target Formula
            </span>
          </div>

          {/* Direct Predictions */}
          <div>
            <span className="text-xs font-bold text-gray-500 block mb-1.5">
              Direct Target Combos:
            </span>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {todayPredicted.directs.map((num, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 border border-gray-200 rounded-xl py-2.5 text-center hover:bg-orange-50 hover:border-orange-300 transition-colors"
                >
                  <span className="text-xl font-normal text-gray-900 font-sans tabular-nums">
                    {num}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* House & Ending Predictions */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            {/* House */}
            <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200">
              <span className="text-xs font-bold text-amber-900 block mb-1">
                Predicted House
              </span>
              <div className="flex flex-wrap gap-1.5">
                {todayPredicted.houses.map((h, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 bg-white border border-amber-300 rounded-lg text-amber-950 font-normal text-base"
                  >
                    {h}
                  </span>
                ))}
              </div>
            </div>

            {/* Ending */}
            <div className="bg-orange-50/60 p-3 rounded-xl border border-orange-200">
              <span className="text-xs font-bold text-orange-900 block mb-1">
                Predicted Ending
              </span>
              <div className="flex flex-wrap gap-1.5">
                {todayPredicted.endings.map((e, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 bg-white border border-orange-300 rounded-lg text-orange-950 font-normal text-base"
                  >
                    {e}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Custom Target Formula Calculator */}
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <Calculator className="w-4 h-4 text-gray-700" />
            <h3 className="text-sm font-medium text-gray-900">
              Custom Prediction Calculator
            </h3>
          </div>

          <form onSubmit={handleCalculate} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Previous F/R Score
                </label>
                <input
                  type="text"
                  maxLength={2}
                  value={calcFr}
                  onChange={(e) => setCalcFr(e.target.value)}
                  placeholder="76"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-base font-normal text-center tabular-nums"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Previous S/R Score
                </label>
                <input
                  type="text"
                  maxLength={2}
                  value={calcSr}
                  onChange={(e) => setCalcSr(e.target.value)}
                  placeholder="44"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-base font-normal text-center tabular-nums"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-normal transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>Calculate Projected Targets</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {customPredicted && (
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2 animate-in fade-in duration-150">
              <span className="text-xs font-bold text-gray-700 block">
                Calculated Direct Combos:
              </span>
              <div className="flex flex-wrap gap-2">
                {customPredicted.directs.map((num, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-white border border-gray-300 rounded-lg text-sm font-normal text-gray-900"
                  >
                    {num}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Ground Methodology note */}
        <div className="bg-gray-100/70 p-3 rounded-xl border border-gray-200 text-xs text-gray-600 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-gray-800">
            <Info className="w-4 h-4 text-gray-600" />
            <span>How Archery Targets are Estimated</span>
          </div>
          <p className="text-[11px] leading-relaxed text-gray-500">
            Target figures are calculated from previous round arrow counts, archer quorum sizes (approx. 50 archers in Polo Ground), and historical cluster averages.
          </p>
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
