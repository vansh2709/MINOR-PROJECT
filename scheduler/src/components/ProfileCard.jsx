import React from "react";

const Sidebar = ({ name, email, id, onLogout }) => {
  return (
    <aside className="sidebar">
      <div className="profile-card">
        <div className="avatar">
          <img
            src="https://via.placeholder.com/100"
            alt="Profile Avatar"
          />
        </div>

        <div className="info-list">
          <div className="info-item">
            <span>Name</span><span>: {name}</span>
          </div>
          <div className="info-item">
            <span>Email</span><span>: {email}</span>
          </div>
          <div className="info-item">
            <span>ID</span><span>: {id}</span>
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
