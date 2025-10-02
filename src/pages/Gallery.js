import React from "react";
import "./Gallery.css";

export default function Gallery() {
  const images = [
    "/gallery/gallery1.jpeg",
    "/gallery/gallery2.jpeg",
    "/gallery/gallery3.webp",
    "/gallery/gallery4.webp",
    "/gallery/gallery5.jpeg",
    "/gallery/gallery5.webp",
    "/gallery/gallery6.jpg",
    "/gallery/gallery7.jpg",
    "/gallery/gallery8.jpeg"
  ];

  return (
    <div className="gallery-container">
      <h1 className="gallery-title">Our Travel Gallery</h1>
      <p className="gallery-subtitle">
        Explore our journeys, buses, and customer experiences ✨
      </p>

      <div className="gallery-grid">
        {images.map((src, i) => (
          <div key={i} className="gallery-item">
            <img src={src} alt={`Gallery ${i}`} />
          </div>
        ))}
      </div>
    </div>
  );
}
