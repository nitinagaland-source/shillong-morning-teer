import React from 'react';
import {
  X,
  Home,
  Hash,
  BookOpen,
  History,
  BarChart3,
  Target,
  Tag,
  Bell,
  HelpCircle,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { SiteSettings } from '../types';

interface NavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
  settings: SiteSettings;
  isAdminLoggedIn?: boolean;
}

export const NavDrawer: React.FC<NavDrawerProps> = ({
  isOpen,
  onClose,
  onNavigate,
  settings,
}) => {
  if (!isOpen) return null;

  const navItems = [
    { label: 'Home (Live Results)', path: '/', icon: Home, badge: 'Live' },
    { label: 'Common Number', path: '/common-number', icon: Hash, badge: 'Daily' },
    { label: 'Dream Number', path: '/dream-number', icon: BookOpen, badge: 'A-Z' },
    { label: 'Previous Results', path: '/previous-results', icon: History, badge: 'Archive' },
    { label: 'Analytics', path: '/analytics', icon: BarChart3, badge: 'Live' },
    { label: 'Predict Target', path: '/predict-target', icon: Target, badge: 'Live' },
    { label: 'Deal', path: '/deal', icon: Tag, badge: 'Deals' },
    { label: 'Notices & Rules', path: '/notices', icon: Bell },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-2xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div
        id="nav-drawer-panel"
        className="relative w-full max-w-xs sm:max-w-sm h-full bg-white text-gray-900 shadow-xl flex flex-col z-10 overflow-y-auto animate-in slide-in-from-right duration-200"
      >
        {/* Top Header of Drawer */}
        <div
          className="p-4 flex items-center justify-between border-b border-slate-900/10"
          style={{ backgroundColor: settings.top_bar_bg_color || '#48c9c0' }}
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full border border-slate-900/40 flex items-center justify-center bg-white shadow-2xs">
              <span className="text-slate-950 font-medium text-xs">ðŸŽ¯</span>
            </div>
            <div>
              <h2 className="text-base font-medium text-slate-950 font-sans leading-tight">
                {settings.site_name || 'Shillongmorningteer'}
              </h2>
              <p className="text-[11px] font-normal text-slate-900/70">Official Mobile Portal</p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close menu"
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-900/20 hover:bg-slate-900/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-slate-950" />
          </button>
        </div>

        {/* Timings Quick Banner */}
        <div className="bg-[#b8e8e3]/60 border-b border-[#48c9c0] p-3 flex items-center gap-2.5 text-xs text-slate-700">
          <Clock className="w-4 h-4 text-[#48c9c0] shrink-0" />
          <div>
            <span className="font-medium text-[#48c9c0]">Game Timings:</span> F/R 10:30 AM | S/R 11:30 AM
          </div>
        </div>

        {/* Nav Links List */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => {
                  onNavigate(item.path);
                  onClose();
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#b8e8e3]/60 active:bg-[#b8e8e3]/70 transition-colors text-left font-normal text-sm text-slate-800 cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#b8e8e3] group-hover:bg-white flex items-center justify-center text-[#48c9c0] group-hover:text-[#48c9c0] border border-[#48c9c0] transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-normal text-slate-900">{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span
                      className={`text-[10px] font-normal px-2 py-0.5 rounded-full ${
                        item.badge === 'Live'
                          ? 'bg-[#b8e8e3] text-[#48c9c0]'
                          : item.badge === 'Daily'
                          ? 'bg-amber-100 text-amber-800'
                          : item.badge === 'Archive'
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-transform group-hover:translate-x-0.5" />
                </div>
              </button>
            );
          })}
        </nav>

        {/* Bottom Disclaimer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50/70 text-xs text-gray-500 space-y-2">
          <div className="flex items-center gap-1.5 text-gray-700 font-normal">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Traditional Archery Records</span>
          </div>
          <p className="text-[11px] leading-relaxed text-gray-600 font-normal">
            Shillong Morning Teer results are collected directly from traditional archery grounds in Meghalaya.
          </p>
        </div>
      </div>
    </div>
  );
};



