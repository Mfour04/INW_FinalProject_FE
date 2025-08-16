import type { ApiResponse } from "../../entity/response";
import type { Tag } from "../../entity/tag";

export type ReadingProcessReq = {
  userId: string;
  novelId: string;
  chapterId: string;
};

export type ReadingProcessRes = {
  id: string;
  userId: string;
  novelId: string;
  title: string;
  slug: string;
  description: string;
  authorId: string;
  authorName: string;
  novelImage: string;
  novelBanner: string | null;
  tags: Tag[];
  status: number;
  totalChapters: number;
  totalViews: number;
  commentCount: number;
  ratingAvg: number;
  ratingCount: number;
  chapterId: string;
  createAt: number;
  updateAt: number;
};

export type GetReadingProcessApiRes = ApiResponse<ReadingProcessRes[]>;
