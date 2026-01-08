// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
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
  const { wishlist, removeFromWishlist, setWishlist } = useWishlist();
  const { addToCart } = useCart();

  const userLocal = JSON.parse(localStorage.getItem("user"));
  const userEmail = userLocal?.email;

  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);

  // Address form
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressLabel, setAddressLabel] = useState("");
  const [addressText, setAddressText] = useState("");

  // Password change
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [profilePic, setProfilePic] = useState(localStorage.getItem("profilePic"));

  // 🔹 FAST PARALLEL FETCH (Fixes slow profile loading)
  useEffect(() => {
    if (!userEmail) return;

    Promise.all([
      fetch(`http://localhost:5000/user/${userEmail}`).then(res => res.json()),
      fetch(`http://localhost:5000/orders/${userEmail}`).then(res => res.json()),
      fetch(`http://localhost:5000/wishlist/${userEmail}`).then(res => res.json())
    ])
      .then(([userData, ordersData, wishlistData]) => {
        setUser(userData);
        setAddresses(userData.addresses || []);
        setOrders(ordersData || []);
        setWishlist(wishlistData || []);
      })
      .catch(err => console.error(err));
  }, [userEmail, setWishlist]);

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  // ✅ Wishlist actions
  const handleMoveToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product.productId || product._id);
  };

  const handleDeleteFromWishlist = (productId) => {
    if (window.confirm("Remove this item from wishlist?")) {
      removeFromWishlist(productId);
    }
  };

  // ✅ Address handlers
  const handleAddAddress = async () => {
    if (!addressText) return alert("Address required");

    const res = await fetch("http://localhost:5000/user/address", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: userEmail,
        label: addressLabel || "Other",
        address: addressText
      })
    });

    const data = await res.json();
    setAddresses(data.addresses);
    setShowAddressForm(false);
    setAddressLabel("");
    setAddressText("");
  };

  // ✅ PASSWORD CHANGE (REAL LOGIC)
  const handleChangePassword = async () => {
    if (!newPassword || newPassword !== confirmPassword) {
      return alert("Passwords do not match");
    }

    const res = await fetch("http://localhost:5000/user/update-password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: userEmail,
        currentPassword,
        newPassword
      })
    });

    const data = await res.json();
    alert(data.message);

    if (res.ok) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  if (!user) return <p>Loading profile...</p>;

  return (
    <div className="profile-page-bg">

      {/* BACK BUTTON */}
      <div className="back-home-wrapper">
        <button className="back-home-btn" onClick={() => navigate("/home")}>
          <FaArrowLeft className="back-icon" /> Back to Store
        </button>
      </div>

      <div className="profile-container">

        {/* SIDEBAR */}
        <aside className="profile-sidebar">
          <div className="profile-user-card">
            <div className="avatar-outer-container">
              <div className="avatar-wrapper">
                {profilePic ? (
                  <img src={profilePic} className="profile-avatar-img" alt="Profile" />
                ) : (
                  <FaUserCircle className="profile-avatar-placeholder" />
                )}
              </div>
              <button
                className="avatar-edit-btn"
                onClick={() => document.getElementById("avatarInput").click()}
              >
                <FaEdit size={14} />
              </button>
              <input
                type="file"
                id="avatarInput"
                hidden
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
          </div>

          <nav className="profile-side-nav">
            <button className="nav-btn" onClick={() => navigate("/orders")}>
              <FaBoxOpen /> <span>My Orders</span> <FaChevronRight />
            </button>
            <button className="nav-btn logout-btn" onClick={logout}>
              <FaSignOutAlt /> <span>Logout</span>
            </button>
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main className="profile-content-area">

          {/* ORDERS FROM DB */}
          <section className="profile-content-section">
            <div className="section-header-flex">
              <div className="header-title">
                <FaShoppingBag className="icon-gold" />
                <h3>Recent Orders</h3>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="empty-section-placeholder">No orders yet</div>
            ) : (
              orders.slice(0, 3).map(order => (
                <div key={order._id} className="order-row-card">
                  <div>
                    <strong>{order.productName}</strong>
                    <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`status-badge ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </div>
              ))
            )}
          </section>

          {/* ADDRESSES – NO STATIC DATA */}
          <section className="profile-content-section">
            <div className="section-header-flex">
              <div className="header-title">
                <FaMapMarkerAlt className="icon-purple" />
                <h3>Saved Addresses</h3>
              </div>
              <button className="add-new-btn" onClick={() => setShowAddressForm(true)}>
                <FaPlus /> Add New
              </button>
            </div>

            {addresses.length === 0 ? (
              <div className="empty-section-placeholder">No saved addresses</div>
            ) : (
              <div className="address-grid-container">
                {addresses.map((a, i) => (
                  <div key={i} className="address-item-card">
                    <strong>{a.label}</strong>
                    <p>{a.address}</p>
                  </div>
                ))}
              </div>
            )}

            {showAddressForm && (
              <div className="security-form-card">
                <input
                  placeholder="Label (Home / Work)"
                  value={addressLabel}
                  onChange={(e) => setAddressLabel(e.target.value)}
                />
                <textarea
                  placeholder="Full address"
                  value={addressText}
                  onChange={(e) => setAddressText(e.target.value)}
                />
                <button onClick={handleAddAddress}>Save Address</button>
              </div>
            )}
          </section>

          {/* SECURITY – ORIGINAL PASSWORD CHANGE */}
          <section className="profile-content-section">
            <div className="header-title">
              <FaShieldAlt className="icon-purple" />
              <h3>Security</h3>
            </div>

            <div className="security-form-card">
              <input type="password" placeholder="Current Password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
              <input type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
              <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
              <button className="update-pwd-btn" onClick={handleChangePassword}>
                Update Password
              </button>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
};

export default Profile;
