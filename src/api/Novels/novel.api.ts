import http from "../../utils/http";
import type { Novels } from "./novel.type";

interface GetNovelsParams {
  page?: number
  limit?: number
  sortBy?: string
  searchTerm?: string
}

export const GetNovels = (params?: GetNovelsParams) => http.get<Novels>('Novels', { params });