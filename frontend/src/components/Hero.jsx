import React, { useState, useEffect } from "react";
import { FaArrowRight } from "react-icons/fa";
import fashionHero from "../assets/hero_fashion_white-removebg-preview.png";
import heroMens from "../assets/hero_mens_white-removebg-preview.png";
import heroKids from "../assets/hero_kids_white-removebg-preview.png";
import heroShoes from "../assets/hero_shoes_white-removebg-preview.png";
import heroWatch from "../assets/hero_watch_white-removebg-preview.png";
import "./hero.css";

const slides = [
  { id: 1, img: fashionHero, title: "Perfect Style", subtitle: "New Trends", discount: "Up to 50% OFF" },
  { id: 2, img: heroMens, title: "Urban Streetwear", subtitle: "Cool & Casual", discount: "New Arrivals" },
  { id: 3, img: heroKids, title: "Kids Collection", subtitle: "Playful Styles", discount: "Flat 20% OFF" },
  { id: 4, img: heroShoes, title: "Premium Footwear", subtitle: "Run in Style", discount: "Best Sellers" },
  { id: 5, img: heroWatch, title: "Luxury Timepieces", subtitle: "Classic Elegance", discount: "Exclusive Deals" }
];

function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[currentSlide];

  return (
    <section className="hero-section-wrapper">
      <div className="container hero-container" key={slide.id}>
        <div className="hero-left fade-in">
          <span className="badge-new">New Arrivals 2026</span>

          <h1>
            Discover Your <br />
            <span className="highlight-text">{slide.title}</span>
          </h1>

          <p className="hero-desc">
            Explore premium products with exclusive deals and fast delivery.
          </p>

          <div className="hero-buttons">
            <button className="primary-btn">
              Shop Now <FaArrowRight />
            </button>
            <button className="secondary-btn">View Deals</button>
          </div>
        </div>

        <div className="hero-right fade-in">
          <div className="featured-card">
            <img
              src={slide.img}
              alt={slide.title}
              className="featured-img"
            />

            <div className="float-card">
              <div className="float-content">
                <strong>{slide.subtitle}</strong>
                <span>{slide.discount}</span>
              </div>
              <button className="mini-shop-btn">Shop</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
