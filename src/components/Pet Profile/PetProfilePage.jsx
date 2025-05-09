import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import PetService from '../../services/petService';
import OptimizedImage from '../Common/OptimizedImage';
import './PetProfilePage.css';

const PetProfilePage = () => {
  const { petId } = useParams();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch pet from API
    const fetchPet = async () => {
      try {
        setLoading(true);
        const petData = await PetService.getPetById(petId);
        
        // Process the pet data
        if (petData) {
          // Format pet image path
          const processedPet = {
            ...petData,
            image: petData.image ? 
              (petData.image.startsWith('http') ? petData.image : 
               petData.image.startsWith('/') ? `http://localhost:5000${petData.image}` : 
               petData.image) : 
              'https://via.placeholder.com/300x300?text=No+Image',
            // Create array of images (in real implementation, this would be from petData.images)
            images: [
              petData.image ? 
                (petData.image.startsWith('http') ? petData.image : 
                 petData.image.startsWith('/') ? `http://localhost:5000${petData.image}` : 
                 petData.image) : 
                'https://via.placeholder.com/300x300?text=No+Image'
            ],
            temperament: petData.temperament || 'Friendly, Playful',
            healthStatus: 'Vaccinated, Neutered',
            backstory: petData.description || 'No backstory available',
            size: petData.breed ? (petData.breed.includes('Small') ? 'Small' : 
                                petData.breed.includes('Miniature') ? 'Small' :
                                petData.breed.includes('Large') ? 'Large' : 'Medium') : 'Medium',
            weight: petData.breed ? (petData.breed.includes('Small') ? '5-10 kg' : 
                                  petData.breed.includes('Miniature') ? '3-5 kg' :
                                  petData.breed.includes('Large') ? '25-40 kg' : '10-25 kg') : '10-20 kg',
            color: petData.breed ? (petData.breed.includes('White') ? 'White' :
                                 petData.breed.includes('Black') ? 'Black' :
                                 petData.breed.includes('Golden') ? 'Golden' : 'Mixed') : 'Mixed',
            gender: Math.random() > 0.5 ? 'Male' : 'Female' // Random gender for now
          };
          
          setPet(processedPet);
        } else {
          setPet(null);
          setError('Pet not found');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching pet:', err);
        setError(err.message || 'Failed to fetch pet details');
        setLoading(false);
      }
    };

    if (petId) {
      fetchPet();
    }
  }, [petId]);

  if (loading) {
    return (
      <div className="pet-profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading pet information...</p>
      </div>
    );
  }

  if (error || !pet) {
    return (
      <div className="pet-not-found">
        <h2>Pet Not Found</h2>
        <p>{error || "We couldn't find the pet you're looking for."}</p>
        <Link to="/pets" className="back-to-pets-btn">Browse All Pets</Link>
      </div>
    );
  }

  const handleAdoptClick = () => {
    // Check if user is authenticated by looking for token
    const token = localStorage.getItem('token');
    
    if (!token) {
      // Save the current path to redirect back after login
      localStorage.setItem('returnUrl', `/pets/${petId}/book`);
      navigate('/login');
    } else {
      // User is authenticated, proceed to booking
      navigate(`/pets/${petId}/book`);
    }
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
              <OptimizedImage 
                src={pet.images[selectedImage]} 
                alt={`${pet.name} main view`} 
                width={600}
                height={400}
              />
            </div>
            {pet.images.length > 1 && (
              <div className="pet-thumbnails">
                {pet.images.map((image, index) => (
                  <div 
                    key={index}
                    className={`pet-thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <OptimizedImage 
                      src={image} 
                      alt={`${pet.name} thumbnail ${index + 1}`} 
                      width={80} 
                      height={80}
                    />
                  </div>
                ))}
              </div>
            )}
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

            <div className="pet-adoption-actions">
              <button className="adopt-now-btn" onClick={handleAdoptClick}>Book Adoption Visit</button>
              {/* <button className="favorite-btn">Add to Favorites</button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetProfilePage; 