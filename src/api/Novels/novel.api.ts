import http from "../../utils/http";

import type {
  BuyNovelApiResponse,
  BuyNovelRequest,
  NovelChaptersApiResponse,
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

export const GetNovels = (params?: GetNovelsParams) =>
  http.http.get<NovelsApiResponse>("Novels", { params });

export const CreateNovels = (request: FormData) =>
  http.multipartHttp.post<NovelsApiResponse>("Novels/created", request);

export const UpdateNovels = (request: FormData) =>
  http.multipartHttp.put<NovelsApiResponse>("Novels/updated", request);

export const DeleteNovel = (novelId: string) =>
  http.privateHttp.delete(`Novels/${novelId}`);

export const GetAuthorNovels = () =>
  http.privateHttp.get<NovelsAuthorApiResponse>("Novels/get-by-authorid");

export const GetNovelById = (id: string) =>
  http.http.get<NovelChaptersApiResponse>(`Novels/${id}`);

export const GetUrlChecked = (slug: string) =>
  http.http.get<NovelSlugCheckingApiResponse>(`Novels/slug/${slug}`);

export const BuyNovel = (novelId: string, request: BuyNovelRequest) =>
  http.privateHttp.post<BuyNovelApiResponse>(`Novels/${novelId}/buy`, request);
