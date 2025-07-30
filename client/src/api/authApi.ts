// src/api/authApi.ts
import axios from './axios'; // axios đã config sẵn baseURL

export const loginUser = async (email: string, password: string) => {
    const response = await axios.post('/auth/login', { email, password });
    return response.data;
};
