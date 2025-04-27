import React from 'react';
// import './styles.css';
import './styles/products.css';

const ProductCard = ({ product }) => {
  const { name, category, image, productId } = product;
  
  return (
    <article className="home-product-card">
      <div className="home-product-image">
        <img src={image} alt={name} />
      </div>
      <div className="home-product-category">{category}</div>
      <div className="home-product-info">
        <p>{name}</p>
        <a href={`/products/${productId}`} className="btn home-shop-btn">Shop Now</a>
      </div>
    </article>
  );
};

export default ProductCard; 