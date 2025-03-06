import React from "react";
import { ThemeProvider } from "./context/ThemeContext";
import HomePage from "./pages/HomePage";

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <HomePage />
    </ThemeProvider>
  );
};

export default App;
