import { toast } from "react-toastify";
import { banUser, deleteUser, getAllUsers, unBanUser } from "../../api/authApi";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useAppDispatch } from "../../store/hooks";
import { setLoading } from "../../store/uiSlice";
import { deleteReport, getAllReports } from "../../api/reportApi";
import { useNavigate } from "react-router-dom";

const ReportAmdin = () => {
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const [selectedReportId, setSelectedReportId] = useState<number>(0);
    const [page, setPage] = useState(1);

    const fetchAllReports = async ({ queryKey }: any) => {
        const [, page] = queryKey // lấy page từ queryKey
        try {
            const response = await getAllReports(page);
            return response.data;
        } catch (error: any) {
            const message = error?.response?.data?.message;
            console.log('Lỗi: ', message);
            toast.error('Lỗi: ', message);
            return [];
        }
    }

    const delReport = async (reportId: number) => {
        try {
            dispatch(setLoading(true));
            const response = await deleteReport(reportId);
            //  { data, statusCode, message }
            toast.success(response.message);
            queryClient.invalidateQueries({ queryKey: ['all-report'] })
            return response.data;
        } catch (error: any) {
            const message = error?.response?.data?.message || 'Có lỗi xảy ra';
            console.error('Lỗi khi sửa bài viết:', message);
            toast.error(message);
            throw new Error(message); // phải throw để mutation biết là lỗi
        } finally {
            dispatch(setLoading(false));
        }
    }

    const mutation = useMutation({
        mutationKey: ['delete-report'],
        mutationFn: delReport,
    })


    const { data: reportData } = useQuery<any>({
        queryKey: ['all-report', page],
        queryFn: fetchAllReports,
        placeholderData: keepPreviousData,
    })

    const handleDeleteUser = (reportId: number) => {
        if (reportId === 0) return;
        mutation.mutate(reportId);
    }

    return (
        <div style={{ width: '100%' }}>
            <h3 className='mb-5'>Quản lý người dùng</h3>
            <table className="table table-striped table-bordered">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>UserID</th>
                        <th>Username</th>
                        <th>PostID</th>
                        <th>Reason</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {reportData?.reports?.map((rp: any) => (
                        <tr key={rp.reportId}>
                            <td>{rp.reportId}</td>
                            <td>{rp.userId}</td>
                            <td>{rp.username}</td>
                            <td
                                style={{ cursor: 'pointer' }}
                                onClick={() => navigate(`/post-details/${rp.postId}`)}
                            >{rp.postId}</td>
                            <td>{rp.reason}</td>
                            <td className="d-flex justify-content-evenly">
                                <button
                                    type="button"
                                    className="btn"
                                    data-bs-toggle="modal"
                                    data-bs-target="#deleteReportModal"
                                    onClick={() => setSelectedReportId(rp.reportId)}
                                >
                                    <span><i className="bi bi-trash3-fill" style={{ color: 'red' }}></i></span>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="modal" id="deleteReportModal" tabIndex={-1}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Xóa người dùng</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <p>Bạn có chắc chắn muốn xóa báo cáo ID = {selectedReportId}?</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                data-bs-dismiss="modal"
                                onClick={() => handleDeleteUser(selectedReportId)}
                            >Xóa</button>
                        </div>
                    </div>
                </div>
            </div>
            <nav aria-label="...">
                <ul className="pagination justify-content-center">
                    <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => setPage(page - 1)}>
                            &laquo;
                        </button>
                    </li>

                    {[...Array(reportData?.totalPage || 1)].map((_, i) => (
                        <li
                            key={i}
                            className={`page-item ${page === i + 1 ? 'active' : ''}`}
                        >
                            <button className="page-link" onClick={() => setPage(i + 1)}>
                                {i + 1}
                            </button>
                        </li>
                    ))}

                    <li className={`page-item ${page === reportData?.totalPage ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => setPage(page + 1)}>
                            &raquo;
                        </button>
                    </li>
                </ul>
            </nav>

        </div>
    )
}

export default ReportAmdin