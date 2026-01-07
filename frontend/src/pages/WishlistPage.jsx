import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import Header from '../components/Header';
import './WishlistPage.css'; // Ensure this is imported

const WishlistPage = () => {
  const { wishlist } = useWishlist();

  return (
    <div className="wishlist-page-wrapper">
      <Header />
      
      <main className="wishlist-main container">
        {wishlist.length === 0 ? (
          <div className="empty-wishlist-card">
            <div className="wishlist-icon-wrapper">
              <span className="floating-heart">❤️</span>
            </div>
            
            <h2 className="empty-title">Love at first sight starts here</h2>
            
            <p className="empty-subtitle">
              Your wishlist is feeling a bit lonely. Tap the heart on any <br />
              product to save it for later. Your future self will thank you.
            </p>

            <Link to="/home" className="classic-browse-btn">
              Find Something to Love
            </Link>
          </div>
        ) : (
          <>
            <h2 className="page-title">My Wishlist <span>({wishlist.length})</span></h2>
            <div className="products-grid">
              {wishlist.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default WishlistPage;