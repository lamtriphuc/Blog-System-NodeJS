import { toast } from "react-toastify";
import { deleteUser, getAllUsers } from "../../api/authApi";
import type { PostData } from "../../types";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useAppDispatch } from "../../store/hooks";
import { setLoading } from "../../store/uiSlice";


const UserAmdin = () => {
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();

    const [selectedUserId, setSelectedUserId] = useState<number>(0);
    const [page, setPage] = useState(1);

    const fetchAllUsers = async ({ queryKey }: any) => {
        const [, page] = queryKey // lấy page từ queryKey
        try {
            const response = await getAllUsers(page);
            return response.data;
        } catch (error: any) {
            const message = error?.response?.data?.message;
            console.log('Lỗi: ', message);
            toast.error('Lỗi: ', message);
            return [];
        }
    }

    const delUser = async (userId: number) => {
        try {
            dispatch(setLoading(true));
            const response = await deleteUser(userId);
            //  { data, statusCode, message }
            toast.success(response.message);
            queryClient.invalidateQueries({ queryKey: ['all-user'] })
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
        mutationKey: ['delete-user'],
        mutationFn: delUser,
    })

    const { data: userData } = useQuery<any>({
        queryKey: ['all-user', page],
        queryFn: fetchAllUsers,
        placeholderData: keepPreviousData,
    })

    const handleDeleteUser = (userId: number) => {
        if (selectedUserId === 0) return;
        console.log(userId)
        mutation.mutate(userId);
    }

    return (
        <div style={{ width: '100%' }}>
            <h3 className='mb-5'>Quản lý người dùng</h3>
            <table className="table table-striped table-bordered">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Posts</th>
                        <th>Comments</th>
                        <th>Banned</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {userData?.users?.map((u: any) => (
                        <tr key={u.id}>
                            <td>{u.id}</td>
                            <td>{u.username}</td>
                            <td>{u.email}</td>
                            <td>{u.role}</td>
                            <td>{u.countPost}</td>
                            <td>{u.countComment}</td>
                            <td>
                                {u.isBanned ? (
                                    <span className="badge bg-danger">Banned</span>
                                ) : (
                                    <span className="badge bg-success">Active</span>
                                )}
                            </td>
                            <td className="d-flex justify-content-evenly">
                                <button
                                    type="button"
                                    className="btn"
                                    data-bs-toggle="modal"
                                    data-bs-target="#deleteUserModal"
                                    onClick={() => setSelectedUserId(u.id)}
                                >
                                    <span><i className="bi bi-trash3-fill" style={{ color: 'red' }}></i></span>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="modal" id="deleteUserModal" tabIndex={-1}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Xóa người dùng</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <p>Bạn có chắc chắn muốn xóa user ID = {selectedUserId}?</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                data-bs-dismiss="modal"
                                onClick={() => handleDeleteUser(selectedUserId)}
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

                    {[...Array(userData?.totalPage || 1)].map((_, i) => (
                        <li
                            key={i}
                            className={`page-item ${page === i + 1 ? 'active' : ''}`}
                        >
                            <button className="page-link" onClick={() => setPage(i + 1)}>
                                {i + 1}
                            </button>
                        </li>
                    ))}

                    <li className={`page-item ${page === userData?.totalPage ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => setPage(page + 1)}>
                            &raquo;
                        </button>
                    </li>
                </ul>
            </nav>

        </div>
    )
}

export default UserAmdin