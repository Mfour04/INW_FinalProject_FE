import type { ApiResponse } from "../../entity/response";

export interface Chapter {
  scheduledAt: Date | null;
  novelId: string;
  title: string;
  content: string;
  chapterNumber: number;
  isPaid: boolean;
  price: number;
  isDraft: boolean;
  isPublic: boolean;
}

export type CreateChapterRequest = Omit<Chapter, "chapterNumber">;

export interface UpdateChapterRequest {
  chapterId: string;
  title: string;
  content: string;
  chapterNumber: number;
  isPaid: boolean;
  price: number;
  scheduledAt: Date | null;
  isDraft: boolean;
  isPublic: boolean;
}

export interface ChapterByNovel {
  id: string;
  novel_id: string;
  title: string;
  content: string;
  chapter_number: number;
  is_paid: boolean;
  price: number;
  scheduled_at: number;
  is_lock: boolean;
  is_draft: boolean;
  is_public: boolean;
  created_at: number;
  updated_at: number;
}

export interface ChapterAdmin {
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
  createAt: number;
  updateAt: number;
}

export type ChapterCreatePayload = Omit<Chapter, "novelId">;

export type ChapterResponse = {
  chapter: Chapter;
  nextChapterId: string;
  previousChapterId: string;
};

export type Chapters = {
  success: boolean;
  message: string;
  data: ChapterResponse;
};

export type NovelChapters = {
  success: boolean;
  message: string;
  data: ChapterByNovel[];
};

export type NovelChaptersAdmin = {
  success: boolean;
  message: string;
  data: ChapterAdmin[];
};

export type ChapterMutationResponse = {
  chapterId: string;
  novelId: string;
  title: string;
  content: string;
  chapterNumber: number | null;
  isPaid: boolean;
  price: number;
  scheduledAt: number;
  isLock: boolean;
  allowComment: boolean;
  isDraft: boolean;
  isPublic: boolean;
  commentCount: number;
  totalChapterViews: number;
  createAt: number;
  updateAt: number;
};

export interface CreateChapterResponse {
  success: boolean;
  message: string;
  data: {
    chapter: ChapterMutationResponse;
  };
}

export interface UpdateChapterResponse {
  success: boolean;
  message: string;
  data: {
    chapter: ChapterMutationResponse;
  };
}

export type BuyChapterRequest = {
  coinCost: number;
};

export type BuyChapterResponse = {
  coin: number;
};

export interface PublishStatus {
  Draft: "DRAFT";
  Private: "PRIVATE";
  Public: "PUBLIC";
}

export interface UpdateChapterLockRequest {
  chapterIds: string[];
  isLocked: boolean;
}

export interface UpdateChapterLockResponse {
  success: boolean;
  message: string;
  data: {
    novelId: string;
    authorId: string;
    signalRSent: boolean;
  };
}

export type BuyChapterApiResponse = ApiResponse<BuyChapterResponse>;
export type UpdateChapterLockApiResponse =
  ApiResponse<UpdateChapterLockResponse>;
