import type { Rating } from "../../entity/rating";
import type { ApiResponse } from "../../entity/response";

export type CreateNovelRatingRequest = {
  novelId: string;
  score: number;
  content: string | null;
};

export type UpdateNovelRatingRequest = {
  ratingId: string;
  novelId: string;
  score: number;
  content: string | null;
};

export type DeleteNovelRatingRequest = {
  ratingId: string;
  novelId: string;
};

type ScoreDistribution = {
  "1"?: number;
  "2"?: number;
  "3"?: number;
  "4"?: number;
  "5"?: number;
};

export type GetNovelRatingResponse = {
  ratings: Rating[];
  totalCount: number;
  totalPage: number;
};

export type GetNovelRatingSummaryRes = {
  ratingCount: number;
  ratingAvg: number;
  scoreDistribution: ScoreDistribution;
};

export type GetNovelRatingApiResponse = ApiResponse<GetNovelRatingResponse>;
export type GetNovelRatingSummaryApiRes = ApiResponse<GetNovelRatingSummaryRes>;
export type UpsertNovelRatingApiResponse = ApiResponse<Rating>;
