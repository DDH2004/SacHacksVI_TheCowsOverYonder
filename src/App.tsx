import React, { useState } from 'react';
import { GameProvider } from './context/GameContext';
import StockList from './components/StockList';
import PortfolioSummary from './components/PortfolioSummary';
import NewsPanel from './components/NewsPanel';
import GameControls from './components/GameControls';
import MarketOverview from './components/MarketOverview';
import StartMenu from './components/StartMenu';

function App() {
  const [isGameStarted, setIsGameStarted] = useState(false);

  const handleStartGame = () => {
    setIsGameStarted(true); // Start the game
  };

  const handleResetToMenu = () => {
    setIsGameStarted(false); // Return to Start Menu
  };

  if (!isGameStarted) {
    return <StartMenu onStart={handleStartGame} />;
  }

  return (
    <GameProvider resetToMenu={handleResetToMenu}>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-blue-600 text-white shadow-md">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold">Market Mayhem</h1>
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
            Market Mayhem &copy; 2025
          </div>
        </footer>
      </div>
    </GameProvider>
  );
}

export default App;