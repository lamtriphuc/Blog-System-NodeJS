export type TagData = {
  id: number;
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
  voteCount: number;
  commentCount: number;
}
