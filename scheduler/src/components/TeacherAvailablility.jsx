import React, { useState } from "react";

const TeacherAvailability = ({ onSubmit }) => {
  const [availability, setAvailability] = useState("");

  const handleSelection = (event) => {
    setAvailability(event.target.value);
  };

  const handleSubmit = () => {
    if (availability) {
      onSubmit(availability);
      setAvailability("");
    } else {
      alert("Please select your availability.");
    }
  };

  return (
    <div className="card">
      <h3>Teacher Availability</h3>

      <div className="availability-container">
        <div className="availability-options">
          <label>
            <input
              type="radio"
              name="availability"
              value="1lecture"
              checked={availability === "1lecture"}
              onChange={handleSelection}
            />
            1st Lecture
          </label>

          <label>
            <input
              type="radio"
              name="availability"
              value="entireday"
              checked={availability === "entireday"}
              onChange={handleSelection}
            />
            Entire Day
          </label>
        </div>

        <div className="availability-submit">
          <button className="availability-btn" onClick={handleSubmit}>
            I'm Available
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherAvailability;
