import type { ApiResponse } from "../../entity/response";

export interface Chapter {
  chapterId: string;
  novelId: string;
  title: string;
  content: string;
  chapterNumber: number;
  isPaid: boolean;
  price: number;
  scheduledAt: number;
  isLock: boolean;
  isDraft: boolean;
  isPublic: boolean;
  allowComment: boolean;
  commentCount: number;
  totalChapterViews: number;
  createAt: number;
  updateAt: number;
}

export interface ChapterResponse {
  chapter: Chapter;
  nextChapterId: string;
  previousChapterId: string;
}

export interface Chapters {
  success: boolean;
  message: string;
  data: ChapterResponse;
}

export interface BackendChapterResponse {
  chapterId: string;
  novelId: string;
  title: string;
  content: string;
  chapterNumber: number;
  isPaid: boolean;
  price: number;
  scheduledAt: number;
  isLock: boolean;
  isDraft: boolean;
  isPublic: boolean;
  allowComment: boolean;
  commentCount: number;
  totalChapterViews: number;
  createAt: number;
  updateAt: number;
}

export type NovelChapters = {
  success: boolean;
  message: string;
  data: BackendChapterResponse[];
};

export interface BuyChapterResponse {
  success: boolean;
  message: string;
}

export type BuyChapterApiResponse = ApiResponse<BuyChapterResponse>;
