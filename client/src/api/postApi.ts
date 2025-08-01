import axiosInstance from "./axios";

export const getAllPost = async () => {
    const response = await axiosInstance.get('/posts');
    return response.data;
}

export const getSavedPost = async () => {
    const response = await axiosInstance.get('/saved-posts');
    return response.data;
}