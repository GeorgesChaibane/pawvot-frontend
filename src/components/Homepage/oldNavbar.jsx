// import React, { useState } from 'react';
// import './styles.css';
// import SearchIcon from './SearchIcon';
// import logoImage from '../assets/images/pawvot-logo-removebg-preview.png';

// const Navbar = ({ onSearch }) => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSearch(searchQuery);
//   };

//   const toggleMobileMenu = () => {
//     setIsMobileMenuOpen(!isMobileMenuOpen);
//   };

//   return (
//     <header>
//       <div className="box-model flex">
//         <a href="/" className="logo">
//           <img src={logoImage} alt="Pawvot Logo" />
//         </a>
//         <div className="search-container">
//           <form className="search-form" onSubmit={handleSubmit}>
//             <input
//               type="text"
//               placeholder="Search by breed, product, or city"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//             <button type="submit">
//               <SearchIcon />
//             </button>
//           </form>
//         </div>
//         <nav className={isMobileMenuOpen ? 'active' : ''}>
//           <button className="burger-menu" onClick={toggleMobileMenu} aria-label="Toggle menu">
//             <span></span>
//             <span></span>
//             <span></span>
//             <span></span>
//           </button>
//           <ul>
//             <li><a href="#adopt">Adopt</a></li>
//             <li><a href="#shop">Shop</a></li>
//             <li><a href="#about">About</a></li>
//             <li><a href="#contact">Contact</a></li>
//           </ul>
//         </nav>
//         <div className="auth-buttons">
//           <a href="/signup" className="btn login-signup">Signup</a>
//           <a href="/login" className="btn login-signup">Login</a>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Navbar; 