import React, { useState } from "react";
import { FaHeart, FaEye, FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const [showAdded, setShowAdded] = useState(false);

  const isWishlisted = wishlist.some(p => p._id === product._id);

  const toggleWishlist = () => {
    isWishlisted
      ? removeFromWishlist(product._id)
      : addToWishlist(product);
  };

  const handleAddToCart = () => {
    addToCart(product);
    setShowAdded(true);

    setTimeout(() => {
      setShowAdded(false);
    }, 1500);
  };

  return (
    <div className="card">
      <div className="image-box">
        <button
          className={`wishlist-btn ${isWishlisted ? "liked" : ""}`}
          onClick={toggleWishlist}
        >
          <FaHeart />
        </button>

        <img
          src={`http://localhost:5000${product.image}`}
          alt={product.name}
        />

        {/* ✅ INLINE MESSAGE */}
        {showAdded && (
          <div className="added-toast">
            Product added to cart
          </div>
        )}

        <div className="overlay-actions">
          <button
            className="quick-view-btn"
            onClick={() => navigate(`/product/${product._id}`)}
          >
            <FaEye /> Quick View
          </button>
        </div>
      </div>

      <div className="card-info">
        <h4>{product.name}</h4>
        <p>₹{product.price}</p>

        <button className="add-cart-full" onClick={handleAddToCart}>
          <FaShoppingCart /> Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
