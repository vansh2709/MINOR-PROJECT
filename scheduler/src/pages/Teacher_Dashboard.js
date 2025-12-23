import React from "react";
import TimeTable from "../components/TimeTable";
import TeacherAvailability from "../components/TeacherAvailablility";
import StudentLeaveManagement from "../components/LeaveApproval";
import Sidebar from "../components/ProfileCard";
import Announce from "../components/Announce";
import RequestNotification from "../components/RequestNotification";
import Footer from "../components/Footer";

const TeacherDashboard = () => {
  const announcements = [
    "Tomorrow is a holiday.",
    "Submit your assignments by Friday.",
    "CS Seminar scheduled for next Monday."
  ];

  return (
    <>
      <RequestNotification />

      <div className="flex h-full">

        <div className="sidebar">
          <Sidebar />
        </div>

        <div className="dashboard teacher-dashboard overflow-hidden overflow-y-auto">
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

          <div className="footers">
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};
export default TeacherDashboard;
