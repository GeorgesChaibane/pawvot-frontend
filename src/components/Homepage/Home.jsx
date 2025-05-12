import React/*, { useState }*/ from 'react';
import HeroSection from './HeroSection';
import PetSection from './PetSection';
import ProductSection from './ProductSection';
import AdoptionProcess from './AdoptionProcess';
import Metrics from './Metrics';
import Testimonials from './Testimonials';
import Faq from './Faq';

const Home = () => {
  return (
    <>
      <HeroSection />
      <PetSection />
      <ProductSection />
      <AdoptionProcess />
      <Testimonials />
      <Metrics />
      <Faq />
    </>
  );
};

export default Home; 