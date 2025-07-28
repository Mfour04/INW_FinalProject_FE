import { useQuery } from "@tanstack/react-query";
import { GetRepliesByComment } from "../../api/Comment/comment.api";

export const UseReplies = (commentId: string) => {
    return useQuery({
        queryKey: ["replies", commentId],
        queryFn: async () => {
            const res = await GetRepliesByComment(commentId, {
                page: 0,
                limit: 50,
                sortBy: "created_at:desc",
            });
            return res.data.data;
        },
        enabled: !!commentId,
        staleTime: 1000 * 60,
    });
}; 