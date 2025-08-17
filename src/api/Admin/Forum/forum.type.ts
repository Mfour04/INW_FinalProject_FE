export interface AuthorInfo {
  id: string;
  username: string;
  avatar?: string;
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  userId: string;
  author: AuthorInfo;
  createdAt: number;
  updatedAt: number;
}
