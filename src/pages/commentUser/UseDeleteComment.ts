import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteComment } from "../../api/Comment/comment.api";

export const UseDeleteComment = (chapterId: string, novelId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (commentId: string) => {
            const res = await DeleteComment(commentId);
            return res.data;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["comments", chapterId, novelId] });

            const commentIds = queryClient.getQueriesData({ queryKey: ["replies"] });
            commentIds.forEach(([queryKey]) => {
                if (Array.isArray(queryKey) && queryKey[0] === "replies") {
                    queryClient.invalidateQueries({ queryKey });
                }
            });
        },
    });
};
