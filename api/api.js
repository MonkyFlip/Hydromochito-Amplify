import axios from 'axios';
import { API_BASE_URL } from '../utils/constants.js'; // ✅ Se obtiene desde `constants.js`

const api = axios.create({
    baseURL: API_BASE_URL, // ✅ Se obtiene desde `constants.js`
    timeout: 5000,
});

export default api;
