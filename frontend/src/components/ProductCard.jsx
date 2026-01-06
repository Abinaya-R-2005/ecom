import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaEye, FaStar } from 'react-icons/fa';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleAddToCart = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="card">
      <div className="image-box">
        {product.tag && (
          <span className={`tag-badge ${product.tag.toLowerCase().replace(" ", "-")}`}>
            {product.tag}
          </span>
        )}
        <img src={product.img || "https://via.placeholder.com/300"} alt={product.name} />

        <div className="overlay-actions">
          <button className="quick-view-btn" onClick={() => navigate(`/product/${product.id}`)}>
            <FaEye /> Quick View
          </button>
        </div>
      </div>

      <div className="card-info">
        <span className="category-label">Electronics</span>
        <h4 className="product-title">{product.name}</h4>

        <div className="rating-row">
          <FaStar className="star-icon" />
          <span className="rating-score">4.8</span>
          <span className="review-count">({product.reviews} reviews)</span>
        </div>

        <div className="price-row">
          <span className="current-price">${product.price}</span>
          {product.oldPrice && <span className="old-price">${product.oldPrice}</span>}
        </div>

        <button className="add-cart-full" onClick={handleAddToCart}>
          <FaShoppingCart /> Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;