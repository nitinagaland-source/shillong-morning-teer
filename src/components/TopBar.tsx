import React from 'react';
import { Menu, X } from 'lucide-react';
import { SiteSettings } from '../types';
import logo from '../assets/logo.webp';

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
          className="min-w-0 flex items-center gap-1 text-black no-underline select-none flex-1"
          onClick={(e) => {
            if (window.location.pathname === '/') {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
        >
          <div className="w-11 h-11 shrink-0" aria-hidden="true">
            <img
              src={logo}
              alt="Shillong Morning Teer logo"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="min-w-0 flex items-center gap-1">
            <span
              id="site-title-text"
              className="text-[25px] sm:text-[30px] leading-none text-black whitespace-nowrap mr-[-34px] sm:mr-[-40px]"
              style={{
                fontFamily: '"Arial Narrow", "Roboto Condensed", Arial, sans-serif',
                fontWeight: 800,
                letterSpacing: '-1.2px',
                transform: 'scaleX(0.82)',
                transformOrigin: 'left center'
              }}
            >
              Shillongmorningteer
            </span>

            <span className="inline-flex items-center gap-1 shrink-0" aria-label="Live">
              <span className="relative flex h-3.5 w-3.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-red-600"></span>
              </span>
              <span className="font-black tracking-wide text-red-700 leading-none"><span className="text-[16px] sm:text-[17px]">L</span><span className="text-[13px] sm:text-[14px]">IVE</span></span>
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




