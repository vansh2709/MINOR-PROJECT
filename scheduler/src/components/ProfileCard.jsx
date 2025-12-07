import React from "react";
import { AppStates } from "../services/states";

const Sidebar = ({ name, email, id, onLogout }) => {

  const { userData } = AppStates();

  return (
    <aside className="sidebar">
      <div className="profile-card">
        <div>
          {
            userData?.avatar ? (
              <img
                className="avatar"
                src="https://via.placeholder.com/100"
                alt="Profile Avatar"
              />
            ) : (
              <h3>{ userData?.name ? userData.name[0] : "Guest" }</h3>
            )
          }
        </div>

        <div className="info-list">
          <div className="info-item">
            <span>Name</span><span>: {userData.name}</span>
          </div>
          <div className="info-item">
            <span>Email</span><span>: {userData.email}</span>
          </div>
          <div className="info-item">
            <span>ID</span><span>: {userData.role === "Student" ? userData.student_id : userData.teacher_id}</span>
          </div>
        </div>
      </div>

      <button className="logout-btn" onClick={onLogout}>
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
