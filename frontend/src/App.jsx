import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import Checkout from './pages/Checkout';
import ProductDetailPage from './pages/ProductDetailPage';
import OrderSuccess from './components/OrderSuccess';
import './ShopHub.css';
import AdminDashboard from './admin/AdminDashboard';

import AddCategory from "./admin/AddCategory";
import AddProduct from "./admin/AddProduct";
function App() {
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/add-category" element={<AddCategory />} />
        <Route path="/admin/add-product" element={<AddProduct />} />


        <Route path="/" element={<AuthPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
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
