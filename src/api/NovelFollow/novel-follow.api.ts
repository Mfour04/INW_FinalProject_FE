import http from "../../utils/http";
import type {
  FollowerNovelsApiResponse,
  NovelFollowApiResponse,
  NovelFollowerApiResponse,
  NovelFollowerRequest,
  NovelFollowRequest,
  UnFollowNovelApiResponse,
  UpdateFollowStatusReq,
} from "./novel-follow.type";

export type FollowerNovelsParams = {
  page?: number;
  limit?: number;
};

export const FollowNovel = (request: NovelFollowRequest) =>
  http.privateHttp.post<NovelFollowApiResponse>(
    `NovelFollowers/created`,
    request
  );

export const UnfollowNovel = (request: NovelFollowerRequest) =>
  http.privateHttp.delete<UnFollowNovelApiResponse>(
    `NovelFollowers/${request.novelFollowId}`
  );

export const GetNovelFollowers = (request: NovelFollowRequest) =>
  http.privateHttp.get<NovelFollowerApiResponse>(
    `NovelFollowers/novel/${request.novelId}`
  );

export const GetFollowerNovels = (params?: FollowerNovelsParams) =>
  http.privateHttp.get<FollowerNovelsApiResponse>(`NovelFollowers/user`, {
    params,
  });

export const UpdateFollowStatus = (request: UpdateFollowStatusReq) =>
  http.privateHttp.put(`NovelFollowers/updated`, request);
