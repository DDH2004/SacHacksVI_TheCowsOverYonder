import React from 'react';
import { useGame } from '../context/GameContext';
import { Play, Pause, FastForward, RotateCcw, Calendar } from 'lucide-react';

const GameControls: React.FC = () => {
  const { state, advanceDay, togglePause, setGameSpeed, resetGame } = useGame();
  const { day, isPaused, gameSpeed } = state;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Calendar size={20} className="mr-2 text-blue-600" />
          <h2 className="text-xl font-bold">Day {day}</h2>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={togglePause}
            className={`p-2 rounded-full ${isPaused ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
            title={isPaused ? 'Resume' : 'Pause'}
          >
            {isPaused ? <Play size={20} /> : <Pause size={20} />}
          </button>
          
          <button
            onClick={advanceDay}
            className="p-2 rounded-full bg-blue-100 text-blue-600"
            title="Advance one day"
            disabled={!isPaused}
          >
            <Calendar size={20} />
          </button>
          
          <button
            onClick={resetGame}
            className="p-2 rounded-full bg-gray-100 text-gray-600"
            title="Reset game"
          >
            <RotateCcw size={20} />
          </button>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">Game Speed:</div>
        <div className="flex space-x-2">
          <button
            onClick={() => setGameSpeed('slow')}
            className={`px-3 py-1 text-sm rounded ${
              gameSpeed === 'slow' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Slow
          </button>
          <button
            onClick={() => setGameSpeed('normal')}
            className={`px-3 py-1 text-sm rounded ${
              gameSpeed === 'normal' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Normal
          </button>
          <button
            onClick={() => setGameSpeed('fast')}
            className={`px-3 py-1 text-sm rounded ${
              gameSpeed === 'fast' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Fast
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameControls;