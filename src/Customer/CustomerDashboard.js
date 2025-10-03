import React, { useEffect, useRef, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
// import CustomerProfile from "../components/CustomerProfile"; // Navbar with profile icon
// import { API_URL } from "../config";
import "./CustomerDashboard.css";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import "../App.css"; // your styles
import { CustomerContext } from "../Context/CustomerContext";
import { FaUserCircle } from "react-icons/fa"; // ✅ profile icon
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";
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

// Hero slider images
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

// Route slider
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

// 🔹 Routes
const allRoutes = [
  { from: "Delhi", to: "Gorakhpur",  image: "/routes/delhi-manali.jpg" },
  { from: "Gorakhpur", to: "Delhi",  image: "/routes/mumbai-goa.jpg" },
  { from: "Delhi", to: "Katra",  image: "/routes/jaipur-udaipur.jpeg" },
  { from: "Katra", to: "Delhi",  image: "/routes/bangalore-chennai.jpg" },
];

export default function Home() {
  // const [isPopupOpen, setPopupOpen] = useState(false);
  // const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { customer, setCustomer } = useContext(CustomerContext);

  // Dropdown
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const profileRef = useRef(null);

  // close on outside click or Escape
useEffect(() => {
  function onDocClick(e) {
    if (profileRef.current && !profileRef.current.contains(e.target)) {
      setDropdownOpen(false);
    }
  }
  function onEsc(e) {
    if (e.key === "Escape") setDropdownOpen(false);
  }
  document.addEventListener("mousedown", onDocClick);
  document.addEventListener("touchstart", onDocClick);
  document.addEventListener("keydown", onEsc);
  return () => {
    document.removeEventListener("mousedown", onDocClick);
    document.removeEventListener("touchstart", onDocClick);
    document.removeEventListener("keydown", onEsc);
  };
}, []);

// Optional keyboard toggle helper
const handleKeyToggle = (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    setDropdownOpen(v => !v);
  }
};
  // Booking form state
  const [formData, setFormData] = useState({
    name: "",
    origin: "",
    destination: "",
    date: "",
    seats: 1,
  });
  const [lastBooking] = useState(null);

  // Routes filter state
  const [filteredRoutes, setFilteredRoutes] = useState(allRoutes);

  // 🔹 Logout
  const handleLogout = () => {
    setCustomer(null);
    localStorage.removeItem("customer");
    navigate("/login");
  };

  // 🔹 Booking form change
  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle booking submit
  const handleBookingSubmit = async e => {
    e.preventDefault();

  if (!customer) {
      alert("Please login first");
      return;
    }

  const booking = {
      id: Date.now(),
      customerId: customer.id, 
      customerName: customer.name,
      email: customer.email,
      origin: formData.origin,
      destination: formData.destination,
      date: formData.date,
      seats: Number(formData.seats),
      amount: Number(formData.seats) * 500, // ₹500 per seat
      status: "confirmed",
    }; 

  // 
  navigate("/select-seats", { state: { booking: booking } });
  };

  // 🔹 Pay now
  const handlePayNow = () => {
    if (lastBooking) {
      navigate("/payments", { state: { booking: lastBooking } });
    } else {
      alert("⚠️ Please book a seat first!");
    }
  };

  // 🔹 Filters
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

  // swap origin <-> destination in formData
const handleSwap = () => {
  setFormData(prev => ({
    ...prev,
    origin: prev.destination || "",
    destination: prev.origin || "",
  }));
};


  // const [open, setOpen] = useState(false);
  // const [route, setRoute] = useState(""); // selected route
  // const [date, setDate] = useState("");
  // const [seats, setSeats] = useState(1);
  // const [bookings, setBookings] = useState([]);
  

  

  // // Fetch notifications from backend
  // useEffect(() => {
  //   const fetchNotifications = async () => {
  //     try {
  //       const res = await fetch(`${API_URL}/api/auth/notifications`);
  //       const data = await res.json();
  //       setNotifications(data || []);
  //     } catch (err) {
  //       console.error("Error fetching notifications:", err);
  //     }
  //   };

  //   fetchNotifications();

  //   // Auto-refresh every 30 seconds
  //   const interval = setInterval(fetchNotifications, 30000);
  //   return () => clearInterval(interval);
  // }, []);

  // // Fetch notifications count
  //   useEffect(() => {
  //     const fetchNotifications = async () => {
  //       try {
  //         const res = await fetch(`${API_URL}/api/auth/notifications`);
  //         const data = await res.json();
  //         setNotifications(data);
  //         const unread = data.filter((n) => !n.isRead).length;
  //         setUnreadCount(unread);
  //       } catch (err) {
  //         console.error("Error fetching notifications:", err);
  //       }
  //     };
  
  //     fetchNotifications();
  
  //     // 🔄 Auto-refresh every 30 sec
  //     const interval = setInterval(fetchNotifications, 30000);
  //     return () => clearInterval(interval);
  //   }, []);
  

  
// -------------------- BOOKING FORM STATE --------------------

// useEffect(() => {
//     if (customer?.id) {
//       fetch(`${API_URL}/bookings/${customer.id}`)
//         .then((res) => res.json())
//         .then((data) => setBookings(data))
//         .catch((err) => console.error("Error fetching bookings:", err));
//     }
//   }, [customer]);



  




    
// const navigate = useNavigate();
//  const handleFormSubmit = (e) => {
//   e.preventDefault();

//   const query = new URLSearchParams(formData).toString();
//   navigate(`/routes?${query}`);
// }; 
// -------------------- ROUTE FILTER --------------------
  

  
// -------------------- UI --------------------
  return (
    <div>
      {/* Top Header */}
      <div className="top-header">
        <div>
          📧{" "}
          <a href="mailto:ajumanholidays@gmail.com" style={{ textDecoration: "none", color: "#f7f2f2ff" }}>
            ajumanholidays@gmail.com
          </a>
        </div>
        <div ref={profileRef} className="fixed-profile-wrapper">
    {customer ? (
      <div className="profile-btn-wrapper">
        <button
          className="profile-btn"
          aria-haspopup="true"
          aria-expanded={dropdownOpen}
          aria-label="Open profile menu"
          onClick={() => setDropdownOpen(v => !v)}
          onKeyDown={handleKeyToggle}
          type="button"
        >
          <FaUserCircle size={20} className="profile-icon" />
        </button>

        {dropdownOpen && (
          <div className="profile-dropdown-menu" role="menu" aria-label="Profile menu">
            <div className="pd-header">
              <FaUserCircle size={36} className="pd-avatar" />
              <div className="pd-name">{customer.name}</div>
            </div>

            <div className="pd-links">
              <Link to="/customer-profile" onClick={() => setDropdownOpen(false)}>My Profile</Link>
              <Link to="/customer/manage-booking" onClick={() => setDropdownOpen(false)}>My Bookings</Link>
            </div>

            <div className="pd-divider" />

            <button className="pd-logout" onClick={() => { setDropdownOpen(false); handleLogout(); }}>
              Logout
            </button>
          </div>
        )}
      </div>
    ) : (
      <div className="profile-guest">
        {/* optional: show login/register buttons or a small fixed login icon */}
        <Link to="/login"><button className="profile-guest-btn">Login</button></Link>
      </div>
    )}
  </div>

      </div>

      {/* Header */}
      <header>
        <div className="logo">
        
          <img src="/logo.jpg" alt="Ajuman Holidays Logo" />
          <span>AJUMAN HOLIDAYS</span>
        </div>
        <nav>
          <Link to="/customer-dashboard">Home</Link>
          <Link to="/customer/manage-booking">Manage My Booking</Link>
          <Link to="/customer-about">About</Link>
        </nav>
      </header>

      {/* Combined Hero Slider + Right-side Booking Panel */}
<section className="hero-slider">
  <Slider {...heroSliderSettings}>
    {heroImages.map((src, index) => (
      <div key={index} className="slider-slide">
        <img src={src} alt={`Slide ${index}`} className="hero-image" />
        <div className="slide-overlay">
          <div className="overlay-text">
            {index === 0 && <><h2>Plan Your Trip</h2><p>Across major cities</p></>}
            {index === 1 && <><h2>Enjoy the Ride</h2><p>Luxury meets safety</p></>}
            {index === 2 && <><h2>Ajuman Holidays</h2><p>Your travel partner</p></>}
            <button className="overlay-button" onClick={() => navigate("/gallery")}>Explore Now</button>
          </div>

          {/* RIGHT SIDE VERTICAL BOOKING PANEL */}
          <aside className="booking-panel" aria-label="Quick booking panel">
            <form className="booking-panel-form" onSubmit={handleBookingSubmit}>
              <div className="bp-row">
                <input
                  name="name"
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="bp-row swap-row">
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
                  className="swap-inline"
                  onClick={() => {
                    if (typeof handleSwap === "function") return handleSwap();
                    // fallback inline swap:
                    const o = formData.origin, d = formData.destination;
                    handleChange({ target: { name: "origin", value: d }});
                    handleChange({ target: { name: "destination", value: o }});
                  }}
                  title="Swap"
                >⇄</button>
              </div>

              <div className="bp-row">
                <input
                  name="destination"
                  type="text"
                  placeholder="Destination"
                  value={formData.destination}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="bp-row">
                <input
                  name="date"
                  type="date"
                  placeholder="dd - mm - yyyy"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="bp-row">
                <input
                  name="seats"
                  type="number"
                  min="1"
                  value={formData.seats}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="bp-actions">
                <button type="submit" className="bp-book">Book Now</button>
                <button type="button" className="bp-pay" onClick={handlePayNow}>Pay Now</button>
              </div>
            </form>
          </aside>

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
              <p>From ₹{route.price} • {route.time}</p>
                <button className="book-btn"><a href="#plan-trip">Book Now</a></button>

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
    <Link to="/write-review">
      <button className="write-review-btn">Write a Review</button>
    </Link>
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
          <p>Email: <a href="mailto:info@ajumanholidays.com">info@ajumanholidays.com</a></p>
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
    <ContactWidget />

    </div>
  );
}
