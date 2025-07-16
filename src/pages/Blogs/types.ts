export type Tabs = "all" | "following";

export interface User {
  name: string;
  username: string;
  avatar: string;
}

export interface Post {
  id: string;
  user: User;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  isLiked: boolean;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  parent_comment_id: string | null;
  like_count: number;
  reply_count: number;
  created_at: string;
  updated_at: string;
}
