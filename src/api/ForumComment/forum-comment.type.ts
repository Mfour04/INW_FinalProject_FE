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
    PostId?: string;
    ParentCommentId?: string;
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