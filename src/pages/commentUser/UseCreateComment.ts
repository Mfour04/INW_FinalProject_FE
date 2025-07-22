import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateComment } from "../../api/Comment/comment.api";

type CreateCommentPayload = {
    content: string;
    parentCommentId?: string;
};

export const UseCreateComment = (chapterId: string, novelId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: CreateCommentPayload) => {
            const res = await CreateComment({
                ...payload,
                chapterId,
                novelId,
            });
            return res.data?.data?.comment;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments", chapterId, novelId] });
        },
    });
};
