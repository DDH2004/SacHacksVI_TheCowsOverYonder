import { GameState, NewsEvent, Company } from '../types';

// Function to advance the game day by fetching data from the API
export const advanceGameDay = async (state: GameState): Promise<GameState> => {
  try {
    const response = await fetch('http://localhost:5000/api/advance-day', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(state),
    });
    
    if (!response.ok) {
      throw new Error('Failed to advance day');
    }
    
    const updatedState = await response.json();
    return updatedState;
  } catch (error) {
    console.error('Error advancing day:', error);
    
    // Fallback to local state if API call fails
    return {
      ...state,
      day: state.day + 1,
    };
  }
};

// Function to fetch the current game state from the API
export const fetchGameState = async (): Promise<GameState | null> => {
  try {
    const response = await fetch('http://localhost:5000/api/gamestate');
    
    if (!response.ok) {
      throw new Error('Failed to fetch game state');
    }
    
    const gameState = await response.json();
    return gameState;
  } catch (error) {
    console.error('Error fetching game state:', error);
    return null;
  }
};

// Function to update the game state on the server
export const updateGameState = async (state: GameState): Promise<GameState | null> => {
  try {
    const response = await fetch('http://localhost:5000/api/gamestate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(state),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update game state');
    }
    
    const updatedState = await response.json();
    return updatedState;
  } catch (error) {
    console.error('Error updating game state:', error);
    return null;
  }
};