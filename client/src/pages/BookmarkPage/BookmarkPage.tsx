import { useSelector } from "react-redux";
import "./BookmarkPage.css";
import type { RootState } from "../../store";
import { useNavigate } from "react-router-dom";
import { getSavedPost } from "../../api/postApi";
import { useQuery } from "@tanstack/react-query";
import PostComponent from "../../components/PostComponent/PostComponent";
import type { PostData } from "../../types";
import { toast } from "react-toastify";
import { useEffect, useRef } from "react";
import { getVoteByUser } from "../../api/voteApi";
import { useAppDispatch } from "../../store/hooks";
import { setLoading } from "../../store/uiSlice";

const BookmarkPage = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const hasRun = useRef(false);
  const dispatch = useAppDispatch()

  const fetchSavedPosts = async () => {
    try {
      const response = await getSavedPost();
      return response.data;
    } catch (error: any) {
      const message = error?.response?.data?.message;
      console.log('Lỗi: ', message);
      toast.error('Lỗi: ', message);
      return [];
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
      return [];
    } finally {
      dispatch(setLoading(false)); // Đảm bảo tắt loading khi logout
    }
  }


  const { data: savedPosts } = useQuery({
    queryKey: ['saved-post'],
    queryFn: fetchSavedPosts,
    enabled: !!user
  })

  useEffect(() => {
    if (!user && !hasRun.current) {
      toast.warning('Vui lòng đăng nhập để xem các bài viết đã lưu');
      navigate('/');
      hasRun.current = true;
    }
  }, []);

  const { data: userVotes } = useQuery({
    queryKey: ['vote'],
    queryFn: fetchVote,
    enabled: !!user
  })

  const getVoteType = (postId: number) => {
    if (!userVotes || userVotes.length === 0) return 0;
    const vote = userVotes.find((v: any) => v.postId === postId)
    return vote ? vote.voteType : 0;
  }

  return (
    <div>
      <h5 className="py-2">Bài viết đã lưu</h5>
      {savedPosts?.map((post: PostData) => {
        return (
          <PostComponent
            key={post.id}
            post={post}
            voteType={getVoteType(post.id)}
            isBookmark={true}
            onClick={() => navigate(`/post-details/${post.id}`)} />
        )
      })}
    </div>
  );
};

export default BookmarkPage;
