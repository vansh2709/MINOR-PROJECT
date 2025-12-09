import React, { useState } from "react";

const TeacherAvailability1 = ({ onSubmit }) => {
  const [availability, setAvailability] = useState("");
  const [duration, setDuration] = useState("");
  const [calendar, setCalendar] = useState("");

  const handleSubmit = () => {
    if (!availability) return alert("Select availability.");
  
    if (availability === "entireday" && !duration)
      return alert("Select duration.");

    if ((availability === "leave" || availability === "entireday") && !calendar)
      return alert("Select date & time.");

    onSubmit({
      availability,
      duration: availability === "entireday" ? duration : null,
      expires_at: calendar,
    });

    setAvailability("");
    setDuration("");
    setCalendar("");
  };

  return (
    <div className="Teacher-availability">
      <h3>Teacher Availability</h3>

      {/* Availability Options */}
      <label>
        <input
          type="radio"
          name="availability"
          value="1lecture"
          checked={availability === "1lecture"}
          onChange={(e) => setAvailability(e.target.value)}
        />
        1st Lecture
      </label>

      <label>
        <input
          type="radio"
          name="availability"
          value="entireday"
          checked={availability === "entireday"}
          onChange={(e) => setAvailability(e.target.value)}
        />
        Entire Day (Substitute Needed)
      </label>

      <label>
        <input
          type="radio"
          name="availability"
          value="leave"
          checked={availability === "leave"}
          onChange={(e) => setAvailability(e.target.value)}
        />
        Taking Leave (Assign Substitute)
      </label>

      {/* Duration dropdown for Entire Day */}
      {availability === "entireday" && (
        <select value={duration} onChange={(e) => setDuration(e.target.value)}>
          <option value="">Select Duration</option>
          <option value="1hour">1 Hour</option>
          <option value="2hours">2 Hours</option>
          <option value="fullday">Entire Day</option>
        </select>
      )}

      {/* CALENDAR INPUT FOR LEAVE / ENTIRE DAY */}
      {(availability === "leave" || availability === "entireday") && (
        <div>
          <input
            className="select-box"
            name="expires_at"
            type="datetime-local"
            value={calendar}
            onChange={(e) => setCalendar(e.target.value)}
          />
        </div>
      )}

      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default TeacherAvailability1;
