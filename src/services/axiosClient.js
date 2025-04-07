import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://localhost:8080',
    withCredentials: true, // Ensure cookies are sent with every request
});

//axiosClient.defaults.headers.common['x-api-key'] = 'Zx9ENYpcTfAruhX9U4lfoqZynG8SsV2KiER11rM487qN0qVjrJZaq59ktTuUfqITteMM8v5dVB5hd7qWAme7EQWFZbK4FIuBgMx6Wuh7PqoxUmsIqOR1eS0KsJU3Vqiw';

export default axiosClient;
