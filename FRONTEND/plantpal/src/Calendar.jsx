import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Calendar.css";

export default function CareChecklist() {

  const [reminders, setReminders] = useState([]);
  const [justCompleted, setJustCompleted] = useState(null);

  // Fetch reminders from backend
  const fetchReminders = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/plants/reminders/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (Array.isArray(data)) {
        setReminders(data);
      } else {
        console.error("Unexpected response:", data);
        setReminders([]);
      }

      setJustCompleted(null); // reset animation state after refresh

    } catch (error) {
      console.error("Error fetching reminders:", error);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  // Determine display date label
  const getDateLabel = (dateString) => {
    const today = new Date();
    const dueDate = new Date(dateString);

    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);

    const diffTime = dueDate - today;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays < 0) return "Overdue";
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";

    return dueDate.toDateString();
  };

  // Mark as watered (with animation delay)
  const handleMarkWatered = async (plantId, reminderId) => {
    try {
      const token = localStorage.getItem("token");

      // trigger animation first
      setJustCompleted(reminderId);

      // delay backend update for smooth animation
      setTimeout(async () => {
        await fetch(
          `${import.meta.env.VITE_API_URL}/api/plants/water/${plantId}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        fetchReminders(); // refresh list after update
      }, 400);

    } catch (error) {
      console.error("Error updating reminder:", error);
    }
  };

  // Group reminders by date label
  const groupedReminders = reminders.reduce((groups, reminder) => {
    const label = getDateLabel(reminder.nextDueDate);
    if (!groups[label]) groups[label] = [];
    groups[label].push(reminder);
    return groups;
  }, {});

  return (
    <div className="container-fluid checklist-page">

      <div className="header">
        🌿 Care Manager
      </div>

      <div className="task-container">
        {Object.keys(groupedReminders).map((date) => (
          <div key={date} className="date-section">
            <div className="date-title">
              {date}
            </div>

            <div className="list-group">
              {groupedReminders[date].map((reminder) => (
                <div
                  key={reminder._id}
                  className="list-group-item task-item"
                >
                  <span
                    className={`task-text ${justCompleted === reminder._id ? "completed" : ""
                      }`}
                  >
                    💧 {reminder.plant?.name || "Unknown Plant"}
                  </span>

                  <div
                    className={`check-circle ${justCompleted === reminder._id ? "active" : ""
                      }`}
                    onClick={() =>
                      handleMarkWatered(
                        reminder.plant._id,
                        reminder._id
                      )
                    }
                  >
                    ✓
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}




