import type { ApiResponse } from "../../../entity/response";
import http from "../../../utils/http";
import type { ForumComment } from "./forumComment.type";

export const GetForumCommentById = (commentId: string) =>
  http.privateHttp.get<ApiResponse<ForumComment>>(
    `/forums/comments/${commentId}`
  );
export const DeleteForumComment = (commentId: string) =>
  http.privateHttp.delete<ApiResponse<{}>>(`/forums/comments/${commentId}`);
