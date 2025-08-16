import { useEffect, useMemo, useState } from "react";
import Star from "@mui/icons-material/Star";
import Button from "../../../components/ButtonComponent";
import DefaultAvatar from "../../../assets/img/default_avt.png";
import { useAuth } from "../../../hooks/useAuth";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  CreateNovelRating,
  DeleteNovelRating,
  GetNovelRating,
  GetNovelRatingSummary,
  UpdateNovelRating,
  type GetNovelRatingParams,
} from "../../../api/Rating/rating.api";
import type { Novel } from "../../../entity/novel";
import type {
  CreateNovelRatingRequest,
  DeleteNovelRatingRequest,
  UpdateNovelRatingRequest,
} from "../../../api/Rating/rating.type";
import { useToast } from "../../../context/ToastContext/toast-context";
import { formatTicksToRelativeTime } from "../../../utils/date_format";

const MAX_LEN = 750;
const scoreKeys = ["1", "2", "3", "4", "5"] as const;

const initialNovelRatingRequest: CreateNovelRatingRequest = {
  novelId: "",
  score: 0,
  content: null,
};

export type RatingSectionProps = {
  novelInfo: Novel;
};

const Hairline = () => (
  <div className="relative h-px">
    <div className="absolute inset-0 bg-white/8" />
    <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
  </div>
);

const Segmented = ({
  value,
  onChange,
}: {
  value: number | "all";
  onChange: (v: number | "all") => void;
}) => {
  const base =
    "px-2.5 py-1 rounded-full text-[12px] transition border border-white/12";
  const active =
    "bg-white/15 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]";
  const idle = "bg-white/5 text-white/80 hover:bg-white/10";
  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-white/5 p-1 border border-white/12">
      <button
        className={`${base} ${value === "all" ? active : idle}`}
        onClick={() => onChange("all")}
      >
        Tất cả
      </button>
      {[5, 4, 3, 2, 1].map((s) => (
        <button
          key={s}
          className={`${base} ${value === s ? active : idle}`}
          onClick={() => onChange(s)}
          title={`${s} sao`}
        >
          <span className="inline-flex items-center gap-1">
            <Star sx={{ width: 12, height: 12 }} className="text-yellow-400" />
            {s}
          </span>
        </button>
      ))}
    </div>
  );
};

