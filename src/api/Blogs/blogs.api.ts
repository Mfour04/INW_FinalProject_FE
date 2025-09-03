import http from "../../utils/http";
import type {
    BlogPost,
    CreateBlogPostRequest,
    BlogPostResponse,
    CreateBlogPostResponse,
    SingleBlogPostResponse
} from "./blogs.type";

export const GetBlogPosts = (params?: {
    page?: number;
    limit?: number;
    sortBy?: string;
}) =>
    http.http.get<BlogPostResponse>("forums/posts", {
        params,
    });

export const GetFollowingBlogPosts = (params?: {
    page?: number;
    limit?: number;
    sortBy?: string;
}) =>
    http.privateHttp.get<BlogPostResponse>("forums/posts/following", {
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

export const GetBlogPostById = (postId: string) =>
    http.http.get<SingleBlogPostResponse>(`forums/posts/${postId}`);



export const CreateBlogPost = async (data: CreateBlogPostRequest & { images?: File[] }) => {
    const formData = new FormData();

    const content = data.content || "";
    formData.append('Content', content);

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

export const UpdateBlogPost = async (postId: string, data: { content: string; images?: File[]; removedImageUrls?: string[]; existingImages?: string[] }) => {
    const formData = new FormData();
    formData.append('Content', data.content);

    if (data.images && data.images.length > 0) {
        data.images.forEach((image) => {
            formData.append('NewImages', image);
        });
    }

    if (data.existingImages && data.existingImages.length > 0) {
        const keepUrls = data.existingImages.filter(url =>
            !data.removedImageUrls || !data.removedImageUrls.includes(url)
        );

        if (keepUrls.length > 0) {
            keepUrls.forEach(url => {
                formData.append('KeepUrls', url);
            });
        }
    }

    const config = {
        headers: {
            'Content-Type': undefined
        }
    };

    for (const [key, value] of formData.entries()) {
    }

    try {
        const result = await http.multipartHttp.put<CreateBlogPostResponse>(`forums/posts/${postId}`, formData, config);
        return result;
    } catch (error: any) {
        throw error;
    }
}; 