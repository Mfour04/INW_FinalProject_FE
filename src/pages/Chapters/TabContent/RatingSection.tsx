import { useEffect, useState } from "react";
import Star from "@mui/icons-material/Star";
import Button from "../../../components/ButtonComponent";
import DefaultAvatar from "../../../assets/img/default_avt.png";
import ArrowLeft02 from "../../../assets/svg/Novels/arrow-left-02-stroke-rounded.svg";
import ArrowRight02 from "../../../assets/svg/Novels/arrow-right-02-stroke-rounded.svg";
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

const scoreKeys = ["1", "2", "3", "4", "5"] as const;

const initialNovelRatingRequest: CreateNovelRatingRequest = {
  novelId: "",
  score: 0,
  content: null,
};

export type RatingSectionProps = {
  novelInfo: Novel;
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

  const { auth } = useAuth();
  const toast = useToast();

  const {
    data: ratingData,
    isLoading: isRatingLoading,
    refetch: refetchRatingData,
  } = useQuery({
    queryKey: ["ratingNovels", novelInfo.novelId!],
    queryFn: () =>
      GetNovelRating(novelInfo?.novelId!, params).then((res) => res.data.data),
    enabled: !!novelInfo.novelId,
  });

  const isMyRating = ratingData?.ratings.find(
    (rating) => rating.author.id === auth?.user.userId
  );

  const {
    data: ratingSummary,
    isLoading: isRatingSumLoading,
    refetch: refetchRatingSummary,
  } = useQuery({
    queryKey: ["ratingSummary", novelInfo.novelId!],
    queryFn: () =>
      GetNovelRatingSummary(novelInfo.novelId).then((res) => res.data.data),
    enabled: !!novelInfo.novelId,
  });

  const ratingsDistribution = ratingSummary?.scoreDistribution ?? {};

  const totalRating = scoreKeys.reduce(
    (sum, key) => sum + (ratingsDistribution[key] ?? 0),
    0
  );

  const percentages = scoreKeys.map((key) => {
    const count = ratingsDistribution[key] ?? 0;
    const percentage = totalRating === 0 ? 0 : (count / totalRating) * 100;

    return {
      star: key,
      count,
      percentage: +percentage.toFixed(2),
    };
  });

  const CreateNovelRatingMutation = useMutation({
    mutationFn: (request: CreateNovelRatingRequest) =>
      CreateNovelRating(request),
    onSuccess: (data) => {
      toast?.onOpen(data.data.message);
      refetchRatingData();
      refetchRatingSummary();
    },
  });

  const UpdateNovelRatingMutation = useMutation({
    mutationFn: (request: UpdateNovelRatingRequest) =>
      UpdateNovelRating(request),
    onSuccess: (data) => {
      toast?.onOpen(data.data.message);
      refetchRatingData();
      refetchRatingSummary();
    },
  });

  const DeleteNovelRatingMutation = useMutation({
    mutationFn: (request: DeleteNovelRatingRequest) =>
      DeleteNovelRating(request),
    onSuccess: (data) => {
      toast?.onOpen(data.data.message);
      refetchRatingData();
      refetchRatingSummary();
      setRatingRequest(initialNovelRatingRequest);
    },
  });

  const handleSendReview = () => {
    if (ratingRequest.score === 0) {
      toast?.onOpen("Bạn cần phải đánh giá trước!");
      return;
    }
    if (ratingRequest.content?.trim().length === 0)
      setRatingRequest((prev) => ({
        ...prev,
        ratingContent: null,
      }));
    if (isMyRating) {
      const updateRequest: UpdateNovelRatingRequest = {
        ratingId: isMyRating.ratingId,
        novelId: ratingRequest.novelId,
        score: ratingRequest.score,
        content: ratingRequest.content,
      };
      UpdateNovelRatingMutation.mutate(updateRequest);
    } else {
      CreateNovelRatingMutation.mutate(ratingRequest);
    }
    setRatingRequest(initialNovelRatingRequest);
  };

  const handleDeleteNovelRating = (ratingId: string) => {
    DeleteNovelRatingMutation.mutate({
      novelId: novelInfo.novelId!,
      ratingId: ratingId,
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
              style={{
                fontSize: size,
                clipPath: "inset(0 50% 0 0)",
              }}
              className="absolute text-yellow-400 fill-yellow-400"
            />
          </span>
        );
      } else {
        // empty star
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
      setRatingRequest((prev) => ({
        ...prev,
        novelId: novelInfo.novelId,
      }));
    }
  }, [novelInfo?.novelId]);

  useEffect(() => {
    if (isMyRating)
      setRatingRequest({
        content: isMyRating?.content,
        novelId: isMyRating?.novelId,
        score: isMyRating?.score,
      });
  }, [isMyRating]);

  return (
    <div className="p-6 mx-auto border border-black rounded shadow bg-[#1e1e21]">
      {/* {auth?.user } */}
      <div className="p-4 flex justify-between gap-2 font-semibold border-b border-gray-600">
        <div className="flex flex-col  gap-10">
          <div className="flex items-center gap-10">
            <span className="text-gray-200 text-5xl">
              {ratingSummary?.ratingAvg.toFixed(1)}
            </span>
            <div className="text-yellow-400 flex">
              {renderStars(ratingSummary?.ratingAvg!, 40)}
            </div>
          </div>
        </div>
        <div className=" w-[350px] rounded-md space-y-2">
          {percentages.map((rating) => (
            <div
              key={rating.star}
              className="flex items-center gap-3 text-sm text-white"
            >
              <span className="w-4 text-right">{rating.star}</span>
              <div className="flex-1 h-2 bg-gray-700 rounded-full relative">
                <div
                  className="absolute h-2 bg-yellow-400 rounded-full"
                  style={{ width: `${rating.percentage}%` }}
                />
              </div>
              <span className="w-10 text-right">{rating.percentage} %</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6  flex flex-col gap-6">
        <div className="text-2xl font-bold">Đánh giá của tôi</div>
        <div className="bg-[#2e2e2e] rounded w-full">
          <div className="p-4 flex items-center gap-2.5">
            <img
              className="h-15 w-15 rounded-full object-cover cursor-pointer bg-white"
              src={auth?.user.avatarUrl || DefaultAvatar}
            />
            <div>
              <div>{auth?.user.userName}</div>
              <div className="flex items-center justify-center ">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-6 h-6 cursor-pointer transition-colors ${
                      (hoverRating || ratingRequest.score) >= star
                        ? "text-yellow-400 fill-yellow-400"
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
          <div className="pb-4 px-4">
            <textarea
              value={ratingRequest.content ?? ""}
              onChange={(e) =>
                setRatingRequest((prev) => ({
                  ...prev,
                  content: e.target.value,
                }))
              }
              placeholder="Viết đánh giá của bạn..."
              className=" w-full h-20 p-3 bg-[#1e1e21]  rounded resize-none focus:outline-none focus:ring-2 "
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={handleSendReview}
            isLoading={CreateNovelRatingMutation.isPending}
            className="bg-[#ff6740] text-white px-5 py-2 rounded hover:bg-orange-600 border-none"
          >
            {isMyRating ? `Cập nhật đánh giá` : `Gửi đánh giá`}
          </Button>
        </div>
      </div>

      <div className="mt-8 border-t pt-4 border-gray-600">
        {isRatingLoading ? (
          <div>Đang tải đánh giá</div>
        ) : (
          <div>
            {ratingData?.ratings?.map((rev, idx) => {
              const isMine = isMyRating && rev.ratingId === isMyRating.ratingId;

              return (
                <div key={idx} className="mb-6">
                  <div className="flex items-center gap-2 font-semibold">
                    <img
                      className="h-15 w-15 rounded-full object-cover cursor-pointer bg-white"
                      src={DefaultAvatar}
                    />
                    <div className="flex flex-col">
                      <span>{rev.author.displayName}</span>
                      <div className="text-yellow-400 flex items-center">
                        {renderStars(rev.score, 20)}
                        <div className="text-xs text-gray-500 mt-1 ml-2">
                          {!rev.updatedAt
                            ? formatTicksToRelativeTime(rev.createdAt)
                            : formatTicksToRelativeTime(rev.updatedAt)}
                        </div>
                        {isMine && (
                          <button
                            onClick={() =>
                              handleDeleteNovelRating(rev.ratingId)
                            }
                            className="text-red-500 text-xs ml-3 hover:underline cursor-pointer mt-1"
                          >
                            Xoá
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="ml-15 text-sm whitespace-pre-line mt-1">
                    {rev.content}
                  </p>
                </div>
              );
            })}
            <div className="mt-[30px] flex justify-center items-center gap-[25px] h-[50px]">
              <button
                onClick={() =>
                  setParams((prev) => ({
                    ...prev,
                    page: (prev.page ?? 0) - 1,
                  }))
                }
                disabled={params.page === 0}
                className="cursor-pointer h-[50px] w-[50px] flex items-center justify-center bg-[#2c2c2c] rounded-[50%] hover:bg-[#555555]"
              >
                <img src={ArrowLeft02} />
              </button>
              <div className="w-[200px] h-[50px] flex items-center justify-center bg-[#ff6740] rounded-[25px]">
                <span className="text-sm">
                  Trang{" "}
                  <span className="border-1 rounded-[5px] px-2.5">
                    {(params.page ?? 0) + 1}
                  </span>{" "}
                  /{ratingData?.totalPage}
                </span>
              </div>
              <button
                onClick={() =>
                  setParams((prev) => ({
                    ...prev,
                    page: (prev.page ?? 0) + 1,
                  }))
                }
                disabled={params.page === (ratingData?.totalPage ?? 1) - 1}
                className="cursor-pointer h-[50px] w-[50px] flex items-center justify-center bg-[#2c2c2c] rounded-[50%] hover:bg-[#555555]"
              >
                <img src={ArrowRight02} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RatingSection;
