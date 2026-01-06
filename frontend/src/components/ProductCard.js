import React from 'react';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  return (
    <div className="card">
      <div className="image-box">
        {product.tag && <span className="tag-badge">{product.tag}</span>}
        <img src={product.img} alt={product.name} />
        <button className="quick-view-overlay">Quick View</button>
      </div>
      <div className="card-info">
        <span className="category-label">Electronics</span>
        <h4>{product.name}</h4>
        <div className="rating">⭐⭐⭐⭐ 4.8 (2,543 reviews)</div>
        <div className="price-row">
          <span className="current-price">${product.price}</span>
        </div>
        <button className="add-cart-full">Add to Cart</button>
      </div>
    </div>
  );
};

export default ProductCard;