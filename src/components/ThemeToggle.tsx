
import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { FaSun, FaMoon } from 'react-icons/fa';

const ThemeToggle: React.FC = () => {
  const { toggleTheme, theme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 ${theme.cardBackground} ${theme.text} rounded-lg hover:${theme.cardBackground}/70 transition-colors`}
    >
      {theme.background === 'bg-gray-800' ? <FaMoon /> : <FaSun />}
    </button>
  );
};

export default ThemeToggle;