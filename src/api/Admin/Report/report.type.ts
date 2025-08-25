import type { ApiResponse } from "../../../entity/response";

export type ReportParams = {
  sortBy?: string;
  limit?: number;
  page?: number;
  scope?: ReportScope;
  status?: ReportStatus;
};

export type UpdateActionRequest = {
  status: number;
  action: number;
  moderatorNote?: string;
};

export const ReportScope = {
  Novel: 0,
  Chapter: 1,
  Comment: 2,
  ForumPost: 3,
  ForumComment: 4,
} as const;

export const ReportReason = {
  Nudity: 0,
  Violence: 1,
  Hate: 2,
  Spam: 3,
  Copyright: 4,
  Scam: 5,
  Illegal: 6,
  Other: 7,
  Harassment: 8,
  Doxxing: 9,
  Offtopic: 10,
  Misinfo: 11,
  Spoiler: 12,
} as const;

export const ReportStatus = {
  Pending: 0,
  Resolved: 1,
  Rejected: 2,
  Ignored: 3,
} as const;

export const ModerationAction = {
  None: 0,
  HideResource: 1,
  DeleteResource: 2,
  WarnAuthor: 3,
  SuspendAuthor: 4,
  BanAuthor: 5,
} as const;

export const ReportTypeStatus = {
  UserReport: 0,
  NovelReport: 1,
  ChapterReport: 2,
  CommentReport: 3,
  ForumPostReport: 4,
  ForumCommentReport: 5,
} as const;

export const ReportReasonLabel: Record<number, string> = {
  0: "Ảnh khỏa thân, nội dung gợi dục",
  1: "Bạo lực",
  2: "Thù ghét, phân biệt",
  3: "Spam, quảng cáo rác",
  4: "Vi phạm bản quyền",
  5: "Lừa đảo",
  6: "Nội dung phi pháp",
  7: "Lý do khác",
  8: "Quấy rối (cho bình luận/bài viết)",
  9: "Tiết lộ thông tin cá nhân",
  10: "Lệch chủ đề",
  11: "Thông tin sai lệch",
  12: "Tiết lộ nội dung (spoiler)",
};

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

export type ReportStatus = (typeof ReportStatus)[keyof typeof ReportStatus];
export type ReportScope = (typeof ReportScope)[keyof typeof ReportScope];

export const ReportStatusLabels = {
  0: "Pending",
  1: "Resolved",
  2: "Rejected",
  3: "Ignored",
} as const;

type Reporter = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
};
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

export type Report = {
  id: string;
  scope: number;
  reporter: Reporter;
  reason: number;
  message: string;
  status: number;
  action: number;
  moderator: Reporter;
  moderatorNote: string;
  moderatedAt: number;
  createdAt: number;
  updatedAt: number;
};

export interface ReportEntityV2 {
  totalReports: number;
  totalPages: number;
  reports: Report[];
}

export type ReportApiResponse = ApiResponse<ReportEntityV2>;
export type ReportActionApiResponse = ApiResponse<ReportEntity>;
