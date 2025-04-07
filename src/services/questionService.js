import axios from "axios";
import axiosClient from "./axiosClient";

const API_URL_LANG = 'http://localhost:8080/api/programming_language';
const API_URL_QUESTION = 'http://localhost:8080/api/question';

const API_KEY = 'Zx9ENYpcTfAruhX9U4lfoqZynG8SsV2KiER11rM487qN0qVjrJZaq59ktTuUfqITteMM8v5dVB5hd7qWAme7EQWFZbK4FIuBgMx6Wuh7PqoxUmsIqOR1eS0KsJU3Vqiw';
axios.defaults.headers.common['x-api-key'] = API_KEY;

/**
 * Fetches all programming languages.
 * @returns {Promise<any>} The response data from the server.
 */
export const getProgrammingLanguages = async () => {
    try {
        const response = await axiosClient.get(`${API_URL_LANG}/programming_languages`);
        return response.data;
    } catch (error) {
        console.error('Error fetching languages:', error);
        throw error;
    }
};

/**
 * Fetches all questions for a given programming language.
 * @param {number} languageId - The ID of the programming language.
 * @returns {Promise<any>} The response data from the server.
 */
export const getQuestionsByLanguage = async (languageId) => {
    try {
        const response = await axiosClient.get(`${API_URL_QUESTION}/questions`, {
            params: { languageId }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching questions:', error);
        throw error;
    }
};

/**
 * Fetches a question by its ID.
 * @param {number} questionId - The ID of the question.
 * @returns {Promise<any>} The response data from the server.
 */
export const getQuestionById = async (questionId) => {
    try {
        const response = await axiosClient.get(`${API_URL_QUESTION}/question/${questionId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching question:', error);
        throw error;
    }
};