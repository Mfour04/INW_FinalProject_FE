import http from "../../utils/http";
import type {
  BuyChapterApiResponse,
  BuyChapterRequest,
  Chapters,
  CreateChapterRequest,
  CreateChapterResponse,
  NovelChapters,
  NovelChaptersAdmin,
  UpdateChapterLockApiResponse,
  UpdateChapterLockRequest,
  UpdateChapterRequest,
} from "./chapter.type";

export const GetChapter = (id: string) => {
  return http.privateHttp.get<Chapters>(`Chapters/${id}`);
};

export const GetChapters = (novelId: string) =>
  http.http.get<NovelChapters>("Chapters/get-chapter-by-novelId", {
    params: { novelId },
  });

export const CreateChapter = (request: CreateChapterRequest) =>
  http.privateHttp.post<CreateChapterResponse>("Chapters/created", request);

export const UpdateChapter = (request: UpdateChapterRequest) =>
  http.privateHttp.put<UpdateChapterRequest>("Chapters/updated", request);

export const BuyChapter = (chapterId: string, request: BuyChapterRequest) =>
  http.privateHttp.post<BuyChapterApiResponse>(
    `Chapters/${chapterId}/buy`,
    request
  );

export const GetChaptersAdmin = (novelId: string) =>
  http.http.get<NovelChaptersAdmin>("Chapters/get-chapter-by-novelId", {
    params: { novelId },
  });

export const UpdateChapterLock = (request: UpdateChapterLockRequest) =>
  http.privateHttp.put<UpdateChapterLockApiResponse>(
    `Chapters/update-lock-chapters`,
    request
  );