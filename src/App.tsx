import React from "react";
import Calendar from "./Components/Calendar";
import "./App.css";

const App: React.FC = () => {
  return (
    <div className="app-container">
      <h1>Holiday Calendar</h1>
      <Calendar />
    </div>
  );
};

export default App;
