import axios from 'axios';

const API_URL = 'http://192.168.43.44:3000/api'; // Reemplaza X.X con tu IP local

const api = axios.create({
    baseURL: API_URL,
    timeout: 5000, // Tiempo límite de 5 segundos
});

export default api;
