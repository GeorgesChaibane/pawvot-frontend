import React, { useState } from 'react';
// import './styles.css';
import './styles/faq.css';

const Faq = () => {
  const [openItem, setOpenItem] = useState(0);

  const faqItems = [
    {
      question: "How does the adoption process work?",
      answer: "Our adoption process is simple! Browse pets, schedule a meet-and-greet, and complete the adoption paperwork. Our team is here to guide you every step of the way."
    },
    {
      question: "Can I return a product if it doesn't suit my pet?",
      answer: "Yes, we offer returns within 30 days of purchase for unused products. Please see our return policy for details."
    },
    {
      question: "Are all pets on the platform vaccinated?",
      answer: "Yes, all pets available for adoption on Pawvot have received their core vaccinations and have been examined by a veterinarian."
    },
    {
      question: "How do I know if a pet is right for my family?",
      answer: "We recommend meeting the pet in person and spending time together. Our adoption counselors can also help match you with pets whose temperament and needs align with your lifestyle."
    }
  ];

  const toggleFaq = (index) => {
    setOpenItem(openItem === index ? -1 : index);
  };

  return (
    <section id="faq">
      <div className="box-model">
        <h2 className="faq-title">FAQ</h2>
        <div className="faq-container">
          {faqItems.map((item, index) => (
            <div key={index} className={`faq-item ${openItem === index ? 'open' : ''}`}>
              <div className="faq-question" onClick={() => toggleFaq(index)}>
                <h3>{item.question}</h3>
                <span className="faq-toggle">
                  {openItem === index ? '×' : '▶'}
                </span>
              </div>
              <div className="faq-answer">
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq; 