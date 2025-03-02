export interface Company {
  id: string;
  name: string;
  ticker: string;
  description: string;
  sector: string;
  initialPrice: number;
  currentPrice: number;
  priceHistory: number[];
  volatility: number; // 0-1 scale, higher means more volatile
}

export interface NewsEvent {
  id: string;
  headline: string;
  body: string;
  affectedCompanies: string[]; // Company IDs
  sentiment: number; // -1 to 1 scale, negative to positive
  timestamp: number;
}

export interface Portfolio {
  cash: number;
  holdings: {
    [companyId: string]: {
      shares: number;
      averagePurchasePrice: number;
    };
  };
  transactionHistory: Transaction[];
  netWorth: number;
}

export interface Transaction {
  id: string;
  companyId: string;
  ticker: string;
  shares: number;
  pricePerShare: number;
  timestamp: number;
  type: 'buy' | 'sell';
  total: number;
}

export interface GameState {
  day: number;
  daysUntilGoal: number; // New variable
  goalAmount: number; // New variable
  showResult: boolean;
  companies: Company[];
  news: NewsEvent[];
  portfolio: Portfolio;
  leaderboard: LeaderboardEntry[];
  marketTrend: number; // -1 to 1 scale, bearish to bullish  
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  netWorth: number;
  dayReached: number;
}