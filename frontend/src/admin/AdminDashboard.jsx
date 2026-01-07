import React from "react";
import { useNavigate } from "react-router-dom";

import "./AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-page">
      <div className="admin-card">
        <h2 className="admin-title">Admin Dashboard</h2>

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
 