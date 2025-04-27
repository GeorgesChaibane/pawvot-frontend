import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './PetProfilePage.css';

// Import placeholder data (in a real app, this would come from an API)
const DUMMY_PETS = [
  {
    id: 'pet1',
    name: 'Max',
    type: 'Dog',
    breed: 'Golden Retriever',
    age: 2,
    gender: 'Male',
    size: 'Large',
    weight: '30 kg',
    color: 'Golden',
    location: 'Pet Zone, Beirut',
    healthStatus: 'Vaccinated, Neutered',
    temperament: 'Friendly, Playful, Good with kids',
    description: 'Max is a friendly and playful Golden Retriever looking for an active family. He loves to run and play fetch in the park. He\'s great with children and gets along well with other dogs. Max has been trained for basic commands and is house-trained.',
    images: [
      '/path/to/dog1-1.jpg',
      '/path/to/dog1-2.jpg',
      '/path/to/dog1-3.jpg',
    ],
    backstory: 'Max was found wandering near a park in Beirut. He was taken in by our shelter and has been with us for 3 months. He\'s in excellent health and ready to find his forever home.'
  },
  {
    id: 'pet2',
    name: 'Luna',
    type: 'Cat',
    breed: 'Persian',
    age: 1,
    gender: 'Female',
    size: 'Medium',
    weight: '4 kg',
    color: 'White',
    location: 'Pegasus Pets Shop, Jounieh',
    healthStatus: 'Vaccinated, Spayed',
    temperament: 'Calm, Affectionate, Independent',
    description: 'Luna is a sweet Persian cat that loves to cuddle and play with toys. She enjoys lounging in sunny spots and watching birds through the window. Luna is litter-trained and well-behaved.',
    images: [
      '/path/to/cat1-1.jpg',
      '/path/to/cat1-2.jpg',
      '/path/to/cat1-3.jpg',
    ],
    backstory: 'Luna was surrendered by her previous owner who could no longer care for her due to moving abroad. She\'s a healthy and beautiful cat looking for a loving home.'
  }
];

const PetProfilePage = () => {
  const { petId } = useParams();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchPet = () => {
      setLoading(true);
      // Simulate API delay
      setTimeout(() => {
        const foundPet = DUMMY_PETS.find(p => p.id === petId);
        setPet(foundPet || null);
        setLoading(false);
      }, 500);
    };

    fetchPet();
  }, [petId]);

  if (loading) {
    return (
      <div className="pet-profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading pet information...</p>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="pet-not-found">
        <h2>Pet Not Found</h2>
        <p>We couldn't find the pet you're looking for.</p>
        <Link to="/pets" className="back-to-pets-btn">Browse All Pets</Link>
      </div>
    );
  }

  const handleAdoptClick = () => {
    navigate(`/pets/${petId}/book`);
  };

  return (
    <div className="pet-profile-page">
      <div className="pet-profile-header">
        <div className="container">
          <Link to="/pets" className="back-link">&#8592; Back to All Pets</Link>
          <h1>{pet.name}</h1>
          <p className="pet-breed-type">
            {pet.breed} • {pet.type} • {pet.age} year{pet.age !== 1 ? 's' : ''} old
          </p>
          <p className="pet-location">Available at: {pet.location}</p>
        </div>
      </div>

      <div className="pet-profile-content container">
        <div className="pet-profile-grid">
          <div className="pet-images-container">
            <div className="pet-main-image">
              <img 
                src={pet.images[selectedImage]} 
                alt={`${pet.name} main view`} 
              />
            </div>
            <div className="pet-thumbnails">
              {pet.images.map((image, index) => (
                <div 
                  key={index}
                  className={`pet-thumbnail ${selectedImage === index ? 'active' : ''}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={image} alt={`${pet.name} thumbnail ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>

          <div className="pet-details-container">
            <div className="pet-detail-section">
              <h2>About {pet.name}</h2>
              <p className="pet-description">{pet.description}</p>
            </div>

            <div className="pet-detail-section">
              <h3>Details</h3>
              <div className="pet-attributes-grid">
                <div className="pet-attribute">
                  <span className="attribute-label">Age:</span>
                  <span className="attribute-value">{pet.age} year{pet.age !== 1 ? 's' : ''}</span>
                </div>
                <div className="pet-attribute">
                  <span className="attribute-label">Gender:</span>
                  <span className="attribute-value">{pet.gender}</span>
                </div>
                <div className="pet-attribute">
                  <span className="attribute-label">Size:</span>
                  <span className="attribute-value">{pet.size}</span>
                </div>
                <div className="pet-attribute">
                  <span className="attribute-label">Weight:</span>
                  <span className="attribute-value">{pet.weight}</span>
                </div>
                <div className="pet-attribute">
                  <span className="attribute-label">Color:</span>
                  <span className="attribute-value">{pet.color}</span>
                </div>
                <div className="pet-attribute">
                  <span className="attribute-label">Health:</span>
                  <span className="attribute-value">{pet.healthStatus}</span>
                </div>
              </div>
            </div>

            <div className="pet-detail-section">
              <h3>Temperament</h3>
              <div className="pet-temperament">
                {pet.temperament.split(', ').map((trait, index) => (
                  <span key={index} className="temperament-trait">{trait}</span>
                ))}
              </div>
            </div>

            <div className="pet-detail-section">
              <h3>Backstory</h3>
              <p>{pet.backstory}</p>
            </div>

            <div className="pet-adoption-cta">
              <button 
                className="adopt-now-btn"
                onClick={handleAdoptClick}
              >
                Schedule a Meet & Greet
              </button>
              <p className="adoption-info">
                Want to meet {pet.name}? Schedule a time to visit {pet.gender === 'Male' ? 'him' : 'her'} at {pet.location}.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetProfilePage; 