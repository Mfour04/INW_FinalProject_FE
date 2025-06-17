import http from "../../utils/http";
import type { Novels } from "./novel.type";

export const GetNovels = () => http.get<Novels>('Novels');