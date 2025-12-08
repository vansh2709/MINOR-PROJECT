import React, { useEffect, useRef, useState } from "react";
import { AppStates } from "../services/states";

const LeaveBox = ({
  leavesThisMonth = 0,
  leaveDate = "today",
  leaveSubject = "Leave Application",
  leaveStatus = "Pending",
  onLeaveSubmit,
}) => {

  const applicationRef = useRef(HTMLTextAreaElement);
  const applicable_from_ref = useRef(HTMLInputElement);
  const applicable_to_ref = useRef(HTMLInputElement);
  const [leaveHistory, setLeaveHistory] = useState([]);

  const { userData, doFetch } = AppStates();

  async function loadLeaves() {
    if (!userData) return;
    const url = `http://localhost:8000/fetch-leaves?user_data=${encodeURIComponent(JSON.stringify(userData))}`;
    const response = await doFetch(url, "GET");
    const leaves = await response.data.json();
    console.log(leaves.data[0])
    setLeaveHistory(leaves.data);
  }

  useEffect(() => {
    // fetch leave
    loadLeaves();
  }, [userData])

  async function submitLeave() {
    const application = applicationRef.current.value;
    const from = applicable_from_ref.current.value;
    const to = applicable_to_ref.current.value;

    if (application === "" || !from || !to) {
      alert("Enter leave details");
      return;
    }

    const subject = application.match(/[Ss]ubject\s*:\s*(.*)\n/)[1];

    // upload to database
    const leave = {
      applicant: userData,
      subject: subject,
      application: application,
      applicable_from: from,
      applicable_to: to
    }

    const response = await fetch("http://localhost:8000/upload-leave", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(leave)
    })
    const resdata = await response.json();
    alert(resdata.message);
  }

  return (
    <div className="leave-submission">

      {/* Leave History */}
      <div className="leave-box">
        <div className="leave-history">
        <h3>Leave History</h3>
        <p>
          Leaves this month: <span>{leaveHistory.length}</span>
        </p>
        </div>

        {/* Leave Status */}
        <div className="leave-status">
        <h3>Leave Status</h3>
        <div className="leave-status">
          {
            leaveHistory[0]?.status === "Pending" ? (
              <>
                <p>
                  <span>Date:</span> {new Date(leaveHistory[0].created_at).toLocaleString("en-IN")}
                </p>
                <p>
                  <span>Sub:</span> {leaveHistory[0].subject}
                </p>
                <p>
                  <span>Status:</span> {leaveHistory[0].status}
                </p>
              </>
            ) : (
              <></>
            )
          }
        </div>
        </div>

        {/* Submit Leave */}
        <div className="submit-leave">
          <h3>Submit Leave</h3>

          <div className="flex gap-4 my-4">
            <div className="flex flex-col">
              <label>From</label>
              <input ref={applicable_from_ref} name="applicable_from" type="date" required />
            </div>

            <div className="flex flex-col">
              <label>To</label>
              <input ref={applicable_to_ref} name="applicable_to" type="date" required />
            </div>
          </div>

          <textarea class="input-box" ref={applicationRef} name="leave_application" placeholder="Type......" required></textarea>

          <div className="submit-row">
            <button
              className="submit-btn"
              onClick={submitLeave}
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
