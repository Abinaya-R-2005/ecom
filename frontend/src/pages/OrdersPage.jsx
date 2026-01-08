import React, { useState, useEffect } from "react";
import { FaStar, FaBoxOpen } from "react-icons/fa";
import "./OrdersPage.css";

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null); // For modal
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [hover, setHover] = useState(null);

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        if (user?.email) {
            fetch(`http://localhost:5000/orders/${user.email}`)
                .then((res) => res.json())
                .then((data) => {
                    setOrders(data);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error("Error fetching orders:", err);
                    setLoading(false);
                });
        }
    }, [user]);

    const handleOpenModal = (order) => {
        setSelectedOrder(order);
        setRating(0);
        setComment("");
    };

    const handleCloseModal = () => {
        setSelectedOrder(null);
    };

    const handleSubmitReview = async () => {
        if (rating === 0) {
            alert("Please select a star rating");
            return;
        }

        const reviewData = {
            productId: selectedOrder.productId, // Ensure backend treats this as matching Product _id
            userEmail: user.email,
            userName: user.name,
            rating,
            comment
        };

        try {
            // Since backend expects multipart/form-data because of 'upload.array', we need FormData
            // Or we can update backend to accept JSON if no images. 
            // Current backend uses 'upload.array("images", 5)'. It usually parses body even if no files.
            // But standard 'fetch' with JSON body usually doesn't play well with multer unless configured.
            // Let's use FormData to be safe since backend uses 'multer'.

            const formData = new FormData();
            formData.append("productId", reviewData.productId);
            formData.append("userEmail", reviewData.userEmail);
            formData.append("userName", reviewData.userName);
            formData.append("rating", reviewData.rating);
            formData.append("comment", reviewData.comment);

            const res = await fetch("http://localhost:5000/reviews", {
                method: "POST",
                body: formData, // Auto-sets Content-Type to multipart/form-data
            });

            const data = await res.json();
            if (res.ok) {
                alert("Review submitted successfully!");
                handleCloseModal();
            } else {
                alert(data.message || "Failed to submit review");
            }
        } catch (err) {
            console.error(err);
            alert("Error submitting review");
        }
    };

    const updateOrderStatus = async (orderId, nextStatus) => {
        try {
            const res = await fetch(`http://localhost:5000/orders/${orderId}/status`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: nextStatus })
            });
            if (res.ok) {
                const updatedOrder = await res.json();
                setOrders(prev => prev.map(o => o._id === orderId ? updatedOrder.order : o));
            }
        } catch (err) {
            console.error("Failed to update status:", err);
        }
    };

    if (loading) return <div className="loading">Loading orders...</div>;

    const stages = ["Ordered", "Shipped", "Delivered"];

    return (
        <div className="orders-container">
            <h2 className="orders-heading">My Orders</h2>

            {orders.length === 0 ? (
                <div className="empty-state">
                    <FaBoxOpen size={50} />
                    <h3>No orders found</h3>
                    <p>You haven't purchased anything yet.</p>
                </div>
            ) : (
                <div className="orders-list">
                    {orders.map((order) => {
                        const currentStageIndex = stages.indexOf(order.status || "Ordered");
                        return (
                            <div key={order._id} className="order-card">
                                <div className="order-header">
                                    <span>Ordered on {new Date(order.createdAt).toLocaleDateString()}</span>
                                    <span>Order ID: {order._id.slice(-6).toUpperCase()}</span>
                                </div>

                                {/* Visual Stepper */}
                                <div className="order-stepper">
                                    {stages.map((stage, index) => (
                                        <div key={stage} className={`step ${index <= currentStageIndex ? "active completed" : ""}`}>
                                            <div className="step-circle">{index <= currentStageIndex ? "✓" : index + 1}</div>
                                            <div className="step-label">{stage}</div>
                                            {index < stages.length - 1 && <div className="step-line"></div>}
                                        </div>
                                    ))}
                                </div>

                                <div className="order-details">
                                    <div className="product-info">
                                        <span className="product-name">{order.productName}</span>
                                        <span className="product-qty">Quantity: {order.quantity}</span>
                                        <div className="order-dates">
                                            {order.shippedAt && (
                                                <span className="date-info shipped">
                                                    Shipped on: {new Date(order.shippedAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </span>
                                            )}
                                            {order.deliveredAt && (
                                                <span className="date-info delivered">
                                                    Delivered on: {new Date(order.deliveredAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="order-meta">
                                        <div className="order-price">₹{order.price}</div>
                                        <span className={`order-status status-${order.status?.toLowerCase() || 'ordered'}`}>
                                            {order.status || "Ordered"}
                                        </span>
                                    </div>
                                </div>

                                <div className="order-actions">
                                    <button className="rate-btn" onClick={() => handleOpenModal(order)}>
                                        <FaStar /> Rate & Review
                                    </button>

                                    {/* Simulation Buttons */}
                                    <div className="demo-controls">
                                        {order.status === "Ordered" && (
                                            <button className="demo-btn ship" onClick={() => updateOrderStatus(order._id, "Shipped")}>
                                                Mark as Shipped
                                            </button>
                                        )}
                                        {order.status === "Shipped" && (
                                            <button className="demo-btn deliver" onClick={() => updateOrderStatus(order._id, "Delivered")}>
                                                Mark as Delivered
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Review Modal */}
            {selectedOrder && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3 className="modal-title">Rate {selectedOrder.productName}</h3>

                        <div className="form-group">
                            <div className="star-rating">
                                {[...Array(5)].map((_, index) => {
                                    const ratingValue = index + 1;
                                    return (
                                        <FaStar
                                            key={index}
                                            className={`star-icon ${ratingValue <= (hover || rating) ? "filled" : ""}`}
                                            onClick={() => setRating(ratingValue)}
                                            onMouseEnter={() => setHover(ratingValue)}
                                            onMouseLeave={() => setHover(null)}
                                        />
                                    );
                                })}
                            </div>
                        </div>

                        <textarea
                            className="review-input"
                            placeholder="Write your feedback..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />

                        <div className="modal-actions">
                            <button className="cancel-btn" onClick={handleCloseModal}>Cancel</button>
                            <button className="submit-btn" onClick={handleSubmitReview}>Submit Review</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrdersPage;
