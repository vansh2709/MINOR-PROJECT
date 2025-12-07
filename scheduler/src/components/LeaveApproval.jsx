import React from "react";

const StudentLeaveManagement = ({ onApprove, onReject }) => {
  return (
    <div className="Student-leave-management">
      <h2>Student Leave Management</h2>

      <div className="submit-row">
        <button className="approve-btn" onClick={onApprove}>
          Approve
        </button>

        <button className="reject-btn" onClick={onReject}>
          Reject
        </button>
      </div>
    </div>
  );
};

export default StudentLeaveManagement;
