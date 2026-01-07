import React from "react";
import { useNavigate } from "react-router-dom";

import "./AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="admin-page">
      <div className="admin-card">
        <div className="admin-header">
          <h2 className="admin-title">Admin Dashboard</h2>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>

        <div className="admin-actions">
          <button onClick={() => navigate("/admin/add-category")}>
            Add Category
          </button>
          <button onClick={() => navigate("/admin/add-product")}>
            Add Product
          </button>
        </div>


      </div>
    </div>
  );
};

export default AdminDashboard;
