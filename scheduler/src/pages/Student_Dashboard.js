import Announcements from "../components/Announcements";
import Sidebar from "../components/ProfileCard";
import LeaveBox from "../components/Student_Leave";
import TimeTable from "../components/TimeTable";
import RequestNotification from "../components/RequestNotification";
import Footer from "../components/Footer";

const StudentDashboard = () => {
  return (
    <>
      <RequestNotification />

      <div>

        <div className="sidebar">
          <Sidebar />
        </div>

        <div className="dashboard overflow-hidden overflow-y-auto">
          <div className="timetable-section">
            <TimeTable />
          </div>

          <div className="leave-management card other">
            <LeaveBox />
          </div>

          <div className="announcements card other">
            <Announcements />
          </div>

          <div className="footers">
            <Footer />
          </div>

        </div>
      </div>
    </>
  );
};

export default StudentDashboard;
