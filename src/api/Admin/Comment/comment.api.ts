import type { ApiResponse } from "../../../entity/response";
import http from "../../../utils/http";
import type { Comment } from "./comment.type";

export const GetCommentById = (commentId: string) =>
  http.privateHttp.get<ApiResponse<Comment>>(`/comments/${commentId}`);
export const DeleteComment = (commentId: string) =>
  http.privateHttp.delete<ApiResponse<{}>>(`/comments/${commentId}`);
