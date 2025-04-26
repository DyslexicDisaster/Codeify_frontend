import axiosClient from "./axiosClient";

const API_URL = '/admin';

export const getAllUsers = async () => {
    try {
        const response = await axiosClient.get(`${API_URL}/get_all_users`);
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

export const addUser = async (userData) => {
    try {
        const response = await axiosClient.post(`${API_URL}/add_user`, userData);
        return response.data;
    } catch (error) {
        console.error('Error adding user:', error);
        throw error;
    }
};

export const updateUser = async (userData) => {
    try {
        const response = await axiosClient.put(`${API_URL}/update_user`, userData);
        return response.data;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};

export const deleteUser = async (userId) => {
    try {
        const response = await axiosClient.delete(`${API_URL}/delete_user/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};

export const changeUserRole = async (userId, role) => {
    try {
        const response = await axiosClient.put(`${API_URL}/change_role/${userId}?role=${role}`);
        return response.data;
    } catch (error) {
        console.error('Error changing user role:', error);
        throw error;
    }
};

export const resetPassword = async (userId, password) => {
    try {
        const response = await axiosClient.put(`${API_URL}/reset_password/${userId}?password=${password}`);
        return response.data;
    } catch (error) {
        console.error('Error resetting password:', error);
        throw error;
    }
};

export const getAllQuestions = async () => {
    try {
        const response = await axiosClient.get(`${API_URL}/get_all_questions`);
        return response.data;
    } catch (error) {
        console.error('Error fetching questions:', error);
        throw error;
    }
};

export const getQuestionById = async (questionId) => {
    try {
        const response = await axiosClient.get(`${API_URL}/question/${questionId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching question:', error);
        throw error;
    }
};


export const addQuestion = async (questionData) => {
    try {
        const response = await axiosClient.post(`${API_URL}/add_question`, questionData);
        return response.data;
    } catch (error) {
        console.error('Error adding question:', error);
        throw error;
    }
};

export const updateQuestion = async (questionData) => {
    try {
        const response = await axiosClient.put(`${API_URL}/update_question`, questionData);
        return response.data;
    } catch (error) {
        console.error('Error updating question:', error);
        throw error;
    }
};

export const deleteQuestion = async (questionId) => {
    try {
        const response = await axiosClient.delete(`${API_URL}/delete_question/${questionId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting question:', error);
        throw error;
    }
};

export const getAllProgrammingLanguages = async () => {
    try {
        const response = await axiosClient.get(`${API_URL}/programming_languages`);
        return response.data;
    } catch (error) {
        console.error('Error fetching programming languages:', error);
        throw error;
    }
};