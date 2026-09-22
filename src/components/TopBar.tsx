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
      className="sticky top-0 z-40 w-full transition-colors duration-200 border-b border-indigo-950/10 shadow-xs"
      style={{ backgroundColor: settings.top_bar_bg_color || '#3b82f6' }}
    >
      <div className="max-w-md mx-auto px-4 h-14 sm:h-16 flex items-center justify-between">
        {/* Left: Archery Target Icon + Site Name with normal/medium font */}
        <a
          href="/"
          id="top-bar-logo-link"
          className="flex items-center gap-2.5 group select-none text-indigo-950 no-underline"
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
              alt={settings.site_name}
              className="w-8 h-8 object-contain"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 100 100" className="w-8 h-8" fill="none">
                <circle cx="50" cy="50" r="44" stroke="#1e293b" strokeWidth="6" fill="#ffffff" />
                <circle cx="50" cy="50" r="30" stroke="#1e293b" strokeWidth="5" fill="#ffffff" />
                <circle cx="50" cy="50" r="16" fill="#1e293b" />
                <path
                  d="M18 18 L48 48"
                  stroke="#1e293b"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                <polygon points="56,44 44,56 46,46" fill="#1e293b" />
                <path
                  d="M12 24 L24 12 M8 16 L16 8 M20 28 L28 20"
                  stroke="#1e293b"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          )}
          <span
            id="site-title-text"
            className="text-[19px] sm:text-[20px] font-medium tracking-tight text-indigo-950 font-sans"
          >
            {settings.site_name || 'Shillongmorningteer'}
          </span>
        </a>

        {/* Right: Hamburger Menu Button */}
        <button
          id="hamburger-menu-btn"
          onClick={onOpenDrawer}
          aria-label="Toggle Navigation Drawer"
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-indigo-950/20 hover:border-indigo-950/40 bg-white/20 active:bg-white/40 transition-all cursor-pointer focus:outline-hidden"
        >
          {isDrawerOpen ? (
            <X className="w-5 h-5 text-indigo-950" />
          ) : (
            <Menu className="w-5 h-5 text-indigo-950" />
          )}
        </button>
      </div>
    </header>
  );
};
