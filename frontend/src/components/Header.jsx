import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaUser,
  FaHeart,
  FaShoppingCart,
  FaBars,
  FaMapMarkerAlt
} from "react-icons/fa";
import "./Header.css";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

const Header = ({ onSearch }) => {
  const [showCategories, setShowCategories] = useState(false);

  const { wishlist } = useWishlist();
  const { cart } = useCart(); // ✅ cart count

  return (
    <header className="sh-header">
      {/* Top Banner */}
      <div className="top-banner">
        <div className="container banner-flex">
          <div className="delivery-loc">
            <FaMapMarkerAlt className="loc-icon" />
            <span>
              Deliver to: <strong>New York 10001</strong>
            </span>
          </div>
          <div className="top-links">
            <Link to="/service">Customer Service</Link>
            <Link to="/track">Track Order</Link>
            <Link to="/app">Download App</Link>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="main-nav container">
        <Link to="/home" className="logo-brand">ShopHub</Link>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for products..."
            onChange={(e) => onSearch && onSearch(e.target.value)}
          />
          <button className="search-btn">
            <FaSearch />
          </button>
        </div>

        <div className="nav-icons">
          <Link to="/login" className="icon-link">
            <FaUser />
          </Link>

          {/* ❤️ Wishlist */}
          <Link to="/wishlist" className="icon-link">
            <FaHeart />
            {wishlist.length > 0 && (
              <span className="cart-badge">{wishlist.length}</span>
            )}
          </Link>

          {/* 🛒 Cart */}
          <Link to="/cart" className="icon-link">
            <FaShoppingCart />
            {cart.length > 0 && (
              <span className="cart-badge">
                {cart.reduce((sum, i) => sum + i.qty, 0)}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Categories */}
      <nav className="categories-bar">
        <div className="container categories-flex">
          <div
            className="all-categories"
            onClick={() => setShowCategories(!showCategories)}
          >
            <FaBars />
            <span>All Categories</span>
          </div>

          <div className="cat-links">
            {["Men","Women","Kids","Accessories","Footwear","Watches","Sports","Sale"]
              .map(cat => (
                <Link key={cat} to={`/category/${cat.toLowerCase()}`} className="cat-item">
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
