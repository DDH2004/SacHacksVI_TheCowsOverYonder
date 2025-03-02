import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { GameState, Company, NewsEvent, Portfolio, GameSpeed } from '../types';
import { initialGameState } from '../data/initialData';
import { advanceGameDay, fetchGameState, updateGameState } from '../utils/marketSimulation';
import { buyStock, sellStock } from '../utils/transactions';

// Define action types
type GameAction =
  | { type: 'ADVANCE_DAY' }
  | { type: 'BUY_STOCK'; companyId: string; shares: number }
  | { type: 'SELL_STOCK'; companyId: string; shares: number }
  | { type: 'SET_GAME_SPEED'; speed: GameSpeed }
  | { type: 'TOGGLE_PAUSE' }
  | { type: 'RESET_GAME' }
  | { type: 'SET_GAME_STATE'; gameState: GameState }; 

// Create context
interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  buyStockShares: (companyId: string, shares: number) => void;
  sellStockShares: (companyId: string, shares: number) => void;
  advanceDay: () => void;
  setGameSpeed: (speed: GameSpeed) => void;
  togglePause: () => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// Reducer function
const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'ADVANCE_DAY':
      // The actual state update will happen in the effect
      return state;
      
    case 'BUY_STOCK': {
      const company = state.companies.find(c => c.id === action.companyId);
      if (!company) return state;
      
      const result = buyStock(state.portfolio, company, action.shares);
      if (!result.success) return state;
      
      const updatedState = {
        ...state,
        portfolio: result.portfolio
      };
      
      // Update the server with the new state
      updateGameState(updatedState);
      
      return updatedState;
    }
    
    case 'SELL_STOCK': {
      const company = state.companies.find(c => c.id === action.companyId);
      if (!company) return state;
      
      const result = sellStock(state.portfolio, company, action.shares);
      if (!result.success) return state;
      
      const updatedState = {
        ...state,
        portfolio: result.portfolio
      };
      
      // Update the server with the new state
      updateGameState(updatedState);
      
      return updatedState;
    }
    
    case 'SET_GAME_SPEED': {
      const updatedState = {
        ...state,
        gameSpeed: action.speed
      };
      
      // Update the server with the new state
      updateGameState(updatedState);
      
      return updatedState;
    }
      
    case 'TOGGLE_PAUSE': {
      const updatedState = {
        ...state,
        isPaused: !state.isPaused
      };
      
      // Update the server with the new state
      updateGameState(updatedState);
      
      return updatedState;
    }
      
    case 'RESET_GAME': {
      // Reset to initial state and update the server
      updateGameState(initialGameState);
      return initialGameState;
    }

    case 'SET_GAME_STATE':
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
    const getInitialGameState = async () => {
      const gameState = await fetchGameState();
      if (gameState) {
        dispatch({ type: 'SET_GAME_STATE', gameState });
      }
    };

    getInitialGameState();
  }, []);
  
  // Effect for handling day advancement
  useEffect(() => {
    const advanceDay = async () => {
      const updatedState = await advanceGameDay(state);
      if (updatedState) {
        dispatch({ type: 'SET_GAME_STATE', gameState: updatedState });
      }
    };

    // Game loop for automatic day advancement
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
      advanceDay();
    }, interval);
    
    return () => clearInterval(timer);
  }, [state.gameSpeed, state.isPaused, state]);
  
  // Helper functions
  const buyStockShares = (companyId: string, shares: number) => {
    dispatch({ type: 'BUY_STOCK', companyId, shares });
  };
  
  const sellStockShares = (companyId: string, shares: number) => {
    dispatch({ type: 'SELL_STOCK', companyId, shares });
  };
  
  const advanceDay = async () => {
    const updatedState = await advanceGameDay(state);
    if (updatedState) {
      dispatch({ type: 'SET_GAME_STATE', gameState: updatedState });
    }
  };
  
  const setGameSpeed = (speed: GameSpeed) => {
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