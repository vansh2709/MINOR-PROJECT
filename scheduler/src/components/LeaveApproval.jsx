import React, { act, useEffect, useState } from "react";
import { AppStates } from "../services/states";

const StudentLeaveManagement = ({ onApprove, onReject }) => {

  const { userData, doFetch } = AppStates();
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [selectedLeave, setSelectedLeave] = useState(null);

  async function verifyLeave(action, applicant, id) {
    console.log(action, applicant, userData.teacher_id)
    const response = await doFetch("http://localhost:8000/verify-leave", "GET", {
      "X-Action": action,
      "X-Applicant": applicant,
      "X-Verifier": userData.teacher_id
    })

    // simulate browsing like behaviour while apporving rejecting

    const res_data = await response.data?.json();
    console.log(res_data);
    if(res_data.success){
      setLeaveHistory(prev => 
        prev.filter((_,i) => i !== id)
      )
    }
  }

  async function loadLeaves() {
    if (!userData) return;
    const url = `http://localhost:8000/fetch-leaves?user_data=${encodeURIComponent(JSON.stringify(userData))}`;
    const response = await doFetch(url, "GET");
    const leaves = await response.data.json();
    setLeaveHistory(leaves.data);
  }

  useEffect(() => {
    loadLeaves();
  }, [userData])

  return (
    <div className="leave-container">
      <h2>Leaves</h2>

      <div className="leaves">
        {
          leaveHistory?.length > 0 ? (
            leaveHistory.filter(l=>l.status == "Pending")?.map((leave, id) => {
              return (
                <div key={id} className="card">
                  <div className="card-left">
                    <p><strong>Name:</strong> {leave.name}</p>
                    <p><strong>Branch:</strong> {leave.branch}</p>
                    <p><strong>Year:</strong> {leave.year}</p>
                    <p><strong>Subject:</strong> {leave.subject}</p>
                  </div>

                  <div className="card-right">
                    <button
                      className="view-app"
                      onClick={() => setSelectedLeave(leave)}
                    >
                      View Application
                    </button>

                    <p className="leaves-count">Leaves this month: {leaveHistory.length}</p>

                    <div className="btn-group">
                      <button onClick={() => verifyLeave("Rejected", leave.student_id, id)} className="reject">Reject</button>
                      <button onClick={() => verifyLeave("Approved", leave.student_id, id)} className="approve">Approve</button>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <h3>No Leaves</h3>
          )
        }
      </div>

      {/* selected leave */}
      {selectedLeave && (
        <div className="modal-overlay" onClick={() => setSelectedLeave(null)}>
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Leave Application</h2>

            <p><strong>Name:</strong> {selectedLeave.name}</p>
            <p><strong>Subject:</strong> {selectedLeave.subject}</p>
            <p><strong>From:</strong> {new Date(selectedLeave.applicable_from).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}</p>
            <p><strong>To:</strong> {new Date(selectedLeave.applicable_to).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}</p>

            <hr />

            <p className="application-text">
              {selectedLeave.application}
            </p>

            <button
              className="close-btn"
              onClick={() => setSelectedLeave(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default StudentLeaveManagement;
