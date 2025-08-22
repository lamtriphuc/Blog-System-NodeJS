import axiosInstance from "./axios";

export const createTag = async (data: { name: string, description: string }) => {
    const response = await axiosInstance.post(`/tags`, data);
    return response.data;
}

export const getAllTag = async () => {
    const response = await axiosInstance.get(`/tags/all-tag`);
    return response.data;
}

export const getAllTagPanigate = async (page = 1) => {
    const response = await axiosInstance.get(`/tags?page=${page}`);
    return response.data;
}

export const getTagTrending = async () => {
    const response = await axiosInstance.get('/tags/tag-trending');
    return response.data;
}

export const deleteTag = async (id: number) => {
    const response = await axiosInstance.delete(`/tags/${id}`);
    return response.data;
};