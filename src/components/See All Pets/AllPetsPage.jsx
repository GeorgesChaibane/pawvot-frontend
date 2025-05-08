import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PetService from '../../services/petService';
import axios from 'axios';
import './AllPetsPage.css';

const AllPetsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Query parameters from URL
  const queryParams = new URLSearchParams(location.search);
  const initialSearchQuery = queryParams.get('search') || '';
  const initialType = queryParams.get('type') || '';
  const initialBreed = queryParams.get('breed') || '';
  const initialLocation = queryParams.get('location') || '';
  const initialPage = parseInt(queryParams.get('page')) || 1;
  
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [filters, setFilters] = useState({
    type: initialType,
    breed: initialBreed,
    age: '',
    gender: '',
    location: initialLocation
  });
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [petsPerPage] = useState(9);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    // Fetch pets from API
    const fetchPets = async () => {
      try {
        setLoading(true);
        let data;
        
        if (searchQuery) {
          // Use search endpoint properly
          const response = await axios.get(`http://localhost:5000/api/pets/search?query=${searchQuery}`);
          data = response.data;
        } else {
          data = await PetService.getAllPetsPage();
        }
        
        // Add gender field (not in API but needed for filtering)
        const petsWithGender = data.map(pet => ({
          ...pet,
          gender: Math.random() > 0.5 ? 'Male' : 'Female', // Random gender assignment
          age: typeof pet.age === 'string' ? parseInt(pet.age) || 1 : pet.age, // Ensure age is a number
          // Ensure image has correct path
          image: pet.image ? 
            (pet.image.startsWith('http') ? pet.image : 
             pet.image.startsWith('/') ? `http://localhost:5000${pet.image}` : 
             pet.image) 
            : 'https://via.placeholder.com/300x300?text=Pet+Image'
        }));
        
        console.log('Fetched pets:', petsWithGender);
        setPets(petsWithGender);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching pets:', error);
        setError(error.message || 'Failed to fetch pets');
        setLoading(false);
      }
    };
    
    fetchPets();
  }, [searchQuery]);

  useEffect(() => {
    // Apply filters and calculate pagination
    let filtered = [...pets];

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(pet =>
        pet.name.toLowerCase().includes(query) ||
        pet.breed.toLowerCase().includes(query) ||
        pet.location.toLowerCase().includes(query) ||
        (pet.description && pet.description.toLowerCase().includes(query))
      );
    }

    // Apply filters
    if (filters.type) {
      filtered = filtered.filter(pet => pet.type === filters.type);
    }
    if (filters.breed) {
      filtered = filtered.filter(pet => pet.breed === filters.breed);
    }
    if (filters.age) {
      filtered = filtered.filter(pet => {
        if (filters.age === 'Under 1') return pet.age < 1;
        if (filters.age === '1-3') return pet.age >= 1 && pet.age <= 3;
        if (filters.age === '4-7') return pet.age >= 4 && pet.age <= 7;
        if (filters.age === '8+') return pet.age >= 8;
        return true;
      });
    }
    if (filters.gender) {
      filtered = filtered.filter(pet => pet.gender === filters.gender);
    }
    if (filters.location) {
      filtered = filtered.filter(pet => pet.location.includes(filters.location));
    }
    
    // Calculate total pages
    setTotalPages(Math.ceil(filtered.length / petsPerPage));
    
    // Adjust currentPage if it's out of bounds
    if (currentPage > Math.ceil(filtered.length / petsPerPage) && filtered.length > 0) {
      setCurrentPage(1);
    }
    
    setFilteredPets(filtered);
    
    // Update URL with query parameters
    const newParams = new URLSearchParams();
    if (searchQuery) newParams.set('search', searchQuery);
    if (filters.type) newParams.set('type', filters.type);
    if (filters.breed) newParams.set('breed', filters.breed);
    if (filters.location) newParams.set('location', filters.location);
    if (currentPage > 1) newParams.set('page', currentPage.toString());
    
    const newUrl = `${location.pathname}${newParams.toString() ? `?${newParams.toString()}` : ''}`;
    navigate(newUrl, { replace: true });
    
  }, [filters, searchQuery, pets, currentPage, petsPerPage, navigate, location.pathname]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
    
    // Reset to first page when filter changes
    setCurrentPage(1);
  };

  // const handleSearchSubmit = (e) => {
  //   e.preventDefault();
  //   // Reset to first page when searching
  //   setCurrentPage(1);
  // };

  const clearFilters = () => {
    setFilters({
      type: '',
      breed: '',
      age: '',
      gender: '',
      location: ''
    });
    setSearchQuery('');
    setCurrentPage(1);
  };

  // Extract unique values for filter dropdowns
  const petTypes = [...new Set(pets.map(pet => pet.type))];
  const petBreeds = [...new Set(pets.map(pet => pet.breed))];
  const petLocations = [...new Set(pets.map(pet => {
    const [shop] = pet.location ? pet.location.split(',') : ['Unknown'];
    return shop.trim();
  }))];
  
  // Get current pets for pagination
  const indexOfLastPet = currentPage * petsPerPage;
  const indexOfFirstPet = indexOfLastPet - petsPerPage;
  const currentPets = filteredPets.slice(indexOfFirstPet, indexOfLastPet);
  
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // Next and previous page navigation
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

  if (loading) {
    return <div className="pets-loading">Loading pets...</div>;
  }

  if (error) {
    return <div className="pets-error">Error: {error}</div>;
  }

  return (
    <div className="all-pets-page">
      <div className="pets-header">
        <h1>Find Your Perfect Pet</h1>
        <p>Browse our available pets and find your new companion</p>
      </div>

      <div className="pets-content-container">
        <div className="filter-sidebar">
          <div className="filter-header">
            <h2>Filter Pets</h2>
            <button className="clear-filters-btn" onClick={clearFilters}>Clear All</button>
          </div>

          <div className="filter-section">
            <label htmlFor="type">Pet Type</label>
            <select 
              id="type" 
              name="type" 
              value={filters.type} 
              onChange={handleFilterChange}
            >
              <option value="">All Types</option>
              {petTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="filter-section">
            <label htmlFor="breed">Breed</label>
            <select 
              id="breed" 
              name="breed" 
              value={filters.breed} 
              onChange={handleFilterChange}
            >
              <option value="">All Breeds</option>
              {petBreeds.map(breed => (
                <option key={breed} value={breed}>{breed}</option>
              ))}
            </select>
          </div>

          <div className="filter-section">
            <label htmlFor="age">Age</label>
            <select 
              id="age" 
              name="age" 
              value={filters.age} 
              onChange={handleFilterChange}
            >
              <option value="">All Ages</option>
              <option value="Under 1">Under 1 year</option>
              <option value="1-3">1-3 years</option>
              <option value="4-7">4-7 years</option>
              <option value="8+">8+ years</option>
            </select>
          </div>

          <div className="filter-section">
            <label htmlFor="gender">Gender</label>
            <select 
              id="gender" 
              name="gender" 
              value={filters.gender} 
              onChange={handleFilterChange}
            >
              <option value="">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div className="filter-section">
            <label htmlFor="location">Location</label>
            <select 
              id="location" 
              name="location" 
              value={filters.location} 
              onChange={handleFilterChange}
            >
              <option value="">All Locations</option>
              {petLocations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="pets-grid-container">
          <div className="pets-count">
            <p>Showing {indexOfFirstPet+1}-{Math.min(indexOfLastPet, filteredPets.length)} of {filteredPets.length} pet{filteredPets.length !== 1 ? 's' : ''}</p>
          </div>

          {filteredPets.length === 0 ? (
            <div className="no-results">
              <p>No pets found matching your criteria. Try adjusting your filters.</p>
              <button className="clear-filters-btn" onClick={clearFilters}>Clear Filters</button>
            </div>
          ) : (
            <>
              <div className="pets-grid">
                {currentPets.map(pet => (
                  <div key={pet._id} className="pet-card">
                    <div className="pet-image-all-pets">
                      <img src={pet.image} alt={pet.name} />
                    </div>
                    <div className="pet-info-all-pets">
                      <h3>{pet.name}</h3>
                      <p className="pet-breed">{pet.breed}</p>
                      <p className="pet-age-gender">{pet.age} {pet.age === 1 ? 'year' : 'years'} • {pet.gender}</p>
                      <p className="pet-location">{pet.location}</p>
                      <Link to={`/pets/${pet._id}`} className="view-pet-btn">View Details</Link>
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

export default AllPetsPage; 