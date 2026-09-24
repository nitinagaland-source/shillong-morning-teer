import React, { useState } from 'react';
import { SiteSettings } from '../types';
import { ArrowLeft, Tag, Copy, Check, ShieldCheck, Ticket, Users, ExternalLink, Calendar } from 'lucide-react';
import { Footer } from '../components/Footer';
import { InfoModal } from '../components/InfoModal';

interface DealPageProps {
  settings: SiteSettings;
  onBack: () => void;
}

export const DealPage: React.FC<DealPageProps> = ({ settings, onBack }) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<'about' | 'terms' | 'privacy' | 'contact' | null>(null);

  const deals = [
    {
      id: 'shillong-ground-pass',
      title: 'Polo Ground Shillong - Archery Ground Entry Pass',
      category: 'Ground Access',
      badge: 'OFFICIAL PASS',
      badgeColor: 'bg-[#b8e8e3] text-[#48c9c0] border-[#48c9c0]',
      description: 'Official spectator entrance to the Shillong archery shooting ring at Polo Ground. Witness the 50 traditional archers live during Morning F/R & S/R shooting.',
      validity: 'Valid Monday to Saturday',
      code: 'POLO-GROUND-ENTRY-2026',
      discount: 'FREE ADMISSION',
    },
    {
      id: 'vip-common-club',
      title: 'Morning Teer Club Daily Common Number Alerts',
      category: 'Community Club',
      badge: 'VERIFIED CLUB',
      badgeColor: 'bg-[#b8e8e3] text-[#48c9c0] border-[#48c9c0]',
      description: 'Join the registered Meghalaya archery enthusiast community. Receive verified morning house and ending calculation sheets directly at 9:30 AM before shooting commences.',
      validity: 'Daily 09:30 AM IST',
      code: 'TEER-VIP-ALERT-MORNING',
      discount: '100% FREE',
    },
    {
      id: 'khanapara-pass',
      title: 'Khanapara Archery Tournament Club Access',
      category: 'Tournament',
      badge: 'TOURNAMENT',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
      description: 'Spectator gallery accreditation for inter-district Meghalaya & Assam archers division. Official archery verification scorecard included.',
      validity: 'Weekend Specials',
      code: 'KHANAPARA-ACCESS-PASS',
      discount: 'VERIFIED',
    },
    {
      id: 'dream-dictionary-pdf',
      title: 'Traditional Khasi Archery Dream Interpretations PDF',
      category: 'Guide',
      badge: 'FREE GUIDE',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
      description: 'Comprehensive archival dictionary cataloging over 300 traditional dream symbols and their corresponding archery target numbers as passed down through generations.',
      validity: 'Instant Download',
      code: 'DREAM-GUIDE-MEGHALAYA',
      discount: 'DOWNLOAD',
    },
  ];

  const handleCopy = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 pb-16">
      {/* Top Bar Header */}
      <div
        className="sticky top-0 z-30 px-4 py-3 border-b border-[#48c9c0]/10 shadow-xs flex items-center justify-between"
        style={{ backgroundColor: settings.top_bar_bg_color || '#48c9c0' }}
      >
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-[#48c9c0] font-normal text-sm hover:opacity-80 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Home</span>
        </button>

        <h1 className="text-base sm:text-lg font-medium text-[#48c9c0] font-sans uppercase tracking-tight">
          Archery Deals &amp; Passes
        </h1>

        <div className="w-12"></div>
      </div>

      <div className="max-w-md mx-auto px-4 pt-4 space-y-4">
        {/* Intro */}
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-2xs space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#b8e8e3] text-[#48c9c0] flex items-center justify-center font-normal">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-medium text-[#48c9c0] leading-tight">
                Community Passes &amp; Archery Deals
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                Verified community resources for Shillong Morning Teer
              </p>
            </div>
          </div>
        </div>

        {/* Deals Cards */}
        <div className="space-y-3.5">
          {deals.map((deal) => (
            <div
              key={deal.id}
              className="bg-white rounded-2xl p-4 border border-gray-200 shadow-2xs space-y-3 hover:border-gray-300 transition-colors"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <span
                  className={`text-[10px] font-normal uppercase px-2 py-0.5 rounded-full border ${deal.badgeColor}`}
                >
                  {deal.badge}
                </span>
                <span className="text-xs font-normal text-[#48c9c0] bg-[#b8e8e3] px-2 py-0.5 rounded-md border border-[#48c9c0]">
                  {deal.discount}
                </span>
              </div>

              {/* Title & Body */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 leading-snug">
                  {deal.title}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed mt-1">
                  {deal.description}
                </p>
              </div>

              {/* Validity */}
              <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-medium">
                <Calendar className="w-3.5 h-3.5" />
                <span>{deal.validity}</span>
              </div>

              {/* Action Box */}
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                <div className="bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-200 flex-1 font-mono text-xs font-bold text-gray-800 truncate">
                  {deal.code}
                </div>
                <button
                  onClick={() => handleCopy(deal.code)}
                  className="py-1.5 px-3 bg-[#48c9c0] hover:bg-[#48c9c0] text-white text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1 transition-colors shrink-0 shadow-xs"
                >
                  {copiedCode === deal.code ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#48c9c0]" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Verification note */}
        <div className="bg-[#b8e8e3]/70 p-3.5 rounded-xl border border-[#48c9c0] text-xs text-[#48c9c0] space-y-1">
          <div className="flex items-center gap-1.5 font-bold">
            <ShieldCheck className="w-4 h-4 text-[#48c9c0]" />
            <span>Community Verified Archery Programs</span>
          </div>
          <p className="text-[11px] leading-relaxed text-[#48c9c0]/90">
            All passes and club alerts are free community initiatives to preserve traditional Meghalaya archery culture. We never charge for club common number access.
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




