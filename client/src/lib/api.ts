import axios from 'axios';

/**
 * Backend Configuration
 * Current Port: 4000 (Based on your server logs)
 */
const API_BASE_URL = 'http://localhost:4000/api'; 

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject JWT from local storage for every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('circle_talk_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Authentication
 */
export const loginGuest = async () => {
  // Matches your backend route: /api/auth/login
  const { data } = await apiClient.post('/auth/login');
  return data.data; // Expected: { userId, nickname, token }
};

/**
 * Room Management
 */
export const getNearbyRooms = async (latitude: number, longitude: number, radius = 5000) => {
  const { data } = await apiClient.get('/rooms/nearby', {
    params: { latitude, longitude, radius }
  });
  return data.data; // Array of rooms
};

export const createRoom = async (name: string, description: string, latitude: number, longitude: number) => {
  const { data } = await apiClient.post('/rooms', {
    name, 
    description, 
    latitude, 
    longitude
  });
  return data.data;
};

export default apiClient;