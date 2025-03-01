import React from 'react';
import { GameProvider } from './context/GameContext';
import StockList from './components/StockList';
import PortfolioSummary from './components/PortfolioSummary';
import NewsPanel from './components/NewsPanel';
import GameControls from './components/GameControls';
import MarketOverview from './components/MarketOverview';
import { TrendingUp } from 'lucide-react';

function App() {
  return (
    <GameProvider>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-blue-600 text-white shadow-md">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <TrendingUp size={28} className="mr-2" />
                <h1 className="text-2xl font-bold">StockSim</h1>
              </div>
              <div className="text-sm">
                Virtual Stock Market Simulator
              </div>
            </div>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <GameControls />
              <StockList />
              <MarketOverview />
            </div>
            
            <div className="space-y-6">
              <PortfolioSummary />
              <NewsPanel />
            </div>
          </div>
        </main>
        
        <footer className="bg-gray-800 text-white py-4 mt-8">
          <div className="container mx-auto px-4 text-center text-sm">
            <p>StockSim - Virtual Stock Market Simulator &copy; 2025</p>
            <p className="text-gray-400 mt-1">All market data is simulated and for educational purposes only.</p>
          </div>
        </footer>
      </div>
    </GameProvider>
  );
}

export default App;