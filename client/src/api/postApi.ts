import axiosInstance from "./axios";

export const getAllPost = async (page = 1, searchTerm = '') => {
    const response = await axiosInstance.get(`/posts?page=${page}&search=${encodeURIComponent(searchTerm)}`);
    return response.data;
}

export const getRelatedPost = async (postId: number) => {
    const response = await axiosInstance.get(`/posts/${postId}/related`);
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

export const getPostByTagId = async (id: number, page: number) => {
    const response = await axiosInstance.get(`/tags/${id}?page=${page}`);
    return response.data;
}

export const getPostDetails = async ({ id }: { id: number }) => {
    const response = await axiosInstance.get(`/posts/${id}`);
    return response.data;
}

export const updatePost = async (id: number, formData: FormData) => {
    const response = await axiosInstance.put(`/posts/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
}

export const createPost = async (formData: FormData) => {
    const response = await axiosInstance.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
};

export const savePost = async (postId: number) => {
    const response = await axiosInstance.post(`/saved-posts/${postId}`);
    return response.data;
};

export const deletePost = async (postId: number) => {
    const response = await axiosInstance.delete(`/posts/${postId}`);
    return response.data;
};

