import React from "react";
import TimeTable from "../components/TimeTable";
import TeacherAvailability from "../components/TeacherAvailablility";
import StudentLeaveManagement from "../components/LeaveApproval";
import Sidebar from "../components/ProfileCard";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Announce from "../components/Announce";
import RequestNotification from "../components/RequestNotification";

const TeacherDashboard = () => {
  const announcements = [
    "Tomorrow is a holiday.",
    "Submit your assignments by Friday.",
    "CS Seminar scheduled for next Monday."
  ];

  return (
    <>
      <RequestNotification />
      <div className="dashboard teacher-dashboard">
        <div className="sidebar">
          <Sidebar />
        </div>

        {/* Left Section – Timetable */}
        <div className="timetable-section">
          <TimeTable />
        </div>

        <div className="card row1 teacher-availability">
          <TeacherAvailability />
        </div>

        <div className="card other announcements">
          <Announce announcements={announcements} />
        </div>

        <div className="card other leave-management leave-verifier">
          <StudentLeaveManagement />
        </div>
      </div>
    </>
  );
};
export default TeacherDashboard;
