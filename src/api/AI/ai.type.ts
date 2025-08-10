import type { ApiResponse } from "../../entity/response";

type Sensitive = {
  category: string;
  score: number;
};

export type ModerationAIRequest = {
  content: string;
};

export type PlagiarismAIRequest = {
  content: string;
};

export type ModerationAIResponse = {
  flagged: false;
  sensitive: Sensitive[];
};

export type PlagiarismAIResponse = {
  inputContentLength: number;
  matchCount: number;
  matches: string[];
};

export type ModerationAIApiResponse = ApiResponse<ModerationAIResponse>;
export type PlagiarismAIApiResponse = ApiResponse<PlagiarismAIResponse>;
