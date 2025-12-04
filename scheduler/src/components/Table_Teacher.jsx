import React from "react";

/**
 * Teacher Timetable Component
 * Displays a single day's schedule for a teacher.
 * Currently uses static sample data, but accepts props for dynamic usage.
 */
const TeacherTable = ({ day = "Monday", timeSlots, scheduleItems }) => {
  const defaultTimeSlots = [
    "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
    "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM",
    "04:00 PM", "05:00 PM",
  ];

  const defaultSchedule = [
    { code: "AHT-030", name: "Innovations and Problem Solving", classroom: "CSE 4th year" },
    { code: "AHT-030", name: "Innovations and Problem Solving", classroom: "CSE 4th year" },
    { code: "AHT-030", name: "Innovations and Problem Solving", classroom: "CSE 4th year" },
    { code: "AHT-030", name: "Innovations and Problem Solving", classroom: "CSE 4th year" },
    { code: "AHT-030", name: "Innovations and Problem Solving", classroom: "CSE 4th year" },
    { code: "", name: "Lunch Break", classroom: "" },
    { code: "AHT-030", name: "Innovations and Problem Solving", classroom: "CSE 4th year" },
    { code: "AHT-030", name: "Innovations and Problem Solving", classroom: "CSE 4th year" },
    { code: "AHT-030", name: "Innovations and Problem Solving", classroom: "CSE 4th year" },
    { code: "AHT-030", name: "Innovations and Problem Solving", classroom: "CSE 4th year" },
  ];

  const slots = timeSlots || defaultTimeSlots;
  const items = scheduleItems || defaultSchedule;

  const SubjectCell = ({ code, name, classroom }) => (
    <td className="subject-cell">
      <div className="subject-box">
        <p className="subject-code">{code}</p>
        <p>{name}</p>
        <p className="Teacher-name">{classroom}</p>
      </div>
    </td>
  );

  return (
    <div className="schedule-container">
      <h2>
        <span className="vertical-text">{day}</span>
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
            {items.map((item, i) => (
              <SubjectCell
                key={i}
                code={item.code}
                name={item.name}
                classroom={item.classroom}
              />
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TeacherTable;
