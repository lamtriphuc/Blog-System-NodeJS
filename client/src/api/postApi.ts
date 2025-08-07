import axios from "axios";
import axiosInstance from "./axios";

export const getAllPost = async () => {
    const response = await axiosInstance.get('/posts');
    return response.data;
}

export const getSavedPost = async () => {
    const response = await axiosInstance.get('/saved-posts');
    return response.data;
}

export const getPostByUser = async () => {
    const response = await axiosInstance.get('/posts/user');
    return response.data;
}

export const getPostDetails = async ({ id }: { id: number }) => {
    const response = await axiosInstance.get(`/posts/${id}`);
    return response.data;
}

export const updatePost = async (id: number, data: { title: string; content: string }) => {
    const response = await axiosInstance.patch(`/posts/${id}`, data);
    return response.data;
}