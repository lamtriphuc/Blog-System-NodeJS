import axiosInstance from "./axios";

export const getAllReports = async (page = 1) => {
    const response = await axiosInstance.get(`/reports?page=${page}`);
    return response.data;
};

export const deleteReport = async (reportId: number) => {
    const response = await axiosInstance.delete(`/reports/${reportId}`);
    return response.data;
};