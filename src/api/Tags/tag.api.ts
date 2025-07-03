import http from "../../utils/http";
import type { Tags } from "./tag.type";

export const getTags = () => http.http.get<Tags>('Tags')