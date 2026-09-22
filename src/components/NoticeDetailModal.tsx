import React from 'react';
import { X, Calendar, Bell, ShieldCheck } from 'lucide-react';
import { NoticeEntry } from '../types';

interface NoticeDetailModalProps {
  notice: NoticeEntry | null;
  onClose: () => void;
}

export const NoticeDetailModal: React.FC<NoticeDetailModalProps> = ({ notice, onClose }) => {
  if (!notice) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-5 border border-gray-200 z-10 max-h-[85vh] flex flex-col animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200/60">
                Official Notice
              </span>
              <p className="text-xs text-gray-500 font-medium flex items-center gap-1 mt-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{notice.date}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-4 overflow-y-auto space-y-3">
          <h2 className="text-lg sm:text-xl font-black text-indigo-950 font-sans leading-snug">
            {notice.title}
          </h2>
          <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line bg-indigo-50/30 p-3.5 rounded-xl border border-indigo-100">
            {notice.body}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t border-gray-100">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span>Verified by Shillong Morning Teer Administrator</span>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-colors cursor-pointer shadow-xs"
          >
            Close Notice
          </button>
        </div>
      </div>
    </div>
  );
};
