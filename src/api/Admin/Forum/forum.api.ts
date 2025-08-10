import type { ApiResponse } from "../../../entity/response";
import http from "../../../utils/http";
import type { ForumPost } from "./forum.type";

export const GetForumPostById = (postId: string) =>
  http.privateHttp.get<ApiResponse<ForumPost>>(`/forums/posts/${postId}`);

export const DeleteForumPost = (postId: string) =>
  http.privateHttp.delete<ApiResponse<{}>>(`/forums/posts/${postId}`);
