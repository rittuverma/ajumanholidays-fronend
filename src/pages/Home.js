import React, { useState } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../App.css"; // your styles
import { useNavigate } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { API_URL } from "../config";
import ContactWidget from "../components/ContactWidget";

// import { Link } from "react-router-dom";
// import ReviewFormPopup from "../components/ReviewFormPopup";




// const inputStyle = {
//   width: "100%",
//   padding: "10px",
//   borderRadius: "8px",
//   border: "1px solid #ccc",
//   fontSize: "1rem",
// };

// const buttonStyle = {
//   backgroundColor: "#007bff",
//   color: "#fff",
//   padding: "12px 30px",
//   fontSize: "1rem",
//   border: "none",
//   borderRadius: "8px",
//   cursor: "pointer",
// };

const heroImages = ["/slide1.jpeg", "/slide2.jpeg", "/slide3.jpeg",];
const heroSliderSettings = {
  dots: true,
  infinite: true,
  autoplay: true,
  autoplaySpeed: 3000,
  speed: 1000,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
};

const routeSliderSettings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 768,
      settings: { slidesToShow: 1 },
    },
    {
      breakpoint: 1024,
      settings: { slidesToShow: 2 },
    },
  ],
};

const allRoutes = [
  {
    from: "Delhi",
    to: "Gorakhpur",
    image: "/routes/delhi-manali.jpg",
  },
  {
    from: "Gorakhpur",
    to: "Delhi",
    image: "/routes/mumbai-goa.jpg",
  },
  {
    from: "Delhi",
    to: "Katra",
    image: "/routes/jaipur-udaipur.jpeg",
  },
  {
    from: "Katra",
    to: "Delhi",
    image: "/routes/bangalore-chennai.jpg",
  },
];

export default function Home() {
  // const [isPopupOpen, setPopupOpen] = useState(false);
  // const [isOpen, setIsOpen] = useState(false);
  
  const [formData, setFormData] = useState({
  name: "",
  origin: "",
  destination: "",
  date: "",
  seats: 1,
});

const handleChange = e => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};

