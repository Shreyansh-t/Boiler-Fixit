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