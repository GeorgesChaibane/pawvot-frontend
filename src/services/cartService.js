import API from './api';
import config from '../config';

// Cart service for managing shopping cart items
const CartService = {
  /**
   * Get all items in the cart
   * @returns {Array} Array of cart items
   */
  getCartItems: () => {
    const cartItems = localStorage.getItem('cartItems');
    return cartItems ? JSON.parse(cartItems) : [];
  },
  
  /**
   * Get all items in cart (alias for getCartItems for consistency)
   * @returns {Array} Array of cart items
   */
  getCart: function() {
    return this.getCartItems();
  },

  /**
   * Check if user is authenticated
   * @returns {Boolean} Whether user is authenticated
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  /**
   * Add item to cart
   * @param {Object} product - Product to add to cart
   * @param {Number} quantity - Quantity to add (default: 1)
   * @param {Boolean} directBuy - Whether this is a direct buy (Buy Now button)
   * @returns {Object} Response with items and redirectRequired flag
   */
  addToCart: async (product, quantity = 1, directBuy = false) => {
    // Check authentication if we're doing a direct buy
    if (directBuy && !CartService.isAuthenticated()) {
      // Return flag indicating redirect is required
      return { redirectRequired: true };
    }
    
    const cartItems = CartService.getCartItems();
    
    // Check if product already exists in cart
    const existItem = cartItems.find(item => 
      item.productId === (product.productId || product._id)
    );
    
    let updatedItems;
    
    if (existItem) {
      // Update quantity if product is already in cart
      updatedItems = cartItems.map(item => 
        item.productId === (product.productId || product._id)
          ? { ...item, quantity: item.quantity + quantity } 
          : item
      );
    } else {
      // Add new product to cart
      // Get image source, preferring the first image in the images array if available
      const imageSource = product.image || 
        (product.images && product.images.length > 0 ? product.images[0] : '');

      const newItem = {
        productId: product._id || product.productId,
        name: product.name,
        image: imageSource,
        category: product.category || '',
        price: product.price,
        countInStock: product.countInStock,
        quantity
      };
      
      updatedItems = [...cartItems, newItem];
    }
    
    // Save to localStorage
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
    
    // Try to save to server if user is logged in
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // If user is logged in, sync with server too
        await API.post('/users/cart', { 
          productId: product._id || product.productId,
          quantity 
        });
      }
    } catch (error) {
      console.error('Error syncing cart with server:', error);
      // Continue with local storage even if server sync fails
    }
    
    // Dispatch a custom event to notify components of cart changes
    window.dispatchEvent(new Event('storage'));
    
    return { items: updatedItems, redirectRequired: false };
  },

  /**
   * Update cart item quantity
   * @param {String} productId - ID of product to update
   * @param {Number} quantity - New quantity
   * @returns {Array} Updated cart items
   */
  updateCartItemQuantity: async (productId, quantity) => {
    const cartItems = CartService.getCartItems();
    
    // Update quantity
    const updatedItems = cartItems.map(item => 
      item.productId === productId ? { ...item, quantity } : item
    );
    
    // Save to localStorage
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
    
    // Try to save to server if user is logged in
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // If user is logged in, sync with server too
        await API.put(`/users/cart/${productId}`, { quantity });
      }
    } catch (error) {
      console.error('Error syncing cart with server:', error);
      // Continue with local storage even if server sync fails
    }
    
    // Dispatch a custom event to notify components of cart changes
    window.dispatchEvent(new Event('storage'));
    
    return updatedItems;
  },

  /**
   * Remove item from cart
   * @param {String} productId - ID of product to remove
   * @returns {Array} Updated cart items
   */
  removeFromCart: async (productId) => {
    const cartItems = CartService.getCartItems();
    
    // Filter out the removed item
    const updatedItems = cartItems.filter(item => item.productId !== productId);
    
    // Save to localStorage
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
    
    // Try to save to server if user is logged in
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // If user is logged in, sync with server too
        await API.delete(`/users/cart/${productId}`);
      }
    } catch (error) {
      console.error('Error syncing cart with server:', error);
      // Continue with local storage even if server sync fails
    }
    
    // Dispatch a custom event to notify components of cart changes
    window.dispatchEvent(new Event('storage'));
    
    return updatedItems;
  },

  /**
   * Clear the cart
   * @returns {Array} Empty array
   */
  clearCart: async () => {
    // Save to localStorage
    localStorage.removeItem('cartItems');
    
    // Try to save to server if user is logged in
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // If user is logged in, sync with server too
        await API.delete('/users/cart');
      }
    } catch (error) {
      console.error('Error syncing cart with server:', error);
      // Continue with local storage even if server sync fails
    }
    
    // Dispatch a custom event to notify components of cart changes
    window.dispatchEvent(new Event('storage'));
    
    return [];
  },

  /**
   * Sync cart with server (called on login)
   */
  syncCartWithServer: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      // Fetch current cart from server
      const response = await API.get('/users/cart');
      
      if (response.data && response.data.length > 0) {
        // Merge with local cart (keep both with higher quantities winning)
        const serverItems = response.data;
        const localItems = CartService.getCartItems();
        
        // Create a map of items by productId for easier merging
        const mergedItemsMap = {};
        
        // Add local items to map
        localItems.forEach(item => {
          mergedItemsMap[item.productId] = item;
        });
        
        // Merge server items (keeping higher quantity)
        serverItems.forEach(serverItem => {
          const localItem = mergedItemsMap[serverItem.productId];
          
          if (localItem) {
            // Item exists in both - keep higher quantity
            mergedItemsMap[serverItem.productId] = {
              ...serverItem,
              quantity: Math.max(localItem.quantity, serverItem.quantity)
            };
          } else {
            // Item only on server - add to local
            mergedItemsMap[serverItem.productId] = serverItem;
          }
        });
        
        // Convert map back to array
        const mergedItems = Object.values(mergedItemsMap);
        
        // Save merged cart back to localStorage
        localStorage.setItem('cartItems', JSON.stringify(mergedItems));
        
        // Dispatch a custom event to notify components of cart changes
        window.dispatchEvent(new Event('storage'));
        
        // Sync merged cart back to server
        await API.put('/users/cart/sync', { items: mergedItems });
      }
    } catch (error) {
      console.error('Error syncing cart with server:', error);
    }
  },

  /**
   * Get cart total (price * quantity for all items)
   * @returns {Number} Total price
   */
  getCartTotal: () => {
    const cartItems = CartService.getCartItems();
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  },

  /**
   * Get cart item count
   * @returns {Number} Total number of items in cart
   */
  getCartItemCount: () => {
    const cartItems = CartService.getCartItems();
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  }
};

export default CartService; 