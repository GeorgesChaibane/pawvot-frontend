import React from 'react';
// import './styles.css';
import './styles/pets.css';

const PetCard = ({ pet }) => {
  const { type, name, breed, age, location, image } = pet;
  
  return (
    <article className="pet-card">
      <div className="pet-image">
        <img src={image} alt={`${name} - ${breed}`} />
      </div>
      <div className="pet-info">
        <h3>{type}</h3>
        <div className="pet-details">
          <p>Name: {name}</p>
          <p>Breed: {breed}</p>
          <p>Age: {age}</p>
          <p>Location: {location}</p>
        </div>
        <a href={`/pets/${name.toLowerCase()}`} className="btn view-btn">View Profile</a>
      </div>
    </article>
  );
};

export default PetCard; 