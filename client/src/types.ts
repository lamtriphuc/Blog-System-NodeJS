export type TagData = {
  tagName: string;
  desciption: string;
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
}
