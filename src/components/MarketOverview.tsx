import React from 'react';
import { useGame } from '../context/GameContext';
import { TrendingUp, TrendingDown, BarChart2 } from 'lucide-react';

const MarketOverview: React.FC = () => {
  const { state } = useGame();
  const { companies, marketTrend } = state;
  
  // Calculate market stats
  const gainers = companies.filter(company => {
    const historyLength = company.priceHistory.length;
    if (historyLength < 2) return false;
    return company.priceHistory[historyLength - 1] > company.priceHistory[historyLength - 2];
  });
  
  const losers = companies.filter(company => {
    const historyLength = company.priceHistory.length;
    if (historyLength < 2) return false;
    return company.priceHistory[historyLength - 1] < company.priceHistory[historyLength - 2];
  });
  
  // Get top gainers and losers
  const topGainers = [...gainers].sort((a, b) => {
    const aChange = (a.currentPrice - a.priceHistory[a.priceHistory.length - 2]) / a.priceHistory[a.priceHistory.length - 2];
    const bChange = (b.currentPrice - b.priceHistory[b.priceHistory.length - 2]) / b.priceHistory[b.priceHistory.length - 2];
    return bChange - aChange;
  }).slice(0, 3);
  
  const topLosers = [...losers].sort((a, b) => {
    const aChange = (a.currentPrice - a.priceHistory[a.priceHistory.length - 2]) / a.priceHistory[a.priceHistory.length - 2];
    const bChange = (b.currentPrice - b.priceHistory[b.priceHistory.length - 2]) / b.priceHistory[b.priceHistory.length - 2];
    return aChange - bChange;
  }).slice(0, 3);
  
  // Market trend indicator
  const getMarketTrendIndicator = () => {
    if (marketTrend > 0.3) return { text: 'Bullish', color: 'text-green-600', icon: <TrendingUp size={20} className="mr-2" /> };
    if (marketTrend > 0.1) return { text: 'Slightly Bullish', color: 'text-green-500', icon: <TrendingUp size={20} className="mr-2" /> };
    if (marketTrend < -0.3) return { text: 'Bearish', color: 'text-red-600', icon: <TrendingDown size={20} className="mr-2" /> };
    if (marketTrend < -0.1) return { text: 'Slightly Bearish', color: 'text-red-500', icon: <TrendingDown size={20} className="mr-2" /> };
    return { text: 'Neutral', color: 'text-gray-600', icon: <BarChart2 size={20} className="mr-2" /> };
  };
  
  const trendIndicator = getMarketTrendIndicator();
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-bold mb-4">Market Overview</h2>
      
      <div className={`flex items-center mb-4 ${trendIndicator.color}`}>
        {trendIndicator.icon}
        <span className="font-medium">Market Trend: {trendIndicator.text}</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-semibold mb-2 text-green-600 flex items-center">
            <TrendingUp size={18} className="mr-1" />
            Top Gainers
          </h3>
          {topGainers.length > 0 ? (
            <ul className="space-y-2">
              {topGainers.map(company => {
                const previousPrice = company.priceHistory[company.priceHistory.length - 2];
                const priceChange = company.currentPrice - previousPrice;
                const percentChange = (priceChange / previousPrice) * 100;
                
                return (
                  <li key={company.id} className="flex justify-between items-center p-2 bg-green-50 rounded">
                    <div>
                      <span className="font-medium">{company.ticker}</span>
                      <span className="text-xs text-gray-500 ml-1">{company.name}</span>
                    </div>
                    <div className="text-green-600">
                      +{percentChange.toFixed(2)}%
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">No gainers today</p>
          )}
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2 text-red-600 flex items-center">
            <TrendingDown size={18} className="mr-1" />
            Top Losers
          </h3>
          {topLosers.length > 0 ? (
            <ul className="space-y-2">
              {topLosers.map(company => {
                const previousPrice = company.priceHistory[company.priceHistory.length - 2];
                const priceChange = company.currentPrice - previousPrice;
                const percentChange = (priceChange / previousPrice) * 100;
                
                return (
                  <li key={company.id} className="flex justify-between items-center p-2 bg-red-50 rounded">
                    <div>
                      <span className="font-medium">{company.ticker}</span>
                      <span className="text-xs text-gray-500 ml-1">{company.name}</span>
                    </div>
                    <div className="text-red-600">
                      {percentChange.toFixed(2)}%
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">No losers today</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketOverview;