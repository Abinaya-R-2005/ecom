import React from 'react';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import Hero from '../components/Hero';
import './Home.js';
import '../ShopHub.css';
import './HomePage.css';
const HomePage = () => {
  const products = [
    { id: 1, name: "Premium Wireless Headphones", price: 299.99, img: "/assets/headphones.jpg", tag: "Best Seller" },
    { id: 2, name: "Ultra-Thin Laptop Pro", price: 1299.99, img: "/assets/laptop.jpg", tag: "Premium" },
    { id: 3, name: "Smart Watch Pro", price: 399.99, img: "/assets/watch.jpg", tag: "Trending" },
    // Add more mock data here to fill image_0a1468 layout
  ];

  return (
    <div className="page-wrapper">
      <Header />
      
      {/* Hero Section */}
      <Hero />

      {/* Product Grid (image_0a1487) */}
      <div className="grid-layout container">
        <aside className="sidebar-filters">
          <h3>Filters</h3>
          <div className="filter-group">
            <label>Categories</label>
            {['Electronics', 'Fashion', 'Home', 'Sports'].map(c => (
              <div key={c} className="check-item"><input type="checkbox"/> {c}</div>
            ))}
          </div>
          <div className="filter-group">
            <label>Price Range</label>
            <input type="range" min="0" max="2000" />
            <div className="range-labels"><span>$0</span><span>$2000</span></div>
          </div>
        </aside>

        <main className="product-feed">
          <div className="feed-header">
            <h2>All Products</h2>
            <select className="sort-select"><option>Featured</option></select>
          </div>
          <div className="products-grid">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomePage;