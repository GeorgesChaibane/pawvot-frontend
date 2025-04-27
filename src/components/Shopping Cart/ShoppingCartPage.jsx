import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ShoppingCartPage.css';

// Import product images for placeholder items
import dogFood1 from '../../assets/images/food/dog/Cesar steak dog.webp';
import dogToy1 from '../../assets/images/toys/playology chew stick dog.webp';
import catFood1 from '../../assets/images/food/cat/purina fancy feast wet cat.webp';

const ShoppingCartPage = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Sample placeholder products
  const placeholderProducts = [
    {
      id: 1,
      name: 'CESAR Adult Soft Wet Dog Food Steak Lovers Variety Pack',
      category: 'Food',
      subcategory: 'Dog Food',
      price: 35.99,
      quantity: 2,
      stock: 15,
      image: dogFood1
    },
    {
      id: 3,
      name: 'Squeaky Chew Stick Bundle, X-Large, 2-Pack',
      category: 'Toy',
      subcategory: 'Dog Toys',
      price: 12.99,
      discountPrice: 9.99,
      quantity: 1,
      stock: 20,
      image: dogToy1
    },
    {
      id: 7,
      name: 'Purina Fancy Feast Wet Cat Food Variety Pack',
      category: 'Food',
      subcategory: 'Cat Food',
      price: 22.99,
      quantity: 1,
      stock: 18,
      image: catFood1
    }
  ];

  useEffect(() => {
    // Get cart from localStorage
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // Save cart to localStorage whenever it changes
    localStorage.setItem('cartItems', JSON.stringify(cart));
  }, [cart]);

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === productId 
          ? { ...item, quantity: newQuantity } 
          : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Calculate cart totals
  const subtotal = cart.reduce((total, item) => 
    total + (item.discountPrice || item.price) * item.quantity, 0
  );
  
  const taxRate = 0.11; // 11% tax rate
  const tax = subtotal * taxRate;
  
  const shipping = subtotal > 50 ? 0 : 7.99; // Free shipping over $50
  
  const total = subtotal + tax + shipping;
  
  const itemCount = cart.reduce((count, item) => count + item.quantity, 0);

  // Function to add a placeholder product to cart for demo purposes
  const addPlaceholderToCart = (product) => {
    setCart([...cart, product]);
  };

  if (loading) {
    return (
      <div className="cart-loading">
        <div className="loading-spinner"></div>
        <p>Loading your shopping cart...</p>
      </div>
    );
  }

  return (
    <div className="shopping-cart-page">
      <div className="cart-header">
        <h1>Your Shopping Cart</h1>
        <p>{itemCount} item{itemCount !== 1 ? 's' : ''} in your cart</p>
      </div>

      <div className="cart-container">
        {cart.length === 0 ? (
          <div className="empty-cart-message">
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any items to your cart yet.</p>
            
            {/* Display sample products that can be added to cart */}
            <div className="sample-products">
              <h3>Suggested Products</h3>
              <div className="sample-products-grid">
                {placeholderProducts.map(product => (
                  <div key={product.id} className="sample-product">
                    <div className="sample-product-image">
                      <img src={product.image} alt={product.name} />
                    </div>
                    <div className="sample-product-details">
                      <h4>{product.name}</h4>
                      <p className="sample-product-price">
                        {product.discountPrice ? (
                          <>
                            <span className="original-price">${product.price.toFixed(2)}</span>
                            <span className="discount-price">${product.discountPrice.toFixed(2)}</span>
                          </>
                        ) : (
                          <span>${product.price.toFixed(2)}</span>
                        )}
                      </p>
                      <button 
                        className="add-sample-btn"
                        onClick={() => addPlaceholderToCart(product)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <Link to="/products" className="continue-shopping-link">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items-section">
              <div className="cart-items-header">
                <span className="product-col">Product</span>
                <span className="price-col">Price</span>
                <span className="quantity-col">Quantity</span>
                <span className="total-col">Total</span>
              </div>
              
              <div className="cart-items-list">
                {cart.map(item => (
                  <div key={item.id} className="cart-item">
                    <div className="product-col">
                      <div className="product-image">
                        <img src={item.image} alt={item.name} />
                      </div>
                      <div className="product-details">
                        <h3>{item.name}</h3>
                        <p className="product-category">{item.category} • {item.subcategory}</p>
                        <button 
                          className="remove-item-btn"
                          onClick={() => removeFromCart(item.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    
                    <div className="price-col">
                      ${(item.discountPrice || item.price).toFixed(2)}
                    </div>
                    
                    <div className="quantity-col">
                      <div className="quantity-control">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="quantity-btn"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <input 
                          type="number" 
                          min="1" 
                          max={item.stock} 
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                          className="quantity-input"
                        />
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="quantity-btn"
                          disabled={item.quantity >= item.stock}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    
                    <div className="total-col">
                      ${((item.discountPrice || item.price) * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="cart-actions">
                <button 
                  className="clear-cart-btn"
                  onClick={clearCart}
                >
                  Clear Cart
                </button>
                <Link to="/products" className="continue-shopping-btn">
                  Continue Shopping
                </Link>
              </div>
            </div>
            
            <div className="cart-summary-section">
              <h2>Order Summary</h2>
              
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              <div className="summary-row">
                <span>Tax (11%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              
              <div className="summary-row">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
              </div>
              
              {shipping > 0 && (
                <p className="free-shipping-note">
                  Add ${(50 - subtotal).toFixed(2)} more to get FREE shipping!
                </p>
              )}
              
              <div className="summary-total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              
              <button 
                className="checkout-btn"
                onClick={() => navigate('/checkout')}
                disabled={cart.length === 0}
              >
                Proceed to Checkout
              </button>
              
              <div className="payment-methods">
                <p>We accept:</p>
                <div className="payment-icons">
                  <span className="payment-icon">💳</span>
                  <span className="payment-icon">💰</span>
                  <span className="payment-icon">🏦</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingCartPage; 