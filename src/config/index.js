/**
 * Client configuration settings
 */
const config = {
  // API base URL
  API_URL: 'http://localhost:5000',
  
  // Image paths
  getImageUrl: (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/300x300?text=No+Image';
    
    // Handle URLs that already start with http
    if (imagePath.startsWith('http')) return imagePath;
    
    // Handle paths starting with slash
    if (imagePath.startsWith('/')) {
      return `${config.API_URL}${imagePath}`;
    }
    
    // Handle absolute Windows paths (containing C:\ or similar)
    if (imagePath.includes(':\\') || imagePath.includes(':/')) {
      // Extract just the filename from the path
      const filename = imagePath.split('\\').pop().split('/').pop().trim();
      
      // Extract directory from path if available
      let directory = '';
      if (imagePath.includes('food')) directory = 'food/';
      else if (imagePath.includes('toys')) directory = 'toys/';
      else if (imagePath.includes('accessories')) directory = 'accessories/';
      else if (imagePath.includes('grooming')) directory = 'grooming/';
      else if (imagePath.includes('carriers')) directory = 'carriers/';
      else if (imagePath.includes('litter')) directory = 'litter/';
      
      return `${config.API_URL}/images/${directory}${encodeURIComponent(filename)}`;
    }
    
    // Handle spaces in filenames
    return `${config.API_URL}/images/${encodeURIComponent(imagePath)}`;
  }
};

export default config; 