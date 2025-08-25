import axiosInstance from "./axios";

export const getStats = async () => {
    const response = await axiosInstance.get(`/dashboard/stats`);
    return response.data;
}

export const getNotif = async () => {
    const response = await axiosInstance.get(`/notification`);
    return response.data;
}

export const getUnread = async () => {
    const response = await axiosInstance.get(`/notification/unread`);
    return response.data;
}

export const markedRead = async (id: number) => {
    const response = await axiosInstance.patch(`/notification/${id}/read`);
    return response.data;
}