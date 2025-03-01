import React, { useState } from 'react';
import { Company } from '../types';
import { useGame } from '../context/GameContext';
import StockChart from './StockChart';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

const StockList: React.FC = () => {
  const { state, buyStockShares, sellStockShares } = useGame();
  const { companies, portfolio } = state;
  
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [tradeShares, setTradeShares] = useState<number>(1);
  
  const handleCompanySelect = (company: Company) => {
    setSelectedCompany(company);
    setTradeShares(1);
  };
  
  const handleBuy = () => {
    if (selectedCompany && tradeShares > 0) {
      buyStockShares(selectedCompany.id, tradeShares);
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
            <div className="mb-4">
              <h3 className="text-lg font-semibold">{selectedCompany.name} ({selectedCompany.ticker})</h3>
              <p className="text-sm text-gray-600">{selectedCompany.description}</p>
              <div className="mt-2">
                <StockChart company={selectedCompany} width={280} height={140} />
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <div className="bg-gray-50 p-2 rounded">
                  <div className="text-sm text-gray-500">Current Price</div>
                  <div className="font-bold">${selectedCompany.currentPrice.toFixed(2)}</div>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <div className="text-sm text-gray-500">Shares Owned</div>
                  <div className="font-bold">{getOwnedShares(selectedCompany.id)}</div>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Shares
              </label>
              <div className="flex items-center">
                <button 
                  onClick={() => setTradeShares(Math.max(1, tradeShares - 1))}
                  className="px-3 py-1 bg-gray-200 rounded-l hover:bg-gray-300"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={tradeShares}
                  onChange={(e) => setTradeShares(Math.max(1, parseInt(e.target.value) || 0))}
                  className="w-full text-center py-1 border-t border-b"
                />
                <button 
                  onClick={() => setTradeShares(tradeShares + 1)}
                  className="px-3 py-1 bg-gray-200 rounded-r hover:bg-gray-300"
                >
                  +
                </button>
              </div>
              <div className="mt-1 text-sm text-gray-500">
                Total: ${(selectedCompany.currentPrice * tradeShares).toFixed(2)}
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={handleBuy}
                disabled={!canAfford(selectedCompany, tradeShares)}
                className={`flex-1 py-2 rounded flex items-center justify-center ${
                  canAfford(selectedCompany, tradeShares)
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <DollarSign size={16} className="mr-1" />
                Buy
              </button>
              <button
                onClick={handleSell}
                disabled={getOwnedShares(selectedCompany.id) < tradeShares}
                className={`flex-1 py-2 rounded flex items-center justify-center ${
                  getOwnedShares(selectedCompany.id) >= tradeShares
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <DollarSign size={16} className="mr-1" />
                Sell
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