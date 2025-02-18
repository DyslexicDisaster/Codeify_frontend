import axios from "axios";

const API_URL_LANG = 'http://localhost:8080/api/programming_language';
const API_URL_QUESTION = 'http://localhost:8080/api/question';

export const getProgrammingLanguages = async () => {
    try {
        const response = await axios.get(`${API_URL_LANG}/programming_languages`);
        return response.data;
    } catch (error) {
        console.error('Error fetching languages:', error);
        throw error;
    }
};

export const getQuestionsByLanguage = async (languageId) => {
    try {
        const response = await axios.get(`${API_URL_QUESTION}/questions?languageId=${languageId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching questions:', error);
        throw error;
    }
};

export const getQuestionById = async (questionId) => {
    try {
        const response = await axios.get(`${API_URL_QUESTION}/question/${questionId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching question:', error);
        throw error;
    }
};