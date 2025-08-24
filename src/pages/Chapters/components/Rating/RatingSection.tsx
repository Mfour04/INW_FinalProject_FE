import { useEffect, useMemo, useState } from "react";
import { Star as StarIcon } from "lucide-react";
import Button from "../../../../components/ButtonComponent";
import DefaultAvatar from "../../../../assets/img/default_avt.png";
import { useAuth } from "../../../../hooks/useAuth";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  CreateNovelRating,
  DeleteNovelRating,
  GetNovelRatingKeyset,
  GetNovelRatingSummary,
  UpdateNovelRating,
  type GetNovelRatingsKeyParams,
} from "../../../../api/Rating/rating.api";
import type { Novel } from "../../../../entity/novel";
import type {
  CreateNovelRatingRequest,
  DeleteNovelRatingRequest,
  UpdateNovelRatingRequest,
} from "../../../../api/Rating/rating.type";
import { useToast } from "../../../../context/ToastContext/toast-context";
import { formatTicksToRelativeTime } from "../../../../utils/date_format";
import { MAX_LEN, scoreKeys } from "../../constants";
import { Segmented } from "./Segment";
import type { Rating } from "../../../../entity/rating";
import { ClickableUserInfo } from "../../../../components/common/ClickableUserInfo";

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
    <div className="absolute inset-0 bg-black/10 dark:bg-white/8" />
    <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-black/20 to-transparent dark:via-white/20" />
  </div>
);

