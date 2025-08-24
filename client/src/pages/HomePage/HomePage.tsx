import PostComponent from "../../components/PostComponent/PostComponent";
import { getAllPost, getSavedPost, savePost } from "../../api/postApi";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { PostData } from "../../types";
import { useDispatch } from "react-redux";
import { clearUser } from "../../store/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getVoteByUser } from "../../api/voteApi";
import { setLoading } from "../../store/uiSlice";
import { useEffect, useState } from "react";


const HomePage = () => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch()
  const [searchTerm, setSearchTerm] = useState("");

  const [page, setPage] = useState(1);

  const fetchAllPosts = async ({ queryKey }: any) => {
    const [, page, searchTerm] = queryKey;
    try {
      const response = await getAllPost(page, searchTerm);
      return response.data;
    } catch (error: any) {
      const message = error?.response?.data?.message;
      console.log('Lỗi: ', message);
      toast.error('Lỗi: ', message);
    } finally {
      dispatch(setLoading(false)); // Đảm bảo tắt loading khi logout
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

  const fetchSavedPosts = async () => {
    try {
      const response = await getSavedPost();
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


  const { data: postData } = useQuery({
    queryKey: ['posts', page, searchTerm],
    queryFn: fetchAllPosts,
    placeholderData: keepPreviousData
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

  useEffect(() => {
    const handler = (e: any) => {
      setSearchTerm(e.detail);
      setPage(1); // reset về page 1 khi search
    };

    window.addEventListener("doSearch", handler);
    return () => window.removeEventListener("doSearch", handler);
  }, []);

  return (
    <div>
      <h5 className="py-2">Bài viết thú vị dành cho bạn</h5>
      {postData?.posts?.map((post: any) => {
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
  );
};

export default HomePage;
