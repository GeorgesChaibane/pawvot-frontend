import React from 'react';
import OptimizedImage from '../Common/OptimizedImage';
// import './styles.css';
import './styles/pets.css';

const PetCard = ({ pet }) => {
  const { type, name, breed, age, location, image } = pet;
  
  return (
    <article className="home-pet-card">
      <div className="home-pet-image">
        <OptimizedImage 
          src={image} 
          alt={`${name} - ${breed}`} 
          width={300}
          height={200}
        />
      </div>
      <div className="home-pet-info">
        <h3>{type}</h3>
        <div className="home-pet-details">
          <p>Name: {name}</p>
          <p>Breed: {breed}</p>
          <p>Age: {age}</p>
          <p>Location: {location}</p>
        </div>
        <a href={`/pets/${pet._id || pet.id || name.toLowerCase()}`} className="btn home-view-btn">View Profile</a>
      </div>
    </article>
  );
};

export default PetCard; 