import axiosInstance from "./axios";

export const updateVote = async ({ postId, voteType }: { postId: number, voteType: number }) => {
    const response = await axiosInstance.post('/vote', { postId, voteType });
    return response.data;
}

export const getVoteByUser = async () => {
    const response = await axiosInstance.get('/vote');
    return response.data;
}
