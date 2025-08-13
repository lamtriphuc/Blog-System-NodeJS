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

const BookmarkPage = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const hasRun = useRef(false);

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

  return (
    <div>
      <h5 className="py-2">Bài viết thú vị dành cho bạn</h5>
      {savedPosts?.map((post: PostData) => {
        return (
          <PostComponent key={post.id} post={post} isBookmark={true} onClick={() => navigate(`/post-details/${post.id}`)} />
        )
      })}
    </div>
  );
};

export default BookmarkPage;
