import axios from 'axios';
import Cookies from 'js-cookie';
import {API_BASE_URL} from "../constants";

const axiosClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true
});

axiosClient.interceptors.request.use((config) => {
    const token = Cookies.get('jwtToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

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