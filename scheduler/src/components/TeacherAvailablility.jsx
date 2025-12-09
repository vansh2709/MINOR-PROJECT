import React, { useState } from "react";

const TeacherAvailability1 = ({ onSubmit }) => {
  const [availability, setAvailability] = useState("");
  const [lectureCount, setLectureCount] = useState(""); 
  const [duration, setDuration] = useState("");
  const [calendar, setCalendar] = useState("");

  const handleSubmit = () => {
    if (!availability) return alert("Select availability.");

    if (availability === "lectures" && !lectureCount)
      return alert("Select number of lectures.");

    if (availability === "entireday" && !duration)
      return alert("Select duration.");

    if ((availability === "leave" || availability === "entireday") && !calendar)
      return alert("Select date & time.");

    onSubmit({
      availability,
      lectureCount: availability === "lectures" ? lectureCount : null,
      duration: availability === "entireday" ? duration : null,
      expires_at: calendar,
    });

    setAvailability("");
    setLectureCount("");
    setDuration("");
    setCalendar("");
  };

  return (
    <div className="Teacher-availability">
      <h3 className="headings">Teacher Availability</h3>

      {/* Availability Options */}
      <label className="radio-option label">
        <input
          type="radio"
          name="availability"
          value="lectures"
          checked={availability === "lectures"}
          onChange={(e) => setAvailability(e.target.value)}
        />
        <span class="radio-custom"></span>
        Single hour leave
      </label>

      <label className="radio-option label">
        <input
          type="radio"
          name="availability"
          value="entireday"
          checked={availability === "entireday"}
          onChange={(e) => setAvailability(e.target.value)}
        />
        <span class="radio-custom"></span>
        Entire Day (Substitute Needed)
      </label>

      <label className="radio-option label">
        <input
          type="radio"
          name="availability"
          value="leave"
          checked={availability === "leave"}
          onChange={(e) => setAvailability(e.target.value)}
        />
        <span class="radio-custom"></span>
        Taking Leave (Assign Substitute)
      </label>

      {/* the fuckin dropdown */}
      {availability === "lectures" && (
        <select className="select-box" value={lectureCount} onChange={(e) => setLectureCount(e.target.value)}>
          <option value="">Select Number of Lectures</option>
          <option value="1">1 Lecture</option>
          <option value="2">2 Lectures</option>
          <option value="3">3 Lectures</option>
          <option value="4">4 Lectures</option>
          <option value="5">5 Lectures</option>
        </select>
      )}

      {/* duration dropdown for entire fuckin day */}
      {availability === "entireday" && (
        <select className="select-box" value={duration} onChange={(e) => setDuration(e.target.value)}>
          <option value="">Select Duration</option>
          <option value="1hour">1 Hour</option>
          <option value="2hours">2 Hours</option>
          <option value="fullday">Entire Day</option>
        </select>
      )}

      {/* Calendar input for some lectures / entire day */}
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
      <br/>
      <button className="button" onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default TeacherAvailability1;
