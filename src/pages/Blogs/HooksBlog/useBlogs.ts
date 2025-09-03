import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    GetBlogPosts,
    GetUserBlogPosts,
    GetFollowingBlogPosts,
    GetBlogPostById,
    CreateBlogPost,
    LikeBlogPost,
    UnlikeBlogPost,
    DeleteBlogPost,
    UpdateBlogPost,
} from "../../../api/Blogs/blogs.api";
import type {
    BlogPost,
    CreateBlogPostRequest,
} from "../../../api/Blogs/blogs.type";

export const useBlogPosts = () => {
    return useQuery({
        queryKey: ["blog-posts"],
        queryFn: async () => {
            try {
                const res = await GetBlogPosts({
                    page: 0,
                    limit: 50,
                    sortBy: "created_at:desc",
                });
                return res.data.data || [];
            } catch (error) {
                console.error("Error fetching blog posts:", error);
                return [];
            }
        },
        staleTime: 0,
        gcTime: 0,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        refetchOnReconnect: true,
        retry: 1,
    });
};

export const useUserBlogPosts = (userId: string) => {
    return useQuery({
        queryKey: ["user-blog-posts", userId],
        queryFn: async () => {
            const res = await GetUserBlogPosts(userId, {
                page: 0,
                limit: 50,
                sortBy: "created_at:desc",
            });
            const allPosts = res.data.data;
            return allPosts.filter((post: BlogPost) => post.author.id === userId);
        },
        enabled: !!userId,
        staleTime: 0,
        gcTime: 0,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        refetchOnReconnect: true,
        retry: 1,
    });
};

export const useFollowingBlogPosts = () => {
    return useQuery({
        queryKey: ["following-blog-posts"],
        queryFn: async () => {
            try {
                const res = await GetFollowingBlogPosts({
                    page: 0,
                    limit: 50,
                    sortBy: "created_at:desc",
                });
                return res.data.data || [];
            } catch (error) {
                console.error("Error fetching following blog posts:", error);
                return [];
            }
        },
        staleTime: 0,
        gcTime: 0,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        refetchOnReconnect: true,
        retry: 1,
    });
};

export const useCreateBlogPost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateBlogPostRequest & { images?: File[] }) => {
            const res = await CreateBlogPost(data);
            return res.data;
        },

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
            queryClient.invalidateQueries({ queryKey: ["user-blog-posts"] });
            queryClient.invalidateQueries({ queryKey: ["following-blog-posts"] });
        },
    });
};

export const useToggleLikePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ postId, isLiked }: { postId: string; isLiked: boolean }) => {
            if (isLiked) {
                return await UnlikeBlogPost(postId);
            } else {
                return await LikeBlogPost(postId);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
        },
    });
};

export const useDeleteBlogPost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (postId: string) => {
            try {
                const res = await DeleteBlogPost(postId);
                return res.data;
            } catch (error: any) {
                console.error("Error deleting blog post:", error);
                if (error.response?.status === 401) {
                    alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
                } else {
                    alert("Có lỗi xảy ra khi xóa bài viết!");
                }
                throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
        },
    });
};

export const useUpdateBlogPost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { postId: string; content: string; images?: File[]; removedImageUrls?: string[]; existingImages?: string[] }) => {
            try {
                const res = await UpdateBlogPost(data.postId, {
                    content: data.content,
                    images: data.images,
                    removedImageUrls: data.removedImageUrls,
                    existingImages: data.existingImages,
                });
                return res.data;
            } catch (error: any) {
                console.error("Error updating blog post:", error);
                if (error.response?.status === 401) {
                    alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
                } else {
                    alert("Có lỗi xảy ra khi cập nhật bài viết!");
                }
                throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
            queryClient.invalidateQueries({ queryKey: ["user-blog-posts"] });
            queryClient.invalidateQueries({ queryKey: ["following-blog-posts"] });
            queryClient.invalidateQueries({ queryKey: ["blog-post"] });
        },
    });
};

export const useBlogPostById = (postId: string) => {
    return useQuery({
        queryKey: ["blog-post", postId],
        queryFn: async () => {
            try {
                const res = await GetBlogPostById(postId);
                return res.data;
            } catch (error: any) {
                console.error("Error fetching blog post by ID:", error);
                console.error("Error details:", {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status
                });
                throw error;
            }
        },
        enabled: !!postId,
        staleTime: 0,
        gcTime: 0,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        refetchOnReconnect: true,
        retry: 1,
    });
};
