export type Tabs = "all" | "following";
export type VisibleRootComments = { [postId: string]: number };
export interface User {
  name: string;
  username: string;
  avatar: string;
  displayName?: string;
}

export interface Post {
  id: string;
  user: User;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  imgUrls?: string[];
}

export interface Comment {
  post_id: string;
  user_id: string;
  content: string;
  parent_comment_id: string | null;
  like_count: number;
  reply_count: number;
  created_at: string;
  updated_at: string;
}

export interface ForumComment {
  id: string;
  content: string;
  postId?: string;
  parentId?: string;
  likeCount: number;
  replyCount: number;
  createdAt: number;
  updatedAt: number;
  author?: {
    id: string;
    username: string;
    avatar: string | null;
  };
  Author?: {
    Id: string;
    Username: string;
    Avatar: string;
  };
}
