import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import Checkout from './pages/Checkout';
import OrderSuccess from './components/OrderSuccess';
import './ShopHub.css';

function App() {
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/checkout" element={
            <div className="checkout-page-view">
               <Checkout onPlaceOrder={() => setIsOrderPlaced(true)} />
               <OrderSuccess 
                  isOpen={isOrderPlaced} 
                  onClose={() => setIsOrderPlaced(false)} 
               />
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;