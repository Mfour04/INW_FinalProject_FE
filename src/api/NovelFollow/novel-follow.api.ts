import http from "../../utils/http";
import type {
  FollowerNovelsApiResponse,
  NovelFollowApiResponse,
  NovelFollowerApiResponse,
  NovelFollowerRequest,
  NovelFollowRequest,
  UnFollowNovelApiResponse,
} from "./novel-follow.type";

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

export const GetFollowerNovels = () =>
  http.privateHttp.get<FollowerNovelsApiResponse>(`NovelFollowers/user`);
