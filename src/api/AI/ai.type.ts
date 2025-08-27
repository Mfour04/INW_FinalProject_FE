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

export type SummarizeAIRequest = {
  novelId: string;
};

export type ModerationAIResponse = {
  flagged: boolean;
  sensitive: Sensitive[];
};

export type PlagiarismAIResponse = {
  inputContentLength: number;
  matchCount: number;
  matches: Matches[];
};

export type Matches = {
  chapterId: string;
  chapterTitle: string;
  novelId: string;
  novelSlug: string;
  novelTitle: string;
  similarity: number;
  matches: Chunk[];
};

export type Chunk = {
  inputChunk: string;
  matchedChunk: string;
  similarity: number;
};

export type ModerationAIApiResponse = ApiResponse<ModerationAIResponse>;
export type PlagiarismAIApiResponse = ApiResponse<PlagiarismAIResponse>;
export type SummarizeAIApiResponse = ApiResponse<string>;
