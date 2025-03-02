import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { GameState, Company, NewsEvent, Portfolio } from '../types';
import { initialGameState } from '../data/initialData';
import { advanceGameDay } from '../utils/marketSimulation';
import { buyStock, sellStock } from '../utils/transactions';

// Define action types
type GameAction =
  | { type: 'ADVANCE_DAY' }
  | { type: 'BUY_STOCK'; companyId: string; shares: number }
  | { type: 'SELL_STOCK'; companyId: string; shares: number }
  | { type: 'SET_GAME_SPEED'; speed: GameState['gameSpeed'] }
  | { type: 'TOGGLE_PAUSE' }
  | { type: 'RESET_GAME' }
  | { type: 'SET_GAME_STATE'; gameState: GameState }; // Action to set the full game state from the backend


// Create context
interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  buyStockShares: (companyId: string, shares: number) => void;
  sellStockShares: (companyId: string, shares: number) => void;
  advanceDay: () => void;
  setGameSpeed: (speed: GameState['gameSpeed']) => void;
  togglePause: () => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// Reducer function
const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'ADVANCE_DAY':
      return advanceGameDay(state);
      
    case 'BUY_STOCK': {
      const company = state.companies.find(c => c.id === action.companyId);
      if (!company) return state;
      
      const result = buyStock(state.portfolio, company, action.shares);
      if (!result.success) return state;
      
      return {
        ...state,
        portfolio: result.portfolio
      };
    }
    
    case 'SELL_STOCK': {
      const company = state.companies.find(c => c.id === action.companyId);
      if (!company) return state;
      
      const result = sellStock(state.portfolio, company, action.shares);
      if (!result.success) return state;
      
      return {
        ...state,
        portfolio: result.portfolio
      };
    }
    
    case 'SET_GAME_SPEED':
      return {
        ...state,
        gameSpeed: action.speed
      };
      
    case 'TOGGLE_PAUSE':
      return {
        ...state,
        isPaused: !state.isPaused
      };
      
    case 'RESET_GAME':
      return initialGameState;

    case 'SET_GAME_STATE': // New case to set the full game state
      return action.gameState;
      
    default:
      return state;
  }
};

// Provider component
export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);

  // Fetch the game state from the backend when the app mounts
  useEffect(() => {
    const fetchGameState = async () => {
      try {
        const response = await fetch('/api/gamestate');
        if (response.ok) {
          const data = await response.json();
          dispatch({ type: 'SET_GAME_STATE', gameState: data }); // Update the state with the backend data
        } else {
          console.error('Failed to fetch game state from backend');
        }
      } catch (error) {
        console.error('Error fetching game state:', error);
      }
    };

    fetchGameState();
  }, []);
  
  // Game loop for automatic day advancement
  useEffect(() => {
    if (state.isPaused) return;
    
    let interval: number;
    
    switch (state.gameSpeed) {
      case 'slow':
        interval = 10000; // 10 seconds
        break;
      case 'normal':
        interval = 5000; // 5 seconds
        break;
      case 'fast':
        interval = 2000; // 2 seconds
        break;
      default:
        interval = 5000;
    }
    
    const timer = setInterval(() => {
      dispatch({ type: 'ADVANCE_DAY' });
    }, interval);
    
    return () => clearInterval(timer);
  }, [state.gameSpeed, state.isPaused]);
  
  // Helper functions
  const buyStockShares = (companyId: string, shares: number) => {
    dispatch({ type: 'BUY_STOCK', companyId, shares });
  };
  
  const sellStockShares = (companyId: string, shares: number) => {
    dispatch({ type: 'SELL_STOCK', companyId, shares });
  };
  
  const advanceDay = () => {
    dispatch({ type: 'ADVANCE_DAY' });
  };
  
  const setGameSpeed = (speed: GameState['gameSpeed']) => {
    dispatch({ type: 'SET_GAME_SPEED', speed });
  };
  
  const togglePause = () => {
    dispatch({ type: 'TOGGLE_PAUSE' });
  };
  
  const resetGame = () => {
    dispatch({ type: 'RESET_GAME' });
  };
  
  return (
    <GameContext.Provider
      value={{
        state,
        dispatch,
        buyStockShares,
        sellStockShares,
        advanceDay,
        setGameSpeed,
        togglePause,
        resetGame
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