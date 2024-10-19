import axios from "axios";

// frontend/src/config/config.js
const config = {
    apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000'
};
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json'
    }
  });
export default api;