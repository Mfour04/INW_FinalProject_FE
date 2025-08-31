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
  classification: string;
  contentWordOverlap: number;
  literalWeightedRate: number;
  novelId: string;
  novelSlug: string;
  novelTitle: string;
  phrase5MatchCount: number;
  semanticCoverage: number;
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
