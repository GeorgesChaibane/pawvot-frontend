import API from './api';

// Pet service for fetching pet data
const PetService = {
  // Get all pets (homepage)
  getAllPets: async () => {
    try {
      const response = await API.get('/pets');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch pets' };
    }
  },

  // Get all pets (all pets page)
  getAllPetsPage: async () => {
    try {
      const response = await API.get('/pets/all');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch all pets' };
    }
  },

  // Get all dogs
  getAllDogs: async () => {
    try {
      const response = await API.get('/pets/dogs');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch dogs' };
    }
  },

  // Get all cats
  getAllCats: async () => {
    try {
      const response = await API.get('/pets/cats');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch cats' };
    }
  },

  // Get pet by ID
  getPetById: async (petId) => {
    try {
      const response = await API.get(`/pets/${petId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch pet details' };
    }
  },

  // Get unique breeds
  getBreeds: async () => {
    try {
      const response = await API.get('/pets/breeds');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch breeds' };
    }
  },

  // Get unique locations
  getLocations: async () => {
    try {
      const response = await API.get('/pets/locations');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch locations' };
    }
  }
};

export default PetService; 