import axiosInstance from "./axios";

export const getCommentsByPostId = async ({ id }: { id: number }) => {
    const response = await axiosInstance.get(`/comments/post/${id}`);
    return response.data;
}

export const createComment = async (data: any) => {
    const response = await axiosInstance.post('/comments', data);
    return response.data;
}