import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
//import { useAuth } from '../../context/AuthContext';
import ProductService from '../../services/productService';
import CartService from '../../services/cartService';
import config from '../../config';
import './AllProductsPage.css';

// import dogFood1 from '../../assets/images/food/dog/Cesar steak dog.webp';
// import dogFood2 from '../../assets/images/food/dog/rachael ray.webp';
// import dogToy1 from '../../assets/images/toys/playology chew stick dog.webp';
// import dogCatToy from '../../assets/images/toys/dog ball works with cat too.webp';
// import dogMedicine1 from '../../assets/images/medicines/dog/Petarmor Antihistamine.jpeg';
// import dogMedicine2 from '../../assets/images/medicines/dog/Petarmor 7 Way De-Wormer For.jpeg';
// import catFood1 from '../../assets/images/food/cat/purina fancy feast wet cat.webp';
// import catFood2 from '../../assets/images/food/cat/purina fancy feast grilled wet cat.webp';
// import catToy1 from '../../assets/images/toys/cat toy ball catch game.webp';
// import catToy2 from '../../assets/images/toys/cat toy ball.webp';
// import catMedicine1 from '../../assets/images/medicines/cat/Cat Heart Supplements - Immune.jpeg';
// import catMedicine2 from '../../assets/images/medicines/cat/PET SUPPLEMENTS Stomach Relief.jpeg';

