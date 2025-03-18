import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import PetSection from './components/PetSection';
import ProductSection from './components/ProductSection';
import AdoptionProcess from './components/AdoptionProcess';
import Metrics from './components/Metrics';
import Testimonials from './components/Testimonials';
import Faq from './components/Faq';
import Footer from './components/Footer';
import './components/styles/variables.css';

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query) => {
    setSearchQuery(query);
    const adopt = document.getElementById('adopt');
    if (adopt) {
      adopt.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="App">
      <Navbar onSearch={handleSearch} />
      <HeroSection />
      <Metrics />
      <PetSection searchQuery={searchQuery} />
      <ProductSection searchQuery={searchQuery} />
      <AdoptionProcess />
      <Testimonials />
      <Faq />
      <Footer />
    </div>
  );
}

export default App;