const RatingSection = ({ novelInfo }: RatingSectionProps) => {
  const [ratingRequest, setRatingRequest] = useState<CreateNovelRatingRequest>(
    initialNovelRatingRequest
  );
  const [hoverRating, setHoverRating] = useState(0);
  const [loadMoreParams, setLoadMoreParams] =
    useState<GetNovelRatingsKeyParams>({
      limit: 5,
      afterId: null,
    });

  const [loadedReviews, setLoadedReviews] = useState<any[]>([]);
  const [filterStar, setFilterStar] = useState<number | "all">("all");

  const { auth } = useAuth();
  const toast = useToast();

  const {
    data: ratingData,
    isLoading: isRatingLoading,
    isFetching: isRatingFetching,
    refetch: ratingRefetch,
  } = useQuery({
    queryKey: ["ratingNovels", novelInfo.novelId ?? "", loadMoreParams],
    queryFn: () =>
      GetNovelRatingKeyset(novelInfo.novelId, loadMoreParams).then(
        (res) => res.data.data
      ),
    enabled: !!novelInfo?.novelId,
  });

  const myId = auth?.user?.userId;
  const myRating: Rating = myId
    ? loadedReviews?.find((r) => (r.author?.id ?? r.author?.userId) === myId)
    : undefined;

  const { data: ratingSummary } = useQuery({
    queryKey: ["ratingSummary", novelInfo?.novelId ?? ""],
    queryFn: () =>
      GetNovelRatingSummary(novelInfo!.novelId).then((res) => res.data.data),
    enabled: !!novelInfo?.novelId,
  });

  const CreateNovelRatingMutation = useMutation({
    mutationFn: (request: CreateNovelRatingRequest) =>
      CreateNovelRating(request),
    onSuccess: (data) => {
      ratingRefetch();
      toast?.onOpen(data.data.message);
    },
  });
  const UpdateNovelRatingMutation = useMutation({
    mutationFn: (request: UpdateNovelRatingRequest) =>
      UpdateNovelRating(request),
    onSuccess: (data) => {
      ratingRefetch();
      toast?.onOpen(data.data.message);
    },
  });
  const DeleteNovelRatingMutation = useMutation({
    mutationFn: (request: DeleteNovelRatingRequest) =>
      DeleteNovelRating(request),
    onSuccess: (data) => {
      toast?.onOpen(data.data.message);
      setRatingRequest((prev) => ({
        ...prev,
        novelId: novelInfo.novelId,
      }));
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
    setRatingRequest(initialNovelRatingRequest);
  };

  const handleDeleteNovelRating = (ratingId: string) => {
    DeleteNovelRatingMutation.mutate({
      novelId: novelInfo.novelId!,
      ratingId,
    });
  };

  useEffect(() => {
    if (myRating)
      setRatingRequest({
        content: myRating.content,
        novelId: myRating.novelId,
        score: myRating.score,
      });
  }, [myRating]);

  const renderStars = (count: number, size: number) =>
    Array.from({ length: 5 }, (_, i) => {
      if (i + 1 <= count) {
        return (
          <StarIcon
            key={i}
            className="inline-block text-yellow-400 fill-yellow-400"
            style={{ width: size, height: size }}
            fill="currentColor"
          />
        );
      } else if (i + 0.5 <= count) {
        return (
          <span
            key={i}
            className="inline-block relative"
            style={{ width: size, height: size }}
          >
            <StarIcon
              className="absolute text-gray-300 fill-gray-300 dark:text-gray-300 dark:fill-gray-300"
              style={{ width: size, height: size }}
              fill="currentColor"
            />
            <StarIcon
              className="absolute text-yellow-400 fill-yellow-400"
              style={{
                width: size,
                height: size,
                clipPath: "inset(0 50% 0 0)",
              }}
              fill="currentColor"
            />
          </span>
        );
      } else {
        return (
          <StarIcon
            key={i}
            className="inline-block text-gray-300 fill-gray-300"
            style={{ width: size, height: size }}
            fill="currentColor"
          />
        );
      }
    });

  useEffect(() => {
    if (!ratingData?.items) return;

    setLoadedReviews((prev) => {
      const map = new Map<string, any>();
      [...prev, ...ratingData?.items].forEach((r) => map.set(r.ratingId, r));
      return Array.from(map.values());
    });
  }, [ratingData?.items]);

  useEffect(() => {
    console.log("loaded Review", loadedReviews);
  }, [loadedReviews]);

  useEffect(() => {
    if (novelInfo?.novelId) {
      setRatingRequest((prev) => ({ ...prev, novelId: novelInfo.novelId }));
      setLoadedReviews([]);
      setFilterStar("all");
    }
  }, [novelInfo?.novelId]);

  const displayed = useMemo(() => {
    const base = Array.isArray(loadedReviews) ? loadedReviews : [];
    if (filterStar === "all") return base;
    return base.filter((r) => Number(r.score) === filterStar);
  }, [loadedReviews, filterStar]);

  return (
    <section
      className="
        rounded-2xl overflow-hidden
        border bg-white text-gray-900
        border-gray-200
        dark:border-white/12 dark:bg-[#0f1012]/90 dark:text-white
        backdrop-blur-md shadow-[0_24px_80px_-30px_rgba(0,0,0,0.08)]
        dark:shadow-[0_24px_80px_-30px_rgba(0,0,0,0.75)]
      "
    >
      <div className="px-4 pt-4 pb-2">
        <h2 className="text-[15px] font-semibold tracking-wide uppercase">
          Đánh giá
        </h2>
      </div>
      <Hairline />

      <div className="p-4">
        <div
          className="
            relative overflow-hidden rounded-xl p-4
            border bg-gray-50 border-gray-200
            shadow-[0_16px_52px_-24px_rgba(0,0,0,0.06)]
            dark:border-white/12 dark:bg-white/[0.03]
            dark:shadow-[0_16px_52px_-24px_rgba(0,0,0,0.65)]
          "
        >
          <div className="pointer-events-none absolute -top-24 -right-16 h-48 w-48 rounded-full bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.06),transparent_60%)] blur-2xl dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.16),transparent_60%)]" />
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-[30px] leading-none font-extrabold tabular-nums bg-clip-text text-transparent bg-gradient-to-br from-black to-black/60 dark:from-white dark:to-white/60">
                {ratingSummary?.ratingAvg != null
                  ? ratingSummary.ratingAvg.toFixed(1)
                  : "0.0"}
              </span>
              <div>
                <div className="text-yellow-400 flex items-center gap-0.5">
                  {renderStars(ratingSummary?.ratingAvg ?? 0, 16)}
                </div>
                <div className="mt-1 text-[11px] text-gray-600 dark:text-white/70">
                  {scoreKeys.reduce(
                    (s, k) => s + (ratingSummary?.scoreDistribution?.[k] ?? 0),
                    0
                  )}{" "}
                  lượt đánh giá
                </div>
              </div>
            </div>

            <div className="w-full md:w-[380px] space-y-1.5">
              {scoreKeys.map((k) => {
                const item = (ratingSummary &&
                  ratingSummary.scoreDistribution &&
                  (() => {
                    const count = ratingSummary.scoreDistribution[k] ?? 0;
                    const total = scoreKeys.reduce(
                      (s, kk) =>
                        s + (ratingSummary.scoreDistribution?.[kk] ?? 0),
                      0
                    );
                    const pct = total === 0 ? 0 : (count / total) * 100;
                    return { percentage: +pct.toFixed(2) };
                  })()) || { percentage: 0 };

                return (
                  <div key={k} className="flex items-center gap-2 text-[12px]">
                    <span className="w-3 text-right text-gray-700 dark:text-white">
                      {k}
                    </span>
                    <div className="relative flex-1 h-1.5 rounded-full bg-gray-200 overflow-hidden dark:bg-white/10">
                      <div
                        className="absolute inset-y-0 left-0 rounded-full bg-yellow-400"
                        style={{ width: `${item.percentage}%` }}
                      />
                      <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-black/10 dark:ring-white/10 pointer-events-none" />
                    </div>
                    <span className="w-10 text-right tabular-nums text-gray-600 dark:text-gray-300">
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
        <div
          className="
            rounded-2xl overflow-hidden
            border bg-white border-gray-200
            shadow-[0_16px_52px_-24px_rgba(0,0,0,0.06)]
            dark:border-white/12 dark:bg-white/[0.03]
            dark:shadow-[0_16px_52px_-24px_rgba(0,0,0,0.65)]
          "
        >
          <div className="p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  className="h-8 w-8 rounded-full object-cover bg-white"
                  src={auth?.user?.avatarUrl || DefaultAvatar}
                  alt="avatar"
                />
                <div>
                  <div className="text-[12px] font-semibold text-gray-900 dark:text-white">
                    {auth?.user?.userName ?? "Bạn"}
                  </div>
                  <div className="mt-0.5 text-yellow-400 flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon
                        key={star}
                        className={`w-4 h-4 cursor-pointer transition-all ${
                          (hoverRating || ratingRequest.score) >= star
                            ? "text-yellow-400 fill-yellow-400 scale-110"
                            : "text-gray-300 fill-gray-300"
                        }`}
                        fill="currentColor"
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
                className="
                  rounded-xl transition-shadow
                  border bg-white
                  border-gray-200
                  focus-within:border-gray-300 focus-within:ring-2 focus-within:ring-black/10
                  shadow-[0_0_0_0_rgba(0,0,0,0)] focus-within:shadow-[0_12px_36px_-20px_rgba(0,0,0,0.18)]
                  dark:bg-black/25 dark:border-white/15 dark:focus-within:border-white/40 dark:focus-within:ring-white/25
                  dark:shadow-none dark:focus-within:shadow-[0_12px_36px_-20px_rgba(255,255,255,0.35)]
                "
              >
                <textarea
                  value={(ratingRequest.content ?? "").slice(0, MAX_LEN)}
                  onChange={(e) => {
                    const next = e.target.value.slice(0, MAX_LEN);
                    setRatingRequest((prev) => ({ ...prev, content: next }));
                  }}
                  placeholder="Viết đánh giá của bạn (tối đa 750 ký tự)..."
                  maxLength={MAX_LEN}
                  className="w-full h-20 p-3 text-[13px] bg-transparent rounded-xl resize-none focus:outline-none text-gray-900 dark:text-white"
                />
                <div className="flex items-center justify-end px-3 pb-2 -mt-1">
                  <span className="text-[11px] tabular-nums text-gray-500 dark:text-white/60">
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
                    "shadow-[0_10px_24px_rgba(0,0,0,0.12)] dark:shadow-[0_10px_24px_rgba(255,255,255,0.18)]",
                    "transition-colors duration-300",
                  ].join(" ")}
                >
                  {myRating ? `Cập nhật` : `Gửi đánh giá`}
                </Button>
              </div>
            </div>
          </div>

          <Hairline />

          <div className="divide-y divide-gray-200 dark:divide-white/10">
            {isRatingLoading && loadedReviews.length === 0 ? (
              <div className="p-4 space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-14 rounded-md bg-gray-100 animate-pulse dark:bg-white/6"
                  />
                ))}
              </div>
            ) : displayed.length ? (
              displayed.map((rev) => {
                const isMine = myRating && rev.ratingId === myRating.ratingId;
                return (
                  <div
                    key={rev.ratingId}
                    className="p-4 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition"
                  >
                    <div className="flex items-start gap-2.5">
                      <ClickableUserInfo
                        username={rev.author?.userName || rev.author?.username}
                        displayName={
                          rev.author?.DisplayName ||
                          rev.author?.displayName ||
                          "Người dùng"
                        }
                        avatarUrl={
                          rev.author?.avatarUrl ||
                          rev.author?.avatar ||
                          DefaultAvatar
                        }
                        size="small"
                        showUsername={false}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[13px] font-semibold text-gray-900 dark:text-white">
                            {rev.author?.displayName ?? "Người dùng"}
                          </span>
                          <div className="text-yellow-400 flex items-center">
                            {renderStars(rev.score, 14)}
                            <span className="ml-2 text-[11px] text-gray-500 dark:text-gray-400">
                              {!rev.updatedAt
                                ? formatTicksToRelativeTime(rev.createdAt)
                                : formatTicksToRelativeTime(rev.updatedAt)}
                            </span>
                            {isMine && (
                              <button
                                onClick={() =>
                                  handleDeleteNovelRating(rev.ratingId)
                                }
                                className="ml-3 text-[11px] text-red-600 hover:underline dark:text-red-400"
                              >
                                Xoá
                              </button>
                            )}
                          </div>
                        </div>
                        {rev.content && (
                          <p className="mt-0.5 text-[13px] text-gray-800 dark:text-gray-200 whitespace-pre-line">
                            {rev.content}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-4 text-center text-[13px] text-gray-600 dark:text-white/70">
                Chưa có đánh giá nào.
              </div>
            )}
          </div>

          {ratingData?.hasMore && (
            <div className="p-3">
              <Button
                onClick={() =>
                  setLoadMoreParams((prev) => ({
                    ...prev,
                    afterId: ratingData.nextAfterId,
                  }))
                }
                isLoading={isRatingFetching}
                disabled={isRatingFetching}
                className="
                  w-full rounded-full text-[12.5px] font-semibold
                  px-3 py-2 border bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-900
                  shadow-[0_10px_28px_-18px_rgba(0,0,0,0.08)]
                  dark:border-white/12 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] dark:text-white
                  dark:shadow-[0_10px_28px_-18px_rgba(255,255,255,0.25)]
                  transition
                "
              >
                Xem thêm đánh giá
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default RatingSection;
