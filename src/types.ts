export type GameSpeed = 'slow' | 'normal' | 'fast';

export interface Company {
  id: string;
  name: string;
  ticker: string;
  description: string;
  sector: string;
  initialPrice: number;
  currentPrice: number;
  priceHistory: number[];
  volatility: number;
}

export interface NewsEvent {
  id: string;
  headline: string;
  body: string;
  affectedCompanies: string[];
  sentiment: number;
  timestamp: number;
}

export interface Holding {
  shares: number;
  averagePurchasePrice: number;
}

export interface Transaction {
  id: string;
  type: 'buy' | 'sell';
  companyId: string;
  companyName: string;
  shares: number;
  pricePerShare: number;
  totalAmount: number;
  timestamp: number;
}

export interface Portfolio {
  cash: number;
  holdings: Record<string, Holding>;
  transactionHistory: Transaction[];
  netWorth: number;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  netWorth: number;
  day: number;
}

export interface GameState {
  day: number;
  companies: Company[];
  news: NewsEvent[];
  portfolio: Portfolio;
  leaderboard: LeaderboardEntry[];
  marketTrend: number;
  gameSpeed: GameSpeed;
  isPaused: boolean;
}