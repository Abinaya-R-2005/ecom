import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { WishlistProvider } from "./context/WishlistContext";
import { CartProvider } from "./context/CartContext";

import HomePage from "./pages/HomePage";
import WishlistPage from "./pages/WishlistPage";
import CartPage from "./pages/CartPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import Checkout from "./pages/Checkout"; 
import OrderSuccess from "./pages/OrderSuccess"; // ✅ Import Success Page
import AuthPage from "./pages/AuthPage";         // ✅ Import Login/Signup Page

function App() {
  return (
    <WishlistProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Auth Route */}
            <Route path="/" element={<AuthPage />} /> {/* Default to Login */}
            
            {/* Shop Routes */}
            <Route path="/home" element={<HomePage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success" element={<OrderSuccess />} /> {/* ✅ Success Page */}
            <Route path="/product/:id" element={<ProductDetailPage />} />
            
            {/* Admin Route (Optional if you have it) */}
            {/* <Route path="/admin" element={<AdminPage />} /> */}
          </Routes>
        </Router>
      </CartProvider>
    </WishlistProvider>
  );
}

export default App;