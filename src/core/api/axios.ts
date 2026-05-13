/**
 * WHAT IS THIS FILE?
 * 
 * This is the Axios API Client. Think of it as our dedicated messenger that talks to the Backend.
 * 
 * WHY IS THIS BETTER THAN `fetch()`?
 * 1. It automatically turns our objects into JSON.
 * 2. We can configure it ONCE here, and use it everywhere.
 * 3. It intercepts requests: If the user logs in, we can write code here 
 *    that automatically attaches their secret Token to every single request they make!
 */

import axios from 'axios';

// Create a globally configured Axios instance
export const apiClient = axios.create({
  // Vite looks for variables starting with VITE_ in your .env file
  // If it's missing, we fallback to our Node.js backend port 5000!
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  headers: {
    // Tell the backend we are speaking JSON language
    'Content-Type': 'application/json',
  },
});

/**
 * INTERCEPTORS
 * They intercept a request before it leaves the browser!
 * This is where we usually attach an Authorization Token if the user is authenticated.
 */
apiClient.interceptors.request.use((config) => {
  // Try to grab a token from Local Storage
  const token = localStorage.getItem('token');
  
  // If a token exists, stick it onto the Authorization Header like a stamp
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});
