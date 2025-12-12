import React, { useEffect, useState } from "react";
import Select from "react-select";
import { AppStates } from "../services/states";

const TeacherAvailability1 = ({ onSubmit }) => {

  const { userData, classes, doFetch } = AppStates();
  const [leaveType, setLeaveType] = useState("");
  const [periods, setPeriods] = useState([]);

  useEffect(() => {
    console.log(periods, leaveType)
  }, [periods, leaveType])

  const handleTeacherAvailability = async (e) => {
    e.preventDefault();

    const form = new FormData(e.target);
    const formData = Object.fromEntries(form.entries());
    formData.applicant = userData;
    formData.classes = periods;

    // send to server
    const response = await doFetch("http://localhost:8000/teacher-availability", "POST", { "Content-Type": "application/json" }, JSON.stringify(formData));

    const res_data = await response.data.json();
    alert(res_data.message);
  }

  return (
    <div className="Teacher-availability" >
      <h4 className="headings">Teacher Availability</h4>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <form onSubmit={handleTeacherAvailability}>
          <select name="leave_type" value={leaveType} onChange={(e) => setLeaveType(e.target.value)} >
            <option >Select Leave Type</option>
            <option value="period">Period</option>
            <option value="day">Entire Day</option>
            <option value="duration">DateTime Specific</option>
          </select>

          {
            leaveType === "period" ? (
              <>
                <Select
                  name="classes"
                  isMulti
                  placeholder="Select Classes"
                  options={classes.classes
                    .filter(c => c.code.trim() !== "")
                    .map(c => ({
                      value: JSON.stringify(c),
                      label: `${c.period}: ${c.code}: ${c.name} - ${c.year} - ${c.branch} - ${c.section}`
                    }))
                  }
                  onChange={(values) => setPeriods(values.map(v => JSON.parse(v.value)))}
                />

                <input name="from" type="date" min={new Date().toISOString().split("T")[0]} />
                <input name="to" type="date" min={new Date().toISOString().split("T")[0]} />
              </>
            ) : leaveType === "duration" ? (
              <>
                <input name="from" type="date" min={new Date().toISOString().split("T")[0]} />

                <input name="to" type="date" min={new Date().toISOString().split("T")[0]} />
              </>
            ) : leaveType === "day" ? (
              <>
                <label>Select Day</label>
                <input name="on" type="date" />
              </>
            ) : (
              ""
            )
          }

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default TeacherAvailability1;
