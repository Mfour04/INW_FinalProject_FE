import http from "../../utils/http";
import type {
  IncomeChartApiRes,
  IncomeChartParams,
  IncomeSummaryApiRes,
  IncomeSummaryParams,
  TopNovelApiRes,
  TopNovelsParams,
} from "./income.type";

export const GetIncomeSummary = (params: IncomeSummaryParams) =>
  http.privateHttp.get<IncomeSummaryApiRes>(`earnings/summary`, { params });

export const GetIncomeChart = (params: IncomeChartParams) =>
  http.privateHttp.get<IncomeChartApiRes>(`earnings/chart`, { params });

export const GetTopNovels = (params?: TopNovelsParams) =>
  http.privateHttp.get<TopNovelApiRes>(`earnings/top-novels`, { params });
