import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AllPetsPage.css';

// Import placeholder data (in a real app, this would come from an API)
const DUMMY_PETS = [
  {
    id: 'pet1',
    name: 'Max',
    type: 'Dog',
    breed: 'Golden Retriever',
    age: 2,
    gender: 'Male',
    location: 'Pet Zone, Beirut',
    image: '/path/to/dog1.jpg',
    description: 'Friendly and playful Golden Retriever looking for an active family.'
  },
  {
    id: 'pet2',
    name: 'Luna',
    type: 'Cat',
    breed: 'Persian',
    age: 1,
    gender: 'Female',
    location: 'Pegasus Pets Shop, Jounieh',
    image: '/path/to/cat1.jpg',
    description: 'Sweet Persian cat that loves to cuddle and play with toys.'
  },
  {
    id: 'pet3',
    name: 'Rocky',
    type: 'Dog',
    breed: 'German Shepherd',
    age: 3,
    gender: 'Male',
    location: 'Les Moustaches, Tripoli',
    image: '/path/to/dog2.jpg',
    description: 'Loyal and intelligent German Shepherd, good with kids.'
  },
  {
    id: 'pet4',
    name: 'Bella',
    type: 'Cat',
    breed: 'Siamese',
    age: 2,
    gender: 'Female',
    location: 'Pet Zone, Beirut',
    image: '/path/to/cat2.jpg',
    description: 'Vocal and affectionate Siamese cat seeking a loving home.'
  },
  {
    id: 'pet5',
    name: 'Charlie',
    type: 'Dog',
    breed: 'Beagle',
    age: 1,
    gender: 'Male',
    location: 'Pegasus Pets Shop, Jounieh',
    image: '/path/to/dog3.jpg',
    description: 'Curious and friendly Beagle puppy with lots of energy.'
  },
  {
    id: 'pet6',
    name: 'Milo',
    type: 'Other',
    breed: 'Rabbit',
    age: 1,
    gender: 'Male',
    location: 'Les Moustaches, Tripoli',
    image: '/path/to/rabbit.jpg',
    description: 'Adorable and calm rabbit that loves carrots and being petted.'
  }
];

const AllPetsPage = () => {
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [filters, setFilters] = useState({
    type: '',
    breed: '',
    age: '',
    gender: '',
    location: ''
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // In a real app, this would be an API call
    setPets(DUMMY_PETS);
    setFilteredPets(DUMMY_PETS);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, searchQuery, pets]);

  const applyFilters = () => {
    let filtered = [...pets];

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(pet =>
        pet.name.toLowerCase().includes(query) ||
        pet.breed.toLowerCase().includes(query) ||
        pet.location.toLowerCase().includes(query) ||
        pet.description.toLowerCase().includes(query)
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

    setFilteredPets(filtered);
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
      type: '',
      breed: '',
      age: '',
      gender: '',
      location: ''
    });
    setSearchQuery('');
  };

  // Extract unique values for filter dropdowns
  const petTypes = [...new Set(pets.map(pet => pet.type))];
  const petBreeds = [...new Set(pets.map(pet => pet.breed))];
  const petLocations = [...new Set(pets.map(pet => {
    const [shop] = pet.location.split(',');
    return shop.trim();
  }))];

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

          {/* <div className="filter-section">
            <label htmlFor="searchQuery">Search</label>
            <input
              type="text"
              id="searchQuery"
              placeholder="Search pets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div> */}

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
            <p>Showing {filteredPets.length} pet{filteredPets.length !== 1 ? 's' : ''}</p>
          </div>

          {filteredPets.length === 0 ? (
            <div className="no-results">
              <p>No pets found matching your criteria. Try adjusting your filters.</p>
              <button className="clear-filters-btn" onClick={clearFilters}>Clear Filters</button>
            </div>
          ) : (
            <div className="pets-grid">
              {filteredPets.map(pet => (
                <div key={pet.id} className="pet-card">
                  <div className="pet-image">
                    <img src={pet.image} alt={pet.name} />
                  </div>
                  <div className="pet-info">
                    <h3>{pet.name}</h3>
                    <p className="pet-breed">{pet.breed}</p>
                    <p className="pet-details">{pet.age} year{pet.age !== 1 ? 's' : ''} • {pet.gender}</p>
                    <p className="pet-location">{pet.location}</p>
                    <Link to={`/pets/${pet.id}`} className="view-profile-btn">View Profile</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllPetsPage; 