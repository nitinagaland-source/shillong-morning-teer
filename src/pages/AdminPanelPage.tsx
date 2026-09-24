import React, { useState, useEffect } from 'react';
import {
  SiteSettings,
  TeerResult,
  CommonNumberEntry,
  DreamNumberEntry,
  NoticeEntry,
} from '../types';
import {
  adminLogin,
  updateSiteSettings,
  updateTodayResult,
  createPreviousResult,
  deletePreviousResult,
  createCommonNumber,
  deleteCommonNumber,
  createDreamNumber,
  updateDreamNumber,
  deleteDreamNumber,
  createNotice,
  deleteNotice,
  checkAdminSession,
  adminLogout,
} from '../lib/api';
import {
  Shield,
  Lock,
  LogOut,
  Palette,
  Target,
  Hash,
  BookOpen,
  History,
  Bell,
  Check,
  AlertCircle,
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  Eye,
  EyeOff,
  ArrowLeft,
} from 'lucide-react';

interface AdminPanelPageProps {
  settings: SiteSettings;
  todayResult: TeerResult;
  previousResults: TeerResult[];
  commonNumbers: CommonNumberEntry[];
  dreamNumbers: DreamNumberEntry[];
  notices: NoticeEntry[];
  onRefreshAll: () => Promise<void>;
  onBackToHome: () => void;
}

