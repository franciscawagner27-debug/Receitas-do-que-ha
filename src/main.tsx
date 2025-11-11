import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { inject } from '@vercel/analytics';

// Renderiza a app React
createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Regista o service worker (PWA)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then(() => {
        console.log('✅ Service Worker registado com sucesso');
      })
      .catch((error) => {
        console.error('❌ Falha ao registar o Service Worker:', error);
      });
  });
}

// Ativa o Analytics da Vercel
inject();
