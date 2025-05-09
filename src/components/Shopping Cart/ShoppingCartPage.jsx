import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CartService from '../../services/cartService';
import config from '../../config';
//import ProductService from '../../services/productService';
import './ShoppingCartPage.css';

// Import images for empty cart page only
// import dogFood1 from '../../assets/images/food/dog/Cesar steak dog.webp';
// import dogToy1 from '../../assets/images/toys/playology chew stick dog.webp';
// import catFood1 from '../../assets/images/food/cat/purina fancy feast wet cat.webp';

const ShoppingCartPage = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Sample placeholder products for empty cart suggestions
  // const placeholderProducts = [
  //   {
  //     productId: 'placeholder-1',
  //     name: 'CESAR Adult Soft Wet Dog Food Steak Lovers Variety Pack',
  //     category: 'food',
  //     price: 35.99,
  //     quantity: 1,
  //     countInStock: 15,
  //     image: dogFood1
  //   },
  //   {
  //     productId: 'placeholder-2',
  //     name: 'Squeaky Chew Stick Bundle, X-Large, 2-Pack',
  //     category: 'toys',
  //     price: 12.99,
  //     quantity: 1,
  //     countInStock: 20,
  //     image: dogToy1
  //   },
  //   {
  //     productId: 'placeholder-3',
  //     name: 'Purina Fancy Feast Wet Cat Food Variety Pack',
  //     category: 'food',
  //     price: 22.99,
  //     quantity: 1,
  //     countInStock: 18,
  //     image: catFood1
  //   }
  // ];

  useEffect(() => {
    // Get initial cart from CartService
    loadCart();

    // Listen for storage events to update cart when it changes
    const handleStorageChange = () => {
      loadCart();
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const loadCart = () => {
    try {
      const cartData = CartService.getCartItems();
      
      // Process each item to ensure proper image path
      const processedCart = cartData.map(item => ({
        ...item,
        image: item.image ? config.getImageUrl(item.image) : 'https://via.placeholder.com/300x300?text=No+Image'
      }));
      
      setCart(processedCart);
      setLoading(false);
    } catch (error) {
      console.error('Error loading cart:', error);
      setLoading(false);
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    
    // Find the item to check stock limit
    const item = cart.find(item => item.productId === productId);
    if (item && item.countInStock) {
      // Ensure quantity doesn't exceed stock
      newQuantity = Math.min(newQuantity, item.countInStock);
    }
    
    CartService.updateCartItemQuantity(productId, newQuantity);
    loadCart();
  };

  const handleQuantityChange = (e, productId) => {
    const value = parseInt(e.target.value) || 1;
    updateQuantity(productId, value);
  };

  const removeFromCart = (productId) => {
    CartService.removeFromCart(productId);
    loadCart();
  };

  const clearCart = () => {
    CartService.clearCart();
    loadCart();
  };

  // Calculate cart totals
  const subtotal = CartService.getCartTotal();
  
  const taxRate = 0.11; // 11% tax rate
  const tax = subtotal * taxRate;
  
  const shipping = subtotal > 50 ? 0 : 7.99; // Free shipping over $50
  
  const total = subtotal + tax + shipping;
  
  const itemCount = CartService.getCartItemCount();

  // Function to add a placeholder product to cart for demo purposes
  //const addPlaceholderToCart = (product) => {
  //   CartService.addToCart(product);
  //   loadCart();
  // };

  // Proceed to checkout
  const proceedToCheckout = () => {
    navigate('/checkout');
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
            {/* <div className="sample-products">
              <h3>Suggested Products</h3>
              <div className="sample-products-grid">
                {placeholderProducts.map(product => (
                  <div key={product.productId} className="sample-product">
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
            </div> */}
            
            <Link to="/products" className="continue-shopping-link-cart">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items-section-cart">
              <div className="cart-items-header-cart">
                <span className="product-col">Product</span>
                <span className="price-col">Price</span>
                <span className="quantity-col">Quantity</span>
                <span className="total-col">Total</span>
              </div>
              
              <div className="cart-items-list">
                {cart.map(item => (
                  <div key={item.productId} className="cart-item-cart">
                    <div className="product-col">
                      <div className="product-image">
                        <img src={item.image} alt={item.name} />
                      </div>
                      <div className="product-details">
                        <h3>{item.name}</h3>
                        <p className="product-category">{item.category}</p>
                        <button 
                          className="remove-item-btn"
                          onClick={() => removeFromCart(item.productId)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    
                    <div className="price-col">
                      ${item.price.toFixed(2)}
                    </div>
                    
                    <div className="quantity-col">
                      <div className="quantity-control">
                        <button 
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="quantity-btn-cart"
                          aria-label="Decrease quantity"
                          disabled={item.quantity <= 1}
                          max={item.countInStock}
                        >
                          -
                        </button>
                        <input
                          //type="number"
                          min="1" 
                          max={item.countInStock} 
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(e, item.productId)}
                          className="quantity-input-cart"
                        />
                        <button 
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="quantity-btn-cart"
                          disabled={item.quantity >= item.countInStock}
                          aria-label="Increase quantity"
                          max={item.countInStock}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    
                    <div className="total-col">
                      ${(item.price * item.quantity).toFixed(2)}
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
                <div className="free-shipping-msg">
                  <p>Add ${(50 - subtotal).toFixed(2)} more to qualify for FREE shipping</p>
                </div>
              )}
              
              <div className="summary-total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              
              <div className="checkout-actions">
                <button 
                  className="checkout-btn"
                  onClick={proceedToCheckout}
                >
                  Proceed to Checkout
                </button>
              </div>
              
              <div className="payment-methods-cart">
                <p>We accept:</p>
                <div className="payment-icons-cart">
                  <span className="payment-icon-cart">Visa</span>
                  <span className="payment-icon-cart">Mastercard</span>
                  <span className="payment-icon-cart">American Express</span>
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