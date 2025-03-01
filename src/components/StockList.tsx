import React, { useState } from 'react';
import { Company } from '../types';
import { useGame } from '../context/GameContext';
import StockChart from './StockChart';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

const StockList: React.FC = () => {
  const { state, buyStockShares, sellStockShares } = useGame();
  const { companies, portfolio } = state;
  
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [tradeShares, setTradeShares] = useState<number>(1); // Buy select amount of stocks
  const [cashToSpend, setCashToSpend] = useState<string>(''); // Buy using cash values, rounded down

  
  const handleCompanySelect = (company: Company) => {
    setSelectedCompany(company);
    setTradeShares(1);
    setCashToSpend('');
  };
  
  // Buy with Stocks
  const handleBuyWithStocks = () => {
    if (selectedCompany && tradeShares > 0) {
      buyStockShares(selectedCompany.id, tradeShares);
    }
  };

  // Buy with Cash
  const handleBuyWithCash = () => {
    if (selectedCompany && cashToSpend) {
      const cash = parseFloat(cashToSpend);
      if (!isNaN(cash) && cash > 0) {
        const maxShares = Math.floor(cash / selectedCompany.currentPrice);
        if (maxShares > 0) {
          buyStockShares(selectedCompany.id, maxShares);
        }
      }
    }
  };
  
  const handleSell = () => {
    if (selectedCompany && tradeShares > 0) {
      sellStockShares(selectedCompany.id, tradeShares);
    }
  };
  
  const getOwnedShares = (companyId: string): number => {
    return portfolio.holdings[companyId]?.shares || 0;
  };
  
  const canAfford = (company: Company, shares: number): boolean => {
    return portfolio.cash >= company.currentPrice * shares;
  };

  const maxSharesForCash = selectedCompany && cashToSpend
  ? Math.floor(parseFloat(cashToSpend) / selectedCompany.currentPrice) || 0
  : 0;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Stock List */}
      <div className="md:col-span-2 bg-white rounded-lg shadow-md p-4">
        <h2 className="text-xl font-bold mb-4">Market</h2>
        <div className="overflow-auto max-h-[500px]">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chart</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {companies.map(company => {
                const priceHistory = company.priceHistory;
                const previousPrice = priceHistory.length > 1 ? priceHistory[priceHistory.length - 2] : company.initialPrice;
                const priceChange = company.currentPrice - previousPrice;
                const percentChange = (priceChange / previousPrice) * 100;
                
                return (
                  <tr key={company.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">
                      <div>
                        <div className="font-medium">{company.ticker}</div>
                        <div className="text-sm text-gray-500">{company.name}</div>
                      </div>
                    </td>
                    <td className="px-4 py-2 font-medium">${company.currentPrice.toFixed(2)}</td>
                    <td className="px-4 py-2">
                      <div className={`flex items-center ${priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {priceChange >= 0 ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
                        <span>{percentChange.toFixed(2)}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <StockChart company={company} width={120} height={60} />
                    </td>
                    <td className="px-4 py-2">
                      <button 
                        onClick={() => handleCompanySelect(company)}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                      >
                        Trade
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Trade Panel */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-xl font-bold mb-4">Trade</h2>

        {selectedCompany ? (
          <div>
            <h3 className="text-lg font-semibold">{selectedCompany.name} ({selectedCompany.ticker})</h3>
            <p className="text-sm text-gray-600">{selectedCompany.description}</p>

            {/* Buy using shares */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Number of Shares</label>
              <input
                type="number"
                min="1"
                value={tradeShares}
                onChange={(e) => setTradeShares(Math.max(1, parseInt(e.target.value) || 0))}
                className="w-full border p-2 rounded mt-1"
              />
              <button
                onClick={handleBuyWithStocks}
                disabled={!selectedCompany || !canAfford(selectedCompany, tradeShares)}
                className="mt-2 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:bg-gray-300"
              >
                Buy {tradeShares} Shares
              </button>
            </div>

            {/* Buy using cash */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Buy with Cash ($)</label>
              <input
                type="number"
                min="0"
                value={cashToSpend}
                onChange={(e) => setCashToSpend(e.target.value)}
                className="w-full border p-2 rounded mt-1"
              />
              <p className="text-sm text-gray-500 mt-1">You can buy {maxSharesForCash} shares</p>
              <button
                  onClick={handleBuyWithCash}
                  disabled={
                    maxSharesForCash <= 0 || 
                    (selectedCompany && parseFloat(cashToSpend) > portfolio.cash)
                  }
                  className="mt-2 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:bg-gray-300"
                >
                Buy with Cash
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Select a stock to trade
          </div>
        )}
      </div>
    </div>
  );
};

export default StockList;