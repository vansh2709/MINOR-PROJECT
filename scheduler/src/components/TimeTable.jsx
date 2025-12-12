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

  const SubjectCell = ({ code, name, teacher, cancelled }) => (
    <td className="subject-cell">
      {
        cancelled ? (
          <div className="cancelled-class">
            <p>Cancelled</p>
          </div>
        ) : (
          ""
        )
      }
      <div className="subject-box">
        {
          code ? (
            <>
              <p className="subject-code">{code}</p>
              <p className="subject-name">{name}</p>
              <p className="Teacher-name">{teacher}</p></>

          ) : (
            "Free"
          )
        }
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
              <th className="table-time" key={time}>{time}</th>
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
                cancelled={item.cancelled}
              />
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TimeTable;
