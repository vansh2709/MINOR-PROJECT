import React from "react";

const Announcements = ({ announcements }) => {
  const AnnouncementItem = ({ message, index }) => (
    <li key={index}>{message}</li>
  );

  return (
    <div className="announcements-container">
      <h2>Announcements</h2>
      <ul>
        {announcements && announcements.length > 0 ? (
          announcements.map((item, index) => (
            <AnnouncementItem key={index} message={item} />
          ))
        ) : (
          <li>No announcements available</li>
        )}
      </ul>
    </div>
  );
};

export default Announcements;
