import http from "../../utils/http";
import type {
  GetReadingProcessApiRes,
  ReadingProcessReq,
} from "./reading.type";

export const CreateReadingProcess = (request: ReadingProcessReq) =>
  http.privateHttp.post(`ReadingProcesses/create`, request);

export const UpdateReadingProcess = (request: ReadingProcessReq) =>
  http.privateHttp.post(`ReadingProcesses/update-progress`, request);

export const GetReadingProcess = (userId: string) =>
  http.privateHttp.get<GetReadingProcessApiRes>(
    `ReadingProcesses/history?userId=${userId}`
  );
