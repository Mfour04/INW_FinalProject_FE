export type ReportRequest = {
  scope: number;
  reason: number;
  novelId?: string;
  chapterId?: string;
  commentId?: string;
  forumPostId?: string;
  forumCommentId?: string;
  targetUserId?: string;
  message?: string;
};
