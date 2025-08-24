import type { ApiResponse } from "../../entity/response";

export type IncomeSummaryParams = {
  userId: string;
  startDate: string;
  endDate: string;
};

export type IncomeChartParams = IncomeSummaryParams & {
  groupBy?: "day" | "week" | "month";
};

export type TopNovelsParams = IncomeSummaryParams & {
  limit?: number;
};

export type IncomeSummaryRes = {
  totalEarningsCoins: number;
  novelSalesCount: number;
  chapterSalesCount: number;
  novelCoins: number;
  chapterCoins: number;
};

export type ChapterDetail = {
  chapterId: string;
  coins: number;
  salesCount: number;
};

export type TopNovelRes = {
  novelId: string;
  title: string;
  image: string;
  totalCoins: number;
  novelSalesCount: number;
  novelCoins: number;
  chapterSalesCount: number;
  chapterCoins: number;
  chapterDetails: ChapterDetail[];
};

export type IncomeChartRes = {
  label: string;
  coins: number;
};

export type IncomeSummaryApiRes = ApiResponse<IncomeSummaryRes>;
export type IncomeChartApiRes = ApiResponse<IncomeChartRes[]>;
export type TopNovelApiRes = ApiResponse<TopNovelRes[]>;
