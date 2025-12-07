import React from "react";
import TeacherTable from "../components/Table_Teacher";
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
    <div className="student-dashboard">

      {/* Header */}
      <Header />
      <Sidebar 
            name="Teacher 1001"
            email="testing@example.com"
            id="XXXXXXXXXXXXXX"
            onLogout={() => console.log("Logout clicked")}
            />

      <div className="dashboard-content">
        

        {/* Left Section – Timetable */}
        <div className="timetable-section">
          <TeacherTable />
        </div>

        {/* create announcement */}
        <Announce />

        {/* Right Section – Availability & Leave Management */}
        <div className="Teacher-availability">
          <TeacherAvailability />
        </div>
        <div className="card student-leave-container">
          <StudentLeaveManagement />
        </div>

      </div>
      <Footer />

    </div>
  );
};

export default TeacherDashboard;
