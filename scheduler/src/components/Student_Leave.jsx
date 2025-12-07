import React, { useRef } from "react";
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

  const { userCreds } = AppStates();

  async function submitLeave() {
    const application = applicationRef.current.value;

    const subject = application.match(/[Ss]ubject\s*:\s*(.*)\n/)[1];
    const from = applicable_from_ref.current.value;
    const to = applicable_to_ref.current.value;

    // upload to database
    const leave = {
      applicant: userCreds, 
      subject: subject, 
      application: application, 
      applicable_from: from, 
      applicable_to: to
    }

    console.log(leave)

    // const response = await fetch("http://localhost:8000/upload-leave", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json"
    //   },
    //   body: JSON.stringify()
    // })
  }

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

          <div className="flex gap-4 my-4">
            <div className="flex flex-col">
              <label>From</label>
              <input ref={applicable_from_ref} name="applicable_from" type="date" />
            </div>

            <div className="flex flex-col">
              <label>To</label>
              <input ref={applicable_to_ref} name="applicable_to" type="date" />
            </div>
          </div>

          <textarea ref={applicationRef} name="leave_application" placeholder="Type......"></textarea>

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
