import http from "../../utils/http";
import type {
    ForumComment,
    CreateForumCommentRequest,
    ForumCommentResponse,
    ForumCommentApiResponse,
    UpdateForumCommentPayload,
    UpdateForumCommentResponse
} from "./forum-comment.type";

export const GetForumComments = (
    postId: string,
    params?: {
        page?: number;
        limit?: number;
        includeReplies?: boolean;
    }
) =>
    http.http.get<ForumCommentResponse>(`forums/posts/${postId}/comments`, {
        params: { ...params },
    });

export const CreateForumComment = (data: CreateForumCommentRequest) =>
    http.privateHttp.post<ForumCommentApiResponse>("forums/comments", data);

export const LikeForumComment = (
    commentId: string,
    userId: string,
    type: number
) =>
    http.privateHttp.post(`forums/comments/${commentId}/likes`, {
        userId,
        type,
    });

export const UnlikeForumComment = (commentId: string, userId: string) =>
    http.privateHttp.delete(`forums/comments/${commentId}/likes`, {
        data: { userId },
    });

export const DeleteForumComment = (commentId: string) =>
    http.privateHttp.delete(`forums/comments/${commentId}`);

export const UpdateForumComment = (data: UpdateForumCommentPayload) =>
    http.privateHttp.put(`forums/comments/${data.commentId}`, {
        content: data.content,
        userId: data.userId
    });

export const GetRepliesByForumComment = async (
    commentId: string,
    params?: {
        page?: number;
        limit?: number;
        sortBy?: string;
    }
) => {
    return http.http.get(`forums/comments/${commentId}/replies`, {
        params,
    });
}; 