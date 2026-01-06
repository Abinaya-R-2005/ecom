import React from 'react';
import './Checkout.css';


const Checkout = () => {
  return (
    <div className="checkout-container container">
      <div className="checkout-main">
        <h2>Secure Checkout</h2>
        
        {/* Step 1 */}
        <div className="checkout-step">
          <div className="step-header"><span>1</span> Shipping Information</div>
          <div className="form-grid">
            <input type="text" placeholder="First Name" />
            <input type="text" placeholder="Last Name" />
            <input type="email" placeholder="Email" className="full-width" />
            <input type="text" placeholder="Address" className="full-width" />
          </div>
        </div>

        {/* Step 2 */}
        <div className="checkout-step">
          <div className="step-header"><span>2</span> Shipping Method</div>
          <div className="method-option active">
            <input type="radio" checked readOnly />
            <span>Standard Shipping (5-7 days)</span>
            <span className="price-tag">FREE</span>
          </div>
        </div>

        {/* Step 3 */}
        <div className="checkout-step">
          <div className="step-header"><span>3</span> Payment Method</div>
          <div className="payment-tabs">
            <button className="active">Credit Card</button>
            <button>PayPal</button>
          </div>
          <input type="text" placeholder="Card Number" className="full-width" />
        </div>
      </div>

      <aside className="order-summary-box">
        <h3>Order Summary</h3>
        <div className="summary-row"><span>Subtotal</span><span>$599.98</span></div>
        <div className="summary-row"><span>Shipping</span><span className="free">FREE</span></div>
        <div className="summary-row total"><span>Total</span><span>$647.98</span></div>
        <button className="btn-primary full-width">Place Order</button>
      </aside>
    </div>
  );
};
export default Checkout