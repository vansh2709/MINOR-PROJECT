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
      <h4 className="headings !m-0 !pt-0">Teacher Availability</h4>

      <div className="w-full">
        <form className="flex flex-col w-full" onSubmit={handleTeacherAvailability}>

          <div className="flex w-full gap-3 items-end">
            <select className="select-box !h-fit" name="leave_type" value={leaveType} onChange={(e) => setLeaveType(e.target.value)} >
              <option >Select Leave Type</option>
              <option value="period">Period</option>
              <option value="day">Entire Day</option>
              <option value="duration">DateTime Specific</option>
            </select>

            {
              leaveType === "period" ? (
                <>
                  <Select
                    className="w-full"
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

                  <div className="flex flex-col">
                    <label>From</label>
                    <input className="p-2 rounded-md" name="from" type="date" min={new Date().toISOString().split("T")[0]} />
                  </div>

                  <div className="flex flex-col">
                    <label>To</label>
                    <input className="p-2 rounded-md" name="to" type="date" min={new Date().toISOString().split("T")[0]} />
                  </div>
                </>
              ) : leaveType === "duration" ? (
                <>
                  <div className="flex flex-col">
                    <label>From</label>
                    <input className="p-2 rounded-md" name="from" type="date" min={new Date().toISOString().split("T")[0]} />
                  </div>

                  <div className="flex flex-col">
                    <label>To</label>
                    <input className="p-2 rounded-md" name="to" type="date" min={new Date().toISOString().split("T")[0]} />
                  </div>
                </>
              ) : leaveType === "day" ? (
                <div className="flex flex-col">
                  <label>Select Day</label>
                  <input className="p-2 rounded-md" name="on" type="date" />
                </div>
              ) : (
                ""
              )
            }
          </div>

          <button className="w-fit px-12 py-3 rounded-md ml-auto mt-3 bg-blue-500 border-none text-white" type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default TeacherAvailability1;
