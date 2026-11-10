export const EMERGENCY_RESULTS: Record<string, { fr: string; sr: string }> = {
  '09/11/2026': { fr: '23', sr: '92' },
  '10/11/2026': { fr: '88', sr: '46' },
};

export function getEmergencyResult(date: string) {
  return EMERGENCY_RESULTS[date] ?? null;
}