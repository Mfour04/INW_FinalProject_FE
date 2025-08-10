import http from "../../utils/http";
import type {
  CommentByIdResponse,
  CommentResponse,
  CreateCommentRequest,
} from "./comment.type";

interface CommentApiResponse {
  success: boolean;
  message: string;
  data: {
    comment: any;
    signalR?: any;
  };
}

export const GetComments = (params?: {
  page?: number;
  limit?: number;
  novelId?: string;
  chapterId?: string;
  includeReplies?: boolean;
}) =>
  http.http.get<CommentResponse>("Comments", {
    params,
  });

export const GetCommentsByNovel = (
  novelId: string,
  params?: {
    page?: number;
    limit?: number;
    includeReplies?: boolean;
  }
) =>
  http.http.get<CommentResponse>(`Comments/novel/${novelId}`, {
    params,
  });

export const GetCommentsByChapter = (
  chapterId: string,
  novelId: string,
  params?: {
    page?: number;
    limit?: number;
    includeReplies?: boolean;
  }
) =>
  http.http.get<CommentResponse>(`Chapters/${chapterId}/comments`, {
    params: { novelId, ...params },
  });

export interface UpdateCommentPayload {
  commentId: string;
  content: string;
  userId?: string;
}

export interface UpdateCommentResponse {
  commentId: string;
  content: string;
  updatedAt: number;
}

export const CreateComment = (data: CreateCommentRequest) =>
  http.privateHttp.post<CommentApiResponse>("Comments", data);

export const LikeComment = (commentId: string, userId: string, type: number) =>
  http.privateHttp.post(`Comments/${commentId}/likes`, {
    userId,
    type,
  });

export const UnlikeComment = (commentId: string, userId: string) =>
  http.privateHttp.delete(`Comments/${commentId}/likes`, {
    data: { userId },
  });

export const DeleteComment = (commentId: string) =>
  http.privateHttp.delete(`Comments/${commentId}`);

export const UpdateComment = (data: UpdateCommentPayload) =>
  http.privateHttp.put(`Comments/${data.commentId}`, data);

export const GetRepliesByComment = (
  commentId: string,
  params?: {
    page?: number;
    limit?: number;
    sortBy?: string;
  }
) =>
  http.http.get<CommentResponse>(`Comments/${commentId}/reply`, {
    params,
  });

export const GetCommentById = (commentId: string) =>
  http.http.get<CommentByIdResponse>(`comments/${commentId}`);
