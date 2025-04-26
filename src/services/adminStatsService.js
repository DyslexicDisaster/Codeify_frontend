import axiosClient from "./axiosClient";

const API_URL = '/admin';

export const getAdminStatistics = async () => {
    try {
        const response = await axiosClient.get(`${API_URL}/statistics`);
        return response.data;
    } catch (error) {
        console.error('Error fetching admin statistics:', error);
        throw error;
    }
};
