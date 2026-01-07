import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Package, Truck, ArrowRight } from 'lucide-react';
import './OrderSuccess.css';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const orderNumber = Math.floor(100000 + Math.random() * 900000);

  return (
    <div className="success-page">
      <div className="success-card">
        <div className="check-container">
  <div className="check-bg-pulse"></div> {/* Add this line */}
  <CheckCircle size={80} className="main-check-icon" />
</div>

        <h1 className="success-title">Order Placed!</h1>
        <p className="success-subtitle">
          Thank you. Your order <strong>#{orderNumber}</strong> is on the way!
        </p>

        <div className="animation-box">
          <div className="road">
            <div className="moving-vehicle">
              <Truck size={40} className="truck-icon" />
              <div className="speed-lines">
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>
        </div>

        <div className="success-actions">
          <button className="btn-primary" onClick={() => navigate('/home')}>
            Continue Shopping <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;