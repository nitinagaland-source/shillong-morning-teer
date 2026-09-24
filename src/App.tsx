import React, { useState, useEffect, useCallback } from 'react';
import {
  SiteSettings,
  TeerResult,
  CommonNumberEntry,
  DreamNumberEntry,
  NoticeEntry,
} from './types';
import {
  initialSiteSettings,
  initialTodayResult,
  initialPreviousResults,
  initialCommonNumbers,
  initialDreamNumbers,
  initialNotices,
} from './data/initialData';
import {
  fetchSiteSettings,
  fetchTodayResult,
  fetchPreviousResults,
  fetchCommonNumbers,
  fetchDreamNumbers,
  fetchNotices,
} from './lib/api';
import { TopBar } from './components/TopBar';
import { TodayResultCard } from './components/TodayResultCard';
import { CategoryGrid } from './components/CategoryGrid';
import { NoticesFeed } from './components/NoticesFeed';
import { NavDrawer } from './components/NavDrawer';
import { NoticeDetailModal } from './components/NoticeDetailModal';
import { CommonNumberPage } from './pages/CommonNumberPage';
import { DreamNumberPage } from './pages/DreamNumberPage';
import { PreviousResultsPage } from './pages/PreviousResultsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { PredictTargetPage } from './pages/PredictTargetPage';
import { DealPage } from './pages/DealPage';
import { AdminPanelPage } from './pages/AdminPanelPage';
import { HomeEditorialArticle } from './components/HomeEditorialArticle';
import { Footer } from './components/Footer';
import { InfoModal } from './components/InfoModal';
import { RefreshCw, Radio } from 'lucide-react';
import { getMsUntilNextMidnightIST, getTodayISTDateString } from './lib/dateUtils';

