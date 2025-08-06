import http from "../../utils/http";

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

export const GetBlogPosts = (params?: {
    page?: number;
    limit?: number;
    sortBy?: string;
}) =>
    http.http.get<BlogPostResponse>("forums/posts", {
        params,
    });

export const GetUserBlogPosts = (userId: string, params?: {
    page?: number;
    limit?: number;
    sortBy?: string;
}) =>
    http.http.get<BlogPostResponse>(`forums/posts`, {
        params,
    });



export const CreateBlogPost = async (data: CreateBlogPostRequest & { images?: File[] }) => {
    const formData = new FormData();

    const content = data.content || "";
    formData.append('content', content);

    if (data.images && data.images.length > 0) {
        data.images.forEach((image) => {
            formData.append('Images', image);
        });
    }

    try {
        const config = {
            headers: {
                'Content-Type': undefined
            }
        };

        const res = await http.multipartHttp.post<CreateBlogPostResponse>("forums/posts", formData, config);
        return res;
    } catch (err: any) {
        if (err.response) {
            console.error('API error response:', err.response.data);
        }
        throw err;
    }
};

export const LikeBlogPost = (postId: string) =>
    http.privateHttp.post(`forums/posts/${postId}/likes`);

export const UnlikeBlogPost = (postId: string) =>
    http.privateHttp.delete(`forums/posts/${postId}/likes`);

export const DeleteBlogPost = (postId: string) =>
    http.privateHttp.delete(`forums/posts/${postId}`);

export const UpdateBlogPost = (postId: string, data: CreateBlogPostRequest) => {
    return http.privateHttp.put<CreateBlogPostResponse>(`forums/posts/${postId}`, {
        content: data.content
    });
}; 