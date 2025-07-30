import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    GetBlogPosts,
    GetUserBlogPosts,
    CreateBlogPost,
    LikeBlogPost,
    UnlikeBlogPost,
    DeleteBlogPost,
    UpdateBlogPost,
    type BlogPost,
    type CreateBlogPostRequest,
} from "../api/Blogs/blogs.api";

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
        staleTime: 1000 * 60,
        refetchOnWindowFocus: true,
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
        staleTime: 1000 * 60,
        refetchOnWindowFocus: true,
        retry: 1,
    });
};

export const useCreateBlogPost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateBlogPostRequest) => {
            const res = await CreateBlogPost(data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
            queryClient.invalidateQueries({ queryKey: ["user-blog-posts"] });
        },
        onError: (error) => {
            console.error("Create blog post error:", error);
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
            const res = await DeleteBlogPost(postId);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
        },
    });
};

export const useUpdateBlogPost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ postId, data }: { postId: string; data: CreateBlogPostRequest }) => {
            const res = await UpdateBlogPost(postId, data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
            queryClient.invalidateQueries({ queryKey: ["user-blog-posts"] });
            queryClient.refetchQueries({ queryKey: ["blog-posts"] });
        },
    });
}; 