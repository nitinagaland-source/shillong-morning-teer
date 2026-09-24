export interface SiteSettings {
  id: string;
  site_name: string;
  game_name: string;
  logo_url: string;
  top_bar_bg_color: string;
  announcement_ticker?: string;
  updated_at: string;
}

export interface TeerResult {
  id: string;
  date: string; // e.g. "18/09/2026"
  round_1_label: string; // e.g. "F/R(10:30 AM)"
  round_1_time: string; // "10:30 AM"
  round_1_number: string; // e.g. "76" or empty
  round_2_label: string; // e.g. "S/R(11:30 AM)"
  round_2_time: string; // "11:30 AM"
  round_2_number: string; // e.g. "44" or empty
  status?: 'awaiting' | 'partial' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface CommonNumberEntry {
  id: string;
  date: string;
  category_label: 'Direct' | 'House' | 'Ending' | 'Special Target';
  numbers: string[];
  notes?: string;
  created_at: string;
}

export interface DreamNumberEntry {
  id: string;
  keyword: string;
  number: string; // e.g. "07, 70" or "44"
  description: string;
}

export interface NoticeEntry {
  id: string;
  title: string;
  date: string;
  body: string;
  priority?: 'normal' | 'high';
  created_at: string;
}

export interface AdminSession {
  token: string;
  email: string;
  role: 'superadmin' | 'editor';
  expires_at: number;
}


