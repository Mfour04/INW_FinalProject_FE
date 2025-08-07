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
  GetNovelRating,
  type GetNovelRatingParams,
} from "../../../api/Rating/rating.api";
import type { Novel } from "../../../entity/novel";
import type { CreateNovelRatingRequest } from "../../../api/Rating/rating.type";
import { useToast } from "../../../context/ToastContext/toast-context";
import { formatTicksToRelativeTime } from "../../../utils/date_format";

const ratings = [
  { star: 5, percentage: 66 },
  { star: 4, percentage: 19 },
  { star: 3, percentage: 8 },
  { star: 2, percentage: 3 },
  { star: 1, percentage: 4 },
];

const initialNovelRatingRequest: CreateNovelRatingRequest = {
  novelId: "",
  score: 0,
  ratingContent: null,
};

export type RatingSectionProps = {
  novelInfo: Novel;
};

const RatingSection = ({ novelInfo }: RatingSectionProps) => {
  const [overallRating] = useState(4.4);
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

  const { data: ratingData, isLoading: isRatingLoading } = useQuery({
    queryKey: ["ratingNovels", novelInfo.novelId!],
    queryFn: () =>
      GetNovelRating(novelInfo?.novelId!, params).then((res) => res.data.data),
    enabled: !!novelInfo.novelId,
  });

  const CreateNovelRatingMutation = useMutation({
    mutationFn: (request: CreateNovelRatingRequest) =>
      CreateNovelRating(request),
    onSuccess: (data) => {
      toast?.onOpen(data.data.message);
    },
  });

  const handleSendReview = () => {
    if (ratingRequest.score === 0) {
      toast?.onOpen("Bạn cần phải đánh giá trước!");
      return;
    }
    if (ratingRequest.ratingContent?.trim().length === 0)
      setRatingRequest((prev) => ({
        ...prev,
        ratingContent: null,
      }));
    CreateNovelRatingMutation.mutate(ratingRequest);
    setRatingRequest(initialNovelRatingRequest);
  };

  const renderStars = (count: number, size: number) =>
    Array.from({ length: 5 }, (_, i) => {
      return (
        <Star
          key={i}
          style={{ fontSize: size }}
          className={`inline-block ${
            i < count ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }`}
        />
      );
    });

  useEffect(() => {
    if (novelInfo?.novelId) {
      setRatingRequest((prev) => ({
        ...prev,
        novelId: novelInfo.novelId,
      }));
    }
  }, [novelInfo?.novelId]);

  return (
    <div className="p-6 mx-auto border border-black rounded shadow bg-[#1e1e21]">
      {/* {auth?.user } */}
      <div className="p-4 flex justify-between gap-2 font-semibold border-b border-gray-600">
        <div className="flex flex-col  gap-10">
          <div className="flex items-center gap-10">
            <span className="text-gray-200 text-5xl">
              {overallRating.toFixed(1)}
            </span>
            <div className="text-yellow-400 flex">{renderStars(4, 40)}</div>
          </div>
        </div>
        <div className=" w-[350px] rounded-md space-y-2">
          {ratings.map((rating) => (
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
              <span className="w-8 text-right">{rating.percentage} %</span>
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
              value={ratingRequest.ratingContent ?? ""}
              onChange={(e) =>
                setRatingRequest((prev) => ({
                  ...prev,
                  ratingContent: e.target.value,
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
            Gửi đánh giá
          </Button>
        </div>
      </div>

      <div className="mt-8 border-t pt-4 border-gray-600">
        {isRatingLoading ? (
          <div>Đang tải đánh giá</div>
        ) : (
          <div>
            {ratingData?.ratings.map((rev, idx) => (
              <div key={idx} className="mb-6">
                <div className="flex items-center gap-2 font-semibold">
                  <img
                    className="h-15 w-15 rounded-full object-cover cursor-pointer bg-white"
                    src={DefaultAvatar}
                  />
                  <div className="flex flex-col">
                    <span>{rev.displayName}</span>
                    <div className="text-yellow-400 flex">
                      {renderStars(rev.score, 20)}
                      <div className="text-xs text-gray-500 mt-1 ml-2">
                        {formatTicksToRelativeTime(rev.updatedAt)}
                      </div>
                    </div>
                  </div>
                </div>
                <p className="ml-15 text-sm whitespace-pre-line mt-1">
                  {rev.ratingContent}
                </p>
              </div>
            ))}
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
                  /{ratingData?.totalPages}
                </span>
              </div>
              <button
                onClick={() =>
                  setParams((prev) => ({
                    ...prev,
                    page: (prev.page ?? 0) + 1,
                  }))
                }
                disabled={params.page === (ratingData?.totalPages ?? 1) - 1}
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
