import axios from "axios";
import { API_BASE_URL, ACCESS_TOKEN, GOOGLE_AUTH_URL, GITHUB_AUTH_URL } from "../constants";

// Create axios instance with base configuration
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // For cookie-based auth if needed
    headers: {
        "Content-Type": "application/x-www-form-urlencoded"
    }
});

// Add JWT token to requests automatically
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Helper to convert an object to URLSearchParams
const toFormData = (data) => {
    const params = new URLSearchParams();
    Object.keys(data).forEach((key) => {
        params.append(key, data[key]);
    });
    return params;
};


export const authService = {
    // Traditional login/registration
    registerUser: async (userData) => {
        try {
            const response = await apiClient.post("/api/user/register", toFormData(userData));
            return response.data;
        } catch (error) {
            console.error('Registration Error:', error);
            throw error.response?.data || error.message;
        }
    },

    loginUser: async (credentials) => {
        try {
            const response = await apiClient.post("/api/user/login", toFormData(credentials));

            // Handle JWT token from response (adjust based on your backend)
            if (response.data.token) {
                localStorage.setItem(ACCESS_TOKEN, response.data.token);
            }

            return response.data;
        } catch (error) {
            console.error('Login Error:', error);
            throw error.response?.data || error.message;
        }
    },

    logoutUser: async () => {
        try {
            const response = await apiClient.get("/api/user/logout");
            localStorage.removeItem(ACCESS_TOKEN);
            return response.data;
        } catch (error) {
            console.error('Logout Error:', error);
            throw error.response?.data || error.message;
        }
    },

    // OAuth2 Integration
    initiateOAuthLogin: (provider) => {
        const authUrl = provider === 'google' ? GOOGLE_AUTH_URL : GITHUB_AUTH_URL;
        window.location.href = authUrl;
    },

    handleOAuthCallback: async () => {
        try {
            // Parse token from URL query parameters
            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get('token');

            if (!token) {
                throw new Error('Authentication failed: No token received');
            }

            // Store the token
            localStorage.setItem(ACCESS_TOKEN, token);

            // Clear the token from URL
            window.history.replaceState({}, document.title, window.location.pathname);

            // Optional: Fetch user details
            return await authService.getCurrentUser();
        } catch (error) {
            console.error('OAuth Callback Error:', error);
            throw error;
        }
    },

    // User management
    getCurrentUser: async () => {
        try {
            const response = await apiClient.get("/api/user/me");
            return response.data;
        } catch (error) {
            console.error('Get User Error:', error);
            return null;
        }
    },

    // Utility function to check auth status
    isAuthenticated: () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        return !!token; // Simple check - you might want to verify token expiry
    }
};

export default authService;