import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = ({ cartCount = 1 }) => {
  return (
    <header className="sh-header">
      <div className="top-banner">
        <div className="container banner-flex">
          <span>Deliver to: <strong>New York 10001</strong></span>
          <div className="top-links">
            <span>Customer Service</span>
            <span>Track Order</span>
            <span>Download App</span>
          </div>
        </div>
      </div>
      
      <div className="main-nav container">
        <Link to="/" className="logo">Shop<span>Hub</span></Link>
        <div className="search-bar">
          <input type="text" placeholder="Search for products, brands and more..." />
          <button className="search-btn">🔍</button>
        </div>
        <div className="nav-icons">
          <Link to="/login">👤 abc</Link>
          <span>❤️ 0</span>
          <Link to="/cart" className="cart-link">
            🛒 <span className="cart-badge">{cartCount}</span>
          </Link>
        </div>
      </div>

      <nav className="categories container">
        {['All Categories', 'Electronics', 'Fashion', 'Home & Living', 'Books', 'Sports', 'Beauty'].map(cat => (
          <span key={cat} className="cat-item">{cat}</span>
        ))}
      </nav>
    </header>
  );
};

export default Header;