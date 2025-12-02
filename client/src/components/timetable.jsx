import React from 'react';

/**
 * A React component to display a weekly schedule/timetable.
 *
 * @param {object} props - Component props (currently no props are used, but structure is provided).
 */
const ScheduleTable = () => {
    // In a real React application, the schedule data (day, times, subjects)
    // would typically be passed in via props or fetched from a state/API.

    const timeSlots = [
        "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
        "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM",
        "04:00 PM", "05:00 PM"
    ];

    // Example subject data for the schedule row
    const scheduleItems = [
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

    // Helper component for a single subject cell (optional, but good for structure)
    const SubjectCell = ({ code, name, teacher, index }) => (
        <td className="subject-cell" key={index}>
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
                {/* Note: In a dynamic app, the day would be a state or prop. 
                    The 'id' on the span is kept as it was in the original, but often not needed. 
                */}
                <span className="vertical-text" id="Current_day">Monday</span>
            </h2>
            <table className="schedule-table">
                <thead>
                    <tr>
                        {/* Map over the timeSlots array to generate the table headers dynamically */}
                        {timeSlots.map((time, index) => (
                            <th key={index}>{time}</th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        {/* Map over the scheduleItems array to generate the table cells dynamically */}
                        {scheduleItems.map((item, index) => (
                            <SubjectCell 
                                key={index} 
                                code={item.code} 
                                name={item.name} 
                                teacher={item.teacher} 
                                index={index} 
                            />
                        ))}
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default ScheduleTable;