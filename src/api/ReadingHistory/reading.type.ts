import type { ApiResponse } from "../../entity/response";

export type ReadingProcessReq = {
  userId: string;
  novelId: string;
  chapterId: string;
};

export type ReadingProcessRes = {
  id: string;
  userId: string;
  novelId: string;
  chapterId: string;
  createdAt: number;
  updatedAt: number;
};

export type GetReadingProcessApiRes = ApiResponse<ReadingProcessRes[]>;
