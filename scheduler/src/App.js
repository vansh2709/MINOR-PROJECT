import React from "react";
import { BorwserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={ <Home /> } />
        <Route path="/signin" element={ <Login /> } />
        <Route path="/signup" element={ <Register /> } />
      </Routes>
    </Router>
  );
}

export default App;
