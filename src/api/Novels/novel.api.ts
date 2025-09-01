import http from "../../utils/http";

import type {
  BuyNovelApiResponse,
  BuyNovelRequest,
  NovelChaptersApiResponse,
  NovelsAdminApiResponse,
  NovelsApiResponse,
  NovelsAuthorApiResponse,
  NovelSlugCheckingApiResponse,
} from "./novel.type";

interface GetNovelsParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  searchTerm?: string;
  searchTagTerm?: string;
}

type novelChapterSortDirection = "chapter_number:asc" | "chapter_number:desc";

export interface GetNovelChaptersParams {
  page?: number;
  limit?: number;
  sortBy?: novelChapterSortDirection;
  chapterNumber?: number;
}

interface GetRecommendNovelsParams {
  topN: number;
}

export const GetNovels = (params?: GetNovelsParams) =>
  http.privateHttp.get<NovelsApiResponse>("Novels", { params });

export const CreateNovels = (request: FormData) =>
  http.multipartHttp.post<NovelsApiResponse>("Novels/created", request);

export const UpdateNovels = (request: FormData) =>
  http.multipartHttp.put<NovelsApiResponse>("Novels/updated", request);

export const DeleteNovel = (novelId: string) =>
  http.privateHttp.delete(`Novels/${novelId}`);

export const GetAuthorNovels = () =>
  http.privateHttp.get<NovelsAuthorApiResponse>("Novels/get-by-authorid");

export const GetNovelById = (id: string) =>
  http.privateHttp.get<NovelChaptersApiResponse>(`Novels/${id}`);

export const GetNovelByUrl = (url: string, params?: GetNovelChaptersParams) =>
  http.privateHttp.get<NovelChaptersApiResponse>(`Novels/slug/${url}`, {
    params,
  });

export const GetUrlChecked = (slug: string) =>
  http.http.get<NovelSlugCheckingApiResponse>(`Novels/${slug}/check`);

export const BuyNovel = (novelId: string, request: BuyNovelRequest) =>
  http.privateHttp.post<BuyNovelApiResponse>(`Novels/${novelId}/buy`, request);

export const GetRecommendedNovels = (params: GetRecommendNovelsParams) =>
  http.privateHttp.get<NovelsApiResponse>("Novels/recommendNovel-user", {
    params,
  });
export const UpdateNovelLock = (novelId: string, isLocked: boolean) =>
  http.privateHttp.put<NovelsAdminApiResponse>(
    `Novels/update-lock-novel/${novelId}`,
    {},
    {
      params: { isLocked },
    }
  );
