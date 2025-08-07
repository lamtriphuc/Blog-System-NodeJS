import { useEffect, useState } from "react";
import PostComponent from "../../components/PostComponent/PostComponent";
import { getAllPost, getSavedPost } from "../../api/postApi";
import { useQuery } from "@tanstack/react-query";
import type { PostData } from "../../types";
import axios from "axios";
import { useDispatch } from "react-redux";
import { clearUser } from "../../store/authSlice";
import { useNavigate } from "react-router-dom";

const fetchAllPosts = async () => {
  const { data } = await getAllPost();
  return data;
}

const fetchSavedPosts = async () => {
  const { data } = await getSavedPost();
  return data;
}

const HomePage = () => {
  const navigate = useNavigate();

  const { data: posts, isLoading, error } = useQuery<PostData[]>({
    queryKey: ['posts'],
    queryFn: fetchAllPosts
  })

  const { data: savedPosts } = useQuery({
    queryKey: ['saved-post'],
    queryFn: fetchSavedPosts
  })

  if (isLoading) return < p > Loading...</p >;
  if (error) return <p>Error: {(error as Error).message}</p>;

  return (
    <div>
      <h5 className="py-2">Bài viết thú vị dành cho bạn</h5>
      {posts?.map(post => {
        return (
          <PostComponent
            key={post.id}
            post={post}
            isBookmark={savedPosts?.some((saved: any) => saved.id === post.id)}
            onClick={() => navigate(`/post-details/${post.id}`)}
          />
        )
      })}
    </div>
  );
};

export default HomePage;
