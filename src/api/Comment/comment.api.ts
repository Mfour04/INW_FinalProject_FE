import http from "../../utils/http";
import type {
    Comment,
    CommentResponse,
    CreateCommentRequest,
    ReplyCommentRequest,
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
    http.http.get<CommentResponse>(`Comments/chapter/${chapterId}`, {
        params: { novelId, ...params },
    });

export const CreateComment = (data: CreateCommentRequest) =>
    http.privateHttp.post<CommentApiResponse>("Comments/created", data);

export const ReplyComment = (parentId: string, data: ReplyCommentRequest) =>
    http.privateHttp.post<CommentApiResponse>(
        `Comments/${parentId}/reply`,
        data
    );

export const LikeComment = (commentId: string, userId: string) =>
    http.privateHttp.post(`Comments/${commentId}/likes`, { userId });

export const UnlikeComment = (commentId: string, userId: string) =>
    http.privateHttp.delete(`Comments/${commentId}/likes`, {
        data: { userId },
    });

export const DeleteComment = (commentId: string) =>
    http.privateHttp.delete(`Comments/${commentId}`);

export const UpdateComment = (comment: Comment) =>
    http.privateHttp.put("Comments/update", comment);
