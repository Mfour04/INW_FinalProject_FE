import { useEffect } from "react";
import type { ReadingProcessReq } from "../../../api/ReadingHistory/reading.type";
import { CreateReadingProcess, UpdateReadingProcess } from "../../../api/ReadingHistory/reading.api";
import { useMutation } from "@tanstack/react-query";

export function useReadingProcess(params: {
  isCurrentNovel: boolean;
  novelId?: string;
  chapterId?: string;
  userId?: string;
}) {
  const { isCurrentNovel, novelId, chapterId, userId } = params;

  const createMutation = useMutation({
    mutationFn: (request: ReadingProcessReq) => CreateReadingProcess(request),
  });
  const updateMutation = useMutation({
    mutationFn: (request: ReadingProcessReq) => UpdateReadingProcess(request),
  });

  useEffect(() => {
    if (!novelId || !chapterId || !userId) return;
    const payload = { novelId, chapterId, userId };
    if (isCurrentNovel) updateMutation.mutate(payload);
    else createMutation.mutate(payload);
  }, [isCurrentNovel, novelId, chapterId, userId]);
}
