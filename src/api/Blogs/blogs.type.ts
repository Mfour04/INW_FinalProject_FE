export interface BlogPost {
    id: string;
    content: string;
    imgUrls: string[];
    likeCount: number;
    commentCount: number;
    createdAt: number;
    updatedAt: number;
    author: {
        id: string;
        username: string;
        avatar: string;
    };
    isLiked?: boolean;
}

export interface CreateBlogPostRequest {
    content: string;
}

export interface BlogPostResponse {
    success: boolean;
    message: string;
    data: BlogPost[];
}

export interface CreateBlogPostResponse {
    success: boolean;
    message: string;
    data: BlogPost;
} 