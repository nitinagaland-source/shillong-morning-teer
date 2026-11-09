export const EMERGENCY_RESULTS: Record<string, { fr: string; sr: string }> = {
  '09/11/2026': { fr: '23', sr: '92' },
};

export function getEmergencyResult(date: string) {
  return EMERGENCY_RESULTS[date] ?? null;
}