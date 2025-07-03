import http from "../../utils/http";
import type { Novels } from "./novel.type";

interface GetNovelsParams {
  page?: number
  limit?: number
  sortBy?: string
  searchTerm?: string
  searchTagTerm?: string
}

export const GetNovels = (params?: GetNovelsParams) => http.http.get<Novels>('Novels', { params });

export const CreateNovels = (request: FormData) => http.multipartHttp.post<Novels>('Novels/created', request);

export const GetAuthorNovels = () => http.privateHttp.get<Novels>('Novels/get-by-authorid');