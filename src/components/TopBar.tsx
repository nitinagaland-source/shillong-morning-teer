import React from 'react';
import { Menu, X } from 'lucide-react';
import { SiteSettings } from '../types';

interface TopBarProps {
  settings: SiteSettings;
  onOpenDrawer: () => void;
  isDrawerOpen?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({ settings, onOpenDrawer, isDrawerOpen }) => {
  return (
    <header
      id="top-bar-header"
      className="sticky top-0 z-40 w-full border-b border-black/10 shadow-xs"
      style={{ backgroundColor: '#b8e1ec' }}
    >
      <div className="max-w-md mx-auto px-3 sm:px-4 h-[72px] sm:h-[78px] flex items-center justify-between">
        <a
          href="/"
          id="top-bar-logo-link"
          className="min-w-0 flex items-center gap-2.5 text-black no-underline select-none"
          onClick={(e) => {
            if (window.location.pathname === '/') {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
        >
          {settings.logo_url ? (
            <img
              src={settings.logo_url}
              alt={settings.site_name || 'Shillongmorningteer'}
              className="w-11 h-11 sm:w-13 sm:h-13 object-contain shrink-0 scale-105"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-11 h-11 sm:w-13 sm:h-13 shrink-0" aria-hidden="true">
              <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
                <circle cx="43" cy="57" r="31" stroke="#050505" strokeWidth="10" />
                <circle cx="43" cy="57" r="19" stroke="#050505" strokeWidth="9" />
                <circle cx="43" cy="57" r="7" fill="#050505" />
                <path d="M43 57 L75 25" stroke="#050505" strokeWidth="9" strokeLinecap="round" />
                <path d="M70 18 L84 16 L82 30" stroke="#050505" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M72 28 L85 41" stroke="#050505" strokeWidth="8" strokeLinecap="round" />
              </svg>
            </div>
          )}

          <div className="min-w-0 flex items-center gap-2">
            <span
              id="site-title-text"
              className="truncate text-[20px] sm:text-[27px] leading-none font-black tracking-[-1.2px] text-black font-sans"
            >
              {settings.site_name || 'Shillongmorningteer'}
            </span>
            <span className="inline-flex items-center gap-1 shrink-0" aria-label="Live">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-600"></span>
              </span>
              <span className="text-[9px] sm:text-[10px] font-extrabold tracking-wide text-red-700">LIVE</span>
            </span>
          </div>
        </a>

        <button
          id="hamburger-menu-btn"
          onClick={onOpenDrawer}
          aria-label="Toggle Navigation Drawer"
          className="ml-2 w-11 h-11 sm:w-13 sm:h-13 shrink-0 flex items-center justify-center rounded-xl border border-black/30 bg-white/10 hover:bg-white/25 active:bg-white/35 transition-all cursor-pointer focus:outline-hidden"
        >
          {isDrawerOpen ? (
            <X className="w-7 h-7 text-black" strokeWidth={2.2} />
          ) : (
            <Menu className="w-7 h-7 text-black" strokeWidth={2.2} />
          )}
        </button>
      </div>
    </header>
  );
};

