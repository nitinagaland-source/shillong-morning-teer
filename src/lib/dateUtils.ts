// Date utility helpers for Shillong Morning Teer (IST UTC+5:30)

export function getTodayISTDateString(d = new Date()): string {
  const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
  const ist = new Date(utc + (3600000 * 5.5));
  const day = String(ist.getDate()).padStart(2, '0');
  const month = String(ist.getMonth() + 1).padStart(2, '0');
  const year = ist.getFullYear();
  return `${day}/${month}/${year}`;
}

export function getMsUntilNextMidnightIST(): number {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const ist = new Date(utc + (3600000 * 5.5));
  
  // Next 00:00:00 IST
  const nextMidnightIST = new Date(ist);
  nextMidnightIST.setHours(24, 0, 0, 0);
  
  const diff = nextMidnightIST.getTime() - ist.getTime();
  return Math.max(1000, diff);
}

// Deterministic hash from date string
export function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// Daily Lucky Dream Pick calculation for any date
export interface DailyDreamPrediction {
  date: string;
  featuredSymbol: string;
  luckyNumbers: string;
  luckyHouse: string;
  luckyEnding: string;
  topSymbols: Array<{ symbol: string; numbers: string; meaning: string }>;
}

export function getDailyDreamPredictions(dateStr: string): DailyDreamPrediction {
  const seed = hashString(dateStr + '_teer_dreams');
  
  const symbols = [
    { symbol: 'Water / River Flow', numbers: '01, 14, 82', meaning: 'Clear mountain stream indicates steady arrow velocity' },
    { symbol: 'Black Snake (Thlen)', numbers: '09, 32, 90', meaning: 'Traditional Khasi serpent omen pointing to unexpected round 1 endings' },
    { symbol: 'Flying Arrow / Bow', numbers: '22, 57, 75', meaning: 'Bamboo archery target hit directly on the center ring' },
    { symbol: 'Fire / Burning Flame', numbers: '03, 33, 84', meaning: 'High intensity hit rate for second round single digits' },
    { symbol: 'Silver Coin / Money', numbers: '11, 46, 64', meaning: 'Prosperity number pair connected to North Shillong archery club' },
    { symbol: 'Wild Elephant / Tiger', numbers: '08, 48, 88', meaning: 'Power figures signaling dominant even house predictions' },
    { symbol: 'Fish Swimming in Pool', numbers: '02, 27, 72', meaning: 'Dual round harmony and paired ending numbers' },
    { symbol: 'Fresh Green Forest', numbers: '15, 59, 95', meaning: 'Pine forest calm favoring odd direct target hits' },
    { symbol: 'White Bird / Eagle', numbers: '06, 61, 91', meaning: 'High trajectory arrow path pointing to 6 and 9 pairs' },
    { symbol: 'Ancient Stone Monolith', numbers: '04, 40, 80', meaning: 'Stable foundation connecting to traditional house 4 and 8' },
  ];

  const startIndex = seed % symbols.length;
  const pickedSymbols: Array<{ symbol: string; numbers: string; meaning: string }> = [];
  for (let i = 0; i < 4; i++) {
    pickedSymbols.push(symbols[(startIndex + i) % symbols.length]);
  }

  const h = (seed % 10).toString();
  const e = ((seed >> 3) % 10).toString();
  const featured = pickedSymbols[0];

  return {
    date: dateStr,
    featuredSymbol: featured.symbol,
    luckyNumbers: featured.numbers,
    luckyHouse: h,
    luckyEnding: e,
    topSymbols: pickedSymbols,
  };
}



