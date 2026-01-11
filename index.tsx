import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Register Service Worker for PWA/A2HS
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Using relative path 'sw.js' ensures the service worker is requested from the same origin as the app
    navigator.serviceWorker.register('sw.js').catch((err) => {
      // In some preview/iframe environments, service workers may be blocked by browser security policies.
      // We log a warning instead of a hard error to prevent application crashes.
      console.warn('ServiceWorker registration skipped or failed: ', err.message);
    });
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);