import axios from 'axios';

const API_URL = 'http://localhost:8001';

export const getServices = async () => {
  try {
    const response = await axios.get(`${API_URL}/services`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch services');
  }
};

export const createServiceRequest = async (cartItems, address, pricing) => {
  try {
    const token = localStorage.getItem('token');
    console.log('Token:', token ? 'Present' : 'Missing');
    console.log('API URL:', `${API_URL}/service-requests`);
    console.log('Request data:', { cartItems, address, pricing });
    
    const response = await axios.post(`${API_URL}/service-requests`, {
      cartItems,
      address,
      pricing
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('API Error Details:');
    console.error('Status:', error.response?.status);
    console.error('Status Text:', error.response?.statusText);
    console.error('Response Data:', error.response?.data);
    console.error('Request Config:', error.config);
    throw new Error(error.response?.data?.message || 'Failed to create service request');
  }
};

export const getUserAddresses = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/user/addresses`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data.addresses;
  } catch (error) {
    throw new Error('Failed to fetch user addresses');
  }
};

export const saveUserAddress = async (addressData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/user/addresses`, addressData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to save address');
  }
}; 