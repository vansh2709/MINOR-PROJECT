import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import StudentDashboard from "./pages/Student_Dashboard";
import TeacherDashboard from "./pages/Teacher_Dashboard";
import ProtectedDashboard from "./components/ProtectedDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default Route */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* After login */}
        <Route path="/dashboard" element={ <ProtectedDashboard /> } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
