// src/pages/SelectSeats.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./SelectSeats.css";

export default function SelectSeats() {
  // router hooks (always call these first)
  const location = useLocation();
  const navigate = useNavigate();

  // --- Hooks (always declared at top-level) ---
  // booking state: either from location.state or from sessionStorage fallback
  const [booking, setBooking] = useState(() => {
    try {
      const fromState = location.state?.booking || null;
      if (fromState) return fromState;
      const persisted = typeof window !== "undefined" && sessionStorage.getItem("booking");
      return persisted ? JSON.parse(persisted) : null;
    } catch (err) {
      return null;
    }
  });

  // selected seats
  const [selected, setSelected] = useState([]);

  // If you later need other state (loading, error) add them here too

  // --- Effects ---
  // ensure we persist booking and redirect if missing
  useEffect(() => {
    if (!booking) {
      // If there's no booking available, go back to home after a tick
      navigate("/", { replace: true });
      return;
    }
    // persist booking for refresh / navigation safety
    try {
      sessionStorage.setItem("booking", JSON.stringify(booking));
    } catch (err) {
      // ignore storage errors
    }
  }, [booking, navigate]);

  // --- If booking still null (because redirect hasn't happened yet) return null to avoid rendering UI briefly ---
  if (!booking) return null;

  // --- Layout params and helpers (computed, not hooks) ---
  const leftSinglesCount = 5;
  const middlePairsRows = 12;
  const upperRows = 6;
  const upperLeftSingleRows = 5;
  const seatsRequested = Number(booking?.seatsRequested || booking?.seats || 1);

  // sample seat prices (replace with data from backend)
  const seatPrices = {};
  for (let r = 1; r <= middlePairsRows; r++) {
    seatPrices[`M${r}A`] = r <= 8 ? 1309 : 1179;
    seatPrices[`M${r}B`] = r <= 8 ? 1369 : 1109;
  }
  for (let i = 1; i <= leftSinglesCount; i++) {
    seatPrices[`L${i}`] = 2519 - (i - 1) * 80;
  }
  for (let r = 1; r <= upperRows; r++) {
    seatPrices[`U${r}_1`] = 2399 - (r - 1) * 40;
    seatPrices[`U${r}_2`] = 2179 - (r - 1) * 40;
  }
  for (let i = 1; i <= upperLeftSingleRows; i++) {
    seatPrices[`S${i}`] = 2519 - (i - 1) * 80;
  }

  const initiallyBooked = booking?.alreadyBooked || ["M3A", "M7B", "U2_2"];

  const toggleSeat = (id) => {
    if (initiallyBooked.includes(id)) return;
    if (selected.includes(id)) {
      setSelected((prev) => prev.filter((s) => s !== id));
      return;
    }
    if (selected.length >= seatsRequested) {
      alert(`You can select only ${seatsRequested} seat(s).`);
      return;
    }
    setSelected((prev) => [...prev, id]);
  };

  const totalAmount = selected.reduce((sum, id) => sum + (seatPrices[id] || 0), 0);

  const handlePayNow = () => {
    if (selected.length !== seatsRequested) {
      alert(`Please select ${seatsRequested} seat(s) before proceeding.`);
      return;
    }
    const payload = { ...booking, selectedSeats: selected, amount: totalAmount };
    sessionStorage.removeItem("booking");
    navigate("/payments", { state: { booking: payload } });
  };

  // --- Render ---
  return (
    <div className="select-seats-page">
      <header className="ss-header">
        <h1>Select Seats</h1>
        <div className="ss-info">
          <div>{booking.origin} → {booking.destination}</div>
          <div>{booking.date}</div>
          <div>Choose <strong>{seatsRequested}</strong> seats</div>
        </div>
      </header>

      <div className="ss-cards">
        <div className="ss-card lower-card">
          <div className="card-head">
            <h3>Lower deck</h3>
            <div className="steering">🛞</div>
          </div>
          <div className="card-body lower-body">
            <div className="left-column">
              {Array.from({ length: leftSinglesCount }).map((_, i) => {
                const id = `L${i + 1}`;
                const booked = initiallyBooked.includes(id);
                return (
                  <div key={id} className="seat-wrap long-wrap">
                    <button
                      className={`seat long ${booked ? "booked" : selected.includes(id) ? "selected" : ""}`}
                      onClick={() => toggleSeat(id)}
                      disabled={booked}
                    />
                    <div className="price">₹{seatPrices[id]}</div>
                  </div>
                );
              })}
            </div>

            <div className="middle-column">
              {Array.from({ length: middlePairsRows }).map((_, r) => {
                const row = r + 1;
                const leftId = `M${row}A`;
                const rightId = `M${row}B`;
                const leftBooked = initiallyBooked.includes(leftId);
                const rightBooked = initiallyBooked.includes(rightId);
                return (
                  <div key={row} className="pair-row">
                    <div className="seat-wrap small-wrap">
                      <button
                        className={`seat pair ${leftBooked ? "booked" : selected.includes(leftId) ? "selected" : ""}`}
                        onClick={() => toggleSeat(leftId)}
                        disabled={leftBooked}
                      />
                      <div className="price">₹{seatPrices[leftId]}</div>
                    </div>

                    <div className="seat-wrap small-wrap">
                      <button
                        className={`seat pair ${rightBooked ? "booked" : selected.includes(rightId) ? "selected" : ""}`}
                        onClick={() => toggleSeat(rightId)}
                        disabled={rightBooked}
                      />
                      <div className="price">₹{seatPrices[rightId]}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="ss-card upper-card">
          <div className="card-head">
            <h3>Upper deck</h3>
          </div>

          <div className="card-body upper-body">
           <div className="left-column">
              {Array.from({ length: upperLeftSingleRows }).map((_, i) => {
                const id = `S${i + 1}`;
                const booked = initiallyBooked.includes(id);
                return (
                  <div key={id} className="seat-wrap long-wrap">
                    <button
                      className={`seat long ${booked ? "booked" : selected.includes(id) ? "selected" : ""}`}
                      onClick={() => toggleSeat(id)}
                      disabled={booked}
                    />
                    <div className="price">₹{seatPrices[id]}</div>
                  </div>
                );
              })}
            </div>
            <div className="upper-left-col">
              {Array.from({ length: upperRows }).map((_, r) => {
                const id = `U${r + 1}_1`;
                const booked = initiallyBooked.includes(id);
                return (
                  <div key={id} className="seat-wrap long-wrap">
                    <button
                      className={`seat long ${booked ? "booked" : selected.includes(id) ? "selected" : ""}`}
                      onClick={() => toggleSeat(id)}
                      disabled={booked}
                    />
                    <div className="price">₹{seatPrices[id]}</div>
                  </div>
                );
              })}
            </div>

            <div className="upper-right-col">
              {Array.from({ length: upperRows }).map((_, r) => {
                const id = `U${r + 1}_2`;
                const booked = initiallyBooked.includes(id);
                return (
                  <div key={id} className="seat-wrap long-wrap">
                    <button
                      className={`seat long ${booked ? "booked" : selected.includes(id) ? "selected" : ""}`}
                      onClick={() => toggleSeat(id)}
                      disabled={booked}
                    />
                    <div className="price">₹{seatPrices[id]}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <footer className="ss-footer">
        <div className="selected-summary">
          <strong>Selected:</strong> {selected.join(", ") || "None"}
          <span className="total">Total: ₹{totalAmount}</span>
        </div>
        <div className="actions">
          <button className="btn secondary" onClick={() => navigate(-1)}>Back</button>
          <button className="btn primary" onClick={handlePayNow}>Pay Now • ₹{totalAmount}</button>
        </div>
      </footer>
    </div>
  );
}
