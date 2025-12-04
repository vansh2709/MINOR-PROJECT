import React from "react";

const LeaveBox = ({
  leavesThisMonth = 0,
  leaveDate = "today",
  leaveSubject = "Leave Application",
  leaveStatus = "Pending",
  onLeaveSubmit,
}) => {
  return (
    <div className="left-column">

      {/* Leave History */}
      <div className="card">
        <h3>Leave History</h3>
        <p>
          Leaves this month: <span>{leavesThisMonth}</span>
        </p>

        {/* Leave Status */}
        <h3>Leave Status</h3>
        <div className="leave-status">
          <p>
            <span>Date:</span> {leaveDate}
          </p>
          <p>
            <span>Sub:</span> {leaveSubject}
          </p>
          <p>
            <span>Status:</span> {leaveStatus}
          </p>
        </div>

        {/* Submit Leave */}
        <div className="card submit-leave">
          <h3>Submit Leave</h3>

          <textarea placeholder="Type......"></textarea>

          <div className="submit-row">
            <button
              className="submit-btn"
              onClick={onLeaveSubmit}
            >
              Submit
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};

export default LeaveBox;
