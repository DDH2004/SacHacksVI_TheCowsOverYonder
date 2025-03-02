import React from 'react';

interface GameResultModalProps {
  message: string;
  onClose: () => void;
}

const GameResultModal: React.FC<GameResultModalProps> = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-bold text-center mb-4">{message}</h2>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onClose} // Call onClose (initializeGame) when the button is clicked
            className="bg-blue-600 text-white py-2 px-4 rounded-lg"
          >
            Start New Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameResultModal;
