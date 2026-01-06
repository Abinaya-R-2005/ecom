import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaUser, FaHeart, FaShoppingCart, FaBars, FaMapMarkerAlt } from 'react-icons/fa';
import './Header.css';

const Header = ({ cartCount = 0 }) => {
  const [showCategories, setShowCategories] = useState(false);

  return (
    <header className="sh-header">
      {/* Top Banner */}
      <div className="top-banner">
        <div className="container banner-flex">
          <div className="delivery-loc">
            <FaMapMarkerAlt className="loc-icon" />
            <span>Deliver to: <strong>New York 10001</strong></span>
          </div>
          <div className="top-links">
            <Link to="/service">Customer Service</Link>
            <Link to="/track">Track Order</Link>
            <Link to="/app">Download App</Link>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="main-nav container">
        {/* Logo */}
        <Link to="/" className="logo-brand">
          ShopHub
        </Link>

        {/* Search Bar */}
        <div className="search-bar">
          <input type="text" placeholder="Search for products, brands and more..." />
          <button className="search-btn">
            <FaSearch />
          </button>
        </div>

        {/* Nav Icons */}
        <div className="nav-icons">
          <Link to="/login" className="icon-link">
            <FaUser className="nav-icon" />
            <span>Login</span>
          </Link>
          <Link to="/wishlist" className="icon-link">
            <FaHeart className="nav-icon" />
          </Link>
          <Link to="/cart" className="icon-link cart-link">
            <FaShoppingCart className="nav-icon" />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
        </div>
      </div>

      {/* Categories Bar */}
      <nav className="categories-bar">
        <div className="container categories-flex">
          <div className="all-categories" onClick={() => setShowCategories(!showCategories)}>
            <FaBars />
            <span>All Categories</span>
          </div>

          <div className="cat-links">
            {['Men', 'Women', 'Kids', 'Accessories', 'Footwear', 'Watches', 'Sports', 'Sale'].map(cat => (
              <Link key={cat} to={`/category/${cat.toLowerCase().replace(/ /g, '-')}`} className="cat-item">
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;