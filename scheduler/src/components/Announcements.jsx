import React from "react";

const Announcements = ({ announcements }) => {
  const AnnouncementItem = ({ message, index }) => (
    <li key={index}>{message}</li>
  );

  return (
    <div className="announcements">
      <h2 className="headings">Announcements</h2><br/>
      <div className="announcements-container">
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
    </div>
  );
};

export default Announcements;
