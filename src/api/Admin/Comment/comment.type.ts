export interface Comment {
  updatedAt: number;
  likeCount: number;
  replyCount: number;
  id: string;
  author: AuthorInfo;
  novelId: string;
  chapterId: string;
  content: string;
  createdAt: number;
}
export interface AuthorInfo {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
}
