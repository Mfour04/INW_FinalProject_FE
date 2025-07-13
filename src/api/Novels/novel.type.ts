import type { Chapter } from "../../entity/chapter";
import type { Novel } from "../../entity/novel";
import type { ApiResponse } from "../../entity/response";

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
  id: string;
  title: string;
  title_unsigned: string;
  description: string;
  author_id: string;
  novel_image: string;
  tags: string[];
  status: number;
  is_public: boolean;
  is_lock: boolean;
  is_paid: boolean;
  purchase_type: number;
  price: number;
  total_chapters: number;
  total_views: number;
  followers: number;
  rating_avg: number;
  rating_count: number;
  created_at: number;
  updated_at: number;
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
