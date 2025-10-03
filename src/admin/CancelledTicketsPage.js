import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TicketsPage.css";
import { API_URL } from "../config";
import { useParams } from "react-router-dom";

const CancelledTicketsPage = () => {
    const { id } = useParams();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCancelled = async () => {
      try {
        const bookingsRes = await axios.get(`${API_URL}/bookings`);
        const customersRes = await axios.get(`${API_URL}/customers/${id}`);

        const customers = customersRes.data;

        const cancelled = bookingsRes.data
          .filter((b) => b.status === "cancelled")
          .map((booking) => {
            const customer = customers.find((c) => c.id === booking.customerId) || {};
            return {
              ...booking,
              customerName: customer.name,
              customerEmail: customer.email
            };
          });

        setTickets(cancelled);
        setLoading(false);
      } catch (err) {
        console.error("❌ Error fetching cancelled tickets:", err);
        setLoading(false);
      }
    };

    fetchCancelled();
  }, [id]);

  if (loading) return <p>Loading cancelled tickets...</p>;

  return (
    <div className="tickets-page">
      <h2>❌ Cancelled Tickets</h2>
      <table className="tickets-table">
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>Customer</th>
            <th>Email</th>
            <th>Route</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {tickets.length > 0 ? (
            tickets.map((t) => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.customerName}</td>
                <td>{t.customerEmail}</td>
                <td>{t.origin} → {t.destination}</td>
                <td>{t.date}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No cancelled tickets found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CancelledTicketsPage;
