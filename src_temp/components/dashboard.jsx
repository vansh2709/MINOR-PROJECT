// src/Dashboard.jsx
import React from 'react';

function Dashboard() {
  return (
    <>
      <header>
        <nav className="navigation-bar">
          <h1>Scheduler Dashboard</h1>
          {/* You'd typically add logout, user profile links here */}
        </nav>
      </header>
      <div className="content">
        <h2>Welcome to Your Dashboard!</h2>
        <p>This is where your scheduler application content will live after successful login.</p>
        {/* Add dashboard content here */}
      </div>
      <footer className="footer">
        {/* Footer content */}
      </footer>
    </>
  );
}

export default Dashboard;