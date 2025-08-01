import axiosInstance from "./axios";

export const getAllTag = async () => {
    const response = await axiosInstance.get('/tags');
    return response.data;
}

export const getTagTrending = async () => {
    const response = await axiosInstance.get('/tags/tag-trending');
    return response.data;
}