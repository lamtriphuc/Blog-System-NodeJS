import { useSelector } from "react-redux";
import "./BookmarkPage.css";
import type { RootState } from "../../store";
import { useNavigate } from "react-router-dom";
import { getSavedPost } from "../../api/postApi";
import { useQuery } from "@tanstack/react-query";
import PostComponent from "../../components/PostComponent/PostComponent";
import type { PostData } from "../../types";

const fetchSavedPosts = async () => {
  const { data } = await getSavedPost();
  return data;
}

const BookmarkPage = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  const { data: savedPosts } = useQuery({
    queryKey: ['saved-post'],
    queryFn: fetchSavedPosts
  })

  console.log(savedPosts)

  if (!user) {
    navigate('/login');
  }
  return (
    <div>
      <h5 className="py-2">Bài viết thú vị dành cho bạn</h5>
      {savedPosts?.map((post: PostData) => {
        return (
          <PostComponent key={post.id} post={post} isBookmark={true} />
        )
      })}
    </div>
  );
};

export default BookmarkPage;
