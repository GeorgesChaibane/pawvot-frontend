import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductService from '../../services/productService';
import CartService from '../../services/cartService';
import './PetProducts.css';

const PetProducts = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  
  useEffect(() => {
    // Reset component state when product ID changes
    setLoading(true);
    setError(null);
    setQuantity(1);
    setActiveTab('description');
    
    // Fetch product details
    const fetchProductData = async () => {
      try {
        const productData = await ProductService.getProductById(productId);
        setProduct(productData);
        
        // Fetch related products of the same category
        try {
          if (productData.category) {
            const categoryProducts = await ProductService.getProductsByCategory(productData.category);
            // Filter out the current product and limit to 3 related products
            const filtered = categoryProducts
              .filter(p => p._id !== productId)
              .slice(0, 3);
              
            setRelatedProducts(filtered);
          }
        } catch (relatedError) {
          console.error('Error fetching related products:', relatedError);
          // Don't set the main error state, as the primary product was loaded successfully
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.message || 'Failed to load product details');
        setLoading(false);
      }
    };
    
    fetchProductData();
  }, [productId]);
  
  const handleQuantityChange = (newQuantity) => {
    // Make sure the new quantity doesn't exceed available stock
    const maxQty = product && product.countInStock ? product.countInStock : 10;
    if (newQuantity > 0 && newQuantity <= maxQty) {
      setQuantity(newQuantity);
    }
  };
  
  const addToCart = () => {
    if (!product) return;
    
    // Use the CartService to add the product to cart
    CartService.addToCart(product, quantity);
    
    // Navigate to shopping cart
    navigate('/cart');
  };
  
  const buyNow = async () => {
    if (!product) return;
    
    // Add to cart then go directly to checkout
    const response = await CartService.addToCart(product, quantity, true);
    
    // Check if redirect to login is required
    if (response.redirectRequired) {
      // Save the return URL to redirect back after login
      localStorage.setItem('returnUrl', `/products/${productId}`);
      navigate('/login');
    } else {
      // Proceed to checkout
      navigate('/checkout');
    }
  };
  
  if (loading) {
    return <div className="product-loading">Loading product details...</div>;
  }
  
  if (error) {
    return <div className="product-error">Error: {error}</div>;
  }
  
  if (!product) {
    return <div className="product-error">Product not found</div>;
  }
  
  // Check if product is in stock
  const inStock = product.countInStock > 0;
  
  // Get first image or placeholder
  const mainImage = product.images && product.images.length > 0 
    ? (product.images[0].startsWith('http') ? product.images[0] : 
       product.images[0].startsWith('/') ? `http://localhost:5000${product.images[0]}` : 
       product.images[0])
    : 'https://via.placeholder.com/400x400?text=No+Image+Available';
  
  return (
    <div className="pet-product-container">
      <div className="product-main">
        <div className="product-images">
          <div className="main-image">
            <img src={mainImage} alt={product.name} />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="thumbnail-images">
              {product.images.map((image, index) => (
                <img 
                  key={index} 
                  src={image.startsWith('http') ? image : 
                      image.startsWith('/') ? `http://localhost:5000${image}` : image} 
                  alt={`${product.name} view ${index + 1}`}
                  className="thumbnail" 
                  onClick={() => {
                    // Move the clicked thumbnail to main image
                    const newImages = [...product.images];
                    [newImages[0], newImages[index]] = [newImages[index], newImages[0]];
                    setProduct({...product, images: newImages});
                  }}
                />
              ))}
            </div>
          )}
        </div>
        
        <div className="product-details">
          <h1>{product.name}</h1>
          <div className="product-price">${product.price.toFixed(2)}</div>
          
          <div className="product-status">
            {inStock ? (
              <span className="in-stock">In Stock ({product.countInStock} available)</span>
            ) : (
              <span className="out-of-stock">Out of Stock</span>
            )}
          </div>
          
          <div className="product-actions">
            <div className="quantity-selector">
              <button 
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1 || !inStock}
              >
                -
              </button>
              <span>{quantity}</span>
              <button 
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= product.countInStock || !inStock}
              >
                +
              </button>
            </div>
            
            <div className="product-buttons">
              <button 
                className="add-to-cart-btn-2" 
                onClick={addToCart}
                disabled={!inStock}
              >
                Add to Cart
              </button>
              
              <button 
                className="buy-now-btn" 
                onClick={buyNow}
                disabled={!inStock}
              >
                Buy Now
              </button>
            </div>
          </div>
          
          <div className="product-tabs">
            <div className="tab-buttons">
              <button 
                className={activeTab === 'description' ? 'active' : ''}
                onClick={() => setActiveTab('description')}
              >
                Description
              </button>
              <button 
                className={activeTab === 'specifications' ? 'active' : ''}
                onClick={() => setActiveTab('specifications')}
              >
                Details
              </button>
              <button 
                className={activeTab === 'reviews' ? 'active' : ''}
                onClick={() => setActiveTab('reviews')}
              >
                Reviews ({product.reviews ? product.reviews.length : 0})
              </button>
            </div>
            
            <div className="tab-content">
              {activeTab === 'description' && (
                <div className="description-tab">
                  <p>{product.description}</p>
                </div>
              )}
              
              {activeTab === 'specifications' && (
                <div className="specifications-tab">
                  <p><strong>Brand:</strong> {product.brand}</p>
                  <p><strong>Category:</strong> {product.category}</p>
                  <p><strong>Pet Type:</strong> {Array.isArray(product.petType) ? product.petType.join(', ') : product.petType}</p>
                  {product.weight && <p><strong>Weight:</strong> {product.weight.value} {product.weight.unit}</p>}
                  {product.dimensions && (
                    <p>
                      <strong>Dimensions:</strong> {product.dimensions.length} x {product.dimensions.width} x {product.dimensions.height} {product.dimensions.unit}
                    </p>
                  )}
                  {product.tags && product.tags.length > 0 && (
                    <p><strong>Tags:</strong> {product.tags.join(', ')}</p>
                  )}
                </div>
              )}
              
              {activeTab === 'reviews' && (
                <div className="reviews-tab">
                  {product.reviews && product.reviews.length > 0 ? (
                    product.reviews.map((review, index) => (
                      <div key={index} className="review">
                        <div className="review-header">
                          <span className="reviewer">{review.name}</span>
                          <div className="rating">
                            {[...Array(5)].map((_, i) => (
                              <span 
                                key={i} 
                                className={i < review.rating ? 'star filled' : 'star'}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                        <p className="review-date">{new Date(review.date).toLocaleDateString()}</p>
                        <p className="review-comment">{review.comment}</p>
                      </div>
                    ))
                  ) : (
                    <p>No reviews yet. Be the first to review this product!</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {relatedProducts.length > 0 && (
        <div className="related-products">
          <h2>Related Products</h2>
          <div className="related-products-grid">
            {relatedProducts.map(related => (
              <div key={related._id} className="related-product-card" onClick={() => navigate(`/products/${related._id}`)}>
                <div className="related-product-image">
                  <img 
                    src={related.images && related.images.length > 0 ? 
                        (related.images[0].startsWith('http') ? related.images[0] : 
                         related.images[0].startsWith('/') ? `http://localhost:5000${related.images[0]}` : 
                         related.images[0]) 
                        : 'https://via.placeholder.com/200x200?text=No+Image'} 
                    alt={related.name} 
                  />
                </div>
                <div className="related-product-info">
                  <h3>{related.name}</h3>
                  <p className="related-product-price">${related.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PetProducts; 