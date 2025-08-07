import http from "../../utils/http";
import type {
  CreateNovelRatingApiResponse,
  CreateNovelRatingRequest,
  GetNovelRatingApiResponse,
} from "./rating.type";

export type GetNovelRatingParams = {
  page?: number;
  limit?: number;
};

export const GetNovelRating = (
  novelId: string,
  params?: GetNovelRatingParams
) =>
  http.http.get<GetNovelRatingApiResponse>(`Ratings/novel/${novelId}`, {
    params,
  });

export const CreateNovelRating = (request: CreateNovelRatingRequest) =>
  http.privateHttp.post<CreateNovelRatingApiResponse>(
    `Ratings/create`,
    request
  );
