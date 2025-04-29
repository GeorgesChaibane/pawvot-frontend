import React from 'react';
import './styles/adoption-process.css';
// import './styles.css';
import searchIcon from '../../assets/images/search-step.png';
import heartIcon from '../../assets/images/heart.png';
import homeIcon from '../../assets/images/home.png';
// import arrow1 from '../../assets/images/arrow1.png';
// import arrow2 from '../../assets/images/arrow2.png';

const AdoptionProcess = () => {
  return (
    <section id="adoption-process">
      <div className="box-model">
        <h2>Adoption Process Steps</h2>
        <div className="process-container">
          <article className="process-step">
            <img src={searchIcon} className="step-icon" alt="Search Icon" />
            <h3>Step 1: Browse Pets</h3>
            <p>Explore our range of adorable pets waiting for their homes. Use filters to find your
                perfect match by breed, age, or location.</p>
          </article>
          
          {/* <img src={arrow1} className="process-arrow" alt="Arrow" /> */}
          
          <article className="process-step">
            <img src={heartIcon} className="step-icon" alt="Heart Icon" />
            <h3>Step 2: Meet &amp; Greet</h3>
            <p>Schedule a visit to meet your potential pet. Spend time with them to see if they're the
                right fit. Our team is here to help.</p>
          </article>
          
          {/* <img src={arrow2} className="process-arrow process-arrow2" alt="Arrow" /> */}
          
          <article className="process-step">
            <img src={homeIcon} className="step-icon" alt="Home Icon" />
            <h3>Step 3: Adopt &amp; Celebrate</h3>
            <p>Complete the adoption process and bring your new furry friend home! Celebrate this moment
                and start creating memories.</p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default AdoptionProcess; 