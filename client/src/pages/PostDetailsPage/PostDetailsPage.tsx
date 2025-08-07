import { useParams } from 'react-router-dom'
import { getPostDetails, updatePost } from '../../api/postApi'
import './PostDetailsPage.css'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import TagComponent from '../../components/TagComponent/TagComponent';
import dayjs from '../../utils/dayjs';
import { createComment, getCommentsByPostId } from '../../api/commentApi';
import { useEffect, useState } from 'react';

const PostDetailsPage = () => {
    const { id } = useParams();
    const postId = Number(id);
    const queryClient = useQueryClient();
    const [newCmt, setNewCmt] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        content: '',
    });

    const fetchPostDetails = async () => {
        try {
            const response = await getPostDetails({ id: postId });
            return response.data;
        } catch (error: any) {
            const message = error?.response?.data?.message;
            console.log('Lỗi: ', message);
            toast.error('Lỗi: ', message);
        }
    }

    const fetchComments = async () => {
        try {
            const response = await getCommentsByPostId({ id: postId });
            return response.data;
        } catch (error: any) {
            const message = error?.response?.data?.message;
            console.log('Lỗi: ', message);
            toast.error('Lỗi: ', message);
        }
    }

    const sendComment = async (data: { postId: number, content: string }) => {
        try {
            const response = await createComment(data);
            //  { data, statusCode, message }
            return response.data;
        } catch (error: any) {
            const message = error?.response?.data?.message || 'Có lỗi xảy ra';
            console.error('Lỗi khi tạo comment:', message);
            toast.error(message);
            throw new Error(message); // phải throw để mutation biết là lỗi
        }
    }

    const updatePostByUser = async ({ id, data }: { id: number, data: any }) => {
        try {
            const response = await updatePost(id, data);
            //  { data, statusCode, message }
            return response.data;
        } catch (error: any) {
            const message = error?.response?.data?.message || 'Có lỗi xảy ra';
            console.error('Lỗi cập nhật bài viết:', message);
            toast.error(message);
            throw new Error(message); // phải throw để mutation biết là lỗi
        }
    }


    // USE QUERY
    const { data: postDetails } = useQuery({
        queryKey: ['post-details'],
        queryFn: fetchPostDetails,
        enabled: !!postId && !isNaN(postId),
    })
    const { data: comments } = useQuery({
        queryKey: ['comments', postId],
        queryFn: fetchComments,
    })

    // Mutation
    const mutation = useMutation({
        mutationFn: sendComment,
        onSuccess: () => {
            toast.success('Bình luận thành công');
            setNewCmt('');
            queryClient.invalidateQueries({ queryKey: ['comments', postId] }); // refetch comment list
        },
        onError: (error: any) => {
            console.error('Mutation lỗi:', error.message);
        }
    })
    const mutationUpdatePost = useMutation({
        mutationFn: updatePostByUser,
        onSuccess: () => {
            toast.success('Cập nhật thành công');
            queryClient.invalidateQueries({ queryKey: ['post-details'] });
        },
        onError: (error: any) => {
            console.error('Mutation lỗi:', error.message);
        }
    })

    // Handle Func
    const handleComment = () => {
        if (!newCmt.trim()) {
            toast.error('Vui lòng nhập nội dung bình luận');
            return;
        }

        mutation.mutate({
            postId,
            content: newCmt,
        });
    }

    const handleUpdatePost = () => {
        console.log(formData)
        mutationUpdatePost.mutate({
            id: postId,
            data: {
                title: formData.title,
                content: formData.content
            }
        })
    }

    // UseEffect
    useEffect(() => {
        if (postDetails) {
            setFormData({
                title: postDetails?.title || '',
                content: postDetails?.content || ''
            })
        }
    }, [postDetails])

    return (
        <div>
            <div className="post-title">
                <div className='d-flex justify-content-between'>
                    <h4>{postDetails?.title}</h4>
                    <button
                        className="btn btn-primary"
                        style={{ cursor: 'pointer' }}
                        data-bs-toggle="modal" data-bs-target="#updatePostModal"
                    ><span>Sửa bài viết  </span><i className="bi bi-pencil-square"></i></button>
                    <div
                        className="modal fade"
                        id="updatePostModal"
                        data-bs-backdrop="static"
                        data-bs-keyboard="false"
                        tabIndex={-1}
                        aria-labelledby="staticBackdropLabel"
                        aria-hidden="true"
                    >
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="staticBackdropLabel">Cập nhật thông tin</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <span>Tiêu đề: </span>
                                    <input type="text" className="form-control update-username" placeholder="Tiêu đề"
                                        value={formData.title}
                                        onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                    />
                                    <span>Nội dung: </span>
                                    <textarea className="form-control update-bio" rows={3}
                                        value={formData.content}
                                        onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
                                    ></textarea>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                                    <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleUpdatePost}>Cập nhật</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='post-info d-flex gap-3 my-3'>
                    <span className="" style={{ height: '30px' }}>
                        {postDetails?.user.avatar ? (
                            <img className="avatar mb-0" src={postDetails?.user.avatar} alt="" />
                        ) : (
                            <i className="bi bi-person-circle"></i>
                        )}
                    </span>
                    <span className="">{postDetails?.user.username}</span>
                    <span>Đăng: {dayjs(postDetails?.createdAt).fromNow()}</span>
                    <span>Chỉnh sửa: {dayjs(postDetails?.updatedAt).fromNow()}</span>
                </div>

            </div>
            <div className="answers d-flex gap-5 mt-4">

                <div className="post-answers">
                    <div className='post-details-content pb-3 mb-4'>
                        <p style={{ whiteSpace: 'pre-line' }}>
                            {postDetails?.content}
                        </p>
                        <div className='post-images'>
                            {postDetails?.images?.map((image: string, index: number) => {
                                return <img key={index} src={image} alt="" />
                            })}
                        </div>
                        <div className='post-tags mt-3 d-flex gap-2'>
                            {postDetails?.tags?.map((tag: string, index: number) => {
                                return <TagComponent key={index} tagName={tag} />
                            })}
                        </div>
                    </div>
                    <h5>{postDetails?.commentCount} Câu trả lời</h5>
                    {comments?.map((cmt: any, index: number) => {
                        return (
                            <div key={index} className='post-answer'>
                                <p>
                                    {cmt.content}
                                </p>
                                <div className='post-info d-flex gap-3 my-3'>
                                    <span className="" style={{ height: '30px' }}>
                                        {cmt.user.avatar ? (
                                            <img className="avatar mb-0" src={cmt.user.avatar} alt="" />
                                        ) : (
                                            <i className="bi bi-person-circle"></i>
                                        )}
                                    </span>
                                    <span className="">{cmt.user.username}</span>
                                    <span>Đăng: {dayjs(cmt.createdAt).fromNow()}</span>
                                    <span>Sửa: {dayjs(cmt.updatedAt).fromNow()}</span>
                                </div>
                            </div>
                        )
                    })}
                    <div className="my-4">
                        <label style={{
                            fontSize: '20px'
                        }} htmlFor="exampleFormControlTextarea1" className="your-answer">Câu trả lời của bạn</label>
                        <textarea
                            className="form-control"
                            id="exampleFormControlTextarea1"
                            rows={5}
                            value={newCmt}
                            onChange={e => setNewCmt(e.target.value)}
                        ></textarea>
                        <button
                            className="btn btn-primary mt-3"
                            onClick={handleComment}
                        >Đăng câu trả lời</button>
                    </div>
                </div>
                <div className="post-related">
                    <h6>Bài viết liên quan</h6>
                    <div>bài post 1</div>
                    <div>bài post 1</div>
                    <div>bài post 1</div>
                    <div>bài post 1</div>
                </div>
            </div>
        </div>
    )
}

export default PostDetailsPage