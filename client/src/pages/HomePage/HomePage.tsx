import PostComponent from "../../components/PostComponent/PostComponent";
import { getAllPost, getSavedPost, savePost } from "../../api/postApi";
import { useQuery } from "@tanstack/react-query";
import type { PostData } from "../../types";
import { useDispatch } from "react-redux";
import { clearUser } from "../../store/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppSelector } from "../../store/hooks";
import { getVoteByUser } from "../../api/voteApi";


const HomePage = () => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);

  const fetchAllPosts = async () => {
    try {
      const response = await getAllPost();
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
      return [];
    }
  }



  const { data: savedPosts } = useQuery({
    queryKey: ['saved-post'],
    queryFn: fetchSavedPosts,
    enabled: !!user
  })


  const { data: posts } = useQuery<PostData[]>({
    queryKey: ['posts'],
    queryFn: fetchAllPosts
  })

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
      <h5 className="py-2">Bài viết thú vị dành cho bạn</h5>
      {posts?.map(post => {
        return (
          <PostComponent
            key={post.id}
            post={post}
            voteType={getVoteType(post.id)}
            isBookmark={savedPosts?.some((saved: any) => saved.id === post.id)}
            onClick={() => navigate(`/post-details/${post.id}`)}
          />
        )
      })}
    </div>
  );
};

export default HomePage;
