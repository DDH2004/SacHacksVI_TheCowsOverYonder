import { Company, GameState } from '../types';

export const initialCompanies: Company[] = [
  {
    id: 'tech-1',
    name: 'NexaTech Solutions',
    ticker: 'NTS',
    description: 'Leading provider of cloud computing and AI solutions',
    sector: 'Technology',
    initialPrice: 245.75,
    currentPrice: 245.75,
    priceHistory: [245.75],
    volatility: 0.8
  },
  {
    id: 'tech-2',
    name: 'Quantum Dynamics',
    ticker: 'QDY',
    description: 'Specializes in quantum computing and advanced algorithms',
    sector: 'Technology',
    initialPrice: 189.30,
    currentPrice: 189.30,
    priceHistory: [189.30],
    volatility: 0.9
  },
  {
    id: 'energy-1',
    name: 'SolarPeak Energy',
    ticker: 'SPE',
    description: 'Renewable energy company focused on solar power solutions',
    sector: 'Energy',
    initialPrice: 78.45,
    currentPrice: 78.45,
    priceHistory: [78.45],
    volatility: 0.6
  },
  {
    id: 'finance-1',
    name: 'Atlas Financial Group',
    ticker: 'AFG',
    description: 'Global financial services and investment management',
    sector: 'Finance',
    initialPrice: 156.20,
    currentPrice: 156.20,
    priceHistory: [156.20],
    volatility: 0.5
  },
  {
    id: 'health-1',
    name: 'BioGenesis Labs',
    ticker: 'BGL',
    description: 'Biotechnology company developing innovative treatments',
    sector: 'Healthcare',
    initialPrice: 112.80,
    currentPrice: 112.80,
    priceHistory: [112.80],
    volatility: 0.7
  },
  {
    id: 'consumer-1',
    name: 'Evergreen Goods',
    ticker: 'EVG',
    description: 'Consumer goods company with sustainable product lines',
    sector: 'Consumer Goods',
    initialPrice: 67.35,
    currentPrice: 67.35,
    priceHistory: [67.35],
    volatility: 0.4
  },
  {
    id: 'manufacturing-1',
    name: 'Titan Industries',
    ticker: 'TTI',
    description: 'Heavy machinery and industrial equipment manufacturer',
    sector: 'Manufacturing',
    initialPrice: 92.15,
    currentPrice: 92.15,
    priceHistory: [92.15],
    volatility: 0.5
  },
  {
    id: 'retail-1',
    name: 'Urban Marketplace',
    ticker: 'UMP',
    description: 'E-commerce platform for urban lifestyle products',
    sector: 'Retail',
    initialPrice: 45.60,
    currentPrice: 45.60,
    priceHistory: [45.60],
    volatility: 0.6
  }
];

export const initialGameState: GameState = {
  day: 1,
  daysUntilGoal: 14, // Start with 14 days
  goalAmount: 10500, // Starting cash ($10000) + $500 profit goal
  showResult: false,
  companies: initialCompanies,
  news: [],
  portfolio: {
    cash: 10000,
    holdings: {},
    transactionHistory: [],
    netWorth: 10000
  },
  leaderboard: [],
  marketTrend: 0,
};