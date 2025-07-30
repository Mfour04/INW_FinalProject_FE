import type { Chapter } from "../../entity/chapter";
import type { Novel } from "../../entity/novel";
import type { Purchaser } from "../../entity/purchaser";
import type { ApiResponse } from "../../entity/response";
import type { Transaction } from "../../entity/transaction";
import type { Tags } from "../Tags/tag.type";

export interface CreateNovelRequest {
  title: string;
  slug: string;
  description: string;
  authorId: string;
  novelImage: File | null;
  novelBanner?: File | null;
  tags: string[];
  status: number;
  isPublic: boolean;
  isPaid: boolean;
  isLock: boolean;
  allowComment: boolean;
  price: number;
}

interface NovelReponse {
  novels: Novel[];
  totalNovels: number;
  totalPages: number;
}

type NovelByAuthorResponse = {
  novels: Novel[];
  totalComments: number;
  totalNovelViews: number;
};

type NovelChaptersResponse = {
  novelInfo: Novel;
  allChapters: Chapter[];
  isAccessFull: boolean;
  freeChapters: string[];
  totalChapters: number;
  totalPages: number;
  purchasedChapterIds: string[];
};

type NovelSlugCheckingResponse = {
  exists: boolean;
};

export type BuyNovelRequest = {
  coinCost: number;
};

export type BuyNovelResponse = {
  purchaser: Purchaser;
  transaction: Transaction;
};

export type NovelsApiResponse = ApiResponse<NovelReponse>;
export type NovelsAuthorApiResponse = ApiResponse<NovelByAuthorResponse>;
export type NovelChaptersApiResponse = ApiResponse<NovelChaptersResponse>;
export type NovelSlugCheckingApiResponse =
  ApiResponse<NovelSlugCheckingResponse>;
export type BuyNovelApiResponse = ApiResponse<BuyNovelResponse>;
