import React from 'react';
// import './styles.css';
import './styles/products.css';

const ProductCard = ({ product }) => {
  const { name, category, image, productId } = product;
  
  return (
    <article className="product-card">
      <div className="product-image">
        <img src={image} alt={name} />
      </div>
      <div className="product-category">{category}</div>
      <div className="product-info">
        <p>{name}</p>
        <a href={`/products/${productId}`} className="btn shop-btn">Shop Now</a>
      </div>
    </article>
  );
};

export default ProductCard; 