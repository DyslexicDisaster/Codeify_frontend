import axios from "axios";

const API_URL_USER = 'http://localhost:8080/api/user';
const API_KEY = 'Zx9ENYpcTfAruhX9U4lfoqZynG8SsV2KiER11rM487qN0qVjrJZaq59ktTuUfqITteMM8v5dVB5hd7qWAme7EQWFZbK4FIuBgMx6Wuh7PqoxUmsIqOR1eS0KsJU3Vqiw';

// Set the API key header for all requests
axios.defaults.headers.common['x-api-key'] = API_KEY;

/**
 * Registers a new user.
 *
 * @param {string} username - The chosen username.
 * @param {string} password - The chosen password.
 * @param {string} email - The user's email address.
 * @returns {Promise<object>} The response data from the server.
 */
export const registerUser = async (username, password, email) => {
    try {
        // Sending a POST request to /register with username, password, and email as query parameters.
        const response = await axios.post(`${API_URL_USER}/register`, null, {
            params: { username, password, email }
        });
        return response.data;
    } catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
};

/**
 * Logs in a user.
 *
 * @param {string} username - The user's username.
 * @param {string} password - The user's password.
 * @returns {Promise<object>} The response data from the server.
 */
export const loginUser = async (username, password) => {
    try {
        // Sending a POST request to /login with username and password as query parameters.
        const response = await axios.post(`${API_URL_USER}/login`, null, {
            params: { username, password }
        });
        return response.data;
    } catch (error) {
        console.error('Error logging in user:', error);
        throw error;
    }
};

/**
 * Logs out the current user.
 *
 * @returns {Promise<object>} The response data from the server.
 */
export const logoutUser = async () => {
    try {
        // Sending a GET request to /logout
        const response = await axios.get(`${API_URL_USER}/logout`);
        return response.data;
    } catch (error) {
        console.error('Error logging out user:', error);
        throw error;
    }
};
