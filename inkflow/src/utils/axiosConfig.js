// src/utils/axiosConfig.js
import axios from 'axios';

// Tworzymy instancję Axios z bazowym URL
const axiosInstance = axios.create({
  baseURL: 'https://studiostrategy-api-beta-fgetbtdeepbud0gq.westeurope-01.azurewebsites.net/', // Zastąp własnym URL API
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
