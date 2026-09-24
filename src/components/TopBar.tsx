import React from 'react';
import { Menu, X } from 'lucide-react';
import { SiteSettings } from '../types';

interface TopBarProps {
  settings: SiteSettings;
  onOpenDrawer: () => void;
  isDrawerOpen?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenDrawer, isDrawerOpen }) => {
  return (
    <header
      id="top-bar-header"
      className="sticky top-0 z-40 w-full border-b border-black/10 shadow-xs"
      style={{ backgroundColor: '#b8e1ec' }}
    >
      <div className="max-w-md mx-auto px-3 h-[72px] sm:h-[78px] flex items-center justify-between gap-2">

        <a
          href="/"
          id="top-bar-logo-link"
          className="min-w-0 flex items-center text-black no-underline select-none"
          onClick={(e) => {
            if (window.location.pathname === '/') {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
        >
          <div className="w-11 h-11 shrink-0 mr-1" aria-hidden="true">
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="43" cy="58" r="31" fill="none" stroke="#050505" strokeWidth="9" />
              <circle cx="43" cy="58" r="20" fill="none" stroke="#050505" strokeWidth="8" />
              <circle cx="43" cy="58" r="8" fill="#050505" />

              <path
                d="M43 58 L75 26"
                stroke="#050505"
                strokeWidth="8"
                strokeLinecap="round"
              />

              <path
                d="M69 19 L88 15 L84 34 L76 26 Z"
                fill="#050505"
              />

              <path
                d="M74 29 L87 42"
                stroke="#050505"
                strokeWidth="7"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="min-w-0 flex items-center">
            <span
              id="site-title-text"
              className="whitespace-nowrap text-[22px] sm:text-[27px] leading-none text-black"
              style={{
                fontFamily: 'Impact, Haettenschweiler, "Arial Narrow Bold", "Arial Narrow", sans-serif',
                fontWeight: 900,
                letterSpacing: '-0.7px'
              }}
            >
              Shillongmorningteer
            </span>

            <span
              className="ml-1 inline-flex items-center gap-1 shrink-0"
              aria-label="Live"
            >
              <span className="relative flex h-3.5 w-3.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-red-600"></span>
              </span>

              <span className="text-[13px] sm:text-[14px] font-black leading-none text-red-700">
                LIVE
              </span>
            </span>
          </div>
        </a>

        <button
          id="hamburger-menu-btn"
          onClick={onOpenDrawer}
          aria-label="Toggle Navigation Drawer"
          className="ml-auto w-11 h-11 sm:w-13 sm:h-13 shrink-0 flex items-center justify-center rounded-xl border border-black/30 bg-white/10 hover:bg-white/25 active:bg-white/35 transition-all cursor-pointer focus:outline-hidden"
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

