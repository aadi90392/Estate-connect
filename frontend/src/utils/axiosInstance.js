import axios from 'axios';

const isDevelopment = import.meta.env.MODE === 'development';

const axiosInstance = axios.create({
    baseURL: isDevelopment 
        ? 'http://localhost:5000/api' 
        : 'https://estate-connect-u36j.onrender.com/api' 
});

export default axiosInstance;