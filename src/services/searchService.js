import API from './api';

/**
 * Search service for handling advanced searches
 */
const SearchService = {
  /**
   * Search for pets and products using natural language query
   * 
   * @param {string} query - Natural language search query
   * @returns {Promise} - Promise with search results
   */
  search: async (query) => {
    try {
      const response = await API.get(`/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  },
  
  /**
   * Search specifically for products
   * 
   * @param {string} query - Search query
   * @returns {Promise} - Promise with product results
   */
  searchProducts: async (query) => {
    try {
      const response = await API.get(`/search?q=${encodeURIComponent(query)}`);
      return response.data.products || [];
    } catch (error) {
      console.error('Product search error:', error);
      throw error;
    }
  },
  
  /**
   * Search specifically for pets
   * 
   * @param {string} query - Search query
   * @returns {Promise} - Promise with pet results
   */
  searchPets: async (query) => {
    try {
      const response = await API.get(`/search?q=${encodeURIComponent(query)}`);
      return response.data.pets || [];
    } catch (error) {
      console.error('Pet search error:', error);
      throw error;
    }
  }
};

export default SearchService; 