import type { Chapter } from "../../entity/chapter";
import type { Novel } from "../../entity/novel";
import type { ApiResponse } from "../../entity/response";
import type { Tags } from "../Tags/tag.type";

export interface CreateNovelRequest {
  title: string;
  description: string;
  authorId: string;
  novelImage: File | null;
  tags: string[];
  status: number;
  isPublic: boolean;
  isPaid: boolean;
  isLock: boolean;
  purchaseType: number;
  price: number;
}

interface NovelReponse {
  novels: Novel[];
  totalNovels: number;
  totalPages: number;
}

type NovelByAuthorResponse = {
  novelId: string;
  title: string;
  description: string;
  authorId: string;
  authorName: string;
  novelImage: string;
  novelBanner: string | null;
  tags: Tags[];
  status: number;
  isPublic: boolean;
  isPaid: boolean;
  isLock: boolean;
  price: number;
  totalChapters: number;
  totalViews: number;
  followers: number;
  ratingAvg: number;
  ratingCount: number;
  createAt: number;
  updateAt: number;
};

type NovelChaptersResponse = {
  novelInfo: Novel;
  allChapters: Chapter[];
  freeChapters: string[];
  totalChapters: number;
  totalPages: number;
  purchasedChapterIds: string[];
};

export type NovelsApiResponse = ApiResponse<NovelReponse>;
export type NovelsAuthorApiResponse = ApiResponse<NovelByAuthorResponse[]>;
export type NovelChaptersApiResponse = ApiResponse<NovelChaptersResponse>;
