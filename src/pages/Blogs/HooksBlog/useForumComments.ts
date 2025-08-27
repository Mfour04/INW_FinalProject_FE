import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    GetForumComments,
    CreateForumComment,
    UpdateForumComment,
    DeleteForumComment,
    LikeForumComment,
    UnlikeForumComment,
    GetRepliesByForumComment,
} from "../../../api/ForumComment/forum-comment.api";

export const UseForumComments = (postId: string) => {
    return useQuery({
        queryKey: ["forum-comments", postId],
        queryFn: async () => {
            const res = await GetForumComments(postId, {
                page: 0,
                limit: 50,
                includeReplies: true,
            });
            return res.data.data;
        },
        enabled: !!postId,
        staleTime: 0,
        gcTime: 0,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        refetchOnReconnect: true,
    });
};

export const UseCreateForumComment = (postId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: { content: string; parentCommentId?: string }) => {
            const payload = data.parentCommentId
                ? { content: data.content, ParentCommentId: data.parentCommentId }
                : { content: data.content, PostId: postId };
            return CreateForumComment(payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["forum-comments", postId] });
            queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
            queryClient.invalidateQueries({ queryKey: ["user-blog-posts"] });
            queryClient.invalidateQueries({ queryKey: ["following-blog-posts"] });
            queryClient.refetchQueries({ queryKey: ["blog-posts"] });
            queryClient.refetchQueries({ queryKey: ["user-blog-posts"] });
            queryClient.refetchQueries({ queryKey: ["following-blog-posts"] });
        },
    });
};

export const UseUpdateForumComment = (postId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: { commentId: string; content: string }) => {
            const res = await UpdateForumComment(payload);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["forum-comments", postId] });
            queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
            queryClient.invalidateQueries({ queryKey: ["user-blog-posts"] });
            queryClient.invalidateQueries({ queryKey: ["following-blog-posts"] });
        },
    });
};

export const UseDeleteForumComment = (postId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (commentId: string) => {
            const res = await DeleteForumComment(commentId);
            return res.data;
        },
        onSuccess: (_, commentId) => {
            queryClient.invalidateQueries({ queryKey: ["forum-comments", postId] });
            queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
            queryClient.invalidateQueries({ queryKey: ["user-blog-posts"] });
            queryClient.invalidateQueries({ queryKey: ["following-blog-posts"] });
            queryClient.refetchQueries({ queryKey: ["blog-posts"] });
            queryClient.refetchQueries({ queryKey: ["user-blog-posts"] });
            queryClient.refetchQueries({ queryKey: ["following-blog-posts"] });
        },
    });
};

export const UseLikeForumComment = (postId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: { commentId: string; userId: string; type: number }) => {
            const res = await LikeForumComment(payload.commentId, payload.userId, payload.type);
            return res;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["forum-comments", postId] });
        },
    });
};

export const UseUnlikeForumComment = (postId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: { commentId: string; userId: string }) => {
            const res = await UnlikeForumComment(payload.commentId, payload.userId);
            return res;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["forum-comments", postId] });
        },
    });
};

export const UseGetRepliesByForumComment = (commentId: string) => {
    return useQuery({
        queryKey: ["forum-replies", commentId],
        queryFn: async () => {
            const res = await GetRepliesByForumComment(commentId, {
                page: 0,
                limit: 50,
            });
            return res.data.data;
        },
        enabled: !!commentId,
        staleTime: 0,
        gcTime: 0,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        refetchOnReconnect: true,
    });
};
