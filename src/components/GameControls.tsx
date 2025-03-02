import React from 'react';
import { useGame } from '../context/GameContext';
import { RotateCcw, Calendar } from 'lucide-react';

const GameControls: React.FC = () => {
  const { state, advanceDay, resetGame } = useGame();
  const { day } = state;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Calendar size={20} className="mr-2 text-blue-600" />
          <h2 className="text-xl font-bold">Day {day}</h2>
        </div>
        
        <div className="flex space-x-2">
          
        <button
          onClick={advanceDay}
          className="p-2 rounded-full bg-blue-100 text-blue-600 flex items-center space-x-2"
          title="Advance one day"
        >
          <Calendar size={20} />
          <span>Advance One Day</span>
        </button>
          
          <button
            onClick={resetGame}
            className="p-2 rounded-full bg-gray-100 text-gray-600 flex items-center space-x-2"
            title="Reset game"
          >
            <RotateCcw size={20} />
            <span>Reset game</span>
          </button>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">Days Until Goal:</div>
        <div className="flex space-x-2">


        </div>
      </div>
    </div>
  );
};

export default GameControls;