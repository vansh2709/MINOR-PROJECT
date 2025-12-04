import React from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import LoginBox from "../components/LoginBox";
import Footer from "../components/Footer";

function LoginPage() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const loginSuccessful = true;

    if (loginSuccessful) {
      navigate("/dashboard");
    }
  };

  return (
    <>
      <Header />
      <LoginBox handleSubmit={handleSubmit} />
      <Footer />
    </>
  );
}

export default LoginPage;
