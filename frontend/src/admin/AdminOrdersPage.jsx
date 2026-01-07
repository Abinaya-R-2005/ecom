import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Package, Clock } from "lucide-react";
import "./AdminOrdersPage.css";

const AdminOrdersPage = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        if (!user || !user.isAdmin) {
            navigate("/login");
            return;
        }
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            // Reusing the existing sales endpoint which returns all orders if no date filter is passed
            const res = await fetch(`http://localhost:5000/admin/sales?email=${user.email}`);
            const data = await res.json();

            if (Array.isArray(data)) {
                // Sort by newest first
                const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setOrders(sorted);
            }
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch orders", err);
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    return (
        <div className="admin-orders-page">
            <div className="ao-container">
                <div className="ao-header">
                    <button className="back-btn" onClick={() => navigate("/admin")}>
                        <ArrowLeft size={20} /> Back to Dashboard
                    </button>
                    <h2>Placed Orders</h2>
                </div>

                {loading ? (
                    <div className="loading-state">Loading orders...</div>
                ) : orders.length === 0 ? (
                    <div className="empty-state">
                        <Package size={48} />
                        <p>No orders placed yet.</p>
                    </div>
                ) : (
                    <div className="table-wrapper">
                        <table className="orders-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Product</th>
                                    <th>Qty</th>
                                    <th>Price</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order._id}>
                                        <td className="order-id">#{order._id.slice(-6).toUpperCase()}</td>
                                        <td>
                                            <div className="customer-info">
                                                <span className="c-name">{order.userName}</span>
                                                <span className="c-email">{order.userEmail}</span>
                                            </div>
                                        </td>
                                        <td className="product-name">{order.productName}</td>
                                        <td>{order.quantity}</td>
                                        <td className="price">${order.price.toFixed(2)}</td>
                                        <td className="date">{formatDate(order.createdAt)}</td>
                                        <td>
                                            <span className="status-badge success">Placed</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminOrdersPage;