// Placeholder data (in a real app, this would come from an API)
// const DUMMY_PRODUCTS = [
//   {
//     id: 1,
//     name: 'CESAR Adult Soft Wet Dog Food Steak Lovers Variety Pack with Red Meat, (36) 3.5 oz. Trays',
//     category: 'Food',
//     subcategory: 'Dog Food',
//     price: 35.99,
//     discountPrice: null,
//     rating: 4.7,
//     stock: 15,
//     petType: 'Dog',
//     image: dogFood1,
//     description: 'Premium wet dog food made with real meat, perfect for your furry friend.'
//   },
//   {
//     id: 2,
//     name: 'Rachael Ray Nutrish Natural Premium Wet Dog Food, Savory Favorites Variety Pack, 8 Ounce Tub (Pack of 6)',
//     category: 'Food',
//     subcategory: 'Dog Food',
//     price: 29.99,
//     discountPrice: null,
//     rating: 4.5,
//     stock: 12,
//     petType: 'Dog',
//     image: dogFood2,
//     description: 'Natural wet dog food with wholesome ingredients for your pet\'s health and happiness.'
//   },
//   {
//     id: 3,
//     name: 'Squeaky Chew Stick Bundle, X-Large, 2-Pack',
//     category: 'Toy',
//     subcategory: 'Dog Toys',
//     price: 12.99,
//     discountPrice: 9.99,
//     rating: 4.5,
//     stock: 20,
//     petType: 'Dog',
//     image: dogToy1,
//     description: 'Durable chew sticks with squeakers to keep your dog entertained for hours.'
//   },
//   {
//     id: 4,
//     name: 'Interactive Dog Ball Toy with LED Lights - Rechargeable Waterproof Auto Rotate Toy for Cats & Dogs',
//     category: 'Toy',
//     subcategory: 'Interactive Toys',
//     price: 19.99,
//     discountPrice: null,
//     rating: 4.8,
//     stock: 8,
//     petType: 'Both',
//     image: dogCatToy,
//     description: 'Motion-activated ball with LED lights that rolls and rotates automatically.'
//   },
//   {
//     id: 5,
//     name: 'Petarmor Antihistamine',
//     category: 'Medicine',
//     subcategory: 'Allergy Care',
//     price: 24.99,
//     discountPrice: null,
//     rating: 4.6,
//     stock: 10,
//     petType: 'Dog',
//     image: dogMedicine1,
//     description: 'Relief from allergies and skin irritations for your canine companion.'
//   },
//   {
//     id: 6,
//     name: 'Petarmor 7 Way De-Wormer For Dogs',
//     category: 'Medicine',
//     subcategory: 'Parasite Control',
//     price: 28.99,
//     discountPrice: 25.99,
//     rating: 4.4,
//     stock: 7,
//     petType: 'Dog',
//     image: dogMedicine2,
//     description: 'Effective treatment for 7 types of common worms in dogs.'
//   },
//   {
//     id: 7,
//     name: 'Purina Fancy Feast Wet Cat Food Variety Pack, Medleys White Meat Chicken in Sauce Collection - (Pack of 12) 3 oz. Cans',
//     category: 'Food',
//     subcategory: 'Cat Food',
//     price: 22.99,
//     discountPrice: null,
//     rating: 4.9,
//     stock: 18,
//     petType: 'Cat',
//     image: catFood1,
//     description: 'Gourmet wet cat food with tender chicken in a delicious sauce that cats love.'
//   },
//   {
//     id: 8,
//     name: 'Purina Fancy Feast Grilled Wet Cat Food Chicken Feast in Wet Cat Food Gravy - (Pack of 12) 3 oz. Cans',
//     category: 'Food',
//     subcategory: 'Cat Food',
//     price: 21.99,
//     discountPrice: null,
//     rating: 4.8,
//     stock: 14,
//     petType: 'Cat',
//     image: catFood2,
//     description: 'Grilled chicken in gravy that provides both nutrition and flavor for your cat.'
//   },
//   {
//     id: 9,
//     name: 'Interactive Cat Toys Ball for Indoor Cats Fast Rolling on Carpet, Chirping & Motion Activate Cat Toys (Blue)',
//     category: 'Toy',
//     subcategory: 'Cat Toys',
//     price: 14.99,
//     discountPrice: 12.99,
//     rating: 4.6,
//     stock: 9,
//     petType: 'Cat',
//     image: catToy1,
//     description: 'Motion-activated ball that chirps and rolls to entertain indoor cats.'
//   },
//   {
//     id: 10,
//     name: 'Interactive Cat Toys Ball Fast Rolling In Pouch, Motion Activate Chirping Cat Toy Hide and Seek Mouse Catching Game (Blue)',
//     category: 'Toy',
//     subcategory: 'Cat Toys',
//     price: 16.99,
//     discountPrice: null,
//     rating: 4.7,
//     stock: 11,
//     petType: 'Cat',
//     image: catToy2,
//     description: 'Interactive ball with hiding pouch for hide-and-seek play with your cat.'
//   },
//   {
//     id: 11,
//     name: 'Cat Heart Supplements - Immune',
//     category: 'Medicine',
//     subcategory: 'Health Supplements',
//     price: 32.99,
//     discountPrice: 29.99,
//     rating: 4.5,
//     stock: 6,
//     petType: 'Cat',
//     image: catMedicine1,
//     description: 'Heart and immune system support supplements for feline health.'
//   },
//   {
//     id: 12,
//     name: 'PET SUPPLEMENTS Stomach Relief',
//     category: 'Medicine',
//     subcategory: 'Digestive Health',
//     price: 26.99,
//     discountPrice: null,
//     rating: 4.4,
//     stock: 8,
//     petType: 'Cat',
//     image: catMedicine2,
//     description: 'Natural supplements to relieve digestive issues and promote gut health in cats.'
//   }
// ];

// API base URL
//const BASE_API_URL = 'http://localhost:5000';

const AllProductsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  //const { currentUser } = useAuth();
  
  // Query parameters from URL
  const queryParams = new URLSearchParams(location.search);
  const initialSearchQuery = queryParams.get('search') || '';
  const initialCategory = queryParams.get('category') || '';
  const initialPetType = queryParams.get('petType') || '';
  const initialPage = parseInt(queryParams.get('page')) || 1;
  
  // State variables
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [filters, setFilters] = useState({
    category: initialCategory,
    petType: initialPetType,
    priceRange: { min: '', max: '' },
    sortBy: 'featured'
  });
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [productsPerPage] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  
  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let data;
        
        // Check if we have a search query
        if (searchQuery) {
          data = await ProductService.searchProducts(searchQuery);
        } else {
          data = await ProductService.getAllProducts();
        }
        
        // Add display price field
        const productsWithDisplayPrice = data.map(product => ({
          ...product,
          // If product has discount, calculate discount price
          discountPrice: product.discount ? 
            (product.price - (product.price * product.discount / 100)).toFixed(2) * 1 : 
            null,
          // No need to fix image paths here as we'll use the config helper when rendering
        }));
        
        setProducts(productsWithDisplayPrice);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [searchQuery]);
  
  // Apply filters and calculate pagination
  useEffect(() => {
    let filtered = [...products];
    
    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(product => 
        product.category && product.category.toLowerCase() === filters.category.toLowerCase()
      );
    }
    
    // Apply pet type filter
    if (filters.petType) {
      filtered = filtered.filter(product => 
        product.petType && (
          (Array.isArray(product.petType) && product.petType.includes(filters.petType.toLowerCase())) ||
          (typeof product.petType === 'string' && product.petType.toLowerCase() === filters.petType.toLowerCase())
        )
      );
    }
    
    // Apply price range filter
    if (filters.priceRange.min && !isNaN(parseFloat(filters.priceRange.min))) {
      filtered = filtered.filter(product => 
        (product.discountPrice || product.price) >= parseFloat(filters.priceRange.min)
      );
    }
    
    if (filters.priceRange.max && !isNaN(parseFloat(filters.priceRange.max))) {
      filtered = filtered.filter(product => 
        (product.discountPrice || product.price) <= parseFloat(filters.priceRange.max)
      );
    }
    
    // Apply sorting
    switch (filters.sortBy) {
      case 'price-low-high':
        filtered.sort((a, b) => 
          (a.discountPrice || a.price) - (b.discountPrice || b.price)
        );
        break;
      case 'price-high-low':
        filtered.sort((a, b) => 
          (b.discountPrice || b.price) - (a.discountPrice || a.price)
        );
        break;
      case 'newest':
        filtered.sort((a, b) => 
          new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
        break;
      case 'featured':
      default:
        filtered.sort((a, b) => 
          (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
        );
        break;
    }
    
    // Calculate total pages
    setTotalPages(Math.ceil(filtered.length / productsPerPage));
    
    // Adjust currentPage if it's out of bounds
    if (currentPage > Math.ceil(filtered.length / productsPerPage)) {
      setCurrentPage(1);
    }
    
    setFilteredProducts(filtered);
    
    // Update URL with query parameters
    const newParams = new URLSearchParams();
    if (searchQuery) newParams.set('search', searchQuery);
    if (filters.category) newParams.set('category', filters.category);
    if (filters.petType) newParams.set('petType', filters.petType);
    if (currentPage > 1) newParams.set('page', currentPage.toString());
    
    const newUrl = `${location.pathname}${newParams.toString() ? `?${newParams.toString()}` : ''}`;
    navigate(newUrl, { replace: true });
    
  }, [products, filters, searchQuery, currentPage, productsPerPage, navigate, location.pathname]);
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'min' || name === 'max') {
      setFilters(prevFilters => ({
        ...prevFilters,
        priceRange: {
          ...prevFilters.priceRange,
          [name]: value
        }
      }));
    } else {
      setFilters(prevFilters => ({
        ...prevFilters,
        [name]: value
      }));
    }
    
    // Reset to first page when filter changes
    setCurrentPage(1);
  };
  
  const clearFilters = () => {
    setFilters({
      category: '',
      petType: '',
      priceRange: { min: '', max: '' },
      sortBy: 'featured'
    });
    setSearchQuery('');
    setCurrentPage(1);
  };
  
  const addToCart = (product) => {
    CartService.addToCart(product);
  };
  
  // Calculate categories and pet types from available products
  const categories = [...new Set(products.map(product => product.category))].filter(Boolean);
  const petTypes = [...new Set(products.flatMap(product => 
    Array.isArray(product.petType) ? product.petType : [product.petType]
  ))].filter(Boolean);
  
  // Get current products for pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // Next and previous page
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  return (
    <div className="all-products-page">
      <div className="products-header">
        <h1>Shop All Pet Products</h1>
      </div>
      
      <div className="products-content-container">
        <div className="filter-sidebar-pro">
          <div className="filter-header">
            <h2>Filter Products</h2>
            <button className="clear-filters-btn" onClick={clearFilters}>
              Clear All Filters
            </button>
          </div>
          
          <div className="filter-section">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
            >
              <option value="">All Categories</option>
              {categories.map((category, idx) => (
                <option key={idx} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          <div className="filter-section">
            <label htmlFor="petType">Pet Type</label>
            <select
              id="petType"
              name="petType"
              value={filters.petType}
              onChange={handleFilterChange}
            >
              <option value="">All Pets</option>
              {petTypes.map((type, idx) => (
                <option key={idx} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          <div className="filter-section">
            <label>Price Range</label>
            <div className="price-inputs">
              <input
                type="number"
                placeholder="Min"
                name="min"
                value={filters.priceRange.min}
                onChange={handleFilterChange}
                min="0"
              />
              <span>to</span>
              <input
                type="number"
                placeholder="Max"
                name="max"
                value={filters.priceRange.max}
                onChange={handleFilterChange}
                min="0"
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
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>
        
        <div className="products-grid-container">
          {loading ? (
            <div className="loading-indicator">
              <div className="spinner"></div>
              <p>Loading products...</p>
            </div>
          ) : error ? (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={() => window.location.reload()}>Retry</button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="no-products">
              <p>No products found matching your criteria.</p>
              <button onClick={clearFilters}>Clear Filters</button>
            </div>
          ) : (
            <>
              <div className="products-count">
                <p>Showing {indexOfFirstProduct+1}-{Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} products</p>
              </div>
              
              <div className="products-grid">
                {currentProducts.map(product => (
                  <div key={product._id} className="product-card">
                    <div className="product-image-allp">
                      <Link to={`/products/${product._id}`}>
                        <img 
                          src={product.images && product.images.length > 0 ? 
                            config.getImageUrl(product.images[0]) : 
                            'https://via.placeholder.com/300x300?text=No+Image'
                          } 
                          alt={product.name} 
                        />
                      </Link>
                      {product.discount > 0 && (
                        <span className="product-sale-tag">-{product.discount}%</span>
                      )}
                    </div>
                    
                    <div className="product-info-all">
                      <h3>{product.name}</h3>
                      <p className="product-category">
                        {product.category && product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                        {product.subcategory && ` • ${product.subcategory}`}
                      </p>
                      
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
                        <div className="stars" style={{ '--rating': product.rating || 0 }}></div>
                        <span>{product.rating || 0}</span>
                      </div>
                      
                      <div className="product-buttons-all">
                        <button 
                          className="add-to-cart-btn"
                          onClick={() => addToCart(product)}
                          disabled={product.countInStock === 0}
                        >
                          {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                        <Link 
                          to={`/products/${product._id}`} 
                          className="buy-now-btn-all"
                        >
                          Buy Now
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button 
                    onClick={goToPreviousPage} 
                    disabled={currentPage === 1}
                    className="page-navigation"
                  >
                    &laquo; Previous
                  </button>
                  
                  <div className="page-numbers">
                    {[...Array(totalPages)].map((_, index) => {
                      // Show limited page numbers with ellipses
                      const pageNum = index + 1;
                      
                      // Always show first page, last page, current page, and one page before/after current
                      if (
                        pageNum === 1 || 
                        pageNum === totalPages || 
                        (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                      ) {
                        return (
                          <button 
                            key={index} 
                            onClick={() => paginate(pageNum)}
                            className={pageNum === currentPage ? 'active' : ''}
                          >
                            {pageNum}
                          </button>
                        );
                      }
                      
                      // Show ellipsis for skipped pages (but only once)
                      if (
                        (pageNum === 2 && currentPage > 3) || 
                        (pageNum === totalPages - 1 && currentPage < totalPages - 2)
                      ) {
                        return <span key={index} className="ellipsis">...</span>;
                      }
                      
                      return null;
                    })}
                  </div>
                  
                  <button 
                    onClick={goToNextPage} 
                    disabled={currentPage === totalPages}
                    className="page-navigation"
                  >
                    Next &raquo;
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllProductsPage; 