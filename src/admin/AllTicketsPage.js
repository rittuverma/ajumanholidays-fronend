import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TicketsPage.css";
import { API_URL } from "../config";
import { useParams } from "react-router-dom";

const AllTicketsPage = () => {
  const { id } = useParams();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const bookingsRes = await axios.get(`${API_URL}/bookings`); // fetch all bookings
        const paymentsRes = await axios.get(`${API_URL}/payments`);
        const customersRes = await axios.get(`${API_URL}/customers/${id}`);

        const payments = paymentsRes.data;
        const customers = customersRes.data;

        // Merge data
        const combined = bookingsRes.data.map((booking) => {
          const customer = customers.find((c) => c.id === booking.customerId) || {};
          const payment = payments.find((p) => p.bookingId === booking.id) || {};
          return {
            ...booking,
            customerName: customer.name,
            customerEmail: customer.email,
            paymentAmount: payment.amount || "N/A",
            paymentStatus: payment.status || "N/A"
          };
        });

        setTickets(combined);
        setLoading(false);
      } catch (err) {
        console.error("❌ Error fetching tickets:", err);
        setLoading(false);
      }
    };

    fetchTickets();
  }, [id]);

  if (loading) return <p>Loading tickets...</p>;

  return (
    <div className="tickets-page">
      <h2>🎟️ All Tickets</h2>
      <table className="tickets-table">
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>Customer</th>
            <th>Email</th>
            <th>Route</th>
            <th>Date</th>
            <th>Status</th>
            <th>Payment</th>
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
                <td>{t.status}</td>
                <td>
                  {t.paymentAmount} ({t.paymentStatus})
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No tickets found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AllTicketsPage;
