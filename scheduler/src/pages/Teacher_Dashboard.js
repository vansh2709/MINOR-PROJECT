import React from "react";
import TimeTable from "../components/TimeTable";
import TeacherAvailability from "../components/TeacherAvailablility";
import StudentLeaveManagement from "../components/LeaveApproval";
import Sidebar from "../components/ProfileCard";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Announce from "../components/Announce";

const TeacherDashboard = () => {
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
            name="Teacher 1001"
            email="testing@example.com"
            id="XXXXXXXXXXXXXX"
            onLogout={() => console.log("Logout clicked")}
            />
        {/* Left Section – Timetable */}
        <div className="timetable-section">
          <TimeTable />
        </div>
        <div className="card row1 ">
          <TeacherAvailability />
        </div>            
        <div className="row2">
        <div className="card other">
          <Announce announcements={announcements} />
        </div>
        <div className="card other">
          <StudentLeaveManagement />
        </div>
        </div>
      </div>
      <Footer />

    </div>
  );
};
export default TeacherDashboard;
