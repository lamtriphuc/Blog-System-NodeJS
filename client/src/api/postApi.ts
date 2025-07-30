import axios from "./axios"

export const getAllPost = async () => {
    const response = await axios.get('/posts');
    return response.data;
}