export default function App() {
  // Application Data States
  const [settings, setSettings] = useState<SiteSettings>(initialSiteSettings);
  const [todayResult, setTodayResult] = useState<TeerResult>(initialTodayResult);
  const [previousResults, setPreviousResults] = useState<TeerResult[]>(initialPreviousResults);
  const [commonNumbers, setCommonNumbers] = useState<CommonNumberEntry[]>(initialCommonNumbers);
  const [dreamNumbers, setDreamNumbers] = useState<DreamNumberEntry[]>(initialDreamNumbers);
  const [notices, setNotices] = useState<NoticeEntry[]>(initialNotices);

  // Navigation / View State
  const [currentView, setCurrentView] = useState<
    'home' | 'common-number' | 'dream-number' | 'previous-results' | 'analytics' | 'predict-target' | 'deal' | 'admin' | 'notices'
  >('home');

  // UI Interactive States
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<NoticeEntry | null>(null);
  const [activeInfoModal, setActiveInfoModal] = useState<'about' | 'terms' | 'privacy' | 'contact' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [liveConnected, setLiveConnected] = useState(false);

  // Fetch all data from server
  const loadAllData = useCallback(async () => {
    try {
      const [s, t, p, c, d, n] = await Promise.allSettled([
        fetchSiteSettings(),
        fetchTodayResult(),
        fetchPreviousResults(),
        fetchCommonNumbers(),
        fetchDreamNumbers(),
        fetchNotices(),
      ]);

      if (s.status === 'fulfilled') setSettings(s.value);
      if (t.status === 'fulfilled') { setTodayResult(t.value); setLiveConnected(true); } else { setLiveConnected(false); }
      if (p.status === 'fulfilled') setPreviousResults(p.value);
      if (c.status === 'fulfilled') setCommonNumbers(c.value);
      if (d.status === 'fulfilled') setDreamNumbers(d.value);
      if (n.status === 'fulfilled') setNotices(n.value);
    } catch (err) {
      console.warn('Backend sync failed, continuing with cached seed:', err);
    }
  }, []);

  // Handle URL history routing (e.g. browser back/forward and direct /admin, /common-number)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/admin') setCurrentView('admin');
      else if (path === '/common-number') setCurrentView('common-number');
      else if (path === '/dream-number') setCurrentView('dream-number');
      else if (path === '/previous-results') setCurrentView('previous-results');
      else if (path === '/analytics') setCurrentView('analytics');
      else if (path === '/predict-target') setCurrentView('predict-target');
      else if (path === '/deal') setCurrentView('deal');
      else setCurrentView('home');
    };

    handlePopState();
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    if (path === '/admin') setCurrentView('admin');
    else if (path === '/common-number') setCurrentView('common-number');
    else if (path === '/dream-number') setCurrentView('dream-number');
    else if (path === '/previous-results') setCurrentView('previous-results');
    else if (path === '/analytics') setCurrentView('analytics');
    else if (path === '/predict-target') setCurrentView('predict-target');
    else if (path === '/deal') setCurrentView('deal');
    else setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Keep public pages synced with Firebase-backed admin changes.
  // Polling is the serverless-safe fallback; the storage event makes another open tab refresh immediately after an admin save.
  useEffect(() => {
    loadAllData();
    const interval = window.setInterval(loadAllData, 5 * 60 * 1000);
    const onFocus = () => loadAllData();
    const onStorage = (event: StorageEvent) => {
      if (event.key === 'teer-data-updated') loadAllData();
    };
    window.addEventListener('focus', onFocus);
    window.addEventListener('storage', onStorage);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('storage', onStorage);
    };
  }, [loadAllData]);

  // Reset the visible live result exactly at 12:00 AM IST, then fetch the new day's Firebase state.
  // This prevents yesterday's numbers from remaining on an already-open browser tab.
  useEffect(() => {
    let timer: number | undefined;

    const scheduleMidnightReset = () => {
      timer = window.setTimeout(async () => {
        const date = getTodayISTDateString();
        setTodayResult((prev) => ({
          ...prev,
          id: `today-${date.replace(/\//g, '-')}`,
          date,
          round_1_number: 'X',
          round_2_number: 'X',
          status: 'awaiting',
          updated_at: new Date().toISOString(),
        }));
        await loadAllData();
        scheduleMidnightReset();
      }, getMsUntilNextMidnightIST() + 250);
    };

    scheduleMidnightReset();
    return () => { if (timer) window.clearTimeout(timer); };
  }, [loadAllData]);

  // Handle tile click from CategoryGrid (all 6 tiles are live!)
  const handleCategoryClick = (path: string) => {
    navigateTo(path);
  };

  // 1. Common Number View
  if (currentView === 'common-number') {
    return (
      <CommonNumberPage
        entries={commonNumbers}
        settings={settings}
        onBack={() => navigateTo('/')}
        onNavigate={navigateTo}
      />
    );
  }

  // 2. Dream Number View
  if (currentView === 'dream-number') {
    return (
      <DreamNumberPage
        entries={dreamNumbers}
        settings={settings}
        onBack={() => navigateTo('/')}
        onNavigate={navigateTo}
      />
    );
  }

  // 3. Previous Results View
  if (currentView === 'previous-results') {
    return (
      <PreviousResultsPage
        results={previousResults}
        settings={settings}
        onBack={() => navigateTo('/')}
        onNavigate={navigateTo}
      />
    );
  }

  // 4. Analytics View (LIVE)
  if (currentView === 'analytics') {
    return (
      <AnalyticsPage
        settings={settings}
        results={previousResults}
        onBack={() => navigateTo('/')}
      />
    );
  }

  // 5. Predict Target View (LIVE)
  if (currentView === 'predict-target') {
    return (
      <PredictTargetPage
        settings={settings}
        todayResult={todayResult}
        commonNumbers={commonNumbers}
        onBack={() => navigateTo('/')}
      />
    );
  }

  // 6. Deal View (LIVE)
  if (currentView === 'deal') {
    return (
      <DealPage
        settings={settings}
        onBack={() => navigateTo('/')}
      />
    );
  }

  // 7. Admin Panel View
  if (currentView === 'admin') {
    return (
      <AdminPanelPage
        settings={settings}
        todayResult={todayResult}
        previousResults={previousResults}
        commonNumbers={commonNumbers}
        dreamNumbers={dreamNumbers}
        notices={notices}
        onRefreshAll={loadAllData}
        onBackToHome={() => navigateTo('/')}
      />
    );
  }

  // 5. Default Public Homepage (Exact replica of mobile screenshot)
  return (
    <div className="w-full min-h-screen bg-[#eef9f7] text-gray-900 antialiased selection:bg-[#b8e8e3]">
      {/* Fixed/Sticky Top Bar matching exact reference */}
      <TopBar
        settings={settings}
        onOpenDrawer={() => setIsDrawerOpen(true)}
        isDrawerOpen={isDrawerOpen}
      />

      {/* Main Mobile-First Feed Container */}
      <main className="max-w-[440px] md:max-w-2xl mx-auto px-4 pt-2 pb-5 space-y-6">
        {/* Section 1: Today's Result Table */}
        <TodayResultCard
          result={todayResult}
          settings={settings}
          isLiveUpdating={liveConnected}
        />

        {/* Section 2: All Categories 3x2 Grid */}
        <CategoryGrid onNavigate={handleCategoryClick} />

        {/* Section 3: Notices Feed */}
        <NoticesFeed
          notices={notices}
          onSelectNotice={(notice) => setSelectedNotice(notice)}
          onViewAll={() => setSelectedNotice(notices[0] || null)}
        />

        {/* Section 4: Home Editorial Article & Comprehensive FAQ Guide */}
        <HomeEditorialArticle />
      </main>

      {/* Aesthetic Full-Width Pastel Cyan Footer (Matching Screenshot) */}
      <Footer
        onNavigateHome={() => navigateTo('/')}
        onOpenModal={(type) => setActiveInfoModal(type)}
      />

      {/* Info Modals for About Us, Terms & Conditions, Privacy Policy, Contact Us */}
      <InfoModal
        type={activeInfoModal}
        onClose={() => setActiveInfoModal(null)}
      />

      {/* Slide-in Navigation Drawer */}
      <NavDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onNavigate={navigateTo}
        settings={settings}
        isAdminLoggedIn={false}
      />

      {/* Notice Detail Modal */}
      <NoticeDetailModal
        notice={selectedNotice}
        onClose={() => setSelectedNotice(null)}
      />
    </div>
  );
}








