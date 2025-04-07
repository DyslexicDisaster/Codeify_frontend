import axios from 'axios';
import Cookies from 'js-cookie';

const axiosClient = axios.create({
    baseURL: 'http://localhost:8080',
    withCredentials: true, // Ensure cookies are sent with every request
});

// Interceptor to add JWT token to every request
axiosClient.interceptors.request.use((config) => {
    const token = Cookies.get('jwtToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Improved Response Interceptor
axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.data && typeof error.response.data === 'object') {
            return Promise.reject(new Error(error.response.data.message || 'Unknown error occurred'));
        } else if (error.response && error.response.status === 403) {
            return Promise.reject(new Error('Forbidden: Access is denied'));
        }
        return Promise.reject(new Error('Network error or server is unavailable'));
    }
);

export default axiosClient;