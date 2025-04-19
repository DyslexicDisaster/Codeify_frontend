import axiosClient from "./axiosClient";

const API_URL_USER = 'http://localhost:8080/api/auth';

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
        const response = await axiosClient.post('/api/auth/register', new URLSearchParams({
            username: username,
            password: password,
            email: email
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
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
        const response = await axiosClient.post(
            '/api/auth/login',
            new URLSearchParams({ username, password }),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }}
        );
        console.log("Raw login response:", response.data);

        if (response.data && typeof response.data === 'object') {
            return response.data;
        }
        throw new Error('Unexpected response format');
    } catch (error) {
        console.error('Error logging in user:', error.message);
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

export const forgotPassword = async (email) => {
    console.debug('[userService] forgotPassword → POST /forgot-password', email);
    try {
        const res = await axiosClient.post(
            '/api/auth/forgot-password',
            new URLSearchParams({ email })
        );
        console.debug('[userService] ←', res.status, res.data);
        return res.data;
    } catch (err) {
        console.error('[userService] ERROR', err.response?.status, err.response?.data);
        throw new Error(err.response?.data || err.message);
    }
};

export const resetPassword = async (token, newPassword) => {
    console.debug("[userService] POST /api/auth/reset-password", { token, newPassword });

    const res = await axiosClient.post(
        "/api/auth/reset-password",
        new URLSearchParams({ token, newPassword }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    console.debug("[userService] ←", res.status, res.data);
    return res.data;
};