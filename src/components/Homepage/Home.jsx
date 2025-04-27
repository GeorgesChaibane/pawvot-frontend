import React, { useState } from 'react';
import HeroSection from './HeroSection';
import PetSection from './PetSection';
import ProductSection from './ProductSection';
import AdoptionProcess from './AdoptionProcess';
import Metrics from './Metrics';
import Testimonials from './Testimonials';
import Faq from './Faq';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query) => {
    setSearchQuery(query);
    const adopt = document.getElementById('adopt');
    if (adopt) {
      adopt.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <HeroSection />
      <PetSection searchQuery={searchQuery} />
      <ProductSection searchQuery={searchQuery} />
      <AdoptionProcess />
      <Testimonials />
      <Metrics />
      <Faq />
    </>
  );
};

export default Home; 