import React from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";
import "./HomePage.css";

const HomePage = () => {
  const products = [
    { id: 1, name: "Premium Headphones", price: 299 },
    { id: 2, name: "Smart Watch", price: 199 },
    { id: 3, name: "Laptop Pro", price: 1299 }
  ];

  return (
    <>
      <Header />
      <Hero />

      <section className="products-section">
        <h2>All Products</h2>
        <div className="products-grid">
          {products.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </>
  );
};

export default HomePage;
