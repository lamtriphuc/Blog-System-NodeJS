// src/api/authApi.ts
import axiosInstance from './axios';
import axios from './axios'; // axios đã config sẵn baseURL

export const loginUser = async ({ email, password }: { email: string, password: string }) => {
    const response = await axiosInstance.post('/auth/login', { email, password });
    return response.data;
};

export const getUserProfile = async () => {
    const response = await axiosInstance.get('/auth/profile', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
    });
    return response.data;
};

export const logoutUser = async () => {
    const response = await axiosInstance.post('/auth/logout');
    return response.data;
};
