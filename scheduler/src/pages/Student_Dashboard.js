import React from "react";
import StudentTable from "../components/Table_Student";
import Announcements from "../components/Announcements";
import Sidebar from "../components/ProfileCard";
import LeaveBox from "../components/Student_Leave";
import Header from "../components/Header";
import Footer from "../components/Footer";
const StudentDashboard = () => {
  const announcements = [
    "Tomorrow is a holiday.",
    "Submit your assignments by Friday.",
    "CS Seminar scheduled for next Monday."
  ];

  return (
    <div className="student-dashboard">

      {/* Header */}
      <Header />
      <Sidebar 
            name="Student 1001"
            email="testing@example.com"
            id="2216201010XX"
            onLogout={() => console.log("Logout clicked")}
            />

      <div className="dashboard-content">

        {/* Left Section – Timetable */}
        <div className="timetable-section">
          <StudentTable />
        </div>
        <div className="leave-box">
            <LeaveBox/>
        </div>

        {/* Right Section – Announcements */}
        <div className="card">
          <Announcements announcements={announcements} />
        </div>

      </div>
      <Footer />

    </div>
    
  );
};

export default StudentDashboard;
