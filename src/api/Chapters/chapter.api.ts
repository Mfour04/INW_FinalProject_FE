import http from "../../utils/http";
import type { Chapters } from "./chapter.type";

export const GetChapter = (id: string) => {
    return http.http.get<Chapters>(`Chapters/id`, {
        params: { id },
    });
};