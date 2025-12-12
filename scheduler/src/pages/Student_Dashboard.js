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
      <div className="sidebar">
        <Sidebar />
      </div>

      {/* Left Section – Timetable */}
      <div className="timetable-section">
        <TimeTable />
      </div>

      <div className="leave-management card other">
        <LeaveBox />
      </div>

      <div className="announcements card other">
        <Announcements announcements={announcements} />
      </div>
    </div>
  );
};

export default StudentDashboard;
