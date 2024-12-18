import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage";
import { Chatbot }from "./Chatbot";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/Chatbot" element={<Chatbot />} />
      </Routes>
    </Router>
  );
};

export default App;
