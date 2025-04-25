import axios from "axios";
import refreshAccessToken from "./utils/refreshAccessToken";
import { useAuthStore } from "./store/useAuthStore";

const BASE_URL = "https://app.hvacsimulator.com/api";
// const BASE_URL = "https://hvac-simulator.vercel.app/api";
// const BASE_URL = "http://localhost:3000/api";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState(); 
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response, 
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; 

      const { refreshToken } = useAuthStore.getState(); // Get refresh token from Zustand
      console.log("errors is",error.response.message)
      if (refreshToken&&error.response.message==="refresh") {
        const newAccessToken = await refreshAccessToken();

        if (newAccessToken) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest); 
        }
      }

      console.log(" No refresh token or refresh failed. Logging out...");
      useAuthStore.getState().clearTokens(); 
      window.location.href = "/login"; 
    }

    if (error.response?.status === 404) {
      // window.location.href = "/not-found"; // Redirect to /notfound on 404
    }

    return Promise.reject(error);
  }
);

export { apiClient, BASE_URL };
