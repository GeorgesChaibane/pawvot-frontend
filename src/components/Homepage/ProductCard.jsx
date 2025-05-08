import React from 'react';
import { Link } from 'react-router-dom';
// import './styles.css';
import './styles/products.css';

const ProductCard = ({ product }) => {
  const { name, category, image, price } = product;
  
  // Get the correct product ID (MongoDB ObjectID)
  const productId = product._id || product.productId;
  
  // Format price with 2 decimal places
  const formattedPrice = price ? `$${price.toFixed(2)}` : '';
  
  return (
    <article className="home-product-card">
      <div className="home-product-image">
        {image ? (
          <img src={image} alt={name} />
        ) : (
          <div className="placeholder-image">No Image Available</div>
        )}
      </div>
      <div className="home-product-category">{category}</div>
      <div className="home-product-info">
        <p className="product-name">{name}</p>
        {price && <p className="product-price">{formattedPrice}</p>}
        <Link to={`/products/${productId}`} className="btn home-shop-btn">Shop Now</Link>
      </div>
    </article>
  );
};

export default ProductCard; 