import React from 'react';

interface StartMenuProps {
  onStart: () => void; // onStart is a function that takes no arguments and returns nothing
}

const StartMenu: React.FC<StartMenuProps> = ({ onStart }) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-blue-600 text-white">
      <h1 className="text-5xl font-bold mb-6">Market Mayhem</h1>
      <p className="text-lg mb-8">Stock Market Simulator Game</p>
      <button
        onClick={onStart}
        className="bg-white text-blue-600 px-6 py-3 rounded-lg text-xl font-semibold hover:bg-gray-200 transition"
      >
        Start Game
      </button>
    </div>
  );
};

export default StartMenu;
