import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateComment } from "../../api/Comment/comment.api";

export const UseCreateComment = (chapterId: string, novelId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (content: string) => {
            const res = await CreateComment({ content, chapterId, novelId });
            return res.data?.data?.comment;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments", chapterId, novelId] });
        },
    });
};