const handleSubmit = async e => {
  e.preventDefault();
  await fetch(`${API_URL}/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
  alert("Booking submitted successfully!");
};

const navigate = useNavigate();
 
  const [filteredRoutes, setFilteredRoutes] = useState(allRoutes);

  const handleLocationFilter = (e) => {
    const val = e.target.value.toLowerCase();
    const filtered = allRoutes.filter(
      (route) =>
        route.from.toLowerCase().includes(val) ||
        route.to.toLowerCase().includes(val)
    );
    setFilteredRoutes(filtered);
  };

  const handlePriceFilter = (e) => {
    const val = e.target.value;
    let sorted = [...filteredRoutes];
    if (val === "asc") {
      sorted.sort((a, b) => parseInt(a.price) - parseInt(b.price));
    } else if (val === "desc") {
      sorted.sort((a, b) => parseInt(b.price) - parseInt(a.price));
    }
    setFilteredRoutes(sorted);
  };

  return (
    <div>
      {/* Top Header */}
      <div className="top-header">
        <div>
          📧{" "}
          <a href="mailto:ajumanholidays@gmail.com" style={{ textDecoration: "none", color: "#fffbfbff" }}>
            ajumanholidays@gmail.com
          </a>
        </div>
        <div>
          <Link to="/login"><button>Customer Login</button></Link>
          <Link to="/admin"><button style={{ marginLeft: "10px" }}>Admin Login</button></Link>
        </div>
      </div>

      {/* Header */}
      <header>
        <div className="logo">
          <img src="/logo.jpg" alt="Ajuman Holidays Logo" />
          <span>AJUMAN HOLIDAYS</span>
        </div>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/manage-bookings">Manage Booking</Link>
          <Link to="/about">About</Link>
        </nav>
      </header>

      {/* Hero Slider */}
      <section className="hero-slider">
  <Slider {...heroSliderSettings}>
    {heroImages.map((src, index) => (
      <div key={index} className="slider-slide">
        <img src={src} alt={`Slide ${index}`} className="hero-image" />

        {/* Overlay with text + booking form */}
        <div className="slide-overlay">
          <div className="overlay-text">
            {index === 0 && (
              <>
                <h2>Plan Your Trip</h2>
                <p>Across major cities</p>
              </>
            )}
            {index === 1 && (
              <>
                <h2>Enjoy the Ride</h2>
                <p>Luxury meets safety</p>
              </>
            )}
            {index === 2 && (
              <>
                <h2>Ajuman Holidays</h2>
                <p>Your travel partner</p>
              </>
            )}
            <button className="overlay-button" onClick={() => navigate("/gallery")}>Explore Now</button>
          </div>

          {/* Booking Form Inside Overlay */}
         <div className="overlay-form">
  <form onSubmit={handleSubmit}>
    <input
      name="name"
      type="text"
      placeholder="Your Name"
      value={formData.name}
      onChange={handleChange}
      required
    />

    <div className="swap-container">
      <input
        name="origin"
        type="text"
        placeholder="Origin"
        value={formData.origin}
        onChange={handleChange}
        required
      />
      <button
        type="button"
        className="swap-btn"
        onClick={() => {
          setFormData({
            ...formData,
            origin: formData.destination,
            destination: formData.origin,
          });
        }}
      >
        ⇆
      </button>
      <input
        name="destination"
        type="text"
        placeholder="Destination"
        value={formData.destination}
        onChange={handleChange}
        required
      />
    </div>

    <input
      name="date"
      type="date"
      value={formData.date}
      onChange={handleChange}
      required
    />

    <input
      name="seats"
      type="number"
      min="1"
      value={formData.seats}
      onChange={handleChange}
      required
    />

    <button type="submit">Book Now</button>
  </form>
</div>


        </div>
      </div>
    ))}
  </Slider>
</section>


      {/* Popular Routes */}
      <section className="popular-routes">
        <h2>Popular Routes</h2>

        {/* Filter Inputs */}
        <div className="filter-section">
          <input type="text" placeholder="Search by location…" onChange={handleLocationFilter} />
          <select onChange={handlePriceFilter}>
            <option value="">Sort by Price</option>
            <option value="asc">Low to High</option>
            <option value="desc">High to Low</option>
          </select>
        </div>

        <Slider {...routeSliderSettings}>
          {filteredRoutes.map((route, index) => (
            <div key={index} className="route-card">
              <img src={route.image} alt={`${route.from} to ${route.to}`} className="route-img" />
              <h3>{route.from} → {route.to}</h3>
              
                <button className="book-btn" onClick={() => navigate("/login")}>Book Now</button>
              
            </div>
          ))}
        </Slider>
      </section>

      
{/* Amenities Section */}
<section className="amenities">
  <h2>Onboard Amenities</h2>

  <div className="amenity-category">
    <h3>🛋️ Comfort</h3>
    <div className="amenities-grid">
      <div className="amenity-card">
        <img src="/icons/sleeper.jpg" alt="Sleeper Coaches" />
        <p>Clean Sleeper Coaches</p>
      </div>
      <div className="amenity-card">
        <img src="/icons/cabin.png" alt="Cabins" />
        <p>Cozy Spacious Cabins</p>
      </div>
      <div className="amenity-card">
        <img src="/icons/curtain.png" alt="Curtains" />
        <p>Private Curtains</p>
      </div>
    </div>
  </div>

  <div className="amenity-category">
    <h3>🔌 Connectivity</h3>
    <div className="amenities-grid">
      <div className="amenity-card">
        <img src="/icons/wifi.png" alt="Free WiFi" />
        <p>Free Wi-Fi</p>
      </div>
      <div className="amenity-card">
        <img src="/icons/charging.webp" alt="Charging Point" />
        <p>Charging Point</p>
      </div>
      <div className="amenity-card">
        <img src="/icons/reading-light.webp" alt="Reading Light" />
        <p>Reading Light</p>
      </div>
    </div>
  </div>

  <div className="amenity-category">
    <h3>🚻 Convenience</h3>
    <div className="amenities-grid">
      <div className="amenity-card">
        <img src="/icons/toilet.png" alt="Toilets" />
        <p>Onboard Toilets</p>
      </div>
      <div className="amenity-card">
        <img src="/icons/water.png" alt="Water Bottle" />
        <p>Free Water Bottle</p>
      </div>
      <div className="amenity-card">
        <img src="/icons/sanitizer.png" alt="Sanitized" />
        <p>Sanitized Buses</p>
      </div>
    </div>
  </div>
</section>
{/* Salient Features */}
<section className="salient-features">
  <h2>Salient Features</h2>
  <div className="features-scroll-container">
    {[
      {
        icon: "/icons/support.png",
        title: "24x7 Support",
        description: "Round-the-clock assistance for all your travel needs.",
      },
      {
        icon: "/icons/tracking.png",
        title: "Real-Time Tracking",
        description: "Track your bus live and stay updated about delays.",
      },
      {
        icon: "/icons/cancellation.png",
        title: "Easy Cancellations",
        description: "Flexible policies and hassle-free refunds.",
      },
      {
        icon: "/icons/trust.png",
        title: "Trusted by Thousands",
        description: "Backed by genuine reviews and a loyal customer base.",
      },
      {
        icon: "/icons/payment.png",
        title: "Secure Payments",
        description: "Your transactions are encrypted and 100% safe.",
      },
    ].map((feature, index) => (
      <div key={index} className="feature-card animate-card">
        <img src={feature.icon} alt={feature.title} className="feature-icon" />
        <h4>{feature.title}</h4>
        <p>{feature.description}</p>
      </div>
    ))}
  </div>
</section>


{/* Testimonials Section */}
<section className="testimonials">
  <h2>What Our Customers Say</h2>

  <Slider
    dots={true}
    infinite={true}
    autoplay={true}
    autoplaySpeed={4000}
    slidesToShow={2}
    slidesToScroll={1}
    responsive={[
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ]}
  >
    {[
      {
        name: "Aarav Sharma",
        feedback: "Amazing service! The buses were clean, punctual and the booking process was very smooth.",
        rating: 5,
        image: "https://randomuser.me/api/portraits/men/32.jpg"
      },
      {
        name: "Priya Mehta",
        feedback: "Loved the cozy sleeper cabins and onboard amenities. Ajuman Holidays is my go-to for travel!",
        rating: 4,
        image: "https://randomuser.me/api/portraits/women/65.jpg"
      },
      {
        name: "Rahul Verma",
        feedback: "Real-time tracking gave me peace of mind. Highly recommended for family travel.",
        rating: 5,
        image: "https://randomuser.me/api/portraits/men/75.jpg"
      },
    ].map((testimonial, index) => (
      <div className="testimonial-card" key={index}>
        <img src={testimonial.image} alt={testimonial.name} />
        <p className="feedback">"{testimonial.feedback}"</p>
        <div className="stars">
          {Array.from({ length: testimonial.rating }).map((_, i) => (
            <span key={i}>⭐</span>
          ))}
        </div>
        <h4>{testimonial.name}</h4>
      </div>
    ))}
  </Slider>

  <div className="review-button-wrap">
      <button className="write-review-btn" onClick={() => navigate("/login")}>Write a Review</button>
  </div>
</section>
{/* Our Gallery Section */}
<section className="gallery-section">
  <div className="gallery-item">
    <h2 className="section-title">Our Gallery</h2>
    <div className="gallery-grid">
      {["gallery1.jpeg", "gallery2.jpeg", "gallery3.webp", "gallery4.webp", "gallery5.webp", "gallery6.jpg", "gallery7.jpg", "gallery8.jpeg"].map((img, index) => (
        <img
          key={index}
          src={`/images/gallery/${img}`}
          alt={`Gallery ${index + 1}`}
          className="w-full h-64 object-cover rounded-lg shadow-md"
        />
      ))}
    </div>
  </div>
</section>
{/* Thank You Section */}
<section className="thank-you-section" style={{ padding: "60px 20px", textAlign: "center", backgroundColor: "#b2d0ea" }}>
  <div style={{ maxWidth: "700px", margin: "auto" }}>
    <h2 style={{ fontSize: "2.5rem", color: "#222", marginBottom: "20px" }}>Thank You!</h2>
    <p style={{ fontSize: "1.125rem", color: "#555", marginBottom: "16px" }}>
      Thank you for exploring Ajuman Holidays. We appreciate your interest and support.
    </p>
    <p style={{ fontSize: "1rem", color: "#777" }}>
      We are committed to making your journeys memorable, safe, and comfortable.
    </p>
  </div>
</section>
      {/* CTA */}
      <section className="cta">
        <h3>Start Your Journey Today</h3>
        <h4>with AJUMAN HOLIDAYS</h4>
      </section>

      {/* Footer */}
      <footer className="site-footer">
      <div className="footer-content">
        {/* Company Info */}
        <div className="footer-section">
          <h3>AJUMAN HOLIDAYS</h3>
          <p>Your trusted travel partner for safe and comfortable journeys.</p>
        </div>

        {/* Contact Info */}
        <div className="footer-section">
          <h4>Contact Us</h4>
          <p>Email: <a href="mailto:ajumanholidays@gmail.com">ajumanholidays@gmail.com</a></p>
          <p>RAJVEER SINGH(RAJU) Phone: <a href="tel:+919212547773">+91 92125 49773</a></p>
          <p>RAMAN Phone: <a href="tel:+919212578546">+91 92125 78546</a></p>
          <p>Address: Ground Floor, Gali No. 8/3, Block-A, Kaushik Enclave, Burari, Delhi- 110084</p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4>Quick Links</h4>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms & Conditions</Link>
        </div>

        {/* Social Media */}
        <div className="footer-section social-links">
          <h4>Follow Us</h4>
          <a href="https://facebook.com" target="_blank" rel="noreferrer"><FaFacebookF /></a>
          <a href="https://www.instagram.com/ajuman_holidays?igsh=MWhodDVrN2JjMG95NA==" target="_blank" rel="noreferrer"><FaInstagram /></a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer"><FaTwitter /></a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer"><FaLinkedinIn /></a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 AJUMAN HOLIDAYS. All rights reserved.</p>
      </div>
    </footer>
    {/* <ContactInfo /> */}
    <ContactWidget />
    </div>
  );
}
