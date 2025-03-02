import React, { useState, useRef, useEffect } from 'react';
import { GameProvider } from './context/GameContext';
import StockList from './components/StockList';
import PortfolioSummary from './components/PortfolioSummary';
import NewsPanel from './components/NewsPanel';
import GameControls from './components/GameControls';
import MarketOverview from './components/MarketOverview';
import StartMenu from './components/StartMenu';
import { Volume, Volume1Icon, Volume2Icon, VolumeXIcon } from 'lucide-react';

function App() {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null); 

  const handleStartGame = () => {
    setIsGameStarted(true); // Start the game
  };

  const handleResetToMenu = () => {
    setIsGameStarted(false); // Return to Start Menu
  };

  // Automatically start the music when the game starts
  useEffect(() => {
    if (isGameStarted && audioRef.current) {
      audioRef.current.play(); // Start playing music
    }
  }, [isGameStarted]);

  // Pause music when game is not started
  useEffect(() => {
    if (!isGameStarted && audioRef.current) {
      audioRef.current.pause(); // Pause music
    }
  }, [isGameStarted]);

  // Update volume when the user adjusts the slider
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume; // Set volume
    }
  }, [volume]);

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

        {/* Background Music */}
        <audio
          ref={audioRef}
          loop
          src="/bg_music.mp3"
          preload="auto"
        />

        {/* Volume Control */}
        <div className="fixed flex bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-md">
          <>
            {volume == 0.00 && <VolumeXIcon size={20} className="mr-2"/>}
            {volume > 0.00 && volume <= 0.33 && <Volume size={20} className="mr-2"/>}
            {volume > 0.33 && volume <= 0.66 && <Volume1Icon size={20} className="mr-2"/>}
            {volume > 0.66 && volume <= 1 && <Volume2Icon size={20} className="mr-2"/>}
          </>
          <input
            id="volume-slider"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="ml-2"
          />
        </div>
      </div>
    </GameProvider>
  );
}

export default App;