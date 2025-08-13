import "./PostComponent.css";
import type { PostData } from "../../types";
import dayjs from "../../utils/dayjs";
import { toast } from "react-toastify";
import { updateVote } from "../../api/voteApi";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../store/uiSlice";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "../../store/hooks";
import { useState } from "react";
import { savePost } from "../../api/postApi";

type PostDetailsProps = {
  post: PostData;
  isBookmark: boolean;
  onClick: () => void;
  voteType: number;
}

const PostComponent: React.FC<PostDetailsProps> = ({ post, isBookmark = false, onClick, voteType = 0 }) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const user = useAppSelector(state => state.auth.user)
  const [localVoteType, setLocalVoteType] = useState(voteType);

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
      const response = await savePost(post.id);
      toast.success(response.message)
    } catch (error: any) {
      const message = error?.response?.data?.message;
      console.log('Lỗi: ', message);
      toast.error('Lỗi: ', message);
    }
  }

  const mutation = useMutation({
    mutationKey: ['updateVote'],
    mutationFn: vote,
    onSuccess: () => {
      // Refetch posts sau khi vote thành công
      queryClient.invalidateQueries({ queryKey: ['posts'] });
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

  const handleUpdateVote = (newVoteType = 0) => {
    if (!user) {
      toast.warning('Vui lòng đăng nhập');
      return;
    }
    setLocalVoteType(newVoteType);
    mutation.mutate({ postId: post.id, voteType: newVoteType })
  }

  const handleSavePost = () => {
    if (!user) {
      toast.warning("Vui lòng đăng nhập");
      return;
    }
    savePostMutation.mutate();
  }

  return (
    <div className="post-container" >
      <div className="post p-2 my-2">
        <div onClick={onClick}>
          <div className="post-credit pb-2 d-flex align-items-center">
            <span className=" d-inline pe-2">
              {post.user.avatar ? (
                <img className="avatar" src={post?.user?.avatar} alt="" />
              ) : (
                <i className="bi bi-person-circle"></i>
              )}
            </span>
            <span className="name">{post.user.username}</span>
            <span className="px -2">
              <i className="bi bi-dot"></i>
            </span>
            <span className="time">{dayjs(post.createdAt).fromNow()}</span>
          </div>
          <div>
            <h5 className="title my-2">
              {post.title}
            </h5>
          </div>
          <div className="post-content my-2 text-truncate-2">
            {post.content}
          </div>
        </div>
        <div className="post-interact d-flex gap-3">
          <div className="vote d-flex justify-content-between align-items-center">
            <span
              onClick={() => handleUpdateVote(1)}
              className='vote-item d-flex justify-content-center align-items-center'>
              {localVoteType === 1 ? (
                <i className="bi bi-caret-up-fill"></i>
              ) : (
                <i className="bi bi-caret-up"></i>
              )}
            </span>
            <span>{post?.voteCount}</span>
            <span
              onClick={() => handleUpdateVote(-1)}
              className="vote-item d-flex justify-content-center align-items-center">
              {localVoteType === -1 ? (
                <i className="bi bi-caret-down-fill"></i>
              ) : (
                <i className="bi bi-caret-down"></i>
              )}
            </span>
          </div>
          <div
            onClick={onClick}
            className="comment d-flex justify-content-between align-items-center gap-1 px-2">
            <span>
              <i className="bi bi-chat-dots"></i>
            </span>
            <span>{post.commentCount}</span>
          </div>
          <div onClick={handleSavePost} className="bookmark d-flex justify-content-center align-items-center gap-1">
            {!isBookmark ? (
              <span>
                <i className="bi bi-bookmark"></i>
              </span>
            ) : (
              <span>
                <i className="bi bi-bookmark-fill text-warning"></i>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostComponent;
