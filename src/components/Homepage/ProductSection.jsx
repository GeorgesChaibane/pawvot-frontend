import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
// import './styles.css';
import './styles/products.css';

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

const productsData = [
  {
    id: 1,
    name: 'CESAR Adult Soft Wet Dog Food Steak Lovers Variety Pack with Red Meat, (36) 3.5 oz. Trays',
    category: 'Food',
    petType: 'Dog',
    image: dogFood1
  },
  {
    id: 2,
    name: 'Rachael Ray Nutrish Natural Premium Wet Dog Food, Savory Favorites Variety Pack, 8 Ounce Tub (Pack of 6)',
    category: 'Food',
    petType: 'Dog',
    image: dogFood2
  },
  {
    id: 3,
    name: 'Squeaky Chew Stick Bundle, X-Large, 2-Pack',
    category: 'Toy',
    petType: 'Dog',
    image: dogToy1
  },
  {
    id: 4,
    name: 'Interactive Dog Ball Toy with LED Lights - Rechargeable Waterproof Auto Rotate Toy for Cats & Dogs',
    category: 'Toy',
    petType: 'Both',
    image: dogCatToy
  },
  {
    id: 5,
    name: 'Petarmor Antihistamine',
    category: 'Medicine',
    petType: 'Dog',
    image: dogMedicine1
  },
  {
    id: 6,
    name: 'Petarmor 7 Way De-Wormer For Dogs',
    category: 'Medicine',
    petType: 'Dog',
    image: dogMedicine2
  },
  {
    id: 7,
    name: 'Purina Fancy Feast Wet Cat Food Variety Pack, Medleys White Meat Chicken in Sauce Collection - (Pack of 12) 3 oz. Cans',
    category: 'Food',
    petType: 'Cat',
    image: catFood1
  },
  {
    id: 8,
    name: 'Purina Fancy Feast Grilled Wet Cat Food Chicken Feast in Wet Cat Food Gravy - (Pack of 12) 3 oz. Cans',
    category: 'Food',
    petType: 'Cat',
    image: catFood2
  },
  {
    id: 9,
    name: 'Interactive Cat Toys Ball for Indoor Cats Fast Rolling on Carpet, Chirping & Motion Activate Cat Toys (Blue)',
    category: 'Toy',
    petType: 'Cat',
    image: catToy1
  },
  {
    id: 10,
    name: 'Interactive Cat Toys Ball Fast Rolling In Pouch, Motion Activate Chirping Cat Toy Hide and Seek Mouse Catching Game (Blue)',
    category: 'Toy',
    petType: 'Cat',
    image: catToy2
  },
  {
    id: 11,
    name: 'Cat Heart Supplements - Immune',
    category: 'Medicine',
    petType: 'Cat',
    image: catMedicine1
  },
  {
    id: 12,
    name: 'PET SUPPLEMENTS Stomach Relief',
    category: 'Medicine',
    petType: 'Cat',
    image: catMedicine2
  }
];

const ProductSection = ({ searchQuery }) => {
  const [products, setProducts] = useState(productsData);
  const [filters, setFilters] = useState({
    category: '',
    petType: ''
  });

  const productCategories = [...new Set(productsData.map(product => product.category))];
  const petTypes = [...new Set(productsData.map(product => product.petType))];

  useEffect(() => {
    let filteredProducts = [...productsData];

    if (filters.category) {
      filteredProducts = filteredProducts.filter(product => product.category === filters.category);
    }

    if (filters.petType) {
      filteredProducts = filteredProducts.filter(product => 
        product.petType === filters.petType || product.petType === 'Both'
      );
    }

    if (searchQuery) {
      filteredProducts = filteredProducts.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.petType.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setProducts(filteredProducts);
  }, [filters, searchQuery]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

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
        
        {products.length > 0 ? (
          <div className="home-products-grid">
            {products.map(product => (
              <ProductCard 
                key={product.id} 
                product={{
                  ...product,
                  productId: product.id
                }} 
              />
            ))}
          </div>
        ) : (
          <p className="no-results">No products match your search criteria. Try adjusting your filters.</p>
        )}
        
        <div className="category-buttons">
          <a href="/products" className="btn see-all-btn">See All Products</a>
          {/* <a href="/all-toys" className="btn category-btn">See All Toys</a>
          <a href="/all-medicines" className="btn category-btn">See All Medicines</a> */}
        </div>
      </div>
    </section>
  );
};

export default ProductSection; 