const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Fetch all programming languages
 * @returns {Promise<Array>} Array of programming languages
 */
export const fetchProgrammingLanguages = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/programming_language/programming_languages`);

        if (response.status === 204) {
            return [];
        }

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(errorData || 'Failed to fetch programming languages');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching programming languages:', error);
        throw error;
    }
};

/**
 * Fetch questions for a specific programming language
 * @param {number} languageId - The ID of the programming language
 * @returns {Promise<Array>} Array of questions
 */
export const fetchQuestionsByLanguage = async (languageId) => {
    try {
        if (!languageId) {
            throw new Error('Language ID is required');
        }

        const response = await fetch(`${API_BASE_URL}/question/questions?languageId=${languageId}`);

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(errorData || 'Failed to fetch questions');
        }

        return await response.json();
    } catch (error) {
        console.error(`Error fetching questions for language ID ${languageId}:`, error);
        throw error;
    }
};