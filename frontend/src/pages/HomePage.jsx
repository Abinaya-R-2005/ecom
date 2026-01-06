import React, { useState } from "react";
import Header from "../components/Header";
import FlashSaleBar from "../components/FlashSaleBar";
import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";
import { FaStar } from "react-icons/fa";
import "./HomePage.css";

const HomePage = () => {
  const [priceRange, setPriceRange] = useState(2000);

  const products = [
    { id: 1, name: "Classic Denim Jacket", price: 89, img: "", tag: "Best Seller", rating: 4.8, reviews: 1243 },
    { id: 2, name: "Floral Summer Dress", price: 59, oldPrice: 79, img: "", tag: "Trending", rating: 4.7, reviews: 832 },
    { id: 3, name: "Men's Casual T-Shirt", price: 29, img: "", tag: "New Arrival", rating: 4.6, reviews: 421 },
    { id: 4, name: "Urban Streetwear Hoodie", price: 65, img: "", rating: 4.8, reviews: 981 },
    { id: 5, name: "Running Sneakers", price: 120, oldPrice: 149, img: "", tag: "Top Rated", rating: 4.9, reviews: 2045 },
    { id: 6, name: "Leather Crossbody Bag", price: 145, img: "", tag: "Premium", rating: 4.7, reviews: 341 },
    { id: 7, name: "Kids' Graphic Tee", price: 25, img: "", tag: "Kids", rating: 4.5, reviews: 143 },
    { id: 8, name: "Designer Sunglasses", price: 199, img: "", tag: "Accessories", rating: 4.8, reviews: 656 }
  ];

  return (
    <div className="homepage">
      <Header cartCount={3} />
      <Hero />
      <FlashSaleBar />

      <div className="home-container container">
        {/* Sidebar Filters */}
        <aside className="sidebar">
          <div className="filter-section">
            <h3 className="filter-title">Filters</h3>

            <div className="filter-group">
              <h4>Categories</h4>
              <div className="checkbox-list">
                {['Men', 'Women', 'Kids', 'Accessories', 'Footwear', 'Watches', 'Sports', 'Sale'].map(cat => (
                  <label key={cat} className="checkbox-item">
                    <input type="checkbox" />
                    <span className="checkmark"></span>
                    {cat}
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h4>Price Range</h4>
              <div className="price-slider-container">
                <input
                  type="range"
                  min="0"
                  max="2000"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="price-slider"
                />
                <div className="price-values">
                  <span>$0</span>
                  <span>${priceRange}</span>
                </div>
              </div>
            </div>

            <div className="filter-group">
              <h4>Minimum Rating</h4>
              <div className="rating-filters">
                {[4, 3, 2, 1].map(star => (
                  <div key={star} className="rating-option">
                    <span className="stars">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className={i < star ? "star-filled" : "star-empty"} />
                      ))}
                    </span>
                    <span className="rating-label">{star}+ Stars</span>
                  </div>
                ))}
              </div>
              <button className="filter-btn">All Ratings</button>
            </div>

            <button className="clear-btn">Clear All Filters</button>
          </div>

          {/* Special Offer Banner */}
          <div className="sidebar-banner">
            <h3>Special Offer!</h3>
            <p>Get 15% off on your first order. Use code: <strong>FIRST15</strong></p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <div className="content-header">
            <div>
              <h2>All Products</h2>
              <p className="result-count">{products.length} products found</p>
            </div>
            <div className="sort-box">
              <select>
                <option>Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest</option>
              </select>
            </div>
          </div>

          <div className="products-grid">
            {products.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomePage;
