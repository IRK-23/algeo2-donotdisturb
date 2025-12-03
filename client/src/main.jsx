import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // Mengasumsikan Anda memiliki file App.jsx di src/
import './index.css'; // Tempat Anda mengimpor CSS Tailwind

// Kode ini mencari elemen dengan id 'root'
ReactDOM.createRoot(document.getElementById('root')).render(
  // StrictMode membantu menemukan potensi masalah dalam kode Anda
  <React.StrictMode>
    {/* Merender komponen utama App.jsx */}
    <App /> 
  </React.StrictMode>,
);