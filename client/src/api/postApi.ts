import axiosInstance from "./axios";

export const getAllPost = async () => {
    const response = await axiosInstance.get('/posts');
    return response.data;
}