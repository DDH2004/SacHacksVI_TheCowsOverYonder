import React, { createContext, useContext, useReducer } from 'react';
import { GameState } from '../types';
import { initialGameState } from '../data/initialData';

// Define action types
type GameAction =
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
    case 'ADVANCE_DAY':
      // Check if the player has won or lost
      const totalPortfolioValue = state.portfolio.netWorth;

      if (totalPortfolioValue >= state.goalAmount) {
        alert('Congratulations! You reached your goal!');

      } else if (state.daysUntilGoal - 1 <= 0) {
        alert('You ran out of time! Better luck next time.');

      }

      return advanceGameDay(state);
    case 'BUY_STOCK': {
      const company = state.companies.find((c) => c.id === action.companyId);
      if (!company) return state;

      const result = buyStock(state.portfolio, company, action.shares);
      if (!result.success) return state;

      return {
        ...state,
        portfolio: result.portfolio,
      };
    }
    case 'SELL_STOCK': {
      const company = state.companies.find((c) => c.id === action.companyId);
      if (!company) return state;

      const result = sellStock(state.portfolio, company, action.shares);
      if (!result.success) return state;

      return {
        ...state,
        portfolio: result.portfolio,
      };
    }
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
    dispatch({ type: 'RESET_GAME' });
    resetToMenu(); // Trigger return to Start Menu
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