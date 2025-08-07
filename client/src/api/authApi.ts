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

export const updateAvatar = async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file); // avatar = field name backend mong đợi

    const response = await axiosInstance.patch('/users/update-avatar', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data;
};


export const upadateUser = async ({ username, bio }: { username: string, bio: string }) => {
    const response = await axiosInstance.put('/users/me', { username, bio });
    return response.data;
};


