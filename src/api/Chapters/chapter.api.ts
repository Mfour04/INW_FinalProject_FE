import http from "../../utils/http";
import type { Chapters, NovelChapters } from "./chapter.type";

export const GetChapter = (id: string) => {
    return http.http.get<Chapters>(`Chapters/id`, {
        params: { id },
    });
};

export const GetChapters = (novelId: string) =>
  http.http.get<NovelChapters>('Chapters/get-chapter-by-novelId', {
    params: { novelId },
  });