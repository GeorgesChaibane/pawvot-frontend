import React from 'react';
// import './styles.css';
import './styles/testimonials.css';
import testimonial1 from '../assets/images/testimonial1.png';
import testimonial2 from '../assets/images/testimonial2.png';
import testimonial5 from '../assets/images/testimonial5.png';
// import upArrow from '../assets/images/up.png';
// import downArrow from '../assets/images/down.png';

const Testimonials = () => {
  return (
    <section id="testimonials">
      <div className="box-model">
        <h2>Testimonials/Stories</h2>
        <div className="testimonials-grid">
          <article className="testimonial-card">
            <div className="testimonial-image">
              <img src={testimonial1} alt="Sarah and Max" />
            </div>
            <div className="testimonial-content">
              <h3>Pet Parent: Sarah</h3>
              <h4>Max found his forever home with us!</h4>
              <p>Max was a shy pup when I first met him at the shelter, but when I brought him home, he filled
                my life with laughter and love. I can't imagine life without him. Thank you for helping me
                find my perfect match!</p>
            </div>
          </article>
          <article className="testimonial-card">
            <div className="testimonial-image">
              <img src={testimonial5} alt="Mia and Luna" />
            </div>
            <div className="testimonial-content">
              <h3>Pet Parent: Mia</h3>
              <h4>Luna: Our Little Feline Queen</h4>
              <p>Luna was a tiny, timid kitten when we adopted her. Now, she's the queen of our household,
                ruling over her humans with her playful antics. Adopting her was the best decision we ever
                made!</p>
            </div>
          </article>
          <article className="testimonial-card">
            <div className="testimonial-image">
              <img src={testimonial2} alt="Emily & Tom with Bella" />
            </div>
            <div className="testimonial-content">
              <h3>Pet Parent: Emily & Tom</h3>
              <h4>Bella Brought Joy Back Into Our Lives</h4>
              <p>After losing our previous dog, we weren't sure if we were ready to adopt again. But when we
                met Bella, her gentle eyes and wagging tail melted our hearts. We're grateful every day for
                her.</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};

export default Testimonials; 