import React, { createContext, useContext, useReducer, useEffect } from 'react';
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

  // Fetch initial game state from backend
  useEffect(() => {
    axios.get('/api/gamestate')
      .then(response => {
        dispatch({ type: 'SET_GAME_STATE', gameState: response.data });
      })
      .catch(error => console.error('Error fetching game state:', error));
  }, []);

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
        resetToMenu(); // Trigger return to Start Menu
      })
      .catch(error => console.error('Error resetting game:', error));
  };

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
      {children}
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