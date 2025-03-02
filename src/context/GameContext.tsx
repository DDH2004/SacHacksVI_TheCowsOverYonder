import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import axios from 'axios';
import { GameState } from '../types';
import { initialGameState } from '../data/initialData';

// Define action types
type GameAction =
  | { type: 'SET_GAME_STATE'; gameState: GameState }
  | { type: 'ADVANCE_DAY' }
  | { type: 'BUY_STOCK'; companyId: string; shares: number }
  | { type: 'SELL_STOCK'; companyId: string; shares: number }
  | { type: 'RESET_GAME' };

// Create context
interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  buyStockShares: (companyId: string, shares: number) => void;
  sellStockShares: (companyId: string, shares: number) => void;
  advanceDay: () => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// Reducer function
const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'SET_GAME_STATE':
      return action.gameState;
    case 'ADVANCE_DAY':
      return state; // No local state change, handled by API
    case 'BUY_STOCK':
      return state; // No local state change, handled by API
    case 'SELL_STOCK':
      return state; // No local state change, handled by API
    case 'RESET_GAME':
      return initialGameState;
    default:
      return state;
  }
};

// Provider component
export const GameProvider: React.FC<{ children: React.ReactNode; resetToMenu: () => void }> = ({
  children,
  resetToMenu,
}) => {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);
  const [gameResult, setGameResult] = useState<'playing' | 'lost' | 'won'>('playing');

  const checkGameResult = (gameState: GameState) => {
    if (gameState.showResult) {
      if (gameState.portfolio.netWorth < gameState.goalAmount) {
        console.log("lost")
        setGameResult('lost');
      } else {
        console.log("won")
        setGameResult('won');
      }
    } else {
      console.log("playing")
      setGameResult('playing');
    }
  };  

  // Fetch initial game state from backend
  useEffect(() => {
    axios.get('/api/gamestate')
      .then(response => {
        dispatch({ type: 'SET_GAME_STATE', gameState: response.data });
        checkGameResult(response.data);
      })
      .catch(error => console.error('Error fetching game state:', error));
  }, []);

  // Check game result after each state update
  useEffect(() => {
    checkGameResult(state);
  }, [state]);

  // Helper functions
  const buyStockShares = (companyId: string, shares: number) => {
    axios.post('/api/buy', { companyId, shares })
      .then(response => {
        dispatch({ type: 'SET_GAME_STATE', gameState: response.data });
      })
      .catch(error => console.error('Error buying stock:', error));
  };

  const sellStockShares = (companyId: string, shares: number) => {
    axios.post('/api/sell', { companyId, shares })
      .then(response => {
        dispatch({ type: 'SET_GAME_STATE', gameState: response.data });
      })
      .catch(error => console.error('Error selling stock:', error));
  };

  const advanceDay = () => {
    axios.post('/api/advance-day')
      .then(response => {
        dispatch({ type: 'SET_GAME_STATE', gameState: response.data });
      })
      .catch(error => console.error('Error advancing day:', error));
  };

  const resetGame = () => {
    axios.post('/api/reset')
      .then(response => {
        dispatch({ type: 'SET_GAME_STATE', gameState: response.data });
        setGameResult('playing');
        resetToMenu(); // Trigger return to Start Menu
      })
      .catch(error => console.error('Error resetting game:', error));
  };

  const LossScreen: React.FC = () => (
    <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto mt-20 text-center">
      <h2 className="text-3xl font-bold mb-6 text-red-600">Game Over</h2>
      <p className="text-xl mb-8 text-gray-700">Your net worth fell below the goal amount.</p>
      <div className="bg-red-50 p-6 rounded-lg mb-8">
        <div className="flex items-center justify-center text-red-700 mb-2">
          <span className="text-lg font-medium">Net Worth Below Goal</span>
        </div>
        <div className="text-2xl font-bold text-red-700">
          ${state.portfolio.netWorth.toFixed(2)} / ${state.goalAmount.toFixed(2)}
        </div>
      </div>
      <button 
        onClick={resetGame}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
      >
        Back To Menu
      </button>
    </div>
  );
  
  const WinScreen: React.FC = () => (
    <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto mt-20 text-center">
      <h2 className="text-3xl font-bold mb-6 text-green-600">Congratulations!</h2>
      <p className="text-xl mb-8 text-gray-700">You've reached the goal amount!</p>
      <div className="bg-green-50 p-6 rounded-lg mb-8">
        <div className="flex items-center justify-center text-green-700 mb-2">
          <span className="text-lg font-medium">Net Worth Exceeded Goal</span>
        </div>
        <div className="text-2xl font-bold text-green-700">
          ${state.portfolio.netWorth.toFixed(2)} / ${state.goalAmount.toFixed(2)}
        </div>
      </div>
      <button 
        onClick={resetGame}
        className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
      >
        Back To Menu
      </button>
    </div>
  );
  
  return (
    <GameContext.Provider
      value={{
        state,
        dispatch,
        buyStockShares,
        sellStockShares,
        advanceDay,
        resetGame,
      }}
    >
      {gameResult === 'lost' ? <LossScreen /> :
       gameResult === 'won' ? <WinScreen /> :
       children}
    </GameContext.Provider>
  );  
};

// Custom hook for using the context
export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};