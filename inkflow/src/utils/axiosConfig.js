import axios from "axios";
import { jwtDecode } from "jwt-decode"; 

export function isTokenExpired(token) {
  if (!token) return true;
  try {
    const decoded = jwtDecode(token); 
    if (!decoded.exp) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
}

const axiosInstance = axios.create({
  baseURL: "https://studiostrategy-api-beta-fgetbtdeepbud0gq.westeurope-01.azurewebsites.net/",
  headers: { "Content-Type": "application/json" },
});

// Interceptor dla żądań - dodaje token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token && !isTokenExpired(token)) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor dla odpowiedzi - wylogowuje jeśli token wygasł
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        window.location.href = "/login"; 
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
