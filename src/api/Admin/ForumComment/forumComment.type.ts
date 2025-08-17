export interface AuthorInfo {
  id: string;
  username: string;
  avatar?: string;
}

export interface ForumComment {
  id: string;
  postId: string;
  content: string;
  userId: string;
  author: AuthorInfo;
  createdAt: number;
  updatedAt: number;
}
