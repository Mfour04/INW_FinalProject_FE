import http from "../../utils/http";
import type {
  ModerationAIApiResponse,
  ModerationAIRequest,
  PlagiarismAIApiResponse,
  PlagiarismAIRequest,
  SummarizeAIApiResponse,
  SummarizeAIRequest,
} from "./ai.type";

export const ModerationContent = (request: ModerationAIRequest) =>
  http.http.post<ModerationAIApiResponse>(`AI/check`, request);

export const PlagiarismCheck = (request: PlagiarismAIRequest) =>
  http.http.post<PlagiarismAIApiResponse>(`AI/plagiarism`, request);

export const SummarizeNovels = (request: SummarizeAIRequest) =>
  http.http.post<SummarizeAIApiResponse>(`AI/summarize`, request);
