import React from 'react';
// Import the component you just created
import LoginPage from './components/LoginBox';
import RegisterPage from './components/RegisterBox';
import Dashboard from './components/dashboard'; // <-- NEW IMPORT
import './components/style.css'
import './components/register.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    
    // BrowserRouter enables client-side routing
    <BrowserRouter>
      {/* Routes is the container for all defined routes */}
      <Routes>
        
        {/* Route 1: The Login page will show when the path is exactly "/" or "/login" */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Route 2: The Register page will show when the path is exactly "/register" */}
        <Route path="/register" element={<RegisterPage />} />
        
        {/* You can add more routes here (e.g., a dashboard) */}

        <Route path="/dashboard" element={<Dashboard />} /> {/* <-- NEW ROUTE */}

      </Routes>
    </BrowserRouter>
  );
}

export default App;
