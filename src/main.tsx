/**
 * WHAT IS THIS FILE?
 * 
 * `main.tsx` is the ENGINE IGNITION of your React Application.
 * 
 * 1. It grabs the actual HTML page (look inside `/index.html` for `<div id="root"></div>`).
 * 2. It essentially injects our massive React Application (`<App />`) inside that div.
 * 3. It imports `index.css` so our Tailwind styles are globally available.
 * 
 * Typically, you will almost never need to edit this file unless you are
 * adding super-global wrappers (like Redux Providers or Error Boundaries).
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
// Automatically loads all Tailwind CSS variables
import './index.css';

// Find the HTML element where React should live, and render the app!
ReactDOM.createRoot(document.getElementById('root')!).render(
  // StrictMode runs components twice in development to catch sneaky bugs! 
  // It throws warnings if it sees bad/deprecated React code.
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
