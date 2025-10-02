import React from "react";
import { FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import "./ContactInfo.css";

const ContactInfo = () => {
  return (
    <div className="contact-us-box">
      <h4>Contact Us</h4>
      <div className="contact-item">
        <FaPhoneAlt className="contact-icon" />
        <span>+91 92125 49773,<br/> +91 92125 78546</span>
      </div>
      <div className="contact-item">
        <FaEnvelope className="contact-icon" />
        <span>ajumanholidays@gmail.com</span>
      </div>
    </div>
  );
};

export default ContactInfo;
