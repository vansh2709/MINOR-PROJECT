import React from "react";
import Announcements from "../components/Announcements";
import Sidebar from "../components/ProfileCard";
import LeaveBox from "../components/Student_Leave";
import Header from "../components/Header";
import Footer from "../components/Footer";
import TimeTable from "../components/TimeTable";


const StudentDashboard = () => {
  const announcements = [
    "Tomorrow is a holiday.",
    "Submit your assignments by Friday.",
    "CS Seminar scheduled for next Monday."
  ];

  return (
    <div className="dashboard">

      {/* Header */}
      <Header />

      <div className="dashboard-content">
        <Sidebar 
            name="Student 1001"
            email="testing@example.com"
            id="2216201010XX"
            onLogout={() => console.log("Logout clicked")}
            />
        {/* Left Section – Timetable */}
        <div className="timetable-section">
          <TimeTable />
        </div>

        <div className="row2">
        <div className="card other">
            <LeaveBox/>
        </div>

        {/* Right Section – Announcements */}
        <div className="card other">
          <Announcements announcements={announcements} />
        </div>
        </div>

      </div>
      <Footer />

    </div>
    
  );
};

export default StudentDashboard;
