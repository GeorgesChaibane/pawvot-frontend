import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductService from '../../services/productService';
import ProductCard from './ProductCard';
// import './styles.css';
import './styles/products.css';

// Import product images
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

// Local product data for fallback or initial products
// const localProductsData = [
//   {
//     id: 1,
//     name: 'CESAR Adult Soft Wet Dog Food Steak Lovers Variety Pack with Red Meat, (36) 3.5 oz. Trays',
//     category: 'food',
//     petType: ['dog'],
//     price: 24.99,
//     description: 'Premium dog food with real steak flavors',
//     brand: 'CESAR',
//     countInStock: 50,
//     images: [dogFood1]
//   },
//   {
//     id: 2,
//     name: 'Rachael Ray Nutrish Natural Premium Wet Dog Food, Savory Favorites Variety Pack, 8 Ounce Tub (Pack of 6)',
//     category: 'food',
//     petType: ['dog'],
//     price: 19.99,
//     description: 'Natural wet dog food made with real meat',
//     brand: 'Rachael Ray Nutrish',
//     countInStock: 45,
//     images: [dogFood2]
//   },
//   {
//     id: 3,
//     name: 'Squeaky Chew Stick Bundle, X-Large, 2-Pack',
//     category: 'toys',
//     petType: ['dog'],
//     price: 12.99,
//     description: 'Durable chew stick toy for dogs',
//     brand: 'Playology',
//     countInStock: 35,
//     images: [dogToy1]
//   },
//   {
//     id: 4,
//     name: 'Interactive Ball Toy with LED Lights - Rechargeable Waterproof Auto Rotate Toy for Cats & Dogs',
//     category: 'toys',
//     petType: ['dog', 'cat'],
//     price: 14.99,
//     description: 'Interactive light-up ball toy suitable for cats and dogs',
//     brand: 'PetFun',
//     countInStock: 30,
//     images: [dogCatToy]
//   },
//   {
//     id: 5,
//     name: 'Petarmor Antihistamine',
//     category: 'health',
//     petType: ['dog'],
//     price: 29.99,
//     description: 'Allergy medication for dogs',
//     brand: 'PetArmor',
//     countInStock: 25,
//     images: [dogMedicine1]
//   },
//   {
//     id: 6,
//     name: 'Petarmor 7 Way De-Wormer For Dogs',
//     category: 'health',
//     petType: ['dog'],
//     price: 34.99,
//     description: 'Comprehensive deworming medication for dogs',
//     brand: 'PetArmor',
//     countInStock: 20,
//     images: [dogMedicine2]
//   }
// ];

const ProductSection = ({ searchQuery }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [filters, setFilters] = useState({
  //   category: '',
  //   petType: ''
  // });

  // Fetch featured products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const fetchedProducts = await ProductService.getFeaturedProducts();
        
        if (fetchedProducts && fetchedProducts.length > 0) {
          setProducts(fetchedProducts);
        } else {
          // If no featured products from API, use local data
          //setProducts(localProductsData);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products');
        // Use local data as fallback
        //setProducts(localProductsData);
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  // Create product categories and pet types from available products
  // const productCategories = [...new Set(products.map(product => 
  //   typeof product.category === 'string' ? product.category : ''
  // ))];
  
  // const petTypes = [...new Set(products.flatMap(product => 
  //   Array.isArray(product.petType) ? product.petType : [product.petType]
  // ))];

  // Filter products based on filters and search query
  const getFilteredProducts = () => {
    let filteredProducts = [...products];

    // if (filters.category) {
    //   filteredProducts = filteredProducts.filter(product => 
    //     product.category === filters.category
    //   );
    // }

    // if (filters.petType) {
    //   filteredProducts = filteredProducts.filter(product => 
    //     (Array.isArray(product.petType) && product.petType.includes(filters.petType)) ||
    //     product.petType === filters.petType ||
    //     product.petType === 'all'
    //   );
    // }

    if (searchQuery) {
      filteredProducts = filteredProducts.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (product.brand && product.brand.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    return filteredProducts;
  };

  // const handleFilterChange = (e) => {
  //   const { name, value } = e.target;
  //   setFilters(prev => ({
  //     ...prev,
  //     [name]: value
  //   }));
  // };

  const filteredProducts = getFilteredProducts();

  return (
    <section id="shop">
      <div className="box-model">
        <h2 className="section-title">Shop Essentials for Your Pet</h2>
        
        {/* <div className="filter-container">
          <h3>Filter Products</h3>
          <div className="filter-options">
            <div className="filter-group">
              <label htmlFor="category">Category</label>
              <select 
                name="category" 
                id="category" 
                value={filters.category} 
                onChange={handleFilterChange}
              >
                <option value="">All Categories</option>
                {productCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label htmlFor="petType">Pet Type</label>
              <select 
                name="petType" 
                id="petType" 
                value={filters.petType} 
                onChange={handleFilterChange}
              >
                <option value="">All Pets</option>
                {petTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div> */}
        
        {loading ? (
          <div className="loading">Loading products...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <>
            {filteredProducts.length > 0 ? (
              <div className="home-products-grid">
                {filteredProducts.slice(0, 6).map(product => (
                  <ProductCard 
                    key={product._id || product.id} 
                    product={{
                      ...product,
                      // Use the correct image path from the server
                      image: product.images && product.images.length > 0 
                        ? (product.images[0].startsWith('http') ? product.images[0] : 
                           product.images[0].startsWith('/') ? product.images[0] : 
                           `http://localhost:5000${product.images[0]}`)
                        : null
                    }} 
                  />
                ))}
              </div>
            ) : (
              <p className="no-results">No products match your search criteria. Try adjusting your filters.</p>
            )}
          </>
        )}
        
        <div className="category-buttons">
          <Link to="/products" className="btn see-all-btn">See All Products</Link>
          {/* <a href="/all-toys" className="btn category-btn">See All Toys</a>
          <a href="/all-medicines" className="btn category-btn">See All Medicines</a> */}
        </div>
      </div>
    </section>
  );
};

export default ProductSection; 