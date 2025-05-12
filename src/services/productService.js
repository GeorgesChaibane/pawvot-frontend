import API from './api';

// Product service for fetching product data
const ProductService = {
  // Get all products
  getAllProducts: async () => {
    try {
      const response = await API.get('/products');
      return response.data || [];
    } catch (error) {
      console.error('Error in getAllProducts:', error);
      if (error.response && error.response.status === 404) {
        return []; // Return empty array on 404
      }
      throw error.response?.data || { message: 'Failed to fetch products' };
    }
  },

  // Get featured products
  getFeaturedProducts: async () => {
    try {
      const response = await API.get('/products/featured');
      return response.data || [];
    } catch (error) {
      console.error('Error in getFeaturedProducts:', error);
      if (error.response && error.response.status === 404) {
        return []; // Return empty array on 404
      }
      throw error.response?.data || { message: 'Failed to fetch featured products' };
    }
  },

  // Get product by ID
  getProductById: async (productId) => {
    try {
      const response = await API.get(`/products/${productId}`);
      return response.data;
    } catch (error) {
      console.error(`Error in getProductById(${productId}):`, error);
      throw error.response?.data || { message: 'Failed to fetch product details' };
    }
  },

  // Get products by category
  getProductsByCategory: async (category) => {
    try {
      const response = await API.get(`/products/category/${category}`);
      return response.data || [];
    } catch (error) {
      console.error(`Error in getProductsByCategory(${category}):`, error);
      if (error.response && error.response.status === 404) {
        return []; // Return empty array on 404
      }
      throw error.response?.data || { message: 'Failed to fetch products in this category' };
    }
  },

  // Get products by pet type
  getProductsByPetType: async (petType) => {
    try {
      const response = await API.get(`/products/pet/${petType}`);
      return response.data || [];
    } catch (error) {
      console.error(`Error in getProductsByPetType(${petType}):`, error);
      if (error.response && error.response.status === 404) {
        return []; // Return empty array on 404
      }
      throw error.response?.data || { message: 'Failed to fetch products for this pet type' };
    }
  },

  // Search products by query
  searchProducts: async (queryParams) => {
    try {
      // Clean up the query parameters
      let queryString;
      
      if (!queryParams || queryParams === '') {
        // Empty search - just return all products with empty search
        queryString = '';
      } else if (typeof queryParams === 'object' && queryParams instanceof URLSearchParams) {
        // It's already a URLSearchParams object
        queryString = queryParams.toString();
      } else if (typeof queryParams === 'string') {
        // If queryParams is a string but doesn't contain '=', assume it's just a search term
        queryString = queryParams.includes('=') ? 
          queryParams : 
          `query=${encodeURIComponent(queryParams)}`;
      } else {
        // Handle unexpected input
        console.warn('Unexpected queryParams type:', typeof queryParams);
        queryString = '';
      }
      
      // Log the request for debugging purposes
      console.log(`Making request to: /products-filter${queryString ? '?' + queryString : ''}`);
      
      // Use the direct endpoint in the main Express app
      const response = await API.get(`/products-filter${queryString ? '?' + queryString : ''}`);
      return response.data || [];
    } catch (error) {
      console.error(`Error in searchProducts(${queryParams}):`, error);
      
      // If we get a 404, try the base getAllProducts as fallback
      if (error.response && error.response.status === 404) {
        console.warn('Got 404 response, trying fallback to getAllProducts');
        try {
          const products = await API.get('/products');
          return products.data || [];
        } catch (fallbackError) {
          console.error('Fallback also failed:', fallbackError);
          return []; // Return empty array as last resort
        }
      }
      
      throw error.response?.data || { message: 'Failed to search products' };
    }
  },

  // Add a product review
  addProductReview: async (productId, reviewData) => {
    try {
      const response = await API.post(`/products/${productId}/reviews`, reviewData);
      return response.data;
    } catch (error) {
      console.error(`Error in addProductReview for product ${productId}:`, error);
      throw error.response?.data || { message: 'Failed to add review' };
    }
  }
};

export default ProductService; 