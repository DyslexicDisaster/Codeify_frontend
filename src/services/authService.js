import axios from "axios";

const API_URL = 'http://localhost:8080/api/user';

// Helper to convert an object to URLSearchParams (for form-encoded data)
const toUrlParams = (data) => {
    const params = new URLSearchParams();
    Object.keys(data).forEach((key) => {
        params.append(key, data[key]);
    });
    return params;
};

export const registerUser = async (userData) => {
    try {
        // Convert userData into URLSearchParams
        const params = toUrlParams(userData);
        const response = await axios.post(`${API_URL}/register`, params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Registration Error:', error);
        throw error;
    }
};

export const loginUser = async (credentials) => {
    try {
        const params = toUrlParams(credentials);
        const response = await axios.post(`${API_URL}/login`, params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Login Error:', error);
        throw error;
    }
};

export const logoutUser = async () => {
    try {
        const response = await axios.get(`${API_URL}/logout`);
        return response.data;
    } catch (error) {
        console.error('Logout Error:', error);
        throw error;
    }
};
