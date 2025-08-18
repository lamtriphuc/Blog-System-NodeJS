import { useNavigate, useParams } from 'react-router-dom'
import { getPostDetails, getSavedPost, savePost } from '../../api/postApi'
import './PostDetailsPage.css'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import TagComponent from '../../components/TagComponent/TagComponent';
import dayjs from '../../utils/dayjs';
import { createComment, getCommentsByPostId } from '../../api/commentApi';
import { useEffect, useState } from 'react';
import { getVoteByUser, updateVote } from '../../api/voteApi';
import { useAppSelector } from '../../store/hooks';
import { useDispatch } from 'react-redux';
import { setLoading } from '../../store/uiSlice';

const PostDetailsPage = () => {
    const nagigate = useNavigate();
    const { id } = useParams();
    const postId = Number(id);
    const queryClient = useQueryClient();
    const dispatch = useDispatch();
    const [newCmt, setNewCmt] = useState('');
    const user = useAppSelector(state => state.auth.user);
    const [localVoteType, setLocalVoteType] = useState(0);
    const [isBookmark, setIsBookmark] = useState(false);

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

    const fetchVote = async () => {
        try {
            const response = await getVoteByUser();
            return response.data;
        } catch (error: any) {
            const message = error?.response?.data?.message;
            console.log('Lỗi: ', message);
            toast.error('Lỗi: ', message);
        }
    }

    const fetchSavedPosts = async () => {
        try {
            const response = await getSavedPost();
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

    const vote = async ({ postId, voteType }: { postId: number, voteType: number }) => {
        try {
            dispatch(setLoading(true));
            const response = await updateVote({ postId, voteType });
            return response.data;
        } catch (error: any) {
            const message = error?.response?.data?.message;
            console.log('Lỗi: ', message);
            toast.error('Lỗi: ', message);
        } finally {
            dispatch(setLoading(false));
        }
    }
    const savePostByUser = async () => {
        try {
            const response = await savePost(postDetails.id);
            toast.success(response.message)
        } catch (error: any) {
            const message = error?.response?.data?.message;
            console.log('Lỗi: ', message);
            toast.error('Lỗi: ', message);
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

    const { data: savedPosts } = useQuery({
        queryKey: ['saved-post'],
        queryFn: fetchSavedPosts,
        enabled: !!user
    })

    const { data: userVotes } = useQuery({
        queryKey: ['vote'],
        queryFn: fetchVote,
        enabled: !!user
    })

    // Mutation
    const mutation = useMutation({
        mutationFn: sendComment,
        onSuccess: () => {
            toast.success('Bình luận thành công');
            setNewCmt('');
            queryClient.invalidateQueries({ queryKey: ['comments', postId] }); // refetch comment list
            queryClient.invalidateQueries({ queryKey: ['post-details'] });
        },
        onError: (error: any) => {
            console.error('Mutation lỗi:', error.message);
        }
    })

    const mutationUpdateVote = useMutation({
        mutationKey: ['updateVote'],
        mutationFn: vote,
        onSuccess: () => {
            // Refetch posts sau khi vote thành công
            queryClient.invalidateQueries({ queryKey: ['post-details'] });
        }
    })

    const savePostMutation = useMutation({
        mutationKey: ['save-post'],
        mutationFn: savePostByUser,
        onSuccess: () => {
            // Refetch posts sau khi vote thành công
            queryClient.invalidateQueries({ queryKey: ['saved-post'] });
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

    const handleUpdateVote = (newVoteType = 0) => {
        if (!user) {
            toast.warning('Vui lòng đăng nhập');
            return;
        }
        setLocalVoteType(newVoteType);
        mutationUpdateVote.mutate({ postId: postDetails.id, voteType: newVoteType })
    }

    const handleSavePost = () => {
        if (!user) {
            toast.warning("Vui lòng đăng nhập");
            return;
        }
        savePostMutation.mutate();
    }
    console.log(savedPosts)

    useEffect(() => {
        if (userVotes && userVotes.length > 0) {
            const vote = userVotes.find((v: any) => v.postId === postId);
            if (vote) {
                setLocalVoteType(vote.voteType);
            }
        }
    }, [userVotes])

    useEffect(() => {
        if (savedPosts && savedPosts.length > 0) {
            const post = savedPosts.find((p: any) => p?.id === postDetails.id);
            if (post) {
                setIsBookmark(true);
            } else {
                setIsBookmark(false)
            }
        }
    }, [savedPosts, postDetails])


    return (
        <div>
            <div className="post-title">
                <div className='d-flex justify-content-between'>
                    <h4>{postDetails?.title}</h4>
                    {postDetails?.user?.id === user?.id && (
                        <button
                            onClick={() => nagigate(`/update-post/${postDetails.id}`)}
                            className="btn btn-primary"
                            style={{ cursor: 'pointer' }}
                        // data-bs-toggle="modal" data-bs-target="#updatePostModal"
                        ><span>Sửa bài viết  </span><i className="bi bi-pencil-square"></i></button>
                    )}
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
            <div className="post-details d-flex gap-5 mt-4">
                <div className="post-answers">
                    <div className='d-flex gap-3'>
                        <div
                            className='post-details-interact d-flex flex-column align-items-center'
                            style={{ fontSize: 30 }}
                        >
                            <span
                                onClick={() => handleUpdateVote(1)}
                                className='vote-item-details d-flex justify-content-center align-items-center'>
                                {localVoteType === 1 ? (
                                    <i className="bi bi-caret-up-fill" style={{ fontSize: 30 }}></i>
                                ) : (
                                    <i className="bi bi-caret-up" style={{ fontSize: 30 }}></i>
                                )}
                            </span>
                            <span className='fw-bold'>{postDetails?.voteCount}</span>
                            <span
                                onClick={() => handleUpdateVote(-1)}
                                className="vote-item-details d-flex justify-content-center align-items-center">
                                {localVoteType === -1 ? (
                                    <i className="bi bi-caret-down-fill" style={{ fontSize: 30 }}></i>
                                ) : (
                                    <i className="bi bi-caret-down" style={{ fontSize: 30 }}></i>
                                )}
                            </span>
                            <span onClick={handleSavePost} className='mt-3 bookmark-details d-flex justify-content-center align-items-center'>
                                {isBookmark ? (
                                    <i className="bi bi-bookmark-fill text-warning" style={{ fontSize: 24 }}></i>
                                ) : (
                                    <i className="bi bi-bookmark" style={{ fontSize: 24 }}></i>
                                )}
                            </span>
                        </div>
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
                                {postDetails?.tags?.map((tag: any) => {
                                    return <TagComponent key={tag?.id} tagName={tag?.name} isAllowDel={false} onDelete={() => { }} />
                                })}
                            </div>
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