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
      <Routes>
         <Route path="/" element={<AuthPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route
          path="/checkout"
          element={
            <>
              <Checkout onPlaceOrder={() => setIsOrderPlaced(true)} />
              <OrderSuccess
                isOpen={isOrderPlaced}
                onClose={() => setIsOrderPlaced(false)}
              />
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
