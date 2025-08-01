import { useEffect, useState } from "react";
import PostComponent from "../../components/PostComponent/PostComponent";
import { getAllPost } from "../../api/postApi";
import { useQuery } from "@tanstack/react-query";
import type { PostData } from "../../types";
import axios from "axios";
import { useDispatch } from "react-redux";
import { clearUser } from "../../store/authSlice";

const fetchAllPosts = async () => {
  const { data } = await getAllPost();
  return data;
}

const HomePage = () => {

  const { data: posts, isLoading, error } = useQuery<PostData[]>({
    queryKey: ['posts'],
    queryFn: fetchAllPosts
  })

  if (isLoading) return < p > Loading...</p >;
  if (error) return <p>Error: {(error as Error).message}</p>;

  return (
    <div>
      <h5 className="py-2">Bài viết thú vị dành cho bạn</h5>
      {posts?.map(post => {
        return (
          <PostComponent key={post.id} post={post} />
        )
      })}
    </div>
  );
};

export default HomePage;
