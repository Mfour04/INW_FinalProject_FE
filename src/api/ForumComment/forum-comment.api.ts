import http from "../../utils/http";

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

export interface CreateForumCommentRequest {
    content: string;
    postId?: string;
    parentCommentId?: string;
}

export interface ForumCommentResponse {
    success: boolean;
    message: string;
    data: ForumComment[];
}

export interface ForumCommentApiResponse {
    success: boolean;
    message: string;
    data: {
        comment: any;
        signalR?: any;
    };
}

export interface UpdateForumCommentPayload {
    commentId: string;
    content: string;
    userId?: string;
}

export interface UpdateForumCommentResponse {
    commentId: string;
    content: string;
    updatedAt: number;
}

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

export const GetRepliesByForumComment = (
    commentId: string,
    params?: {
        page?: number;
        limit?: number;
        sortBy?: string;
    }
) => {
    return Promise.resolve({ data: { data: [] } });
}; 