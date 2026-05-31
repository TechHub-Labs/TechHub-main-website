/**
 * axios.ts
 * 
 * Core component/utility for the TechHub application.
 */

import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * INTERCEPTORS
 * They intercept a request before it leaves the browser!
 * This is where we usually attach an Authorization Token if the user is authenticated.
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
