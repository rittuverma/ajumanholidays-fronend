import React, { useEffect, useState, useContext } from "react"; 
import { API_URL } from "../config";
import { CustomerContext } from "../Context/CustomerContext";
import "./NotificationPage.css";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const { customer } = useContext(CustomerContext);

  // Fetch notifications
  useEffect(() => {
  if (customer?.id) {
    fetch(`${API_URL}/notifications/${customer.id}`)
      .then(res => res.json())
      .then(data => setNotifications(data))
      .catch(err => console.error("Error fetching notifications:", err));
  }
}, [customer]);

  // Mark notification as read
  const markAsRead = async (id) => {
    await fetch(`${API_URL}/notifications/${id}/read`, { method: "PUT" });
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  return (
    <div className="notifications-page">
      <h2>🔔 Notifications for {customer?.name || "Guest"}</h2>
      {notifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        <ul>
          {notifications.map((n) => (
            <li key={n.id} className={n.isRead ? "read" : "unread"}>
              <div>
                <p>
                    {n.type === "booking" && "✅"}
                    {n.type === "cancellation" && "❌"}
                    {n.type === "payment" && "💳"}
                    {n.type === "delay" && "🚌"}
                    {n.message}
                </p>
                <small>
                    {n.date}
                </small>
              </div>
              {!n.isRead && (
                <button onClick={() => markAsRead(n.id)}>Mark as Read</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
