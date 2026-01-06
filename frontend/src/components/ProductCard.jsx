import React from 'react';
import { FaShoppingCart, FaEye, FaStar } from 'react-icons/fa';
import './ProductCard.css';

const ProductCard = ({ product }) => {
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
          <button className="quick-view-btn">
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
          <span className="review-count">(2,543 reviews)</span>
        </div>

        <div className="price-row">
          <span className="current-price">${product.price}</span>
          {product.oldPrice && <span className="old-price">${product.oldPrice}</span>}
        </div>

        <button className="add-cart-full">
          <FaShoppingCart /> Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;