import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // <-- IMPORT useNavigate
function LoginPage() {
  const navigate = useNavigate();

  // 2. Update the handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();

    // creation of formdata
    const form = new FormData(e.target);
    const formData = Object.fromEntries(form.entries());

    // authenticate user login
    const response = await fetch("http://localhost:8000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    })

    const data = await response.json();
    console.log(data)
    window.localStorage.setItem("user_creds", JSON.stringify(data.user_creds));

    alert(data.message);

    const loginSuccessful = data.success;

    if (loginSuccessful) {
      console.log('Login successful! Redirecting to dashboard...');

      // 3. Use navigate to redirect to the new route
      navigate('/dashboard');

    } else {
      // Handle login failure (show error message)
      console.log('Login failed.');
    }
  };

  const [isEmailValid, setEmailValid] = useState(null);

  const validate = async (event) => {
    const field = event.target;
    const value = field.value;

    // validate email id
    if (field.name === "email") {
      const response = await fetch("http://localhost:8000/validate-creds", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ "email": value })
      })

      const isValid = await response.json();
      setEmailValid(isValid.success ? true : false);
    }
  }

  return (
    <div>
      <div className="login-page" id="login-page">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className='mb-0'>
            <label className="label" htmlFor="email">Email</label><br />
            <input
              name='email'
              type="email"
              id="email"
              required
              placeholder="tom.holand@mcu.com"
              onChange={validate}
              className={`input-box border ${isEmailValid === true
                ? "!border-green-500"
                : isEmailValid === false
                  ? "!border-red-500"
                  : "border-gray-300"
                }`}

            />

            {
              isEmailValid === true ? (
                <p className="text-green-500">user exists</p>
              ) : isEmailValid === false ? (
                <p className="text-red-500">user doesn't exists</p>
              ) : null
            }
          </div>

          <div>
            <label className="label" htmlFor="password">Password</label><br />
            <input
              className="input-box"
              name='password'
              type="password"
              id="password"
              required
              placeholder="tom@1992#"
              onChange={validate}
            />
          </div>
          <p>
            Don't have an account? <Link to="/register">Register Account</Link>
          </p>
          {/* The <br> tag must be self-closing in JSX */}
          <br />
          <button className="button" type="submit" disabled={isEmailValid ? false : true}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
