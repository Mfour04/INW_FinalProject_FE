import type { ApiResponse } from "../../entity/response";

type FilterType = "all" | "chapter" | "novel";

export type IncomeSummaryParams = {
  startDate?: string;
  endDate?: string;
  filter?: FilterType;
  novelId?: string;
  page?: number;
  PageSize?: number;
};

export type IncomeChartParams = {
  startDate?: string;
  endDate?: string;
  groupBy?: "day" | "month" | "year";
  filter?: FilterType;
  novelId?: string;
};

export type TopNovelsParams = {
  limit?: number;
};

type Log = {
  earningId: string;
  novelId: string;
  chapterId: string;
  type: string;
  amount: number;
  createdAt: number;
  buyerUsername: string;
  buyerDisplayName: string;
};

export type IncomeSummaryRes = {
  totalEarningsCoins: number;
  totalOrders: number;
  filterApplied: string;
  novelId: string;
  totalLogs: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
  logs: Log[];
};

export type ChapterDetail = {
  chapterId: string;
  coins: number;
  salesCount: number;
};

export type TopNovelRes = {
  novelId: string;
  title: string;
  totalCoins: number;
  totalOrders: number;
};

export type TopNovelsViewRes = {
  novelId: string;
  title: string;
  totalViews: number;
};

export type IncomeChartRes = {
  label: string;
  coins: number;
  bucketStartTicks: number;
  bucketEndTicks: number;
};

export type IncomeSummaryApiRes = ApiResponse<IncomeSummaryRes>;
export type IncomeChartApiRes = ApiResponse<IncomeChartRes[]>;
export type TopNovelApiRes = ApiResponse<TopNovelRes[]>;
export type TopNovelViewApiRes = ApiResponse<TopNovelsViewRes[]>;
