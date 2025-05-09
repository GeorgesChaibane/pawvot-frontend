import React, { useState } from 'react';

/**
 * OptimizedImage component that handles image optimization and loading
 * 
 * @param {Object} props Component props
 * @param {string} props.src Original image source URL
 * @param {string} props.alt Alt text for the image
 * @param {number} props.width Desired width of the image
 * @param {number} props.height Desired height of the image
 * @param {string} props.className CSS class name for the image
 * @param {function} props.onClick Click handler for the image
 * @param {Object} props.style Additional inline styles
 */
const OptimizedImage = ({ 
  src, 
  alt, 
  width = 300, 
  height = 300, 
  className = '', 
  onClick, 
  style = {},
  ...rest 
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Placeholder image if src is not provided or loading failed
  const placeholderSrc = `https://via.placeholder.com/${width}x${height}?text=No+Image`;
  
  // Handle image loading
  const handleLoad = () => {
    setLoaded(true);
  };

  // Handle image loading errors
  const handleError = () => {
    setError(true);
  };

  // Determine final src
  const imageSrc = !src || error ? placeholderSrc : src;

  // Check if it's an external image (starts with http)
  const isExternalImage = imageSrc.startsWith('http');

  // For external images from APIs like TheDogAPI, we can add size parameters to the URL
  // This is common for services that support dynamic resizing via URL parameters
  const optimizedSrc = isExternalImage ? 
    // If image contains cdn parameters, add/replace the size parameter
    imageSrc.includes('cdn.thedogapi.com') || imageSrc.includes('cdn.thecatapi.com') ? 
      imageSrc.replace(/size=\w+/, `size=small`) : 
      imageSrc : 
    imageSrc;

  return (
    <img
      src={optimizedSrc}
      alt={alt || 'Image'}
      className={`optimized-image ${className} ${!loaded ? 'loading' : 'loaded'}`}
      style={{ 
        maxWidth: '100%',
        ...style
      }}
      width={width}
      height={height}
      onLoad={handleLoad}
      onError={handleError}
      onClick={onClick}
      {...rest}
    />
  );
};

export default OptimizedImage; 