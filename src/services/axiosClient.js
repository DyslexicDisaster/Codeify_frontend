import axios from 'axios';

//refrances: https://medium.com/@vdsnini/understanding-interceptors-in-axios-intercepting-and-enhancing-http-requests-5cdfb53a6b51
//https://axios-http.com/docs/interceptors

const axiosClient = axios.create({
    baseURL: 'http://localhost:8080',
});

axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            // Attach the token to the Authorization header.
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // Handle errors in the request.
        return Promise.reject(error);
    }
);

export default axiosClient;
