import http from "../../utils/http";
import type {
  IncomeChartApiRes,
  IncomeChartParams,
  IncomeSummaryApiRes,
  IncomeSummaryParams,
  TopNovelApiRes,
  TopNovelsParams,
  TopNovelViewApiRes,
} from "./income.type";

export const GetIncomeSummary = (params: IncomeSummaryParams) =>
  http.privateHttp.get<IncomeSummaryApiRes>(`authors/me/earnings/summary`, {
    params,
  });

export const GetIncomeChart = (params: IncomeChartParams) =>
  http.privateHttp.get<IncomeChartApiRes>(`authors/me/earnings/chart`, {
    params,
  });

export const GetTopNovels = (params?: TopNovelsParams) =>
  http.privateHttp.get<TopNovelApiRes>(`authors/me/earnings/top-novels`, {
    params,
  });

export const GetTopNovelsViews = (params?: TopNovelsParams) =>
  http.privateHttp.get<TopNovelViewApiRes>(`authors/me/views/top-novels`, {
    params,
  });
