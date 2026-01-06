import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { products } from "../data/products";
import { FaStar, FaShoppingCart, FaArrowLeft } from "react-icons/fa";
import "./ProductDetailPage.css";

const ProductDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const product = products.find((p) => p.id === parseInt(id));

    const [selectedSize, setSelectedSize] = useState("M");
    const [quantity, setQuantity] = useState(1);

    if (!product) {
        return <div className="container">Product not found</div>;
    }

    const sizes = ["S", "M", "L", "XL", "XXL"];

    const handlePlaceOrder = () => {
        alert(`Order placed for ${quantity} x ${product.name} (Size: ${selectedSize})`);
        navigate("/home");
    };

    return (
        <div className="product-detail-page">
            <Header cartCount={3} />

            <div className="container detail-container">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <FaArrowLeft /> Back to Shop
                </button>

                <div className="detail-grid">
                    <div className="product-image-section">
                        <img src={product.img || "https://via.placeholder.com/600"} alt={product.name} className="main-detail-img" />
                    </div>

                    <div className="product-info-section">
                        <span className="detail-tag">{product.tag || "New"}</span>
                        <h1 className="detail-title">{product.name}</h1>

                        <div className="detail-rating">
                            <div className="stars">
                                {[...Array(5)].map((_, i) => (
                                    <FaStar key={i} className={i < 4 ? "star-filled" : "star-empty"} />
                                ))}
                            </div>
                            <span className="reviews">({product.reviews} customer reviews)</span>
                        </div>

                        <div className="detail-price">
                            <span className="price">${product.price}</span>
                            {product.oldPrice && <span className="old-price">${product.oldPrice}</span>}
                        </div>

                        <p className="detail-description">
                            Elevate your style with this premium quality {product.name.toLowerCase()}.
                            Crafted with comfort and durability in mind, perfect for any occasion.
                        </p>

                        <div className="selection-group">
                            <h4>Select Size</h4>
                            <div className="size-options">
                                {sizes.map((size) => (
                                    <button
                                        key={size}
                                        className={`size-btn ${selectedSize === size ? "active" : ""}`}
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="selection-group">
                            <h4>Quantity</h4>
                            <div className="quantity-control">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                                <span>{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)}>+</button>
                            </div>
                        </div>

                        <div className="action-buttons">
                            <button className="place-order-btn" onClick={handlePlaceOrder}>
                                Place Order Now
                            </button>
                            <button className="add-to-cart-outline">
                                <FaShoppingCart /> Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;
