import type { Rating } from "../../entity/rating";
import type { ApiResponse } from "../../entity/response";

export type CreateNovelRatingRequest = {
  novelId: string;
  score: number;
  ratingContent: string | null;
};

export type GetNovelRatingResponse = {
  ratings: Rating[];
  totalRatings: number;
  totalPages: number;
};

export type GetNovelRatingApiResponse = ApiResponse<GetNovelRatingResponse>;
export type CreateNovelRatingApiResponse = ApiResponse<Rating>;
