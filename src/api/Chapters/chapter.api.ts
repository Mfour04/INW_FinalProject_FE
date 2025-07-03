import http from "../../utils/http";
import type { Chapters } from "./chapter.type";

export const GetChapters = (id: string) => {
    return http.get<Chapters>(`Chapters/id`, {
        params: { id },
    });
};