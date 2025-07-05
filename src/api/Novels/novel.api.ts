import http from "../../utils/http";
import type { Novels, NovelsByAuthor, NovelUpdate } from "./novel.type";

interface GetNovelsParams {
  page?: number
  limit?: number
  sortBy?: string
  searchTerm?: string
  searchTagTerm?: string
}

export const GetNovels = (params?: GetNovelsParams) => http.http.get<Novels>('Novels', { params });

export const CreateNovels = (request: FormData) => http.multipartHttp.post<Novels>('Novels/created', request);

export const UpdateNovels = (request: FormData) => http.multipartHttp.put<Novels>('Novels/updated', request);

export const DeleteNovel = (novelId: string) => http.privateHttp.delete(`Novels/${novelId}`);

export const GetAuthorNovels = () => http.privateHttp.get<NovelsByAuthor>('Novels/get-by-authorid');

export const GetNovelById = (id: string) => http.privateHttp.get<NovelUpdate>(`Novels/${id}`);