import axiosClient from "./axiosClient";

const API_URL_LANG = 'http://localhost:8080/api/programming_language';
const API_URL_QUESTION = 'http://localhost:8080/api/question';

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

/**
 * Submits an answer for grading.
 * @param {number} questionId - The ID of the question.
 * @param {string} answer - The user's answer.
 * @returns {Promise<any>} The response data from the server, including grade and feedback.
 */
export const submitAnswer = async (questionId, answer) => {
    try {
        const response = await axiosClient.post(`${API_URL_QUESTION}/grade`, {
            questionId,
            answer
        });
        return response.data;
    } catch (error) {
        console.error('Error submitting answer:', error);
        throw error;
    }
};

/**
 * Fetches the user's progress for a specific programming language.
 * @param {number} languageId - The ID of the programming language.
 * @returns {Promise<any>} The response data from the server with progress information.
 */
export const getUserProgress = async (languageId) => {
    try {
        const timestamp = new Date().getTime();
        const response = await axiosClient.get(`${API_URL_QUESTION}/progress`, {
            params: {
                languageId,
                _t: timestamp
            }
        });

        if (!response.data) {
            return {
                progressPercentage: 0,
                completedQuestions: 0,
                totalQuestions: 0,
                progressDetails: []
            };
        }

        return response.data;
    } catch (error) {
        console.error('Error fetching user progress:', error);
        return {
            progressPercentage: 0,
            completedQuestions: 0,
            totalQuestions: 0,
            progressDetails: []
        };
    }
};

/**
 * Fetches the user's last attempt for a question.
 * @param {number} questionId - The ID of the question.
 * @returns {Promise<string|null>} The user's last code attempt or null if none exists.
 */
export const getLastAttempt = async (questionId) => {
    try {
        const response = await axiosClient.get(`${API_URL_QUESTION}/last-attempt/${questionId}`);
        return response.data.code;
    } catch (error) {
        console.error('Error fetching last attempt:', error);
        return null;
    }
};