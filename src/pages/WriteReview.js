// src/pages/WriteReview.js
import React, { useState, useEffect } from "react";
import { API_URL } from "../config";
import "./WriteReview.css";


export default function WriteReview() {
  const [form, setForm] = useState({
    name: "",
    rating: 5,
    comment: ""
  });

  const [reviews, setReviews] = useState([]);

  // 🔹 Fetch all reviews on page load
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${API_URL}/reviews`);
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      console.error("❌ Error fetching reviews:", err);
    }
  };


  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleStarClick = (rating) => {
    setForm({ ...form, rating });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        alert("Review submitted successfully!");
        console.log("Saved Review:", data);
        setForm({ name: "", rating: 5, comment: "" });

        // 🔹 Refresh reviews list
      fetchReviews();

      } else {
        console.error("Server Error:", res.status, data);
        alert("Error submitting review.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Network error submitting review.");
    }finally {
      setLoading(false);
    }
  };

  return (
    
    <div className="review-form-page">
      <div className="form-section">
        <h2>Share Your Experience</h2>
        <p className="form-subtitle">We’d love to hear your feedback!</p>

      <form onSubmit={handleSubmit} className="review-form">
        <label>
            Your Name
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>
        {/* ⭐ Star Rating */}
        <label>
            Rating
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={star <= form.rating ? "star filled" : "star"}
                  onClick={() => handleStarClick(star)}
                >
                  ★
                </span>
              ))}
            </div>
          </label>
        <label>
            Your Review
            <textarea
              name="comment"
              placeholder="Write something..."
              value={form.comment}
              onChange={handleChange}
              required
            />
          </label>
        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
      {/* 🔹 Show submitted reviews */}
      <div className="reviews-list">
        <h3>Customer Reviews</h3>
        {reviews.length === 0 ? (
          <p className="empty-state">No reviews yet. Be the first!</p>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="review-card">
              <h4>
                {r.name} – <span className="stars">{"★".repeat(r.rating)}</span>
              </h4>
              <p>{r.comment}</p>
              <small>
                {r.date
                  ? new Date(r.date).toLocaleDateString()
                  : "Just now"}
              </small>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
