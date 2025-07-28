import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateComment } from "../../api/Comment/comment.api";

type CreateCommentPayload = {
    content: string;
    novelId?: string;
    chapterId?: string;
    parentCommentId?: string;
    userId?: string;
};

export const UseCreateComment = (chapterId: string, novelId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: CreateCommentPayload) => {
            const res = await CreateComment(payload);
            return res;
        },
        onSuccess: () => {
        },
    });
};
