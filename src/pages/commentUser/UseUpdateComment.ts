import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateComment } from "../../api/Comment/comment.api";
import type { UpdateCommentPayload, UpdateCommentResponse } from "../../api/Comment/comment.api";

export const UseUpdateComment = (chapterId: string, novelId: string) => {
    const queryClient = useQueryClient();

    return useMutation<UpdateCommentResponse, unknown, UpdateCommentPayload>({
        mutationFn: async ({ commentId, content }) => {
            const res = await UpdateComment({ commentId, content });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments", chapterId, novelId] });
        },
    });
};
