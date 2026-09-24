import React from 'react';
import { NoticeEntry } from '../types';
import { ChevronRight } from 'lucide-react';

interface NoticesFeedProps {
  notices: NoticeEntry[];
  onSelectNotice: (notice: NoticeEntry) => void;
  onViewAll: () => void;
}

export const NoticesFeed: React.FC<NoticesFeedProps> = ({
  notices,
  onSelectNotice,
  onViewAll,
}) => {
  return (
    <section id="notices-feed-section" className="w-full">
      {/* Header: Title on Left, View all on Right */}
      <div className="flex items-center justify-between mb-3">
        <h2
          id="notices-heading"
          className="text-lg sm:text-xl font-medium tracking-tight text-gray-900 font-sans"
        >
          Notices
        </h2>
        <button
          id="notices-view-all-btn"
          onClick={onViewAll}
          className="text-sm font-normal text-blue-600 hover:text-blue-800 cursor-pointer hover:underline flex items-center gap-1 focus:outline-hidden"
        >
          View all
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Notice Cards List */}
      <div className="space-y-3">
        {notices.slice(0, 3).map((notice) => (
          <article
            key={notice.id}
            id={`notice-item-${notice.id}`}
            onClick={() => onSelectNotice(notice)}
            className="w-full bg-white rounded-xl p-4 border border-gray-200 hover:border-blue-300 transition-all cursor-pointer shadow-2xs hover:shadow-xs active:bg-gray-50/80 group"
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm sm:text-base font-medium text-gray-900 group-hover:text-blue-600 transition-colors leading-snug">
                {notice.title}
              </h3>
              {notice.priority === 'high' && (
                <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-normal uppercase bg-red-50 text-red-600 border border-red-200 tracking-wide">
                  New
                </span>
              )}
            </div>

            <p className="text-xs text-gray-400 font-normal mt-1 mb-2">
              {notice.date}
            </p>

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-2 font-normal">
              {notice.body}
            </p>

            <div className="mt-2.5 flex items-center gap-1 text-xs font-normal text-blue-600">
              <span>Read notice</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </article>
        ))}

        {notices.length === 0 && (
          <div className="p-6 text-center text-sm text-gray-500 bg-white rounded-xl border border-gray-200 font-normal">
            No notices published today.
          </div>
        )}
      </div>
    </section>
  );
};


