import { toast } from "react-toastify";
import { banUser, deleteUser, getAllUsers, unBanUser } from "../../api/authApi";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useAppDispatch } from "../../store/hooks";
import { setLoading } from "../../store/uiSlice";

interface ModalInfo {
    title: string,
    message: string,
    buttonString: string
}

const UserAmdin = () => {
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();

    const [selectedUserId, setSelectedUserId] = useState<number>(0);
    const [page, setPage] = useState(1);
    const [isBan, setIsBan] = useState(false);
    const [hours, setHours] = useState(1);

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

    const banUnBanUser = async ({ userId, hours }: { userId: number, hours: number }) => {
        try {
            dispatch(setLoading(true));
            let response: any = {}
            if (isBan) {
                response = await unBanUser(userId);
            } else {
                response = await banUser(userId, hours);
            }
            //  { data, statusCode, message }
            toast.success(response?.message);
            queryClient.invalidateQueries({ queryKey: ['all-user'] })
            return response?.data;
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

    const mutationBanUser = useMutation({
        mutationKey: ['ban-user'],
        mutationFn: banUnBanUser,
    })

    const { data: userData } = useQuery<any>({
        queryKey: ['all-user', page],
        queryFn: fetchAllUsers,
        placeholderData: keepPreviousData,
    })

    const handleDeleteUser = (userId: number) => {
        if (userId === 0) return;
        mutation.mutate(userId);
    }

    const handleBanUser = (userId: number) => {
        if (userId === 0) return;
        mutationBanUser.mutate({ userId, hours });
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
                        <th style={{ width: '50px' }}>Banned</th>
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
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        data-bs-toggle="modal"
                                        data-bs-target="#banUserModal"
                                        onClick={() => {
                                            setSelectedUserId(u.id)
                                            setIsBan(true);
                                        }}
                                    >Banned</button>
                                ) : (
                                    <button
                                        type="button"
                                        className="btn btn-success"
                                        data-bs-toggle="modal"
                                        data-bs-target="#banUserModal"
                                        onClick={() => {
                                            setSelectedUserId(u.id);
                                            setIsBan(false);
                                        }}
                                    >Active</button>
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
            <div className="modal" id="banUserModal" tabIndex={-1}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Ban người dùng</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {!isBan ? (
                                <div>
                                    <label className="form-label">Nhập thời gian ban(giờ)</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={hours}
                                        onChange={(e) => setHours(Number(e.target.value))}
                                        placeholder="1" />
                                </div>
                            ) : (
                                <p>Bạn có chắc chắn muốn gỡ ban user ID = {selectedUserId}?</p>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                data-bs-dismiss="modal"
                                onClick={() => handleBanUser(selectedUserId)}
                            >Ban</button>
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