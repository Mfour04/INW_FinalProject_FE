import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteComment } from "../../../api/Comment/comment.api";

export const useDeleteComment = (chapterId: string, novelId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentId: string) => {
      const res = await DeleteComment(commentId);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", chapterId, novelId] });

      const qds = queryClient.getQueriesData({ queryKey: ["replies"] });
      qds.forEach(([queryKey]) => {
        if (Array.isArray(queryKey) && queryKey[0] === "replies") {
          queryClient.invalidateQueries({ queryKey });
        }
      });
    },
  });
};
