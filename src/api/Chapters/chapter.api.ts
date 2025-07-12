import http from "../../utils/http";
import type {
  Chapters,
  CreateChapterRequest,
  CreateChapterResponse,
  NovelChapters,
  UpdateChapterRequest,
} from "./chapter.type";

export const GetChapter = (id: string) => {
  return http.http.get<Chapters>(`Chapters/${id}`);
};

export const GetChapters = (novelId: string) =>
  http.http.get<NovelChapters>("Chapters/get-chapter-by-novelId", {
    params: { novelId },
  });

export const CreateChapter = (request: CreateChapterRequest) =>
  http.privateHttp.post<CreateChapterResponse>("Chapters/created", request);

export const UpdateChapter = (request: UpdateChapterRequest) =>
  http.privateHttp.put<UpdateChapterRequest>("Chapters/updated", request);
