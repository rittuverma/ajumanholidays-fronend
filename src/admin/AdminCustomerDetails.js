import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";
import "./AdminCustomerDetails.css";

const AdminCustomerDetails = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ensure id is number
        const numericId = Number(id);

        const customerRes = await axios.get(`${API_URL}/customers/${numericId}`);
        setCustomer(customerRes.data);

        // Fetch bookings
        const bookingsRes = await axios.get(`${API_URL}/bookings`);
        const filteredBookings = bookingsRes.data.filter(
          (b) => b.customerId === numericId || b.email === customerRes.data.email
        );
        setBookings(filteredBookings);

        // Fetch payments
        const paymentsRes = await axios.get(`${API_URL}/payments`);
        const filteredPayments = paymentsRes.data.filter(
          (p) => p.customerId === numericId
        );
        setPayments(filteredPayments);
      } catch (err) {
        console.error("Error fetching details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <p className="loading">Loading...</p>;

  return (
    <div className="customer-details-page">
      <h2>Customer Details</h2>

      {!customer ? (
        <p>No customer found.</p>
      ) : (
        <div className="customer-info">
          <p><strong>Name:</strong> {customer.name}</p>
          <p><strong>Email:</strong> {customer.email}</p>
          {/* <p><strong>Phone:</strong> {customer.phone}</p> */}
        </div>
      )}

      <h3>Bookings</h3>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <table className="details-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Route</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>{b.origin} → {b.destination}</td>
                <td>{b.date}</td>
                <td>{b.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h3>Payments</h3>
      {payments.length === 0 ? (
        <p>No payments found.</p>
      ) : (
        <table className="details-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>₹{p.amount}</td>
                <td>{new Date(p.date).toLocaleString()}</td>
                <td>{p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminCustomerDetails;
