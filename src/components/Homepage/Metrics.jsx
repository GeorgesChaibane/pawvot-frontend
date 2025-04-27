import React from 'react';
import upArrow from '../../assets/images/up.png';
import downArrow from '../../assets/images/down.png';
import badge1 from '../../assets/images/satisfaction.png';
import badge2 from '../../assets/images/certified.png';
import './styles/metrics.css';
import './styles/testimonials.css';

const Metrics = () => {
    return (
        <section className="metrics">
            <div className="box-model">
                <div className="metrics-grid">
                    <div className="metric-card primary">
                        <h4>Happy Pets</h4>
                        <p>1,000+</p>
                        <div className="metric-percentage">
                            <img src={upArrow} alt="Up arrow" />
                            <span>+15% this month</span>
                        </div>
                    </div>
                    <div className="metric-card primary">
                        <h4>Pet Products</h4>
                        <p>500+</p>
                        <div className="metric-percentage">
                            <img src={upArrow} alt="Up arrow" />
                            <span>+25% this month</span>
                        </div>
                    </div>
                    <div className="metric-card primary">
                        <h4>Adoptions</h4>
                        <p>800+</p>
                        <div className="metric-percentage">
                            <img src={upArrow} alt="Up arrow" />
                            <span>+20% this month</span>
                        </div>
                    </div>
                </div>
                <div className="metrics-grid">
                    <div className="metric-card primary">
                        <h4>Pets Rehomed</h4>
                        <p>1,570</p>
                        <div className="metric-percentage">
                        <span>+101%</span>
                        <img src={upArrow} alt="Increase" />
                        </div>
                    </div>
                    <div className="metric-card primary">
                        <h4>New Users</h4>
                        <p>156</p>
                        <div className="metric-percentage">
                        <span>+183%</span>
                        <img src={upArrow} alt="Increase" />
                        </div>
                    </div>
                    <div className="metric-card primary">
                        <h4>Active Users</h4>
                        <p>2,318</p>
                        <div className="metric-percentage">
                        <span>+40%</span>
                        <img src={upArrow} alt="Increase" />
                        </div>
                    </div>
                    <div className="metric-card primary">
                        <h4>Products Sold</h4>
                        <p>7,265</p>
                        <div className="metric-percentage">
                        <span>+110%</span>
                        <img src={upArrow} alt="Increase" />
                        </div>
                    </div>
                    <div className="metric-card secondary">
                        <h4>Page Views</h4>
                        <p>3,671</p>
                        <div className="metric-percentage">
                        <span>-0.03%</span>
                        <img src={downArrow} alt="Decrease" />
                        </div>
                    </div>
                    <div className="metric-card primary">
                        <h4>Hours Spent</h4>
                        <p>869</p>
                        <div className="metric-percentage">
                        <span>+150%</span>
                        <img src={upArrow} alt="Increase" />
                        </div>
                    </div>
                </div>
                <div className="badges-container">
                    <div className="badge">
                        <img src={badge1} alt="Badge 1" />
                        <span>1000+ Pets Rehomed</span>
                    </div>
                    <div className="badge">
                        <img src={badge2} alt="Badge 2" />
                        <span>Vet-Approved Products</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Metrics; 