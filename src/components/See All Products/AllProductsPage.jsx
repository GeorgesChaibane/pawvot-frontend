import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AllProductsPage.css';

import dogFood1 from '../../assets/images/food/dog/Cesar steak dog.webp';
import dogFood2 from '../../assets/images/food/dog/rachael ray.webp';
import dogToy1 from '../../assets/images/toys/playology chew stick dog.webp';
import dogCatToy from '../../assets/images/toys/dog ball works with cat too.webp';
import dogMedicine1 from '../../assets/images/medicines/dog/Petarmor Antihistamine.jpeg';
import dogMedicine2 from '../../assets/images/medicines/dog/Petarmor 7 Way De-Wormer For.jpeg';
import catFood1 from '../../assets/images/food/cat/purina fancy feast wet cat.webp';
import catFood2 from '../../assets/images/food/cat/purina fancy feast grilled wet cat.webp';
import catToy1 from '../../assets/images/toys/cat toy ball catch game.webp';
import catToy2 from '../../assets/images/toys/cat toy ball.webp';
import catMedicine1 from '../../assets/images/medicines/cat/Cat Heart Supplements - Immune.jpeg';
import catMedicine2 from '../../assets/images/medicines/cat/PET SUPPLEMENTS Stomach Relief.jpeg';

// Placeholder data (in a real app, this would come from an API)
const DUMMY_PRODUCTS = [
  {
    id: 1,
    name: 'CESAR Adult Soft Wet Dog Food Steak Lovers Variety Pack with Red Meat, (36) 3.5 oz. Trays',
    category: 'Food',
    subcategory: 'Dog Food',
    price: 35.99,
    discountPrice: null,
    rating: 4.7,
    stock: 15,
    petType: 'Dog',
    image: dogFood1,
    description: 'Premium wet dog food made with real meat, perfect for your furry friend.'
  },
  {
    id: 2,
    name: 'Rachael Ray Nutrish Natural Premium Wet Dog Food, Savory Favorites Variety Pack, 8 Ounce Tub (Pack of 6)',
    category: 'Food',
    subcategory: 'Dog Food',
    price: 29.99,
    discountPrice: null,
    rating: 4.5,
    stock: 12,
    petType: 'Dog',
    image: dogFood2,
    description: 'Natural wet dog food with wholesome ingredients for your pet\'s health and happiness.'
  },
  {
    id: 3,
    name: 'Squeaky Chew Stick Bundle, X-Large, 2-Pack',
    category: 'Toy',
    subcategory: 'Dog Toys',
    price: 12.99,
    discountPrice: 9.99,
    rating: 4.5,
    stock: 20,
    petType: 'Dog',
    image: dogToy1,
    description: 'Durable chew sticks with squeakers to keep your dog entertained for hours.'
  },
  {
    id: 4,
    name: 'Interactive Dog Ball Toy with LED Lights - Rechargeable Waterproof Auto Rotate Toy for Cats & Dogs',
    category: 'Toy',
    subcategory: 'Interactive Toys',
    price: 19.99,
    discountPrice: null,
    rating: 4.8,
    stock: 8,
    petType: 'Both',
    image: dogCatToy,
    description: 'Motion-activated ball with LED lights that rolls and rotates automatically.'
  },
  {
    id: 5,
    name: 'Petarmor Antihistamine',
    category: 'Medicine',
    subcategory: 'Allergy Care',
    price: 24.99,
    discountPrice: null,
    rating: 4.6,
    stock: 10,
    petType: 'Dog',
    image: dogMedicine1,
    description: 'Relief from allergies and skin irritations for your canine companion.'
  },
  {
    id: 6,
    name: 'Petarmor 7 Way De-Wormer For Dogs',
    category: 'Medicine',
    subcategory: 'Parasite Control',
    price: 28.99,
    discountPrice: 25.99,
    rating: 4.4,
    stock: 7,
    petType: 'Dog',
    image: dogMedicine2,
    description: 'Effective treatment for 7 types of common worms in dogs.'
  },
  {
    id: 7,
    name: 'Purina Fancy Feast Wet Cat Food Variety Pack, Medleys White Meat Chicken in Sauce Collection - (Pack of 12) 3 oz. Cans',
    category: 'Food',
    subcategory: 'Cat Food',
    price: 22.99,
    discountPrice: null,
    rating: 4.9,
    stock: 18,
    petType: 'Cat',
    image: catFood1,
    description: 'Gourmet wet cat food with tender chicken in a delicious sauce that cats love.'
  },
  {
    id: 8,
    name: 'Purina Fancy Feast Grilled Wet Cat Food Chicken Feast in Wet Cat Food Gravy - (Pack of 12) 3 oz. Cans',
    category: 'Food',
    subcategory: 'Cat Food',
    price: 21.99,
    discountPrice: null,
    rating: 4.8,
    stock: 14,
    petType: 'Cat',
    image: catFood2,
    description: 'Grilled chicken in gravy that provides both nutrition and flavor for your cat.'
  },
  {
    id: 9,
    name: 'Interactive Cat Toys Ball for Indoor Cats Fast Rolling on Carpet, Chirping & Motion Activate Cat Toys (Blue)',
    category: 'Toy',
    subcategory: 'Cat Toys',
    price: 14.99,
    discountPrice: 12.99,
    rating: 4.6,
    stock: 9,
    petType: 'Cat',
    image: catToy1,
    description: 'Motion-activated ball that chirps and rolls to entertain indoor cats.'
  },
  {
    id: 10,
    name: 'Interactive Cat Toys Ball Fast Rolling In Pouch, Motion Activate Chirping Cat Toy Hide and Seek Mouse Catching Game (Blue)',
    category: 'Toy',
    subcategory: 'Cat Toys',
    price: 16.99,
    discountPrice: null,
    rating: 4.7,
    stock: 11,
    petType: 'Cat',
    image: catToy2,
    description: 'Interactive ball with hiding pouch for hide-and-seek play with your cat.'
  },
  {
    id: 11,
    name: 'Cat Heart Supplements - Immune',
    category: 'Medicine',
    subcategory: 'Health Supplements',
    price: 32.99,
    discountPrice: 29.99,
    rating: 4.5,
    stock: 6,
    petType: 'Cat',
    image: catMedicine1,
    description: 'Heart and immune system support supplements for feline health.'
  },
  {
    id: 12,
    name: 'PET SUPPLEMENTS Stomach Relief',
    category: 'Medicine',
    subcategory: 'Digestive Health',
    price: 26.99,
    discountPrice: null,
    rating: 4.4,
    stock: 8,
    petType: 'Cat',
    image: catMedicine2,
    description: 'Natural supplements to relieve digestive issues and promote gut health in cats.'
  }
];

const AllProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    subcategory: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'featured'
  });
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    // In a real app, this would be an API call
    setProducts(DUMMY_PRODUCTS);
    setFilteredProducts(DUMMY_PRODUCTS);
    
    // Check for existing cart in localStorage
    const savedCart = localStorage.getItem('pawvot-cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, searchQuery, products]);

  useEffect(() => {
    // Save cart to localStorage whenever it changes
    localStorage.setItem('pawvot-cart', JSON.stringify(cart));
  }, [cart]);

  const applyFilters = () => {
    let filtered = [...products];

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.subcategory.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    // Apply subcategory filter
    if (filters.subcategory) {
      filtered = filtered.filter(product => product.subcategory === filters.subcategory);
    }

    // Apply price range filter
    if (filters.minPrice) {
      filtered = filtered.filter(product => 
        (product.discountPrice || product.price) >= parseFloat(filters.minPrice)
      );
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(product => 
        (product.discountPrice || product.price) <= parseFloat(filters.maxPrice)
      );
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'priceLow':
        filtered.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
        break;
      case 'priceHigh':
        filtered.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        // In a real app, this would sort by date added
        break;
      default: 
        // 'featured' - no specific sort
        break;
    }

    setFilteredProducts(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      subcategory: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'featured'
    });
    setSearchQuery('');
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(prevCart => 
        prevCart.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        )
      );
    } else {
      setCart(prevCart => [...prevCart, { ...product, quantity: 1 }]);
    }
    
    // Open the cart sidebar
    setCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

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

  // Calculate cart totals
  const cartTotal = cart.reduce((total, item) => 
    total + (item.discountPrice || item.price) * item.quantity, 0
  );

  // Extract unique values for filter dropdowns
  const categories = [...new Set(products.map(product => product.category))];
  const subcategories = [...new Set(products.map(product => product.subcategory))];

  return (
    <div className="all-products-page">
      <div className="products-header">
        <h1>Shop Pet Products</h1>
        <p>Quality products for your furry friends</p>
      </div>

      <div className="products-content-container">
        <div className="filter-sidebar">
          <div className="filter-header">
            <h2>Filter Products</h2>
            <button className="clear-filters-btn" onClick={clearFilters}>Clear All</button>
          </div>

          {/* <div className="filter-section">
            <label htmlFor="searchQuery">Search</label>
            <input
              type="text"
              id="searchQuery"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div> */}

          <div className="filter-section">
            <label htmlFor="category">Category</label>
            <select 
              id="category" 
              name="category" 
              value={filters.category} 
              onChange={handleFilterChange}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="filter-section">
            <label htmlFor="subcategory">Type</label>
            <select 
              id="subcategory" 
              name="subcategory" 
              value={filters.subcategory} 
              onChange={handleFilterChange}
            >
              <option value="">All Types</option>
              {subcategories.map(subcategory => (
                <option key={subcategory} value={subcategory}>{subcategory}</option>
              ))}
            </select>
          </div>

          <div className="filter-section">
            <label htmlFor="price-range">Price Range</label>
            <div className="price-inputs">
              <input
                type="number"
                id="minPrice"
                name="minPrice"
                placeholder="Min"
                min="0"
                value={filters.minPrice}
                onChange={handleFilterChange}
              />
              <span>to</span>
              <input
                type="number"
                id="maxPrice"
                name="maxPrice"
                placeholder="Max"
                min="0"
                value={filters.maxPrice}
                onChange={handleFilterChange}
              />
            </div>
          </div>

          <div className="filter-section">
            <label htmlFor="sortBy">Sort By</label>
            <select 
              id="sortBy" 
              name="sortBy" 
              value={filters.sortBy} 
              onChange={handleFilterChange}
            >
              <option value="featured">Featured</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest Arrivals</option>
            </select>
          </div>
        </div>

        <div className="products-grid-container">
          <div className="products-count">
            <p>Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}</p>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="no-results">
              <p>No products found matching your criteria. Try adjusting your filters.</p>
              <button className="clear-filters-btn" onClick={clearFilters}>Clear Filters</button>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map(product => (
                <div key={product.id} className="product-card">
                  <div className="product-image">
                    <img src={product.image} alt={product.name} />
                    {product.discountPrice && (
                      <div className="product-sale-tag">Sale</div>
                    )}
                  </div>
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p className="product-category">{product.category} • {product.subcategory}</p>
                    
                    <div className="product-pricing">
                      {product.discountPrice ? (
                        <>
                          <span className="product-price discounted">${product.price.toFixed(2)}</span>
                          <span className="product-discount-price">${product.discountPrice.toFixed(2)}</span>
                        </>
                      ) : (
                        <span className="product-price">${product.price.toFixed(2)}</span>
                      )}
                    </div>
                    
                    <div className="product-rating">
                      <div className="stars" style={{ '--rating': product.rating }}></div>
                      <span>{product.rating}</span>
                    </div>
                    
                    <button 
                      className="add-to-cart-btn"
                      onClick={() => addToCart(product)}
                      disabled={product.stock === 0}
                    >
                      {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Shopping Cart Sidebar */}
        <div className={`cart-sidebar ${cartOpen ? 'open' : ''}`}>
          <div className="cart-header">
            <h2>Your Cart ({cart.reduce((total, item) => total + item.quantity, 0)})</h2>
            <button className="close-cart-btn" onClick={() => setCartOpen(false)}>✕</button>
          </div>
          
          {cart.length === 0 ? (
            <div className="empty-cart">
              <p>Your cart is empty</p>
              <button className="continue-shopping-btn" onClick={() => setCartOpen(false)}>Continue Shopping</button>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cart.map(item => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-image">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="cart-item-details">
                      <h4>{item.name}</h4>
                      <p className="cart-item-price">
                        ${(item.discountPrice || item.price).toFixed(2)}
                      </p>
                      <div className="quantity-controls">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="quantity-btn"
                        >
                          {item.quantity === 1 ? '🗑️' : '-'}
                        </button>
                        <span className="quantity">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="quantity-btn"
                          disabled={item.quantity >= item.stock}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="cart-summary">
                <div className="cart-total">
                  <span>Total:</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <Link to="/cart" className="view-cart-btn">Go to Cart</Link>
                <Link to="/checkout" className="checkout-btn">Proceed to Checkout</Link>
              </div>
            </>
          )}
        </div>
        
        {/* Cart toggle button (mobile) */}
        <button 
          className="toggle-cart-btn" 
          onClick={() => setCartOpen(!cartOpen)}
        >
          🛒 {cart.reduce((total, item) => total + item.quantity, 0)}
        </button>
      </div>
    </div>
  );
};

export default AllProductsPage; 