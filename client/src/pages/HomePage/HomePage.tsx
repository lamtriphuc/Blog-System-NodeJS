import { useEffect, useState } from "react";
import PostComponent from "../../components/PostComponent/PostComponent";
import { getAllPost } from "../../api/postApi";

const HomePage = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getAllPost(); // postId ví dụ
        setPosts(data.data); // nếu API trả về theo kiểu { data, status, message }
      } catch (error) {
        console.error('Lỗi khi lấy comment:', error);
      }
    };

    fetch();
  }, []);

  console.log(posts)

  return (
    <div>
      <h5 className="py-2">Bài viết thú vị dành cho bạn</h5>
      {posts.length > 0 ? (
        <PostComponent post={posts[0]} />
      ) : (
        <p>Đang tải bài viết...</p>
      )}
    </div>
  );
};

export default HomePage;
