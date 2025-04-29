import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './PetProducts.css';

const PetProducts = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);
  
  useEffect(() => {
    // Fetch product details
    // In a real app, this would be an API call
    const fetchProduct = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Dummy product data
        const productData = {
          id: productId,
          name: 'Premium Dog Food',
          price: 29.99,
          description: 'High-quality premium dog food made with real chicken and vegetables. Perfect for all dog breeds and sizes. Rich in proteins and essential nutrients for a healthy diet.',
          specifications: 'Weight: 5kg\nIngredients: Chicken, Brown Rice, Carrots, Peas\nAge: Adult dogs\nFeeding Guide: 100g per 10kg of body weight',
          reviews: [
            { id: 1, user: 'John D.', rating: 5, comment: 'My dog loves this food! His coat looks healthier after switching to this brand.' },
            { id: 2, user: 'Sarah M.', rating: 4, comment: 'Good quality food, but a bit pricey.' },
            { id: 3, user: 'Mike R.', rating: 5, comment: 'Excellent product. Will buy again!' }
          ],
          images: [
            'https://source.unsplash.com/random/400x400/?dogfood',
            'https://source.unsplash.com/random/400x400/?petfood',
            'https://source.unsplash.com/random/400x400/?dogfood,package'
          ],
          inStock: true,
          category: 'Food'
        };
        
        setProduct(productData);
        
        // Set related products
        setRelatedProducts([
          {
            id: '101',
            name: 'Dog Leash',
            price: 15.99,
            image: 'https://source.unsplash.com/random/200x200/?dogleash'
          },
          {
            id: '102',
            name: 'Dog Toy Bundle',
            price: 12.99,
            image: 'https://source.unsplash.com/random/200x200/?dogtoys'
          },
          {
            id: '103',
            name: 'Pet Shampoo',
            price: 9.99,
            image: 'https://source.unsplash.com/random/200x200/?petshampoo'
          }
        ]);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [productId]);
  
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity > 0 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };
  
  const addToCart = () => {
    // Get current cart from localStorage
    const currentCart = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    // Check if product already exists in cart
    const existingItemIndex = currentCart.findIndex(item => item.id === product.id);
    
    if (existingItemIndex !== -1) {
      // Update quantity if product already in cart
      currentCart[existingItemIndex].quantity += quantity;
    } else {
      // Add new product to cart
      currentCart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        quantity: quantity
      });
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('cartItems', JSON.stringify(currentCart));
    
    // Navigate to shopping cart
    navigate('/cart');
  };
  
  if (loading) {
    return <div className="product-loading">Loading product details...</div>;
  }
  
  if (!product) {
    return <div className="product-error">Product not found</div>;
  }
  
  return (
    <div className="pet-product-container">
      <div className="product-main">
        <div className="product-images">
          <div className="main-image">
            <img src={product.images[0]} alt={product.name} />
          </div>
          <div className="thumbnail-images">
            {product.images.map((image, index) => (
              <img 
                key={index} 
                src={image} 
                alt={`${product.name} view ${index + 1}`}
                className="thumbnail" 
                onClick={() => {
                  // In a real app, this would change the main image
                  const newImages = [...product.images];
                  [newImages[0], newImages[index]] = [newImages[index], newImages[0]];
                  setProduct({...product, images: newImages});
                }}
              />
            ))}
          </div>
        </div>
        
        <div className="product-details">
          <h1>{product.name}</h1>
          <div className="product-price">${product.price.toFixed(2)}</div>
          
          <div className="product-status">
            {product.inStock ? (
              <span className="in-stock">In Stock</span>
            ) : (
              <span className="out-of-stock">Out of Stock</span>
            )}
          </div>
          
          <div className="product-actions">
            <div className="quantity-selector">
              <button 
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
              >
                -
              </button>
              <span>{quantity}</span>
              <button 
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= 10}
              >
                +
              </button>
            </div>
            
            <div className="product-buttons">
              <button 
                className="add-to-cart-btn-2" 
                onClick={addToCart}
                disabled={!product.inStock}
              >
                Add to Cart
              </button>
              
              <button 
                className="buy-now-btn" 
                onClick={() => {
                  // Add to cart then go directly to checkout
                  const currentCart = JSON.parse(localStorage.getItem('cartItems')) || [];
                  currentCart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.images[0],
                    quantity: quantity
                  });
                  localStorage.setItem('cartItems', JSON.stringify(currentCart));
                  navigate('/checkout');
                }}
                disabled={!product.inStock}
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
                Specifications
              </button>
              <button 
                className={activeTab === 'reviews' ? 'active' : ''}
                onClick={() => setActiveTab('reviews')}
              >
                Reviews ({product.reviews.length})
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
                  <pre>{product.specifications}</pre>
                </div>
              )}
              
              {activeTab === 'reviews' && (
                <div className="reviews-tab">
                  {product.reviews.map(review => (
                    <div key={review.id} className="review">
                      <div className="review-header">
                        <span className="reviewer">{review.user}</span>
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
                      <p className="review-comment">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {relatedProducts.length > 0 && (
        <div className="related-products">
          <h2>You May Also Like</h2>
          <div className="related-products-grid">
            {relatedProducts.map(product => (
              <div key={product.id} className="related-product" onClick={() => navigate(`/products/${product.id}`)}>
                <img src={product.image} alt={product.name} />
                <h3>{product.name}</h3>
                <p className="related-price">${product.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PetProducts; 