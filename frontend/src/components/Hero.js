import React from "react";

import headphones from "../assets/headphones.png";
import './hero.css';
function Hero() {
  return (
    <section className="hero">
      <div className="hero-left">
        <span className="badge">New Arrivals 2026</span>

        <h1>
          Discover Your <br />
          <span>Perfect Style</span>
        </h1>

        <p>
          Explore our curated collection of premium products with exclusive deals,
          fast shipping, and hassle-free returns.
        </p>

        <div className="hero-buttons">
          <button className="primary-btn">Shop Now</button>
          <button className="secondary-btn">View Deals</button>
        </div>

        <div className="stats">
          <div>
            <h3>2M+</h3>
            <p>Products</p>
          </div>
          <div>
            <h3>50K+</h3>
            <p>Brands</p>
          </div>
          <div>
            <h3>10M+</h3>
            <p>Customers</p>
          </div>
        </div>
      </div>

      <div className="hero-right">
        <div className="featured-card">
          <img src={headphones} alt="Featured" className="featured-img" />

          <div className="offer-card">
            <div className="offer-text">
              <strong>Premium Headphones</strong>
              <p>Up to 25% OFF</p>
            </div>
            <button className="shop-btn">Shop</button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
