export interface Comment {
    id: string;
    content: string;
    novelId?: string;
    chapterId?: string;
    parentId?: string;
    name: string;
    user: string;
    avatarUrl?: string;
    timestamp: string;
    likes: number;
    replies: number;
}

export interface CreateCommentRequest {
    content: string;
    novelId?: string;
    chapterId?: string;
}

export interface ReplyCommentRequest {
    content: string;
}

export interface CommentResponse {
    success: boolean;
    message: string;
    data: Comment[];
}