export const AdminPanelPage: React.FC<AdminPanelPageProps> = ({
  settings,
  todayResult,
  previousResults,
  commonNumbers,
  dreamNumbers,
  notices,
  onRefreshAll,
  onBackToHome,
}) => {
  // Session State
  const [token, setToken] = useState<string>('');
  const [authChecking, setAuthChecking] = useState(true);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'branding' | 'today' | 'common' | 'dream' | 'previous' | 'notices'
  >('today');

  // Status Feedback
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showStatus = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 5000);
  };

  const notifyPublicUpdate = () => {
    try {
      localStorage.setItem('teer-data-updated', String(Date.now()));
    } catch {
      // localStorage can be unavailable in strict/private browser contexts.
    }
  };

  const adminNavItems = [
    { id: 'today', label: "Today's Result", icon: Target },
    { id: 'branding', label: 'General / Branding', icon: Palette },
    { id: 'common', label: 'Common Numbers', icon: Hash },
    { id: 'dream', label: 'Dream Numbers', icon: BookOpen },
    { id: 'previous', label: 'Previous Results', icon: History },
    { id: 'notices', label: 'Notices', icon: Bell },
  ] as const;

  // 1. Branding Form State
  const [siteName, setSiteName] = useState(settings.site_name);
  const [gameName, setGameName] = useState(settings.game_name);
  const [topBarBgColor, setTopBarBgColor] = useState(settings.top_bar_bg_color || '#96d8ea');
  const [logoUrl, setLogoUrl] = useState(settings.logo_url || '');

  // 2. Today's Result Form State
  const [todayDate, setTodayDate] = useState(todayResult.date);
  const [frLabel, setFrLabel] = useState(todayResult.round_1_label);
  const [frTime, setFrTime] = useState(todayResult.round_1_time);
  const [frNumber, setFrNumber] = useState(todayResult.round_1_number);
  const [srLabel, setSrLabel] = useState(todayResult.round_2_label);
  const [srTime, setSrTime] = useState(todayResult.round_2_time);
  const [srNumber, setSrNumber] = useState(todayResult.round_2_number);

  // 3. Common Number Form State
  const [cnDate, setCnDate] = useState(todayResult.date);
  const [cnCategory, setCnCategory] = useState<'Direct' | 'House' | 'Ending' | 'Special Target'>('Direct');
  const [cnNumbersInput, setCnNumbersInput] = useState('');
  const [cnNotes, setCnNotes] = useState('');

  // 4. Dream Number Form State
  const [dnKeyword, setDnKeyword] = useState('');
  const [dnNumber, setDnNumber] = useState('');
  const [dnDesc, setDnDesc] = useState('');
  const [dnSearch, setDnSearch] = useState('');
  const [editingDnId, setEditingDnId] = useState<string | null>(null);
  const [dailyDreamDate, setDailyDreamDate] = useState('');
  const [dailyDreamSymbol, setDailyDreamSymbol] = useState('');
  const [dailyDreamDirect, setDailyDreamDirect] = useState('');
  const [dailyDreamHouse, setDailyDreamHouse] = useState('');
  const [dailyDreamEnding, setDailyDreamEnding] = useState('');

  // 5. Past Result Form State
  const [newPastDate, setNewPastDate] = useState('');
  const [newPastFr, setNewPastFr] = useState('');
  const [newPastSr, setNewPastSr] = useState('');

  // 6. Notices Form State
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeBody, setNoticeBody] = useState('');
  const [noticePriority, setNoticePriority] = useState<'normal' | 'high'>('normal');

  // 7. Security Form State
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  // Keep state updated when props change
  useEffect(() => {
    setSiteName(settings.site_name);
    setGameName(settings.game_name);
    setTopBarBgColor(settings.top_bar_bg_color || '#96d8ea');
    setLogoUrl(settings.logo_url || '');
  }, [settings]);

  useEffect(() => {
    setTodayDate(todayResult.date);
    setFrLabel(todayResult.round_1_label);
    setFrTime(todayResult.round_1_time);
    setFrNumber(todayResult.round_1_number);
    setSrLabel(todayResult.round_2_label);
    setSrTime(todayResult.round_2_time);
    setSrNumber(todayResult.round_2_number);
    setCnDate(todayResult.date);
  }, [todayResult]);

  useEffect(() => {
    let mounted = true;
    checkAdminSession()
      .then((ok) => { if (mounted && ok) setToken('http-only-cookie'); })
      .finally(() => { if (mounted) setAuthChecking(false); });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!token) return;
    fetch('/api/dream-numbers/daily')
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (!data) return;
        setDailyDreamDate(data.date || '');
        setDailyDreamSymbol(data.symbol || '');
        setDailyDreamDirect(Array.isArray(data.direct_numbers) ? data.direct_numbers.join(', ') : '');
        setDailyDreamHouse(data.house_number || '');
        setDailyDreamEnding(data.ending_number || '');
      })
      .catch(() => undefined);
  }, [token]);

  // Auth Handlers
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      const session = await adminLogin(adminEmail, adminPassword);
      setToken(session.token);
      showStatus('Admin authenticated successfully');
    } catch (err: any) {
      setLoginError(err.message || 'Login failed');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try { await adminLogout(); } catch { /* cookie may already be expired */ }
    setToken('');
    showStatus('Logged out securely');
  };

  // 1. Branding Save
  const handleSaveBranding = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSiteSettings(
        {
          site_name: siteName,
          game_name: gameName,
          top_bar_bg_color: topBarBgColor,
          logo_url: logoUrl,
        },
        token
      );
      await onRefreshAll();
      notifyPublicUpdate();
      showStatus('Site branding updated successfully');
    } catch (err: any) {
      showStatus(err.message, 'error');
    }
  };

  // 2. Today Result Save
  const handlePublishTodayResult = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateTodayResult(
        {
          date: todayDate,
          round_1_label: frLabel,
          round_1_time: frTime,
          round_1_number: frNumber,
          round_2_label: srLabel,
          round_2_time: srTime,
          round_2_number: srNumber,
        },
        token
      );
      await onRefreshAll();
      notifyPublicUpdate();
      showStatus('F/R and S/R updated successfully');
    } catch (err: any) {
      showStatus(err.message, 'error');
    }
  };

  // 3. Common Numbers Add/Delete
  const handleAddCommonNumber = async (e: React.FormEvent) => {
    e.preventDefault();
    const numbers = cnNumbersInput
      .split(/[,;\s]+/)
      .map((s) => s.trim())
      .filter(Boolean);

    if (numbers.length === 0) {
      showStatus('Please provide at least one number', 'error');
      return;
    }

    try {
      await createCommonNumber(
        {
          date: cnDate,
          category_label: cnCategory,
          numbers,
          notes: cnNotes,
        },
        token
      );
      setCnNumbersInput('');
      setCnNotes('');
      await onRefreshAll();
      notifyPublicUpdate();
      showStatus('Common numbers updated successfully');
    } catch (err: any) {
      showStatus(err.message, 'error');
    }
  };

  const handleDeleteCommonNumber = async (id: string) => {
    if (!confirm('Are you sure you want to delete this common number entry?')) return;
    try {
      await deleteCommonNumber(id, token);
      await onRefreshAll();
      notifyPublicUpdate();
      showStatus('Common number entry removed successfully');
    } catch (err: any) {
      showStatus(err.message, 'error');
    }
  };

  // 4. Daily Dream + Dream Dictionary
  const handleSaveDailyDream = async (e: React.FormEvent) => {
    e.preventDefault();
    const directNumbers = dailyDreamDirect.split(/[,;\s]+/).map((v) => v.trim()).filter(Boolean);
    if (!directNumbers.length) { showStatus('Add at least one daily dream number', 'error'); return; }
    try {
      const res = await fetch('/api/dream-numbers/daily', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol: dailyDreamSymbol,
          direct_numbers: directNumbers,
          house_number: dailyDreamHouse,
          ending_number: dailyDreamEnding,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to update daily dream numbers');
      await onRefreshAll();
      notifyPublicUpdate();
      showStatus("Today's dream numbers updated successfully");
    } catch (err: any) {
      showStatus(err.message, 'error');
    }
  };

  const handleSaveDreamNumber = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dnKeyword.trim() || !dnNumber.trim()) {
      showStatus('Keyword and numbers are required', 'error');
      return;
    }

    try {
      if (editingDnId) {
        await updateDreamNumber(
          editingDnId,
          { keyword: dnKeyword, number: dnNumber, description: dnDesc },
          token
        );
        showStatus('Dream number entry updated');
      } else {
        await createDreamNumber(
          { keyword: dnKeyword, number: dnNumber, description: dnDesc },
          token
        );
        showStatus('New dream number interpretation added');
      }
      setEditingDnId(null);
      setDnKeyword('');
      setDnNumber('');
      setDnDesc('');
      await onRefreshAll();
      notifyPublicUpdate();
    } catch (err: any) {
      showStatus(err.message, 'error');
    }
  };

  const handleDeleteDreamNumber = async (id: string) => {
    if (!confirm('Delete this dream interpretation entry?')) return;
    try {
      await deleteDreamNumber(id, token);
      await onRefreshAll();
      notifyPublicUpdate();
      showStatus('Dream number entry deleted');
    } catch (err: any) {
      showStatus(err.message, 'error');
    }
  };

  // 5. Past Results Add/Delete
  const handleAddPastResult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPastDate) {
      showStatus('Date is required (e.g. DD/MM/YYYY)', 'error');
      return;
    }
    try {
      await createPreviousResult(
        {
          date: newPastDate,
          round_1_label: 'F/R(10:30 AM)',
          round_1_time: '10:30 AM',
          round_1_number: newPastFr,
          round_2_label: 'S/R(11:30 AM)',
          round_2_time: '11:30 AM',
          round_2_number: newPastSr,
        },
        token
      );
      setNewPastDate('');
      setNewPastFr('');
      setNewPastSr('');
      await onRefreshAll();
      notifyPublicUpdate();
      showStatus('Historical archery record saved');
    } catch (err: any) {
      showStatus(err.message, 'error');
    }
  };

  const handleDeletePastResult = async (id: string) => {
    if (!confirm('Delete this historical result record?')) return;
    try {
      await deletePreviousResult(id, token);
      await onRefreshAll();
      notifyPublicUpdate();
      showStatus('Result record deleted');
    } catch (err: any) {
      showStatus(err.message, 'error');
    }
  };

  // 6. Notices CRUD
  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeBody.trim()) {
      showStatus('Title and notice content are required', 'error');
      return;
    }
    try {
      await createNotice(
        {
          title: noticeTitle,
          body: noticeBody,
          priority: noticePriority,
          date: new Date().toLocaleDateString('en-GB'),
        },
        token
      );
      setNoticeTitle('');
      setNoticeBody('');
      await onRefreshAll();
      notifyPublicUpdate();
      showStatus('Notice published');
    } catch (err: any) {
      showStatus(err.message, 'error');
    }
  };

  const handleDeleteNotice = async (id: string) => {
    if (!confirm('Delete this notice?')) return;
    try {
      await deleteNotice(id, token);
      await onRefreshAll();
      notifyPublicUpdate();
      showStatus('Notice removed');
    } catch (err: any) {
      showStatus(err.message, 'error');
    }
  };

  // 7. Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPw !== confirmPw) {
      showStatus('New passwords do not match', 'error');
      return;
    }
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update password');
      setCurrentPw('');
      setNewPw('');
      setConfirmPw('');
      setToken('');
      showStatus('Password changed. Please sign in again.');
    } catch (err: any) {
      showStatus(err.message, 'error');
    }
  };

  if (authChecking) {
    return (
      <div className="w-full min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-gray-600"><RefreshCw className="w-4 h-4 animate-spin" /> Checking admin sessionâ€¦</div>
      </div>
    );
  }

  // If not logged in, render the login gate
  if (!token) {
    return (
      <div className="w-full min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div
            className="p-5 text-center border-b border-indigo-950/10"
            style={{ backgroundColor: settings.top_bar_bg_color || '#48c9c0' }}
          >
            <div className="w-12 h-12 bg-white rounded-full mx-auto flex items-center justify-center border-2 border-indigo-950 mb-2 shadow-xs">
              <Shield className="w-6 h-6 text-indigo-950" />
            </div>
            <h1 className="text-xl font-medium text-indigo-950 font-sans">
              Admin Authentication
            </h1>
            <p className="text-xs font-semibold text-indigo-900">
              Shillong Morning Teer Content Management
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="p-6 space-y-4">
            {loginError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs font-bold text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Admin Email / Username
              </label>
              <input
                type="text"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Security Password
              </label>
              <div className="relative">
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                  className="w-full px-3.5 py-2.5 pr-11 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword((v) => !v)}
                  aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                  title={showLoginPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-gray-500 hover:text-gray-900 cursor-pointer"
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 bg-gray-950 hover:bg-black text-white font-medium text-sm rounded-xl transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2"
            >
              {loginLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Authenticate to Admin</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onBackToHome}
              className="w-full text-center text-xs font-bold text-gray-500 hover:text-gray-900 cursor-pointer pt-2"
            >
              Back to Public Live Site
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Logged In Admin Dashboard
  return (
    <div className="w-full min-h-screen bg-gray-100 pb-12">
      {/* Compact top bar */}
      <header className="sticky top-0 z-40 bg-gray-900 text-white border-b border-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={onBackToHome}
              title="Return to Public Site"
              className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-300 hover:text-white cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <Shield className="w-5 h-5 text-indigo-400" />
            <span className="font-medium text-sm sm:text-base tracking-tight font-sans">Admin Manager</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onRefreshAll()}
              title="Refresh Data"
              className="px-2.5 py-1.5 bg-gray-800 hover:bg-gray-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer text-gray-200"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={handleLogout}
              className="px-2.5 py-1.5 bg-red-600/80 hover:bg-red-600 text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer text-white"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Fixed success/error toast so feedback is always visible */}
      {statusMessage && (
        <div className="fixed top-16 right-4 z-[70] w-[calc(100%-2rem)] max-w-sm">
          <div
            className={`p-4 rounded-xl border shadow-xl flex items-center justify-between gap-3 text-sm font-semibold ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-red-50 border-red-300 text-red-900'
            }`}
          >
            <div className="flex items-center gap-2">
              {statusMessage.type === 'success' ? (
                <Check className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
            <button onClick={() => setStatusMessage(null)} className="text-gray-500 hover:text-gray-900 text-xl leading-none">Ã—</button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 flex flex-col md:flex-row gap-4 items-start">
        {/* Left admin sidebar */}
        <aside className="sticky top-[72px] w-56 shrink-0 bg-gray-950 text-white rounded-2xl border border-gray-800 shadow-sm overflow-hidden hidden md:block">
          <div className="px-4 py-3 border-b border-gray-800">
            <p className="text-[11px] uppercase tracking-widest text-gray-500 font-bold">General</p>
          </div>
          <nav className="p-2 space-y-1">
            {adminNavItems.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer text-left ${
                    isActive ? 'bg-[#48c9c0] text-white' : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Mobile selector keeps the admin usable on phones */}
        <div className="md:hidden w-full mb-1">
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value as any)}
            className="w-full bg-gray-950 text-white border border-gray-800 rounded-xl px-3 py-3 text-sm font-semibold"
          >
            {adminNavItems.map((tab) => <option key={tab.id} value={tab.id}>{tab.label}</option>)}
          </select>
        </div>

        {/* Main Workspace */}
        <main className="flex-1 min-w-0 space-y-4">
        {/* TAB 1: TODAY'S RESULT */}
        {activeTab === 'today' && (
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-medium text-gray-900 font-sans">
                  Publish Today&apos;s Live Archery Results
                </h2>
                <p className="text-xs text-gray-500">
                  Updates are saved to Firebase and reflected on the public website automatically.
                </p>
              </div>
              <span className="px-2.5 py-1 bg-[#b8e8e3] text-indigo-800 rounded-full text-xs font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#48c9c0] animate-pulse"></span>
                Live Feed
              </span>
            </div>

            <form onSubmit={handlePublishTodayResult} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Result Date (e.g. DD/MM/YYYY)
                </label>
                <input
                  type="text"
                  required
                  readOnly
                  value={todayDate}
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-xl text-sm font-semibold text-gray-600"
                />
                <p className="mt-1 text-[11px] text-gray-500">The current IST date is controlled by the server and resets automatically at midnight.</p>
              </div>

              {/* F/R Configuration */}
              <div className="bg-[#b8e8e3]/60 p-4 rounded-xl border border-indigo-200 space-y-3">
                <span className="text-xs font-medium uppercase text-indigo-900 tracking-wider">
                  First Round (F/R)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">Label</label>
                    <input
                      type="text"
                      value={frLabel}
                      onChange={(e) => setFrLabel(e.target.value)}
                      placeholder="F/R(10:30 AM)"
                      className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">Time</label>
                    <input
                      type="text"
                      value={frTime}
                      onChange={(e) => setFrTime(e.target.value)}
                      placeholder="10:30 AM"
                      className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-indigo-950 mb-1">
                      F/R Number (Live Result)
                    </label>
                    <input
                      type="text"
                      maxLength={2}
                      value={frNumber}
                      onChange={(e) => setFrNumber(e.target.value)}
                      placeholder="76"
                      className="w-full px-3 py-1.5 bg-white border-2 border-indigo-500 rounded-lg text-lg font-medium text-center tabular-nums"
                    />
                  </div>
                </div>
              </div>

              {/* S/R Configuration */}
              <div className="bg-[#b8e8e3]/60 p-4 rounded-xl border border-indigo-200 space-y-3">
                <span className="text-xs font-medium uppercase text-indigo-900 tracking-wider">
                  Second Round (S/R)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">Label</label>
                    <input
                      type="text"
                      value={srLabel}
                      onChange={(e) => setSrLabel(e.target.value)}
                      placeholder="S/R(11:30 AM)"
                      className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">Time</label>
                    <input
                      type="text"
                      value={srTime}
                      onChange={(e) => setSrTime(e.target.value)}
                      placeholder="11:30 AM"
                      className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-indigo-950 mb-1">
                      S/R Number (Live Result)
                    </label>
                    <input
                      type="text"
                      maxLength={2}
                      value={srNumber}
                      onChange={(e) => setSrNumber(e.target.value)}
                      placeholder="44"
                      className="w-full px-3 py-1.5 bg-white border-2 border-indigo-500 rounded-lg text-lg font-medium text-center tabular-nums"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#48c9c0] hover:bg-[#48c9c0] text-white font-medium text-sm rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                <span>Publish Numbers Live to Public</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: SITE BRANDING */}
        {activeTab === 'branding' && (
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-4">
            <div className="pb-3 border-b border-gray-100">
              <h2 className="text-lg font-medium text-gray-900 font-sans">
                Site Branding & Appearance
              </h2>
              <p className="text-xs text-gray-500">
                Customizes top bar header color, site title, game header and logo.
              </p>
            </div>

            <form onSubmit={handleSaveBranding} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Site Name (Top Bar text)
                  </label>
                  <input
                    type="text"
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    placeholder="Shillongmorningteer"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Game Name (Table Header)
                  </label>
                  <input
                    type="text"
                    value={gameName}
                    onChange={(e) => setGameName(e.target.value)}
                    placeholder="SHILLONG MORNING TEER"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold uppercase"
                  />
                </div>
              </div>

              {/* Color Picker with presets */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Top Bar Background Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={topBarBgColor}
                    onChange={(e) => setTopBarBgColor(e.target.value)}
                    className="w-12 h-10 rounded-lg border border-gray-300 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={topBarBgColor}
                    onChange={(e) => setTopBarBgColor(e.target.value)}
                    className="w-32 px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-mono font-bold"
                  />
                  {/* Presets */}
                  <div className="flex items-center gap-1.5">
                    {[
                      { name: 'Original Light Teal', color: '#96d8ea' },
                      { name: 'Emerald Mint', color: '#6ee7b7' },
                      { name: 'Sky Cerulean', color: '#7dd3fc' },
                      { name: 'Clean White', color: '#ffffff' },
                      { name: 'Sunset Amber', color: '#fde68a' },
                    ].map((preset) => (
                      <button
                        key={preset.color}
                        type="button"
                        onClick={() => setTopBarBgColor(preset.color)}
                        title={preset.name}
                        className="w-7 h-7 rounded-full border border-gray-300 shadow-2xs hover:scale-110 transition-transform cursor-pointer"
                        style={{ backgroundColor: preset.color }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Live Preview Box */}
              <div className="p-3 rounded-xl border border-gray-200 bg-gray-50">
                <span className="text-[11px] font-bold text-gray-500 uppercase block mb-1.5">
                  Live Top Bar Preview
                </span>
                <div
                  className="w-full h-12 rounded-lg px-4 flex items-center justify-between border border-black/10 shadow-xs"
                  style={{ backgroundColor: topBarBgColor }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">ðŸŽ¯</span>
                    <span className="font-medium text-indigo-950 font-sans text-base">
                      {siteName || 'Shillongmorningteer'}
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded border border-indigo-950/30 flex items-center justify-center bg-white/20">
                    <span className="text-xs font-medium">â‰¡</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Custom Logo Image URL (Optional)
                </label>
                <input
                  type="url"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="https://example.com/logo.png"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm"
                />
                <p className="text-[11px] text-gray-500 mt-1">
                  Leave blank to use the high-fidelity SVG archery bullseye logo.
                </p>
              </div>

              <button
                type="submit"
                className="py-2.5 px-5 bg-gray-900 hover:bg-black text-white font-bold text-sm rounded-xl cursor-pointer shadow-xs"
              >
                Save Site Branding
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: COMMON NUMBERS */}
        {activeTab === 'common' && (
          <div className="space-y-4">
            {/* Add New Form */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-4">
              <h2 className="text-lg font-medium text-gray-900 font-sans">
                Add Daily Common Numbers
              </h2>

              <form onSubmit={handleAddCommonNumber} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Date</label>
                    <input
                      type="text"
                      value={cnDate}
                      onChange={(e) => setCnDate(e.target.value)}
                      placeholder="18/09/2026"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Category Type
                    </label>
                    <select
                      value={cnCategory}
                      onChange={(e) => setCnCategory(e.target.value as any)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold"
                    >
                      <option value="Direct">Direct Numbers</option>
                      <option value="House">House</option>
                      <option value="Ending">Ending</option>
                      <option value="Special Target">Special Target</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Numbers (comma or space separated)
                  </label>
                  <input
                    type="text"
                    required
                    value={cnNumbersInput}
                    onChange={(e) => setCnNumbersInput(e.target.value)}
                    placeholder="e.g. 76, 44, 21, 89"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Calculation Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={cnNotes}
                    onChange={(e) => setCnNotes(e.target.value)}
                    placeholder="e.g. Morning club arrow ratio"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="py-2.5 px-4 bg-[#48c9c0] hover:bg-[#48c9c0] text-white font-bold text-sm rounded-xl cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Common Numbers</span>
                </button>
              </form>
            </div>

            {/* List of Existing Entries */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-3">
              <h3 className="font-medium text-gray-900 text-sm">
                Existing Common Number Records ({commonNumbers.length})
              </h3>
              <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                {commonNumbers.map((entry) => (
                  <div key={entry.id} className="py-2.5 flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-gray-100 text-gray-800">
                          {entry.date}
                        </span>
                        <span className="text-xs font-medium text-rose-700 uppercase">
                          {entry.category_label}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {entry.numbers.map((n, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-gray-50 border border-gray-200 rounded text-xs font-medium"
                          >
                            {n}
                          </span>
                        ))}
                      </div>
                      {entry.notes && (
                        <p className="text-[11px] text-gray-500 mt-1">{entry.notes}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteCommonNumber(entry.id)}
                      title="Delete"
                      className="text-gray-400 hover:text-red-600 p-1.5 rounded cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: DREAM NUMBERS */}
        {activeTab === 'dream' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-4">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Today's Daily Dream Pick</h2>
                <p className="text-xs text-gray-500">A random set is created automatically at 12:00 AM IST. You can override today's stored values here.</p>
              </div>
              <form onSubmit={handleSaveDailyDream} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Date</label>
                    <input value={dailyDreamDate} readOnly className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-xl text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Symbol / Label</label>
                    <input value={dailyDreamSymbol} onChange={(e) => setDailyDreamSymbol(e.target.value)} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Direct Numbers</label>
                    <input value={dailyDreamDirect} onChange={(e) => setDailyDreamDirect(e.target.value)} placeholder="04, 27, 63, 91" className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">House</label>
                    <input value={dailyDreamHouse} onChange={(e) => setDailyDreamHouse(e.target.value)} maxLength={2} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Ending</label>
                    <input value={dailyDreamEnding} onChange={(e) => setDailyDreamEnding(e.target.value)} maxLength={2} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm" />
                  </div>
                </div>
                <button type="submit" className="py-2.5 px-5 bg-[#48c9c0] hover:bg-[#48c9c0] text-white font-bold text-sm rounded-xl cursor-pointer">Save Today's Dream Pick</button>
              </form>
            </div>

            {/* Add / Edit Form */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900 font-sans">
                  {editingDnId ? 'Edit Dream Number Entry' : 'Add Dream Symbol Interpretation'}
                </h2>
                {editingDnId && (
                  <button
                    onClick={() => {
                      setEditingDnId(null);
                      setDnKeyword('');
                      setDnNumber('');
                      setDnDesc('');
                    }}
                    className="text-xs font-bold text-gray-500 hover:text-gray-800"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              <form onSubmit={handleSaveDreamNumber} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Dream Keyword / Symbol
                    </label>
                    <input
                      type="text"
                      required
                      value={dnKeyword}
                      onChange={(e) => setDnKeyword(e.target.value)}
                      placeholder="e.g. Water / Snake / Flying"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Target Number(s)
                    </label>
                    <input
                      type="text"
                      required
                      value={dnNumber}
                      onChange={(e) => setDnNumber(e.target.value)}
                      placeholder="e.g. 04, 07, 70"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm font-mono font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Interpretation Details / Description
                  </label>
                  <textarea
                    rows={2}
                    value={dnDesc}
                    onChange={(e) => setDnDesc(e.target.value)}
                    placeholder="e.g. Seeing river flow or drinking fresh water..."
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="py-2.5 px-5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm rounded-xl cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingDnId ? 'Update Interpretation' : 'Save Dream Interpretation'}</span>
                </button>
              </form>
            </div>

            {/* Existing Dictionary List */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900 text-sm">
                  Dream Interpretations ({dreamNumbers.length})
                </h3>
                <input
                  type="text"
                  value={dnSearch}
                  onChange={(e) => setDnSearch(e.target.value)}
                  placeholder="Filter dictionary..."
                  className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-lg text-xs"
                />
              </div>

              <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                {dreamNumbers
                  .filter(
                    (d) =>
                      !dnSearch ||
                      d.keyword.toLowerCase().includes(dnSearch.toLowerCase()) ||
                      d.number.includes(dnSearch)
                  )
                  .map((item) => (
                    <div key={item.id} className="py-2.5 flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-900 font-sans">
                            {item.keyword}
                          </span>
                          <span className="text-xs font-mono font-bold bg-sky-50 text-sky-800 px-2 py-0.5 rounded border border-sky-200">
                            {item.number}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-1">{item.description}</p>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingDnId(item.id);
                            setDnKeyword(item.keyword);
                            setDnNumber(item.number);
                            setDnDesc(item.description);
                            window.scrollTo({ top: 120, behavior: 'smooth' });
                          }}
                          className="p-1.5 text-gray-400 hover:text-sky-600 rounded cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteDreamNumber(item.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 rounded cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: PREVIOUS RESULTS */}
        {activeTab === 'previous' && (
          <div className="space-y-4">
            {/* Add Past Record */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-3">
              <h2 className="text-lg font-medium text-gray-900 font-sans">
                Add Archived Day Result
              </h2>
              <form onSubmit={handleAddPastResult} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Date</label>
                  <input
                    type="text"
                    required
                    value={newPastDate}
                    onChange={(e) => setNewPastDate(e.target.value)}
                    placeholder="19/09/2026"
                    className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">F/R Number</label>
                  <input
                    type="text"
                    maxLength={2}
                    value={newPastFr}
                    onChange={(e) => setNewPastFr(e.target.value)}
                    placeholder="76"
                    className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-medium text-center"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">S/R Number</label>
                  <input
                    type="text"
                    maxLength={2}
                    value={newPastSr}
                    onChange={(e) => setNewPastSr(e.target.value)}
                    placeholder="44"
                    className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-medium text-center"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full py-2 px-3 bg-[#48c9c0] hover:bg-[#48c9c0] text-white font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Save Record
                  </button>
                </div>
              </form>
            </div>

            {/* Past Records Table */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-3">
              <h3 className="font-medium text-gray-900 text-sm">
                Archived Result History ({previousResults.length} records)
              </h3>
              <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                {previousResults.map((r) => (
                  <div key={r.id} className="py-2.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-mono font-bold text-gray-900 w-24">
                        {r.date}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 font-medium">F/R:</span>
                        <span className="text-sm font-medium text-slate-900 font-sans">{r.round_1_number || '--'}</span>
                        <span className="text-gray-300">|</span>
                        <span className="text-xs text-gray-500 font-medium">S/R:</span>
                        <span className="text-sm font-medium text-slate-900 font-sans">{r.round_2_number || '--'}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeletePastResult(r.id)}
                      className="text-gray-400 hover:text-red-600 p-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: NOTICES */}
        {activeTab === 'notices' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-3">
              <h2 className="text-lg font-medium text-gray-900 font-sans">
                Post New Announcement / Notice
              </h2>
              <form onSubmit={handleCreateNotice} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Notice Headline
                  </label>
                  <input
                    type="text"
                    required
                    value={noticeTitle}
                    onChange={(e) => setNoticeTitle(e.target.value)}
                    placeholder="e.g. Archery Grounds Holiday Schedule"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Full Notice Body Text
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={noticeBody}
                    onChange={(e) => setNoticeBody(e.target.value)}
                    placeholder="Detailed notice text..."
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      name="priority"
                      checked={noticePriority === 'normal'}
                      onChange={() => setNoticePriority('normal')}
                    />
                    <span>Normal Notice</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-bold text-red-700 cursor-pointer">
                    <input
                      type="radio"
                      name="priority"
                      checked={noticePriority === 'high'}
                      onChange={() => setNoticePriority('high')}
                    />
                    <span>High Priority (Marked &quot;New&quot;)</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="py-2.5 px-5 bg-gray-900 hover:bg-black text-white font-bold text-sm rounded-xl cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <Bell className="w-4 h-4" />
                  <span>Publish Notice</span>
                </button>
              </form>
            </div>

            {/* Existing notices */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-3">
              <h3 className="font-medium text-gray-900 text-sm">
                Active Notices ({notices.length})
              </h3>
              <div className="divide-y divide-gray-100">
                {notices.map((n) => (
                  <div key={n.id} className="py-2.5 flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-900">{n.title}</span>
                        <span className="text-[10px] text-gray-400">{n.date}</span>
                        {n.priority === 'high' && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-red-100 text-red-700">
                            High Priority
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2 mt-1">{n.body}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteNotice(n.id)}
                      className="text-gray-400 hover:text-red-600 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        </main>
      </div>
    </div>
  );
};

