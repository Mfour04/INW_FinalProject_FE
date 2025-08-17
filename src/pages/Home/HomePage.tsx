import Typography from "../../components/TypographyComponent";
import ArrowLeftIcon from "../../assets/svg/HomePage/arrow-left-01-stroke-rounded.svg";
import BubbleChat from "../../assets/svg/HomePage/bubble-chat-stroke-rounded.svg";
import PencilEdit from "../../assets/svg/HomePage/pencil-edit-01-stroke-rounded.svg";
import ArrowRightIcon from "../../assets/svg/HomePage/arrow-right-01-stroke-rounded.svg";
import TrendingUp from "@mui/icons-material/TrendingUp";
import StarRate from "@mui/icons-material/StarRate";
import MenuBook from "@mui/icons-material/MenuBook";
import RemoveRedEye from "@mui/icons-material/RemoveRedEye";
import BookMark from "@mui/icons-material/Bookmark";
import { useMutation, useQuery } from "@tanstack/react-query";
import { GetNovels, GetRecommendedNovels } from "../../api/Novels/novel.api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TagView } from "../../components/TagComponent";
import { useAuth } from "../../hooks/useAuth";
import { FavouriteTypeModal } from "./FavoriteTypeModal";
import { getTags } from "../../api/Tags/tag.api";
import type { Tag } from "../../entity/tag";
import { UpdateUser } from "../../api/User/user.api";
import { urlToFile } from "../../utils/img";
import { useToast } from "../../context/ToastContext/toast-context";

export const SORT_BY_FIELDS = {
  CREATED_AT: "created_at",
  TOTAL_VIEWS: "total_views",
  RATING_AVG: "rating_avg",
};

export const SORT_DIRECTIONS = {
  ASC: "asc",
  DESC: "desc",
};

