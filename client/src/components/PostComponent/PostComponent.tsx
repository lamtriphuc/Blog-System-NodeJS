import "./PostComponent.css";
import avatar from "../../assets/images/Avatar.png";
import type { PostData } from "../../types";
import dayjs from "../../utils/dayjs";

type PostDetailsProps = {
  post: PostData;
}

const PostComponent: React.FC<PostDetailsProps> = ({ post }) => {
  console.log('post', post)
  return (
    <div className="post-container">
      <div className="post p-2 my-2">
        <div className="post-credit pb-2 d-flex align-items-center">
          <span className=" d-inline pe-2">
            {post.user.avatar ? (
              <img className="avatar" src={avatar} alt="" />
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
        <div className="post-content my-2">
          {post.content}
        </div>
        <div className="post-interact d-flex gap-3">
          <div className="vote d-flex justify-content-between align-items-center">
            <span className="vote-item d-flex justify-content-center align-items-center">
              <i className="bi bi-arrow-up-circle"></i>
            </span>
            <span>100</span>
            <span className="vote-item d-flex justify-content-center align-items-center">
              <i className="bi bi-arrow-down-circle"></i>
            </span>
          </div>
          <div className="comment d-flex justify-content-between align-items-center gap-1 px-2">
            <span>
              <i className="bi bi-chat-dots"></i>
            </span>
            <span>19</span>
          </div>
          <div className="bookmark d-flex justify-content-center align-items-center gap-1">
            <span>
              <i className="bi bi-bookmark"></i>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostComponent;
