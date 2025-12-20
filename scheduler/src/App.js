import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedDashboard from "./components/ProtectedDashboard";
import Header from "./components/Header";
import Footer from "./components/Footer";

import { GlobalProvider } from "./services/states";

function App() {
  return (
    <GlobalProvider>
      <Header />
      <BrowserRouter>
        <Routes>
          {/* Default Route */}
          <Route path="/" element={<ProtectedDashboard />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* After login */}
          <Route path="/dashboard" element={<ProtectedDashboard />} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </GlobalProvider>
  );
}

export default App;