export const HomePage = () => {
  const [nNovelsIndex, setNNovelsIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const visibleCount = 5;

  const navigate = useNavigate();

  const { auth } = useAuth();
  const toast = useToast();

  const useSortedNovels = (
    sortBy: string,
    direction: string,
    page: number = 0,
    limit: number = 10
  ) =>
    useQuery({
      queryKey: ["novels", sortBy, direction],
      queryFn: () =>
        GetNovels({
          page: page,
          limit: limit,
          sortBy: `${sortBy}:${direction}`,
        }).then((res) => res.data.data.novels),
    });

  const { data: tagData } = useQuery({
    queryKey: ["home-tags"],
    queryFn: () => getTags().then((res) => res.data.data),
  });

  const { data: recommendNovels } = useQuery({
    queryKey: ["recommendedNovels", { topN: 10 }],
    queryFn: () =>
      GetRecommendedNovels({ topN: 10 }).then((res) => res.data.data),
  });

  const maxIndex = Math.max(
    0,
    (recommendNovels?.novels?.length || 0) - visibleCount
  );

  const updateUserMutation = useMutation({
    mutationFn: (body: FormData) => UpdateUser(body),
    onSuccess: () => {
      setShowModal(false);
      toast?.onOpen("Thêm các thể loại yêu thích thành công");
    },
    onError: () => {
      toast?.onOpen("Có lỗi xảy ra khi thêm thể loại yêu thích");
    },
  });

  const { isLoading: isTrendingLoading, data: trendingData } = useSortedNovels(
    SORT_BY_FIELDS.CREATED_AT,
    SORT_DIRECTIONS.DESC,
    0,
    5
  );

  const { isLoading: isMostViewedLoading, data: mostViewed } = useSortedNovels(
    SORT_BY_FIELDS.TOTAL_VIEWS,
    SORT_DIRECTIONS.DESC,
    0,
    5
  );
  const { isLoading: isTopRatedLoading, data: topRated } = useSortedNovels(
    SORT_BY_FIELDS.RATING_AVG,
    SORT_DIRECTIONS.DESC,
    0,
    5
  );

  const handleNextNovels = () => {
    if (trendingData && nNovelsIndex < trendingData.length - 1) {
      setNNovelsIndex((prev) => prev + 1);
    } else if (trendingData && nNovelsIndex == trendingData.length - 1) {
      setNNovelsIndex(0);
    }
  };

  const handlePrevNovels = () => {
    if (nNovelsIndex > 0) {
      setNNovelsIndex((prev) => prev - 1);
    } else if (trendingData && nNovelsIndex == 0) {
      setNNovelsIndex(trendingData?.length - 1);
    }
  };

  const handleSlide = (direction: "left" | "right") => {
    setCurrentIndex((prev) => {
      const next =
        direction === "right"
          ? Math.min(prev + 1, maxIndex)
          : Math.max(prev - 1, 0);
      return next;
    });
  };

  const handleConfirmFavourite = async (selectedTypes: Tag[]) => {
    const formData = new FormData();

    if (auth?.user) {
      formData.append("userId", auth.user.userId);
      formData.append("displayName", auth.user.displayName);
      formData.append("bio", auth.user.bio!);
      selectedTypes.forEach((type) => {
        formData.append("favouriteType", type.tagId);
      });
    }

    if (auth?.user.badgeId) {
      auth.user.badgeId.forEach((id: string) => {
        formData.append("badgeId", id);
      });
    }

    if (auth?.user.avatarUrl) {
      const avatarImg = await urlToFile(auth.user.avatarUrl);
      if (avatarImg) {
        formData.append("avatarUrl", avatarImg);
      } else {
        formData.append("avatarUrl", "");
      }
    } else {
      formData.append("avatarUrl", "");
    }

    updateUserMutation.mutate(formData);
  };

  useEffect(() => {
    if (
      auth?.user &&
      Array.isArray(auth.user.favouriteType) &&
      auth.user.favouriteType.length === 0
    ) {
      setShowModal(true);
    }
  }, [auth]);

  return (
    <div>
      <div className="flex-col items-center px-[50px] bg-white dark:text-white dark:bg-[#0f0f11] justify-between">
        <Typography variant="h4" size="large" className="my-4">
          Truyện Vừa Ra Mắt
        </Typography>
        <div className="lg:h-[412px] w-full flex flex-col lg:flex-row bg-[#1c1c1f] rounded-[10px] border border-black overflow-hidden">
          <img
            onClick={() =>
              navigate(`/novels/${trendingData?.[nNovelsIndex].slug}`)
            }
            src={trendingData?.[nNovelsIndex].novelImage || undefined}
            className="cursor-pointer w-1/4 lg:w-1/4 h-52 lg:h-auto object-cover bg-[#d9d9d9]"
          />

          <div className="p-4 flex flex-col flex-1 min-w-0">
            <Typography variant="h3" size="large" className="mb-2 line-clamp-1">
              {isTrendingLoading
                ? "Đang tải..."
                : trendingData?.[nNovelsIndex].title}
            </Typography>

            <div className="flex flex-wrap gap-2 mb-4">
              {trendingData?.[nNovelsIndex].tags.map((tag) => (
                <TagView key={tag.tagId} tag={tag} />
              ))}
            </div>
            <Typography
              variant="p"
              size="small"
              className="mb-4 line-clamp-2 lg:line-clamp-7"
            >
              {isTrendingLoading
                ? "Đang tải..."
                : trendingData?.[nNovelsIndex].description}
            </Typography>

            <div className="flex justify-between items-center mt-auto pt-2 text-white">
              <div className="italic text-lg">Iris Cavana</div>
              <div className="flex items-center gap-4">
                <div className="text-[#ff6740]">NO.{nNovelsIndex + 1}</div>
                <button className="cursor-pointer" onClick={handlePrevNovels}>
                  <img src={ArrowLeftIcon} alt="left" />
                </button>
                <button className="cursor-pointer" onClick={handleNextNovels}>
                  <img src={ArrowRightIcon} alt="right" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="my-8 h-[595px] w-full border border-black bg-[#1c1c1f] gap-5 flex rounded-[10px]">
          <div className="w-1/3">
            <div className="h-14 bg-[#585876] rounded-[10px] flex gap-4 items-center justify-center">
              <MenuBook />
              <Typography>ĐỌC NHIỀU NHẤT</Typography>
              <img src={ArrowRightIcon} alt="right" />
            </div>
            {isMostViewedLoading ? (
              <div className="text-white px-5 mt-4">Đang tải...</div>
            ) : (
              mostViewed?.map((novel) => (
                <div
                  onClick={() => navigate(`/novels/${novel.slug}`)}
                  key={novel.novelId}
                  className="h-[88px] mt-[15px] px-5 py-1 flex"
                >
                  <div className="bg-[#d9d9d9] h-[80px] min-w-[60px] rounded-[10px] overflow-hidden">
                    {novel.novelImage && (
                      <img
                        src={novel.novelImage}
                        alt={novel.title}
                        className="h-full w-[60px] object-cover rounded-[10px]"
                      />
                    )}
                  </div>
                  <div className="mx-2.5 mt-1">
                    <div className="text-[15px] py-[1px] line-clamp-1">
                      {novel.title}
                    </div>
                    <div className="text-[12px] py-[1px] flex items-center gap-1 truncate">
                      <RemoveRedEye sx={{ height: "20px" }} />
                      {novel.totalViews}
                    </div>
                    <div className="text-[12px] py-[1px] flex items-center gap-1 truncate w-full">
                      <BookMark sx={{ height: "20px" }} /> {novel.ratingCount}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="w-1/3">
            <div className="h-14 bg-[#585876] rounded-[10px] flex gap-4 items-center justify-center">
              <TrendingUp />
              <Typography>XU HƯỚNG MỚI</Typography>
              <img src={ArrowRightIcon} alt="right" />
            </div>
            {isTrendingLoading ? (
              <div className="text-white px-5 mt-4">Đang tải...</div>
            ) : (
              trendingData?.map((novel) => (
                <div
                  onClick={() => navigate(`/novels/${novel.slug}`)}
                  key={novel.novelId}
                  className="h-[88px] mt-[15px] px-5 py-1 flex"
                >
                  <div className="bg-[#d9d9d9] h-[80px] min-w-[60px] rounded-[10px] overflow-hidden">
                    {novel.novelImage && (
                      <img
                        src={novel.novelImage}
                        alt={novel.title}
                        className="h-full w-[60px] object-cover rounded-[10px]"
                      />
                    )}
                  </div>
                  <div className="mx-2.5 mt-1">
                    <div className="text-[15px] py-[1px] line-clamp-1">
                      {novel.title}
                    </div>
                    <div className="text-[12px] py-[1px] flex items-center gap-1">
                      <img className="h-5" src={BubbleChat} />
                      {novel.totalViews}
                    </div>
                    <div className="text-[13px] py-[1px] flex items-center gap-1">
                      <img className="h-5" src={PencilEdit} />
                      {novel.totalViews}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="w-1/3">
            <div className="h-14 bg-[#585876] rounded-[10px] flex gap-4 items-center justify-center">
              <StarRate />
              <Typography>ĐÁNH GIÁ CAO</Typography>
              <img src={ArrowRightIcon} alt="right" />
            </div>
            {isTopRatedLoading ? (
              <div className="text-white px-5 mt-4">Đang tải...</div>
            ) : (
              topRated?.map((novel) => (
                <div
                  onClick={() => navigate(`/novels/${novel.slug}`)}
                  key={novel.novelId}
                  className="h-[88px] mt-[15px] px-5 py-1 flex"
                >
                  <div className="bg-[#d9d9d9] h-[80px] min-w-[60px] rounded-[10px] overflow-hidden">
                    {novel.novelImage && (
                      <img
                        src={novel.novelImage}
                        alt={novel.title}
                        className="h-full w-[60px] object-cover rounded-[10px]"
                      />
                    )}
                  </div>
                  <div className="mx-2.5 mt-1">
                    <div className="text-[15px] py-[1px] line-clamp-1">
                      {novel.title}
                    </div>
                    <div className="text-[13px] py-[1px] flex items-center gap-1">
                      <StarRate sx={{ height: "20px" }} />
                      {novel.ratingCount}
                    </div>
                    <div className="text-[13px] py-[1px] flex items-center gap-1">
                      <img className="h-5" src={PencilEdit} />
                      {novel.totalViews}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {recommendNovels?.novels && (
          <div className="h-[490px] w-full flex flex-col relative">
            <div className="py-6">
              <Typography variant="h4" size="large">
                InkWave Đề cử
              </Typography>
            </div>

            {/* Nút trái */}
            <button
              onClick={() => handleSlide("left")}
              className="absolute left-0 top-[50%] -translate-y-1/2 bg-white/80 px-2 py-1 rounded-full shadow z-10"
            >
              ◀
            </button>

            {/* Novel list */}
            <div className="gap-12 flex overflow-x-hidden max-w-screen transition-all duration-300">
              {recommendNovels?.novels
                ?.slice(currentIndex, currentIndex + visibleCount)
                .map((novel) => (
                  <img
                    key={novel.novelId}
                    src={novel.novelImage || undefined}
                    onClick={() => navigate(`/novels/${novel.slug}`)}
                    className="h-[280px] w-[160px] bg-[#d9d9d9] rounded-[10px] shrink-0"
                  />
                ))}
            </div>

            {/* Nút phải */}
            <button
              onClick={() => handleSlide("right")}
              className="absolute right-0 top-[50%] -translate-y-1/2 bg-white/80 px-2 py-1 rounded-full shadow z-10"
            >
              ▶
            </button>
          </div>
        )}

        {/* <div className="h-[625px] w-full flex-col">
          <div className="py-6">
            <Typography variant="h4" size="large">
              Truyện mới cập nhật
            </Typography>
          </div>
          <div>
            <div className="h-64 gap-12 flex max-w-screen overflow-x-hidden">
              <img className="h-[180px] w-[100px] bg-[#d9d9d9] rounded-[10px]" />
              <img className="h-[180px] w-[100px] bg-[#d9d9d9] rounded-[10px]" />
              <img className="h-[180px] w-[100px] bg-[#d9d9d9] rounded-[10px]" />
              <img className="h-[180px] w-[100px] bg-[#d9d9d9] rounded-[10px]" />
              <img className="h-[180px] w-[100px] bg-[#d9d9d9] rounded-[10px]" />
              <img className="h-[180px] w-[100px] bg-[#d9d9d9] rounded-[10px]" />
              <img className="h-[180px] w-[100px] bg-[#d9d9d9] rounded-[10px]" />
            </div>
            <div className="h-64 gap-12 flex max-w-screen overflow-x-hidden">
              <div className="h-[180px] w-[100px] bg-[#d9d9d9] rounded-[10px]" />
              <div className="h-[180px] w-[100px] bg-[#d9d9d9] rounded-[10px]" />
              <div className="h-[180px] w-[100px] bg-[#d9d9d9] rounded-[10px]" />
              <div className="h-[180px] w-[100px] bg-[#d9d9d9] rounded-[10px]" />
              <div className="h-[180px] w-[100px] bg-[#d9d9d9] rounded-[10px]" />
              <div className="h-[180px] w-[100px] bg-[#d9d9d9] rounded-[10px]" />
              <div className="h-[180px] w-[100px] bg-[#d9d9d9] rounded-[10px]" />
            </div>
          </div>
        </div> */}
      </div>

      {showModal && (
        <FavouriteTypeModal
          allTypes={tagData!}
          selected={auth?.user?.favouriteType ?? []}
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirmFavourite}
          isLoading={updateUserMutation.isPending}
        />
      )}
    </div>
  );
};
