import axios from "axios";

const API_URL_LANG = 'http://localhost:8080/api/programming_language';
const API_URL_QUESTION = 'http://localhost:8080/api/question';

const API_KEY = 'Zx9ENYpcTfAruhX9U4lfoqZynG8SsV2KiER11rM487qN0qVjrJZaq59ktTuUfqITteMM8v5dVB5hd7qWAme7EQWFZbK4FIuBgMx6Wuh7PqoxUmsIqOR1eS0KsJU3Vqiw';
axios.defaults.headers.common['x-api-key'] = API_KEY;
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
        const response = await axios.get(`${API_URL_QUESTION}/questions`, {
            params: { languageId }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching questions:', error);
        throw error;
    }
};

export const getQuestionById = async (questionId) => {
    try {
        const response = await axios.get(`${API_URL_QUESTION}/question/${questionId}`); // Correct path
        return response.data;
    } catch (error) {
        console.error('Error fetching question:', error);
        throw error;
    }
};