import type { ApiResponse } from "../../../entity/response";

export const ReportTypeStatus = {
  UserReport: 0,
  NovelReport: 1,
  ChapterReport: 2,
  CommentReport: 3,
  ForumPostReport: 4,
  ForumCommentReport: 5,
} as const;

export type ReportTypeStatus =
  (typeof ReportTypeStatus)[keyof typeof ReportTypeStatus];

export const ReportTypeStatusLabels = {
  0: "UserReport",
  1: "NovelReport",
  2: "ChapterReport",
  3: "CommentReport",
  4: "ForumPostReport",
  5: "ForumCommentReport",
} as const;

export const ReportStatus = {
  InProgress: 0,
  Resolved: 1,
  Rejected: 2,
} as const;

export type ReportStatus = (typeof ReportStatus)[keyof typeof ReportStatus];

export const ReportStatusLabels = {
  0: "InProgress",
  1: "Resolved",
  2: "Rejected",
} as const;

export interface ReportEntity {
  id: string;
  userId: string;
  memberId: string | null;
  novelId: string | null;
  chapterId: string | null;
  commentId: string | null;
  forumPostId: string | null;
  forumCommentId: string | null;
  type: ReportTypeStatus;
  reason: string | null;
  status: ReportStatus;
  createdAt: number;
  updatedAt: number;
}

export type ReportApiResponse = ApiResponse<ReportEntity[]>;
export type ReportActionApiResponse = ApiResponse<ReportEntity>;
