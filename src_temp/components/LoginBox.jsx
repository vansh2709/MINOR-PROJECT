import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // <-- IMPORT useNavigate
function LoginPage() {
const navigate = useNavigate();

  // 2. Update the handleSubmit function
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt...');

    // **Simulate Login Logic:**
    // In a real application, you would perform validation,
    // send credentials to a server, and wait for a response here.
    
    const loginSuccessful = true; // Assume success for this example

    if (loginSuccessful) {
      console.log('Login successful! Redirecting to dashboard...');
      
      // 3. Use navigate to redirect to the new route
      navigate('/dashboard'); 
      
    } else {
      // Handle login failure (show error message)
      console.log('Login failed.');
    }
  };

  return (
    <>
      <header>
        <nav className="navigation-bar">
          <h1>Scheduler</h1>
          <div>
            <a href="#">About</a>
            <a href="#">Contact Admin</a>
          </div>
        </nav>
      </header>
      <div className="content">
        <div className="login-page" id="login-page">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email">Email</label>
              <input
                className="input-box"
                type="email"
                id="email"
                placeholder="tom.holand@mcu.com"
              />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input
                className="input-box"
                type="password"
                id="password"
                placeholder="tom@1992#"
              />
            </div>
            <p>
              Don't have an account? <Link to="/register">Register Account</Link>
            </p>
            {/* The <br> tag must be self-closing in JSX */}
            <br />
            <button className="button" type="submit">
              Login
            </button>
          </form>
        </div>
      </div>
      <footer className="footer">
        <a href="#">T's & C's</a>
        <a href="#">Calendar</a>
        <a href="#">Exit</a>
      </footer>
    </>
  );
}

export default LoginPage;
