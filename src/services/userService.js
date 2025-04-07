
import axiosClient from "./axiosClient";

const API_URL_USER = 'http://localhost:8080/api/user';

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
        const response = await axiosClient.post('/api/user/register', {
            username,
            password,
            email
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
 * Since the backend now sets the JWT as an HttpOnly cookie,
 * this function does not need to manually store the token.
 *
 * @param {string} username - The user's username.
 * @param {string} password - The user's password.
 * @returns {Promise<object>} The response data from the server.
 */
export const loginUser = async (username, password) => {
    try {
        const response = await axiosClient.post(`${API_URL_USER}/login`, null, {
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
        const response = await axiosClient.get(`${API_URL_USER}/logout`);
        return response.data;
    } catch (error) {
        console.error('Error logging out user:', error);
        throw error;
    }
};
