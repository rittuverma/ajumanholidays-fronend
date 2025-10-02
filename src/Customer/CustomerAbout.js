import React from "react";
import "../about.css"; // make sure this file exists
import CustomerHeader from "./CustomerHeader";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import aboutBg from "../assets/images/aboutBg.jpg"; // replace with your own image
// import backgroundImage from"../background-pattern.jpg";
// import aboutHero from '../assets/about-hero.jpg';
import busInside from '../assets/images/gallery1.jpeg';
import busJourney from '../assets/images/slide3.jpeg';

export default function About() {
  return (
    <>
      <CustomerHeader />
      <div className="about-page">
        {/* Hero Section */}
        <section className="about-hero" style={{ backgroundImage: `url(${aboutBg})` }}>
          <div className="overlay">
            <h1>Ajuman Holidays</h1>
            <p>Welcome to Ajuman Holidays, your trusted travel partner for safe, comfortable, and reliable journeys across major routes. With years of experience in passenger transport, we specialize in providing luxury AC sleeper buses designed for your ultimate comfort and convenience.</p>
          </div>
        </section>

        {/* Who We Are */}
        <section className="about-section two-column">
          <div className="text">
            <h2>Who We Are</h2>
            <p>
              At Ajuman Holidays, we are more than just a travel service – we are a team of passionate professionals dedicated to making your journey smooth, safe, and memorable. Founded with a vision to bring comfort and reliability to long-distance travel, we have quickly grown into one of the most trusted names in AC sleeper bus services.<br/><br/>

              Our buses are designed keeping in mind the needs of modern travelers – offering cleanliness, punctuality, and personalized service. We believe travel is not just about reaching a destination, but about enjoying the journey itself. That’s why every detail – from comfortable sleeper berths and air-conditioned interiors to professional drivers and friendly support staff – is taken care of with the highest standards.<br/><br/>

              With Ajuman Holidays, you don’t just book a ticket – you book an experience of safety, luxury, and peace of mind.
            </p>
          </div>
          <img src={busInside} alt="Inside view of bus" className="about-img" />
        </section>

        {/* Our Mission */}
        <section className="about-section">
          <h2>Our Mission</h2>
          <p>
            
            At Ajuman Holidays, our mission is simple:
            “Ride Safe, Ride Smart, Ride with Ajuman Holidays.”
            We are committed to redefining bus travel with world-class comfort, safety, and reliability, making every trip a memorable experience for our passengers.<br/><br/>

            To become the most trusted travel brand in the region by providing high-quality bus services, building long-lasting customer relationships, and ensuring sustainable and safe travel solutions.
          </p>
        </section>

        {/* Why Choose Us */}
        <section className="about-section features">
          <h2>Why Choose Us?</h2>
          <div className="feature-list">
            <div className="feature">
              <span>🕐</span>
              <p>On-time Departures</p>
            </div>
            <div className="feature">
              <span>🛏️</span>
              <p>Comfortable Coaches</p>
            </div>
            <div className="feature">
              <span>💸</span>
              <p>Affordable Pricing</p>
            </div>
            <div className="feature">
              <span>🧼</span>
              <p>Sanitized Buses</p>
            </div>
            <div className="feature">
              <span>📞</span>
              <p>24/7 Support</p>
            </div>
            <div className="feature">
              <span>🚽</span>
              <p>Clean Toilet</p>
            </div>
            <div className="feature">
              <span>🔦</span>
              <p>Reading Lights</p>
            </div>
            <div className="feature">
              <span>🔌</span>
              <p>Charging Point</p>
            </div>
            <div className="feature">
              <span>🛜</span>
              <p>Free WIFI</p>
            </div>
            <div className="feature">
              <span>🍔</span>
              <p>Refreshments</p>
            </div>
            <div className="feature">
              <span>🛌</span>
              <p>Blanket & Pillows</p>
            </div>
            <div className="feature">
              <span>😴</span>
              <p>Curtains</p>
            </div>
          </div>
        </section>


        {/* Our Story */}
        <section className="about-section two-column">
          <img src={busJourney} alt="Our journey" className="about-img" />
          <div className="text">
            <h2>Our Story</h2>
            <p>
              Every great journey begins with a single step, and for Ajuman Holidays, that step was taken in 2025. Born from a vision to provide safe, reliable, and luxurious travel experiences, we started our journey with one simple goal – to redefine bus travel and make it as comfortable as home.<br/><br/>

              In our very first year, we introduced AC Sleeper Buses equipped with modern amenities, ensuring passengers could travel long distances without compromising on comfort or safety. What started as a single idea quickly transformed into a trusted travel brand, winning the confidence of passengers through punctual service, professional staff, and premium facilities.<br/><br/>

              We believe travel should be more than just moving from one place to another – it should be a stress-free, enjoyable, and memorable experience. With that belief, Ajuman Holidays continues to grow, connecting cities, bringing people closer, and making every journey special.<br/><br/>

            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="cta-section">
          <h2>Ready to Ride?</h2>
          <p>Book your next journey with Ajuman Holidays and travel smarter.</p>
          <Link to="/customer-dashboard#plan-trip" className="cta-button">Book Now</Link>
        </section>
      </div>
      <Footer />
    </>
  );
}
