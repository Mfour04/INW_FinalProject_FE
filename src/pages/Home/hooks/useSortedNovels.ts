import { useQuery } from "@tanstack/react-query";
import { GetNovels } from "../../../api/Novels/novel.api";

export const SORT_BY_FIELDS = {
  CREATED_AT: "created_at",
  TOTAL_VIEWS: "total_views",
  RATING_AVG: "rating_avg",
} as const;

export const SORT_DIRECTIONS = {
  ASC: "asc",
  DESC: "desc",
} as const;

export const useSortedNovels = (
  sortBy: string,
  direction: string,
  page = 0,
  limit = 10
) =>
  useQuery({
    queryKey: ["novels", sortBy, direction, page, limit],
    queryFn: () =>
      GetNovels({ page, limit, sortBy: `${sortBy}:${direction}` }).then(
        (res) => res.data.data.novels
      ),
    staleTime: 60_000,
  });
