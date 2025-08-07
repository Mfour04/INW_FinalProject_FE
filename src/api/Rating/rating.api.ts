import http from "../../utils/http";
import type {
  CreateNovelRatingRequest,
  DeleteNovelRatingRequest,
  GetNovelRatingApiResponse,
  GetNovelRatingSummaryApiRes,
  UpdateNovelRatingRequest,
  UpsertNovelRatingApiResponse,
} from "./rating.type";

export type GetNovelRatingParams = {
  page?: number;
  limit?: number;
};

export const GetNovelRating = (
  novelId: string,
  params?: GetNovelRatingParams
) =>
  http.http.get<GetNovelRatingApiResponse>(`novels/${novelId}/ratings`, {
    params,
  });

export const GetNovelRatingSummary = (novelId: string) =>
  http.http.get<GetNovelRatingSummaryApiRes>(
    `novels/${novelId}/ratings/summary`
  );

export const CreateNovelRating = (request: CreateNovelRatingRequest) =>
  http.privateHttp.post<UpsertNovelRatingApiResponse>(
    `novels/${request.novelId}/ratings`,
    request
  );

export const UpdateNovelRating = (request: UpdateNovelRatingRequest) =>
  http.privateHttp.put<UpsertNovelRatingApiResponse>(
    `novels/${request.novelId}/ratings/${request.ratingId}`,
    request
  );

export const DeleteNovelRating = (request: DeleteNovelRatingRequest) =>
  http.privateHttp.delete(
    `novels/${request.novelId}/ratings/${request.ratingId}`
  );
