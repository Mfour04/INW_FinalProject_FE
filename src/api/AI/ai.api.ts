import http from "../../utils/http";
import type {
  ModerationAIApiResponse,
  ModerationAIRequest,
  PlagiarismAIApiResponse,
  PlagiarismAIRequest,
} from "./ai.type";

export const ModerationContent = (request: ModerationAIRequest) =>
  http.http.post<ModerationAIApiResponse>(`AI/check`, request);

export const PlagiarismCheck = (request: PlagiarismAIRequest) =>
  http.http.post<PlagiarismAIApiResponse>(`AI/plagiarism`, request);
