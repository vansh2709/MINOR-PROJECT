import React, { useEffect, useState } from "react";

/**
 * Student Timetable Component
 * Displays a single day's schedule for a student.
 * Accepts props but works with default sample data.
 */

const StudentTable = ({ day = "Monday", timeSlots, scheduleItems }) => {
  const defaultTimeSlots = [
    "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
    "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM",
    "04:00 PM", "05:00 PM",
  ];

  let defaultSchedule = [
    { code: "AHT-030", name: "Innovations and Problem Solving", teacher: "Director" },
    { code: "AHT-030", name: "Innovations and Problem Solving", teacher: "Director" },
    { code: "AHT-030", name: "Innovations and Problem Solving", teacher: "Director" },
    { code: "AHT-030", name: "Innovations and Problem Solving", teacher: "Director" },
    { code: "AHT-030", name: "Innovations and Problem Solving", teacher: "Director" },
    { code: "", name: "Lunch Break", teacher: "" },
    { code: "AHT-030", name: "Innovations and Problem Solving", teacher: "Director" },
    { code: "AHT-030", name: "Innovations and Problem Solving", teacher: "Director" },
    { code: "AHT-030", name: "Innovations and Problem Solving", teacher: "Director" },
    { code: "AHT-030", name: "Innovations and Problem Solving", teacher: "Director" },
  ];

  const [ userData, setUserData ] = useState({});
  const [ classes, setClasses ] = useState([]);

  async function loadTimetable(params) {
    const user_creds = localStorage.getItem("user_creds");
    const userCreds = user_creds ? JSON.parse(user_creds) : undefined;
    
    if(userCreds) setUserData(userCreds);

    if (userCreds) {
      // setting default timetable in case response delays
      setClasses(defaultSchedule);

      const day = "Monday";
      const year = userCreds.year;
      const branch = userCreds.branch;
      const section = "A";

      const response = await fetch(`http://localhost:8000/get-timetable?year=${year}&branch=${branch}&section=${section}&day=${day}`);
      let data = await response.json();
      data = data.data;

      const timetable = [];

      for (let p=0; p<10; p++){
        if (p > 4) p++;
        const period = data?.classes.find(f=>f.period_id === p);

        if (period){
          const period_data = {
            code: period.subject_id,
            name: period.subject_name,
            teacher: period.teacher_name
          }
          timetable.push(period_data);
        }else{
          timetable.push({ code: "-----", name: "-----", teacher: "-----" })
        }
      }

      setClasses(timetable);
    }
  }

  useEffect(() => {
    loadTimetable();
  }, [])

  const slots = timeSlots || defaultTimeSlots;

  const SubjectCell = ({ code, name, teacher }) => (
    <td className="subject-cell">
      <div className="subject-box">
        <p className="subject-code">{code}</p>
        <p>{name}</p>
        <p className="Teacher-name">{teacher}</p>
      </div>
    </td>
  );

  return (
    <div className="schedule-container">
      <h2>
        <span className="Day-label">{day}</span>
      </h2>

      <table className="schedule-table">
        <thead>
          <tr>
            {slots.map((time) => (
              <th key={time}>{time}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          <tr>
            {classes.map((item, i) => (
              <SubjectCell
                key={i}
                code={item.code}
                name={item.name}
                teacher={item.teacher}
              />
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default StudentTable;
