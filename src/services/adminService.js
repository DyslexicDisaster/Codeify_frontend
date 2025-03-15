import axios from "axios";

const API_URL = 'http://localhost:8080/admin';
const API_KEY = 'Zx9ENYpcTfAruhX9U4lfoqZynG8SsV2KiER11rM487qN0qVjrJZaq59ktTuUfqITteMM8v5dVB5hd7qWAme7EQWFZbK4FIuBgMx6Wuh7PqoxUmsIqOR1eS0KsJU3Vqiw';


axios.defaults.headers.common['x-api-key'] = API_KEY;

// User management functions
export const getAllUsers = async () => {
    try {
        const response = await axios.get(`${API_URL}/get_all_users`);
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

export const addUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/add_user`, userData);
        return response.data;
    } catch (error) {
        console.error('Error adding user:', error);
        throw error;
    }
};

export const updateUser = async (userData) => {
    try {
        const response = await axios.put(`${API_URL}/update_user`, userData);
        return response.data;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};

export const deleteUser = async (userId) => {
    try {
        const response = await axios.delete(`${API_URL}/delete_user/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};

export const changeUserRole = async (userId, role) => {
    try {
        const response = await axios.put(`${API_URL}/change_role/${userId}?role=${role}`);
        return response.data;
    } catch (error) {
        console.error('Error changing user role:', error);
        throw error;
    }
};

export const resetPassword = async (userId, password) => {
    try {
        const response = await axios.put(`${API_URL}/reset_password/${userId}?password=${password}`);
        return response.data;
    } catch (error) {
        console.error('Error resetting password:', error);
        throw error;
    }
};

export const getAllQuestions = async () => {
    try {
        const response = await axios.get(`${API_URL}/get_all_questions`);
        return response.data;
    } catch (error) {
        console.error('Error fetching questions:', error);
        throw error;
    }
};

export const getQuestionById = async (questionId) => {
    try {
        const response = await axios.get(`${API_URL}/question/${questionId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching question:', error);
        throw error;
    }
};

export const getQuestionsByLanguage = async (languageId) => {
    try {
        const response = await axios.get(`${API_URL}/questions/language/${languageId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching questions by language:', error);
        throw error;
    }
};

export const addQuestion = async (questionData) => {
    try {
        const response = await axios.post(`${API_URL}/add_question`, questionData);
        return response.data;
    } catch (error) {
        console.error('Error adding question:', error);
        throw error;
    }
};

export const updateQuestion = async (questionData) => {
    try {
        const response = await axios.put(`${API_URL}/update_question`, questionData);
        return response.data;
    } catch (error) {
        console.error('Error updating question:', error);
        throw error;
    }
};

export const deleteQuestion = async (questionId) => {
    try {
        const response = await axios.delete(`${API_URL}/delete_question/${questionId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting question:', error);
        throw error;
    }
};

export const getAllProgrammingLanguages = async () => {
    try {
        const response = await axios.get(`${API_URL}/programming_languages`);
        return response.data;
    } catch (error) {
        console.error('Error fetching programming languages:', error);
        throw error;
    }
};

export const getProgrammingLanguageById = async (languageId) => {
    try {
        const response = await axios.get(`${API_URL}/programming_language/${languageId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching programming language:', error);
        throw error;
    }
};

export const addProgrammingLanguage = async (languageData) => {
    try {
        const response = await axios.post(`${API_URL}/add_programming_language`, languageData);
        return response.data;
    } catch (error) {
        console.error('Error adding programming language:', error);
        throw error;
    }
};

export const updateProgrammingLanguage = async (languageData) => {
    try {
        const response = await axios.put(`${API_URL}/update_programming_language`, languageData);
        return response.data;
    } catch (error) {
        console.error('Error updating programming language:', error);
        throw error;
    }
};

export const deleteProgrammingLanguage = async (languageId) => {
    try {
        const response = await axios.delete(`${API_URL}/delete_programming_language/${languageId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting programming language:', error);
        throw error;
    }
};