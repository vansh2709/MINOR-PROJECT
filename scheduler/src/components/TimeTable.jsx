import React, { useEffect, useState } from "react";
import { AppStates } from "../services/states";

/**
 * Student Timetable Component
 * Displays a single day's schedule for a student.
 * Accepts props but works with default sample data.
 */

const TimeTable = ({ day = "Monday" }) => {
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

  const { classes } = AppStates();
  
  const slots = defaultTimeSlots;

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
        <span className="Day-label">{classes.day}</span>
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
            {classes?.classes?.map((item, i) => (
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

export default TimeTable;
