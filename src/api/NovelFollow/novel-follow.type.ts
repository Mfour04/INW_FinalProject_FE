import type { ApiResponse } from "../../entity/response";

export type NovelFollowRequest = {
  novelId: string;
};

export type NovelFollowerRequest = {
  novelFollowId: string;
};

type NovelFollowResponse = {
  novelFollowId: string;
  novelId: string;
  userId: string;
  userName: string;
  displayName: string;
  avatarUrl: string;
  followedAt: number;
};

export interface NovelFollower {
  followerId: string;
  userId: string;
  userName: string;
  displayName: string;
  avatarUrl: string | null;
  followedAt: number;
}

export interface NovelFollowerResponse {
  novelId: string;
  title: string;
  novelImage: string;
  novelBanner: string | null;
  authorId: string;
  authorName: string;
  price: number;
  totalChapters: number;
  totalFollowers: number;
  followers: NovelFollower[];
}

export type FollowedNovel = {
  followId: string;
  novelId: string;
  title: string;
  novelImage: string;
  novelBanner: string | null;
  authorId: string;
  authorName: string;
  isCompleted: boolean;
  isPaid: boolean;
  price: number;
  ratingAvg: number;
  followers: number;
  totalChapters: number;
  followedAt: number;
};

export type NovelFollows = {
  userId: string;
  userName: string;
  displayName: string;
  avatarUrl: string | null;
  totalFollowing: number;
  followedNovels: FollowedNovel[];
};

export type FollowerNovelsResponse = {
  novelFollows: NovelFollows;
  totalNovelFollows: number;
  totalPages: 1;
};

export type NovelFollowApiResponse = ApiResponse<NovelFollowResponse>;
export type NovelFollowerApiResponse = ApiResponse<NovelFollowerResponse>;
export type UnFollowNovelApiResponse = ApiResponse<boolean>;
export type FollowerNovelsApiResponse = ApiResponse<FollowerNovelsResponse>;
