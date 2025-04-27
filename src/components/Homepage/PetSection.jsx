import React, { useState, useEffect } from 'react';
import PetCard from './PetCard';
import './styles/pets.css';

import scoobyImg from '../../assets/images/breed/dog/scooby.jpeg';
import galaxyImg from '../../assets/images/breed/dog/galaxy-destroyer.png';
import cupcakeImg from '../../assets/images/breed/dog/cupcake.png';
import princeImg from '../../assets/images/breed/cat/prince.jpeg';
import grizouImg from '../../assets/images/breed/cat/grizou.png';
import beerusImg from '../../assets/images/breed/cat/beerus.png';

const petsData = [
  {
    id: 1,
    type: 'Dog',
    name: 'Scooby',
    breed: 'Golden Retriever',
    age: '2 years',
    location: 'Baabda',
    image: scoobyImg
  },
  {
    id: 2,
    type: 'Dog',
    name: 'Galaxy Destroyer',
    breed: 'German Shepherd',
    age: '6 years',
    location: 'Ashrafiye',
    image: galaxyImg
  },
  {
    id: 3,
    type: 'Dog',
    name: 'Cupcake',
    breed: 'Husky',
    age: '1 year',
    location: 'Sin El Fil',
    image: cupcakeImg
  },
  {
    id: 4,
    type: 'Cat',
    name: 'Prince',
    breed: 'Persian',
    age: '6 months',
    location: 'Dekwaneh',
    image: princeImg
  },
  {
    id: 5,
    type: 'Cat',
    name: 'Grizou',
    breed: 'British Shorthair',
    age: '4 years',
    location: 'Baabda',
    image: grizouImg
  },
  {
    id: 6,
    type: 'Cat',
    name: 'Beerus',
    breed: 'Sphynx',
    age: '2 years',
    location: 'Dbayeh',
    image: beerusImg
  }
];

const PetSection = ({ searchQuery }) => {
  const [pets, setPets] = useState(petsData);
  const [filters, setFilters] = useState({
    type: '',
    breed: '',
    location: ''
  });

  const petTypes = [...new Set(petsData.map(pet => pet.type))];
  const petBreeds = [...new Set(petsData.map(pet => pet.breed))];
  const locations = [...new Set(petsData.map(pet => pet.location))];

  useEffect(() => {
    let filteredPets = [...petsData];

    if (filters.type) {
      filteredPets = filteredPets.filter(pet => pet.type === filters.type);
    }

    if (filters.breed) {
      filteredPets = filteredPets.filter(pet => pet.breed === filters.breed);
    }

    if (filters.location) {
      filteredPets = filteredPets.filter(pet => pet.location === filters.location);
    }

    if (searchQuery) {
      filteredPets = filteredPets.filter(pet => 
        pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pet.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pet.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pet.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setPets(filteredPets);
  }, [filters, searchQuery]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <section id="adopt">
      <div className="box-model">
        <h2 className="section-title">Pets Looking for a Home</h2>
        
        {/* <div className="filter-container">
          <h3>Filter Pets</h3>
          <div className="filter-options">
            <div className="filter-group">
              <label htmlFor="type">Pet Type</label>
              <select 
                name="type" 
                id="type" 
                value={filters.type} 
                onChange={handleFilterChange}
              >
                <option value="">All Types</option>
                {petTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label htmlFor="breed">Breed</label>
              <select 
                name="breed" 
                id="breed" 
                value={filters.breed} 
                onChange={handleFilterChange}
              >
                <option value="">All Breeds</option>
                {petBreeds.map(breed => (
                  <option key={breed} value={breed}>{breed}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label htmlFor="location">Location</label>
              <select 
                name="location" 
                id="location" 
                value={filters.location} 
                onChange={handleFilterChange}
              >
                <option value="">All Locations</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
          </div>
        </div> */}
        
        {pets.length > 0 ? (
          <div className="home-pets-grid">
            {pets.map(pet => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>
        ) : (
          <p className="no-results">No pets match your search criteria. Try adjusting your filters.</p>
        )}
        
        <a href="/pets" className="btn see-all-btn">See All Pets</a>
      </div>
    </section>
  );
};

export default PetSection; 