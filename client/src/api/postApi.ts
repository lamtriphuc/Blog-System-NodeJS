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

