Patch contents:
- server.ts: disables caching for live API data.
- src/App.tsx: resets visible F/R + S/R to X exactly at 12:00 AM IST and immediately refreshes the new day's Firebase data.
- src/components/TodayResultCard.tsx: never displays stale/previous-day result numbers; awaiting results always display X.
- src/components/CategoryGrid.tsx: increases the six category tiles on desktop and slightly improves spacing on mobile.

This patch does not change Firebase credentials, admin credentials, API routing, or Vercel secrets.
