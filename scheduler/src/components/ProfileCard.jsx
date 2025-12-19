import React from "react";
import { useNavigate } from "react-router-dom";
import { AppStates } from "../services/states";

const Sidebar = ({ name, email, id, onLogout }) => {
  const navigate = useNavigate();
  const { userData } = AppStates();

  async function logout() {
    // simulate logout like buffering or loading 
    localStorage.removeItem("user_creds");
    navigate("/login");
  }

  return (
    <aside className="sidebar">
      <div className="profile-card">
        <div className="avatar">
          {
            userData?.avatar ? (
              <img
                className=""
                src="https://via.placeholder.com/100"
                alt="Profile Avatar"
              />
            ) : (
              <p className="">{userData?.name ? userData?.name[0] : "Guest"}</p>
            )
          }
        </div>

        <div className="info-list">
          <div className="info-item">
            <span>Name</span><span>: {userData?.name}</span>
          </div>
          {
            userData?.role === "Student" && (
              <>
                <div className="info-item">
                  <span>Year</span><span>: {userData?.year}</span>
                </div>

                <div className="info-item">
                  <span>Branch</span><span>: {userData?.branch}</span>
                </div>

                <div className="info-item">
                  <span>Section</span><span>: {userData?.section}</span>
                </div>
              </>
            )
          }
          <div className="info-item">
            <span>Email</span><span>: {userData?.email}</span>
          </div>
          <div className="info-item">
            <span>ID</span><span>: {userData?.role === "Student" ? userData?.student_id : userData?.teacher_id}</span>
          </div>
        </div>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
