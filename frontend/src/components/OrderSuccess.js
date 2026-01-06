import React from 'react';
import './OrderSuccess.css';

const OrderSuccess = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="success-card">
        <div className="success-icon-circle">
          <div className="check-mark">L</div> {/* CSS Styled checkmark */}
        </div>
        <h1>Order Confirmed!</h1>
        <p>Thank you for your purchase. Your order has been successfully placed and will be delivered soon.</p>
        <div className="modal-actions">
          <button className="btn-primary full-width" onClick={onClose}>Continue Shopping</button>
          <button className="btn-outline full-width">Track Order</button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;