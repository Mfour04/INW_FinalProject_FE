import { useQuery } from "@tanstack/react-query";
import { GetCommentsByChapter } from "../../../api/Comment/comment.api";

export const useComments = (chapterId: string, novelId: string) => {
  return useQuery({
    queryKey: ["comments", chapterId, novelId],
    queryFn: async () => {
      const res = await GetCommentsByChapter(chapterId, novelId, {
        page: 0,
        limit: 50,
        includeReplies: true,
      });
      return res.data.data;
    },
    staleTime: 60_000,
  });
};
