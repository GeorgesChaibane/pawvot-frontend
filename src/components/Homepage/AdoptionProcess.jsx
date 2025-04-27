import React from 'react';
import './styles/adoption-process.css';
// import './styles.css';
import searchIcon from '../../assets/images/search-step.png';
import heartIcon from '../../assets/images/heart.png';
import homeIcon from '../../assets/images/home.png';
import arrow1 from '../../assets/images/arrow1.png';
import arrow2 from '../../assets/images/arrow2.png';

const AdoptionProcess = () => {
  return (
    <section id="adoption-process">
      <div className="box-model">
        <h2>Adoption Process Steps</h2>
        <div className="process-container">
          <div className="process-step">
            <div className="step1-header">
              <h3>Step 1: Browse Pets</h3>
              <img src={searchIcon} className="step1-header" alt="Search Icon" />
            </div>
            <p>Explore our range of adorable pets waiting for their homes. Use filters to find your
                perfect match by breed, age, or location.</p>
          </div>
          <div className="process-arrow">
            <img src={arrow1} alt="Arrow" />
          </div>
          <div className="process-step">
            <div className="step2-header">
              <h3>Step 2: Meet &amp; Greet</h3>
              <img src={heartIcon} className="step2-header" alt="Heart Icon" />
            </div>
            <p>Schedule a visit to meet your potential pet. Spend time with them to see if they're the
                right fit. Our team is here to help.</p>
          </div>
          <div className="process-arrow2">
            <img src={arrow2} alt="Arrow" />
          </div>
          <div className="process-step">
            <div className="step3-header">
              <h3>Step 3: Adopt &amp; Celebrate</h3>
              <img src={homeIcon} className="step3-header" alt="Home Icon" />
            </div>
            <p>Complete the adoption process and bring your new furry friend home! Celebrate this moment
                and start creating memories.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdoptionProcess; 