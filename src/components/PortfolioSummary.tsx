import React from 'react';
import { useGame } from '../context/GameContext';
import { Wallet, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';

const PortfolioSummary: React.FC = () => {
  const { state } = useGame();
  const { portfolio, companies } = state;
  
  // Calculate total portfolio value
  const totalValue = portfolio.netWorth;
  
  // Calculate total profit/loss
  const initialCash = 10000; // Starting cash
  const profitLoss = totalValue - initialCash;
  const profitLossPercent = (profitLoss / initialCash) * 100;
  
  // Get holdings with current values
  const holdingsWithValues = Object.entries(portfolio.holdings).map(([companyId, holding]) => {
    const company = companies.find(c => c.id === companyId);
    if (!company) return null;
    
    const currentValue = holding.shares * company.currentPrice;
    const costBasis = holding.shares * holding.averagePurchasePrice;
    const profit = currentValue - costBasis;
    const profitPercent = (profit / costBasis) * 100;
    
    return {
      companyId,
      ticker: company.ticker,
      name: company.name,
      shares: holding.shares,
      averagePrice: holding.averagePurchasePrice,
      currentPrice: company.currentPrice,
      currentValue,
      profit,
      profitPercent
    };
  }).filter(Boolean);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-bold mb-4">Portfolio Summary</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg flex flex-col items-center justify-between">
          <div className="flex items-center text-blue-700 mb-1">
            <Wallet size={20} className="mr-2" />
            <span className="text-sm font-medium">Cash</span>
          </div>
          <div className="text-xl sm:text-lg font-bold">${portfolio.cash.toFixed(2)}</div>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg flex flex-col items-center justify-between">
          <div className="flex items-center text-purple-700 mb-1">
            <BarChart3 size={20} className="mr-2" />
            <span className="text-sm font-medium">Net&nbsp;Worth</span>
          </div>
          <div className="text-xl sm:text-lg font-bold">${totalValue.toFixed(2)}</div>
        </div>
        
        <div className={`${profitLoss >= 0 ? 'bg-green-50' : 'bg-red-50'} p-4 rounded-lg flex flex-col items-center justify-between`}>
          <div className={`flex items-center ${profitLoss >= 0 ? 'text-green-700' : 'text-red-700'} mb-1`}>
            {profitLoss >= 0 ? (
              <TrendingUp size={20} className="mr-2" />
            ) : (
              <TrendingDown size={20} className="mr-2" />
            )}
            <span className="text-sm font-medium">Profit/Loss</span>
          </div>
          <div className="text-xl sm:text-lg font-bold">
            {profitLoss >= 0 ? '+' : ''}${profitLoss.toFixed(2)} ({profitLossPercent.toFixed(2)}%)
          </div>
        </div>
      </div>
      
      <h3 className="text-lg font-semibold mb-2">Holdings</h3>
      {holdingsWithValues.length > 0 ? (
        <div className="overflow-x-auto max-w-full">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shares</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Price</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit/Loss</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {holdingsWithValues.map((holding: any) => (
                <tr key={holding.companyId}>
                  <td className="px-4 py-2">
                    <div className="font-medium">{holding.ticker}</div>
                    <div className="text-xs text-gray-500">{holding.name}</div>
                  </td>
                  <td className="px-4 py-2">{holding.shares}</td>
                  <td className="px-4 py-2">${holding.averagePrice.toFixed(2)}</td>
                  <td className="px-4 py-2">${holding.currentPrice.toFixed(2)}</td>
                  <td className="px-4 py-2">${holding.currentValue.toFixed(2)}</td>
                  <td className="px-4 py-2">
                    <div className={`flex items-center ${holding.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {holding.profit >= 0 ? (
                        <TrendingUp size={16} className="mr-1" />
                      ) : (
                        <TrendingDown size={16} className="mr-1" />
                      )}
                      <span className="text-xs">
                        {holding.profit >= 0 ? '+' : ''}${holding.profit.toFixed(2)} ({holding.profitPercent.toFixed(2)}%)
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500">
          No stocks in portfolio
        </div>
      )}
    </div>
  );
};

export default PortfolioSummary;