const RatingSection = ({ novelInfo }: RatingSectionProps) => {
  const [ratingRequest, setRatingRequest] = useState<CreateNovelRatingRequest>(
    initialNovelRatingRequest
  );
  const [hoverRating, setHoverRating] = useState(0);
  const [params, setParams] = useState<GetNovelRatingParams>({
    limit: 10,
    page: 0,
  });

  const [loadedReviews, setLoadedReviews] = useState<any[]>([]);
  const [filterStar, setFilterStar] = useState<number | "all">("all");

  const { auth } = useAuth();
  const toast = useToast();

  const {
    data: ratingData,
    isLoading: isRatingLoading,
  } = useQuery({
    queryKey: [
      "ratingNovels",
      novelInfo?.novelId ?? "",
      params.page,
      params.limit,
    ],
    queryFn: () =>
      GetNovelRating(novelInfo!.novelId, params).then((res) => res.data.data),
    enabled: !!novelInfo?.novelId,
  });

  useEffect(() => {
    if (!ratingData?.ratings) return;
    if ((params.page ?? 0) === 0) {
      setLoadedReviews(ratingData.ratings);
    } else {
      setLoadedReviews((prev) => {
        const map = new Map<string, any>();
        [...prev, ...ratingData.ratings].forEach((r) =>
          map.set(r.ratingId, r)
        );
        return Array.from(map.values());
      });
    }
  }, [ratingData?.ratings, params.page]);

  const myId = auth?.user?.userId;
  const myRating = myId
    ? loadedReviews?.find(
        (r) => (r.author?.id ?? r.author?.userId) === myId
      )
    : undefined;

  const { data: ratingSummary } = useQuery({
    queryKey: ["ratingSummary", novelInfo?.novelId ?? ""],
    queryFn: () =>
      GetNovelRatingSummary(novelInfo!.novelId).then((res) => res.data.data),
    enabled: !!novelInfo?.novelId,
  });

  const ratingsDistribution = ratingSummary?.scoreDistribution ?? {};
  const totalRating = useMemo(
    () => scoreKeys.reduce((s, k) => s + (ratingsDistribution[k] ?? 0), 0),
    [ratingsDistribution]
  );
  const percentages = useMemo(
    () =>
      scoreKeys.map((k) => {
        const count = ratingsDistribution[k] ?? 0;
        const pct = totalRating === 0 ? 0 : (count / totalRating) * 100;
        return { star: k, count, percentage: +pct.toFixed(2) };
      }),
    [ratingsDistribution, totalRating]
  );

  const CreateNovelRatingMutation = useMutation({
    mutationFn: (request: CreateNovelRatingRequest) => CreateNovelRating(request),
    onSuccess: (data) => {
      toast?.onOpen(data.data.message);
      setParams((p) => ({ ...p, page: 0 }));
    },
  });
  const UpdateNovelRatingMutation = useMutation({
    mutationFn: (request: UpdateNovelRatingRequest) => UpdateNovelRating(request),
    onSuccess: (data) => {
      toast?.onOpen(data.data.message);
      setParams((p) => ({ ...p, page: 0 }));
    },
  });
  const DeleteNovelRatingMutation = useMutation({
    mutationFn: (request: DeleteNovelRatingRequest) => DeleteNovelRating(request),
    onSuccess: (data) => {
      toast?.onOpen(data.data.message);
      setRatingRequest((prev) => ({
        ...initialNovelRatingRequest,
        novelId: novelInfo.novelId,
      }));
      setParams((p) => ({ ...p, page: 0 }));
    },
  });

  const handleSendReview = () => {
    if (ratingRequest.score === 0) {
      toast?.onOpen("Bạn cần phải đánh giá trước!");
      return;
    }
    const content = (ratingRequest.content ?? "").slice(0, MAX_LEN);
    const normalized = content.trim().length === 0 ? null : content;

    if (myRating) {
      const req: UpdateNovelRatingRequest = {
        ratingId: myRating.ratingId,
        novelId: ratingRequest.novelId,
        score: ratingRequest.score,
        content: normalized,
      };
      UpdateNovelRatingMutation.mutate(req);
    } else {
      CreateNovelRatingMutation.mutate({
        ...ratingRequest,
        content: normalized,
      });
    }
    setRatingRequest((prev) => ({
      ...initialNovelRatingRequest,
      novelId: novelInfo.novelId,
    }));
  };

  const handleDeleteNovelRating = (ratingId: string) => {
    DeleteNovelRatingMutation.mutate({
      novelId: novelInfo.novelId!,
      ratingId,
    });
  };

  const renderStars = (count: number, size: number) =>
    Array.from({ length: 5 }, (_, i) => {
      if (i + 1 <= count) {
        return (
          <Star
            key={i}
            style={{ fontSize: size }}
            className="inline-block text-yellow-400 fill-yellow-400"
          />
        );
      } else if (i + 0.5 <= count) {
        return (
          <span
            key={i}
            className="inline-block relative"
            style={{ width: size, height: size }}
          >
            <Star
              style={{ fontSize: size }}
              className="absolute text-gray-300 fill-gray-300"
            />
            <Star
              style={{ fontSize: size, clipPath: "inset(0 50% 0 0)" }}
              className="absolute text-yellow-400 fill-yellow-400"
            />
          </span>
        );
      } else {
        return (
          <Star
            key={i}
            style={{ fontSize: size }}
            className="inline-block text-gray-300 fill-gray-300"
          />
        );
      }
    });

  useEffect(() => {
    if (novelInfo?.novelId) {
      setRatingRequest((prev) => ({ ...prev, novelId: novelInfo.novelId }));
      setParams({ limit: 10, page: 0 });
      setLoadedReviews([]);
      setFilterStar("all");
    }
  }, [novelInfo?.novelId]);

  const displayed = useMemo(() => {
    const base = Array.isArray(loadedReviews) ? loadedReviews : [];
    if (filterStar === "all") return base;
    return base.filter((r) => Number(r.score) === filterStar);
  }, [loadedReviews, filterStar]);

  const totalPages = Math.max(ratingData?.totalPage ?? 1, 1);
  const canLoadMore =
    (params.page ?? 0) < (ratingData?.totalPage ?? 1) - 1 && filterStar === "all";

  const contentLen = (ratingRequest.content ?? "").length;
  const nearLimit = contentLen > MAX_LEN - 25;

  return (
    <section className="rounded-2xl border border-white/12 bg-[#0f1012]/90 backdrop-blur-md shadow-[0_24px_80px_-30px_rgba(0,0,0,0.75)] overflow-hidden">
      <div className="px-4 pt-4 pb-2">
        <h2 className="text-[15px] font-semibold tracking-wide uppercase text-white/90">
            Đánh giá
        </h2>
      </div>
      <Hairline />

      <div className="p-4">
        <div className="relative overflow-hidden rounded-xl border border-white/12 bg-white/[0.03] p-4 shadow-[0_16px_52px_-24px_rgba(0,0,0,0.65)]">
          <div className="pointer-events-none absolute -top-24 -right-16 h-48 w-48 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.16),transparent_60%)] blur-2xl" />
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-[30px] leading-none font-extrabold tabular-nums bg-clip-text text-transparent bg-gradient-to-br from-white to-white/60">
                {ratingSummary?.ratingAvg != null
                  ? ratingSummary.ratingAvg.toFixed(1)
                  : "0.0"}
              </span>
              <div>
                <div className="text-yellow-400 flex items-center gap-0.5">
                  {renderStars(ratingSummary?.ratingAvg ?? 0, 16)}
                </div>
                <div className="mt-1 text-[11px] text-white/70">
                  {totalRating} lượt đánh giá
                </div>
              </div>
            </div>

            <div className="w-full md:w-[380px] space-y-1.5">
              {scoreKeys.map((k) => {
                const item = percentages.find((p) => p.star === k)!;
                return (
                  <div key={k} className="flex items-center gap-2 text-[12px]">
                    <span className="w-3 text-right">{k}</span>
                    <div className="relative flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500"
                        style={{ width: `${item.percentage}%` }}
                      />
                      <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/10 pointer-events-none" />
                    </div>
                    <span className="w-10 text-right tabular-nums text-gray-300">
                      {item.percentage}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <Hairline />

      <div className="p-4">
        <div className="rounded-2xl border border-white/12 bg-white/[0.03] shadow-[0_16px_52px_-24px_rgba(0,0,0,0.65)] overflow-hidden">
          <div className="p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  className="h-8 w-8 rounded-full object-cover bg-white"
                  src={auth?.user?.avatarUrl || DefaultAvatar}
                  alt="avatar"
                />
                <div>
                  <div className="text-[12px] font-semibold">
                    {auth?.user?.userName ?? "Bạn"}
                  </div>
                  <div className="mt-0.5 text-yellow-400 flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 cursor-pointer transition-all ${
                          (hoverRating || ratingRequest.score) >= star
                            ? "text-yellow-400 fill-yellow-400 scale-110"
                            : "text-gray-300"
                        }`}
                        onClick={() =>
                          setRatingRequest((prev) => ({
                            ...prev,
                            score: star,
                          }))
                        }
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <Segmented value={filterStar} onChange={setFilterStar} />
            </div>

            <div className="mt-3">
              <div
                className={[
                  "rounded-xl border bg-black/25",
                  "border-white/15 transition-shadow",
                  "focus-within:border-white/40 focus-within:ring-2 focus-within:ring-white/25",
                  "shadow-[0_0_0_0_rgba(0,0,0,0)] focus-within:shadow-[0_12px_36px_-20px_rgba(255,255,255,0.35)]",
                ].join(" ")}
              >
                <textarea
                  value={(ratingRequest.content ?? "").slice(0, MAX_LEN)}
                  onChange={(e) => {
                    const next = e.target.value.slice(0, MAX_LEN);
                    setRatingRequest((prev) => ({ ...prev, content: next }));
                  }}
                  placeholder="Viết đánh giá của bạn (tối đa 750 ký tự)..."
                  maxLength={MAX_LEN}
                  className="w-full h-20 p-3 text-[13px] bg-transparent rounded-xl resize-none focus:outline-none"
                />
                <div className="flex items-center justify-end px-3 pb-2 -mt-1">
                  <span
                    className={`text-[11px] tabular-nums ${
                      (ratingRequest.content ?? "").length > MAX_LEN - 25
                        ? "text-white"
                        : "text-white/60"
                    }`}
                  >
                    {(ratingRequest.content ?? "").length}/{MAX_LEN}
                  </span>
                </div>
              </div>

              <div className="mt-3 flex justify-end">
                <Button
                  onClick={handleSendReview}
                  isLoading={
                    CreateNovelRatingMutation.isPending ||
                    UpdateNovelRatingMutation.isPending
                  }
                  className={[
                    "relative rounded-full border-none text-white font-semibold",
                    "text-[12px] px-3.5 py-1.5",
                    "!bg-gradient-to-r from-[#ff512f] via-[#ff6740] to-[#ff9966]",
                    "hover:from-[#ff6a3d] hover:via-[#ff6740] hover:to-[#ffa177]",
                    "shadow-[0_10px_24px_rgba(255,255,255,0.18)] hover:shadow-[0_14px_32px_rgba(255,255,255,0.26)]",
                    "transition-colors duration-300",
                  ].join(" ")}
                >
                  {myRating ? `Cập nhật` : `Gửi đánh giá`}
                </Button>
              </div>
            </div>
          </div>

          <Hairline />

          <div className="divide-y divide-white/10">
            {isRatingLoading && loadedReviews.length === 0 ? (
              <div className="p-4 space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-14 rounded-md bg-white/6 animate-pulse" />
                ))}
              </div>
            ) : displayed.length ? (
              displayed.map((rev) => {
                const isMine = myRating && rev.ratingId === myRating.ratingId;
                return (
                  <div key={rev.ratingId} className="p-4 hover:bg-white/[0.02] transition">
                    <div className="flex items-start gap-2.5">
                      <img
                        className="h-7 w-7 rounded-full object-cover bg-white"
                        src={
                          (rev.author?.avatarUrl ??
                            rev.author?.avatar ??
                            DefaultAvatar) as string
                        }
                        alt={rev.author?.displayName ?? "user"}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[13px] font-semibold">
                            {rev.author?.displayName ?? "Người dùng"}
                          </span>
                          <div className="text-yellow-400 flex items-center">
                            {renderStars(rev.score, 14)}
                            <span className="ml-2 text-[11px] text-gray-400">
                              {!rev.updatedAt
                                ? formatTicksToRelativeTime(rev.createdAt)
                                : formatTicksToRelativeTime(rev.updatedAt)}
                            </span>
                            {isMine && (
                              <button
                                onClick={() =>
                                  handleDeleteNovelRating(rev.ratingId)
                                }
                                className="ml-3 text-[11px] text-red-400 hover:underline"
                              >
                                Xoá
                              </button>
                            )}
                          </div>
                        </div>
                        {rev.content && (
                          <p className="mt-0.5 text-[13px] text-gray-200 whitespace-pre-line">
                            {rev.content}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-4 text-center text-[13px] text-white/70">
                Chưa có đánh giá nào.
              </div>
            )}
          </div>

          {((params.page ?? 0) < (ratingData?.totalPage ?? 1) - 1 &&
            filterStar === "all") && (
            <div className="p-3">
              <button
                onClick={() =>
                  setParams((prev) => ({ ...prev, page: (prev.page ?? 0) + 1 }))
                }
                className={[
                  "w-full rounded-full text-[12.5px] font-semibold",
                  "px-3 py-2 border border-white/12 bg-white/[0.06] hover:bg-white/[0.1] transition",
                  "shadow-[0_10px_28px_-18px_rgba(255,255,255,0.25)]",
                ].join(" ")}
              >
                Xem thêm đánh giá
                <span className="ml-2 text-white/60">
                  ({(params.page ?? 0) + 1}/{totalPages})
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default RatingSection;
