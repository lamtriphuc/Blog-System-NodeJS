export type TagData = {
  name: string;
  description: string;
  totalPost: number;
  postToday: number;
};

export type PostData = {
  id: number;
  title: string;
  content: string;
  user: {
    id: number;
    username: string;
    avatar: string;
  }
  createdAt: Date;
  upVoteCount: number;
  commentCount: number;
}
