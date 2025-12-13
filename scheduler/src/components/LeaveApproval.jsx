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
    if (res_data.success) {
      setLeaveHistory(prev =>
        prev.filter((_, i) => i !== id)
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
            leaveHistory.filter(l => l.status == "Pending")?.map((leave, id) => {
              return (
                <div key={id} className="leave card flex justify-between gap-2">
                  <div className="card-left">
                    <p><strong>Name:</strong> {leave.name}</p>
                    <p><strong>Branch:</strong> {leave.branch}</p>
                    <p><strong>Year:</strong> {leave.year}</p>
                    <p><strong>Subject:</strong> {leave.subject}</p>
                  </div>

                  <div className="card-right flex flex-col items-end gap-1 flex-1">
                    <button
                      className="view-app bg-transparent text-blue-600 border-none"
                      onClick={() => {
                        console.log(leave)
                        setSelectedLeave(leave)
                      }}
                    >
                      View Application
                    </button>

                    <p className="leaves-count">Leaves this month: {leaveHistory.length}</p>

                    <div className="btn-group mt-auto flex gap-2">
                      <button onClick={() => verifyLeave("Rejected", leave.student_id, id)} className="reject border-none rounded-md py-1 px-3 bg-red-500 text-white">Reject</button>
                      <button onClick={() => verifyLeave("Approved", leave.student_id, id)} className="approve border-none rounded-md py-1 px-3 bg-green-500 text-white">Approve</button>
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
        <div
          className="fixed inset-0 z-110 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setSelectedLeave(null)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-xl shadow-xl p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4">
              Leave Application
            </h2>

            <div className="space-y-1 text-sm">
              <p><strong>Name:</strong> {selectedLeave.name}</p>
              <p><strong>Subject:</strong> {selectedLeave.subject}</p>
              <p>
                <strong>From:</strong>{" "}
                {new Date(selectedLeave.applicable_from).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
              <p>
                <strong>To:</strong>{" "}
                {new Date(selectedLeave.applicable_to).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>

            <hr className="my-4" />

            <p className="text-sm text-gray-700 whitespace-pre-wrap max-h-60 overflow-y-auto">
              {selectedLeave.application}
            </p>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedLeave(null)}
                className="px-4 py-2 rounded-md bg-gray-800 text-white hover:bg-gray-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default StudentLeaveManagement;
