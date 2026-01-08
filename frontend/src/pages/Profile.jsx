import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext"; 
import {
  FaUserCircle, FaBoxOpen, FaHeart, FaMapMarkerAlt,
  FaRedo, FaSignOutAlt, FaEdit, FaTrash,
  FaPlus, FaShoppingBag, FaShieldAlt, FaChevronRight,
  FaArrowLeft
} from "react-icons/fa";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart(); 

  const [user] = useState(
    JSON.parse(localStorage.getItem("user")) || {
      name: "Guest User",
      email: "guest@example.com",
      phone: "+1 234 567 890",
      lastLogin: new Date().toLocaleString()
    }
  );

  const [profilePic, setProfilePic] = useState(localStorage.getItem("profilePic") || null);

  const [addresses, setAddresses] = useState([
    { id: 1, label: "Home", address: "123 Main Street, New York, NY 10001", default: true },
    { id: 2, label: "Work", address: "456 Office Rd, Manhattan, NY 10012", default: false }
  ]);

  const [orders] = useState([
    { id: "ORD123", date: "Jan 07, 2026", status: "Delivered" },
    { id: "ORD124", date: "Jan 08, 2026", status: "Shipped" }
  ]);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  // ✅ Move to Cart & Remove from Wishlist (Syncs everywhere)
  const handleMoveToCart = (product) => {
    addToCart(product); 
    removeFromWishlist(product._id); 
    alert(`${product.name} moved to cart!`);
  };

  // ✅ Delete Icon logic (Syncs everywhere)
  const handleDeleteFromWishlist = (productId) => {
    if (window.confirm("Remove this item from your wishlist?")) {
      removeFromWishlist(productId);
    }
  };

  const handleAddAddress = () => {
    const newAddress = prompt("Enter new delivery address:");
    if (newAddress) {
      setAddresses(prev => [...prev, { id: Date.now(), label: "Other", address: newAddress, default: false }]);
    }
  };

  const handleEditAddress = (id) => {
    const updated = prompt("Edit your address:");
    if (updated) {
      setAddresses(prev => prev.map(a => (a.id === id ? { ...a, address: updated } : a)));
    }
  };

  const handleDeleteAddress = (id) => {
    if (window.confirm("Remove this address?")) {
      setAddresses(prev => prev.filter(a => a.id !== id));
    }
  };

  const handleChangePassword = () => {
    if (!newPassword || newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    alert("Password updated!");
    setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
  };

  return (
    <div className="profile-page-bg">
      {/* --- BACK TO STORE BUTTON --- */}
      <div className="back-home-wrapper">
        <button className="back-home-btn" onClick={() => navigate("/home")}>
          <FaArrowLeft className="back-icon" />
          <span>Back to Store</span>
        </button>
      </div>

      <div className="profile-container">
        {/* Sidebar */}
        <aside className="profile-sidebar">
          <div className="profile-user-card">
            <div className="avatar-outer-container">
              <div className="avatar-wrapper">
                {profilePic ? (
                  <img src={profilePic} alt="Profile" className="profile-avatar-img" />
                ) : (
                  <FaUserCircle className="profile-avatar-placeholder" />
                )}
              </div>
              <button className="avatar-edit-btn" onClick={() => document.getElementById("avatarInput").click()}>
                <FaEdit size={14} />
              </button>
              <input type="file" id="avatarInput" accept="image/*" style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = () => {
                      setProfilePic(reader.result);
                      localStorage.setItem("profilePic", reader.result);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </div>
            <h2>{user.name}</h2>
            <p className="user-meta">{user.email}</p>
            <div className="login-status-pill">Last login: {user.lastLogin}</div>
          </div>

          <nav className="profile-side-nav">
            <button className="nav-btn" onClick={() => navigate("/orders")}><FaBoxOpen className="icon-purple" /> <span>My Orders</span> <FaChevronRight /></button>
            <button className="nav-btn" onClick={() => navigate("/home")}><FaRedo className="icon-gold" /> <span>Buy Again</span> <FaChevronRight /></button>
            <button className="nav-btn" onClick={handleAddAddress}><FaMapMarkerAlt className="icon-purple" /> <span>Addresses</span> <FaChevronRight /></button>
            <button className="nav-btn logout-btn" onClick={logout}><FaSignOutAlt /> <span>Logout</span></button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="profile-content-area">
          {/* Orders Section */}
          <section className="profile-content-section">
            <div className="section-header-flex">
              <div className="header-title"><FaShoppingBag className="icon-gold" /> <h3>Recent Orders</h3></div>
              <button className="view-all-btn" onClick={() => navigate("/orders")}>View All</button>
            </div>
            <div className="orders-list">
              {orders.map(order => (
                <div key={order.id} className="order-row-card">
                  <div className="order-main-info">
                    <span className="order-id-label">Order #{order.id}</span>
                    <p className="order-date-text">{order.date}</p>
                  </div>
                  <span className={`status-badge ${order.status.toLowerCase()}`}>{order.status}</span>
                  <button className="details-pill-btn">Track</button>
                </div>
              ))}
            </div>
          </section>

          {/* Addresses Section */}
          <section className="profile-content-section">
            <div className="section-header-flex">
              <div className="header-title"><FaMapMarkerAlt className="icon-purple" /> <h3>Saved Addresses</h3></div>
              <button className="add-new-btn" onClick={handleAddAddress}><FaPlus /> Add New</button>
            </div>
            <div className="address-grid-container">
              {addresses.map(addr => (
                <div key={addr.id} className={`address-item-card ${addr.default ? 'active-border' : ''}`}>
                  <div className="address-top-row"><strong>{addr.label}</strong>{addr.default && <span className="default-tag">Primary</span>}</div>
                  <p className="address-text-content">{addr.address}</p>
                  <div className="address-actions-row">
                    <button onClick={() => handleEditAddress(addr.id)}>Edit</button>
                    <button className="del-btn" onClick={() => handleDeleteAddress(addr.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Wishlist Section */}
          <section className="profile-content-section">
            <div className="section-header-flex">
              <div className="header-title"><FaHeart className="icon-gold" /> <h3>Your Wishlist ({wishlist.length})</h3></div>
              {wishlist.length > 0 && <button className="view-all-btn" onClick={() => navigate("/wishlist")}>Full Page</button>}
            </div>
            <div className="wishlist-grid-container">
              {wishlist.length > 0 ? (
                wishlist.map(item => (
                  <div key={item._id} className="wishlist-item-card">
                    <div className="wish-info">
                      <strong>{item.name}</strong>
                      <p className="wish-price">₹{item.price}</p>
                    </div>
                    <div className="wish-actions">
                      <button className="move-to-cart-btn" onClick={() => handleMoveToCart(item)}>Move to Cart</button>
                      <button className="remove-wish-btn" onClick={() => handleDeleteFromWishlist(item._id)}><FaTrash /></button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-section-placeholder"><p>No items in wishlist.</p></div>
              )}
            </div>
          </section>

          {/* Security Section */}
          <section className="profile-content-section">
            <div className="section-header-flex">
              <div className="header-title"><FaShieldAlt className="icon-purple" /> <h3>Security</h3></div>
            </div>
            <div className="security-form-card">
              <div className="form-grid">
                <div className="input-box"><label>Current Password</label><input type="password" value={currentPassword} onChange={(e)=>setCurrentPassword(e.target.value)} /></div>
                <div className="input-box"><label>New Password</label><input type="password" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} /></div>
                <div className="input-box"><label>Confirm Password</label><input type="password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} /></div>
              </div>
              <button className="update-pwd-btn" onClick={handleChangePassword}>Update Password</button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Profile;