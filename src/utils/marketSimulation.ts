import { Company, GameState, NewsEvent } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Constants for simulation
const MAX_NEWS_PER_DAY = 3;
const BASE_MARKET_FLUCTUATION = 0.02; // 2% base fluctuation

// News templates for generating random news
const newsTemplates = {
  positive: [
    { headline: "{company} Reports Record Quarterly Profits", impact: 0.15 },
    { headline: "{company} Announces Revolutionary New Product", impact: 0.2 },
    { headline: "{company} Expands into New Markets", impact: 0.1 },
    { headline: "{company} Exceeds Analyst Expectations", impact: 0.12 },
    { headline: "Investors Bullish on {company}'s Future", impact: 0.08 },
    { headline: "{company} Secures Major Partnership Deal", impact: 0.15 },
    { headline: "{company} Stock Upgraded by Analysts", impact: 0.1 }
  ],
  negative: [
    { headline: "{company} Faces Regulatory Investigation", impact: -0.18 },
    { headline: "{company} Recalls Defective Products", impact: -0.15 },
    { headline: "{company} CEO Steps Down Amid Controversy", impact: -0.2 },
    { headline: "{company} Reports Disappointing Earnings", impact: -0.12 },
    { headline: "{company} Loses Key Client", impact: -0.1 },
    { headline: "Analysts Downgrade {company} Stock", impact: -0.08 },
    { headline: "{company} Faces Increased Competition", impact: -0.1 }
  ],
  neutral: [
    { headline: "{company} Announces Leadership Restructuring", impact: 0.03 },
    { headline: "{company} to Present at Industry Conference", impact: 0.02 },
    { headline: "{company} Maintains Current Outlook", impact: 0.01 },
    { headline: "{company} Releases Sustainability Report", impact: 0.02 },
    { headline: "{company} Updates Corporate Policies", impact: 0.01 }
  ],
  market: [
    { headline: "Market Rallies on Economic Data", impact: 0.05, isMarketWide: true },
    { headline: "Investors Concerned About Inflation", impact: -0.05, isMarketWide: true },
    { headline: "Central Bank Adjusts Interest Rates", impact: -0.03, isMarketWide: true },
    { headline: "Economic Growth Exceeds Expectations", impact: 0.04, isMarketWide: true },
    { headline: "Global Trade Tensions Escalate", impact: -0.06, isMarketWide: true }
  ]
};

// Generate random news events
export const generateNewsEvents = (companies: Company[]): NewsEvent[] => {
  const newsCount = Math.floor(Math.random() * MAX_NEWS_PER_DAY) + 1;
  const news: NewsEvent[] = [];
  
  // Possibly add a market-wide news event (20% chance)
  if (Math.random() < 0.2) {
    const marketNews = newsTemplates.market[Math.floor(Math.random() * newsTemplates.market.length)];
    news.push({
      id: uuidv4(),
      headline: marketNews.headline,
      body: generateNewsBody(marketNews.headline),
      affectedCompanies: companies.map(c => c.id), // Affects all companies
      sentiment: marketNews.impact,
      timestamp: Date.now()
    });
  }
  
  // Add company-specific news
  while (news.length < newsCount) {
    // Select a random company
    const company = companies[Math.floor(Math.random() * companies.length)];
    
    // Determine news sentiment (positive, negative, or neutral)
    const sentimentRoll = Math.random();
    let newsCategory;
    if (sentimentRoll < 0.4) newsCategory = 'positive';
    else if (sentimentRoll < 0.8) newsCategory = 'negative';
    else newsCategory = 'neutral';
    
    // Select a random news template from the category
    const template = newsTemplates[newsCategory][
      Math.floor(Math.random() * newsTemplates[newsCategory].length)
    ];
    
    // Create the news event
    news.push({
      id: uuidv4(),
      headline: template.headline.replace('{company}', company.name),
      body: generateNewsBody(template.headline.replace('{company}', company.name)),
      affectedCompanies: [company.id],
      sentiment: template.impact,
      timestamp: Date.now()
    });
  }
  
  return news;
};

// Generate a more detailed news body based on the headline
const generateNewsBody = (headline: string): string => {
  // Simple implementation - in a real app, this could be more sophisticated
  return `${headline}. Analysts are closely watching how this development will impact the company's financial performance and market position in the coming quarters.`;
};

// Update stock prices based on news and market conditions
export const updateStockPrices = (gameState: GameState, news: NewsEvent[]): Company[] => {
  const updatedCompanies = [...gameState.companies];
  
  // Apply market-wide trend
  const marketTrend = gameState.marketTrend + (Math.random() * 0.2 - 0.1); // Slight random shift
  const boundedMarketTrend = Math.max(-1, Math.min(1, marketTrend)); // Keep between -1 and 1
  
  // Update each company's stock price
  updatedCompanies.forEach(company => {
    // Start with base market fluctuation
    let priceChange = (Math.random() * 2 - 1) * BASE_MARKET_FLUCTUATION;
    
    // Add market trend influence
    priceChange += boundedMarketTrend * 0.01;
    
    // Apply news effects
    news.forEach(newsItem => {
      if (newsItem.affectedCompanies.includes(company.id) || 
          newsItem.affectedCompanies.length === updatedCompanies.length) { // Market-wide news
        priceChange += newsItem.sentiment * company.volatility;
      }
    });
    
    // Apply the change
    const newPrice = company.currentPrice * (1 + priceChange);
    company.priceHistory.push(newPrice);
    company.currentPrice = Math.max(0.01, newPrice); // Ensure price doesn't go below $0.01
  });
  
  return updatedCompanies;
};

// Advance the game state by one day
export const advanceGameDay = (gameState: GameState): GameState => {
  // Generate news events
  const news = generateNewsEvents(gameState.companies);
  
  // Update stock prices based on news
  const updatedCompanies = updateStockPrices(gameState, news);
  
  // Calculate new market trend
  const newMarketTrend = calculateMarketTrend(updatedCompanies);
  
  // Update portfolio net worth
  const updatedPortfolio = calculatePortfolioValue(gameState.portfolio, updatedCompanies);
  
  return {
    ...gameState,
    day: gameState.day + 1,
    companies: updatedCompanies,
    news: [...gameState.news, ...news].slice(-10), // Keep only the 10 most recent news items
    portfolio: updatedPortfolio,
    marketTrend: newMarketTrend
  };
};

// Calculate the overall market trend based on price movements
const calculateMarketTrend = (companies: Company[]): number => {
  let totalChange = 0;
  
  companies.forEach(company => {
    const historyLength = company.priceHistory.length;
    if (historyLength >= 2) {
      const previousPrice = company.priceHistory[historyLength - 2];
      const currentPrice = company.priceHistory[historyLength - 1];
      totalChange += (currentPrice - previousPrice) / previousPrice;
    }
  });
  
  // Normalize to a -1 to 1 scale
  return Math.max(-1, Math.min(1, totalChange / companies.length * 5));
};

// Calculate the current value of the portfolio
export const calculatePortfolioValue = (portfolio: any, companies: Company[]) => {
  let stockValue = 0;
  
  // Calculate value of all stock holdings
  Object.entries(portfolio.holdings).forEach(([companyId, holding]: [string, any]) => {
    const company = companies.find(c => c.id === companyId);
    if (company) {
      stockValue += holding.shares * company.currentPrice;
    }
  });
  
  // Update net worth
  return {
    ...portfolio,
    netWorth: portfolio.cash + stockValue
  };
};