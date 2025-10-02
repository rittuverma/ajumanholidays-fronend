// src/components/ContactWidget.js
import React, { useState, useRef, useEffect } from "react";
import ContactInfo from "../pages/ContactInfo"; // adjust path if needed
import "./ContactWidget.css";

export default function ContactWidget() {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleOutsideClick(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div
      className="contact-widget"
      ref={wrapperRef}
      // ensure keyboard users can open via focus and close via blur
      onKeyDown={(e) => {
        if (e.key === "Escape") setOpen(false);
      }}
    >
      <button
        className="contact-toggle"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Contact information"
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        type="button"
      >
        {/* Replace emoji with any icon if preferred */}
        📞
      </button>

      {open && (
        <div
          className="contact-popover"
          role="dialog"
          aria-label="Contact details"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <ContactInfo />
        </div>
      )}
    </div>
  );
}
