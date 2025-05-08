import API from './api';

// Product service for fetching product data
const ProductService = {
  // Get all products
  getAllProducts: async () => {
    try {
      const response = await API.get('/products');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch products' };
    }
  },

  // Get featured products
  getFeaturedProducts: async () => {
    try {
      const response = await API.get('/products/featured');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch featured products' };
    }
  },

  // Get product by ID
  getProductById: async (productId) => {
    try {
      const response = await API.get(`/products/${productId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch product details' };
    }
  },

  // Get products by category
  getProductsByCategory: async (category) => {
    try {
      const response = await API.get(`/products/category/${category}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch products in this category' };
    }
  },

  // Get products by pet type
  getProductsByPetType: async (petType) => {
    try {
      const response = await API.get(`/products/pet/${petType}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch products for this pet type' };
    }
  },

  // Add a product review
  addProductReview: async (productId, reviewData) => {
    try {
      const response = await API.post(`/products/${productId}/reviews`, reviewData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to add review' };
    }
  }
};

export default ProductService; 