import React, { useState } from 'react'
import { useAppDispatch } from '../../store/hooks';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { deletePost, getAllPost } from '../../api/postApi';
import { useNavigate } from 'react-router-dom';
import { setLoading } from '../../store/uiSlice';

const PostAdmin = () => {
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const [selectedPostId, setSelectedPostId] = useState<number>(0);
    const [page, setPage] = useState(1);

    const fetchAllUsers = async ({ queryKey }: any) => {
        const [, page] = queryKey // lấy page từ queryKey
        try {
            const response = await getAllPost(page);
            return response.data;
        } catch (error: any) {
            const message = error?.response?.data?.message;
            console.log('Lỗi: ', message);
            toast.error('Lỗi: ', message);
            return [];
        }
    }

    const delPost = async (postId: number) => {
        try {
            dispatch(setLoading(true));
            const response = await deletePost(postId);
            //  { data, statusCode, message }
            toast.success(response.message);
            queryClient.invalidateQueries({ queryKey: ['all-post'] })
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
        mutationKey: ['delete-post'],
        mutationFn: delPost,
    })

    const { data: postData } = useQuery({
        queryKey: ['all-post', page],
        queryFn: fetchAllUsers,
        placeholderData: keepPreviousData,
    })

    const handleDeletePost = (postId: number = 0) => {
        if (postId === 0) return;
        mutation.mutate(postId);
    }


    return (
        <div style={{ width: '100%' }}>
            <h3 className='mb-5'>Quản lý bài viết</h3>
            <table className="table table-striped table-bordered">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Title</th>
                        <th>Created At</th>
                        <th>Updated At</th>
                        <th>Comments</th>
                        <th>Votes</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {postData?.posts?.map((p: any) => (
                        <tr key={p.id}>
                            <td>{p.id}</td>
                            <td>{p.user.username}</td>
                            <td style={{ cursor: 'pointer' }} onClick={() => navigate(`/post-details/${p.id}`)}>{p.title}</td>
                            <td>{p.createdAt}</td>
                            <td>{p.updatedAt}</td>
                            <td>{p.commentCount}</td>
                            <td>{p.voteCount}</td>
                            <td className="d-flex justify-content-evenly">
                                <button
                                    type="button"
                                    className="btn"
                                    data-bs-toggle="modal"
                                    data-bs-target="#deleteUserModal"
                                    onClick={() => setSelectedPostId(p.id)}
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
                            <p>Bạn có chắc chắn muốn xóa user ID = {selectedPostId}?</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                data-bs-dismiss="modal"
                                onClick={() => handleDeletePost(selectedPostId)}
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

                    {[...Array(postData?.totalPage || 1)].map((_, i) => (
                        <li
                            key={i}
                            className={`page-item ${page === i + 1 ? 'active' : ''}`}
                        >
                            <button className="page-link" onClick={() => setPage(i + 1)}>
                                {i + 1}
                            </button>
                        </li>
                    ))}

                    <li className={`page-item ${page === postData?.totalPage ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => setPage(page + 1)}>
                            &raquo;
                        </button>
                    </li>
                </ul>
            </nav>

        </div>
    )
}

export default PostAdmin