import { useMutation } from "@tanstack/react-query";
import { CreateComment } from "../../../api/Comment/comment.api";

type CreateCommentPayload = {
  content: string;
  novelId?: string;
  chapterId?: string;
  parentCommentId?: string;
  userId?: string;
};

export const useCreateComment = (chapterId: string, novelId: string) => {
  return useMutation({
    mutationFn: async (payload: CreateCommentPayload) => {
      const res = await CreateComment(payload);
      return res;
    },
  });
};
