import PostComponent from "../../components/PostComponent/PostComponent";

const HomePage = () => {
  return (
    <div>
      <h5 className="py-2">Bài viết thú vị dành cho bạn</h5>
      <PostComponent />
      <PostComponent />
      <PostComponent />
      <PostComponent />
    </div>
  );
};

export default HomePage;
