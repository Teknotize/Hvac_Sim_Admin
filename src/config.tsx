import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

async function sendRequest(
    endpoint: string, 
    method: string = 'GET', 
    data: any = null
) {
    try {
        const headers: Record<string, string> = {};

        const accessToken = localStorage.getItem('accessToken');

        if (accessToken) {
            headers['Authorization'] = `Bearer ${accessToken}`;
        }

        const response = await axios({
            url: `${BASE_URL}/${endpoint}`, 
            method,
            data,
            headers,
                });

        return response.data; 
    } catch (error: any) {
        console.error(`Request failed: ${error.message}`);

        return {
            success: false,
            error: error.response?.data || error.message,
        };
    }
}

export { BASE_URL, sendRequest };