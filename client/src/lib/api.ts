import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

export const apiClient = axios.create({
  baseURL: API_URL,
});

// Interceptor to inject JWT from local storage
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('circle_talk_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginGuest = async () => {
  const { data } = await apiClient.post('/auth/login');
  return data.data; // { userId, nickname, token }
};

export const getNearbyRooms = async (latitude: number, longitude: number, radius = 5000) => {
  const { data } = await apiClient.get('/rooms/nearby', {
    params: { latitude, longitude, radius }
  });
  return data.data; // array of rooms
};

export const createRoom = async (name: string, description: string, latitude: number, longitude: number) => {
  const { data } = await apiClient.post('/rooms', {
    name, description, latitude, longitude
  });
  return data.data;
};
