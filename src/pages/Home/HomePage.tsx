import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { FavouriteTypeModal } from "./FavoriteTypeModal";
import { GetRecommendedNovels } from "../../api/Novels/novel.api";
import { getTags } from "../../api/Tags/tag.api";
import { UpdateUser } from "../../api/User/user.api";
import { urlToFile } from "../../utils/img";
import { useToast } from "../../context/ToastContext/toast-context";
import { TOKENS } from "./ui/tokens";
import { Hero } from "./components/Hero";
import { RecommendCarousel } from "./sections/RecommendCarousel";
import {
  useSortedNovels,
  SORT_BY_FIELDS,
  SORT_DIRECTIONS,
} from "./hooks/useSortedNovels";
import type { TagType as Tag, Novel } from "./types";

// === Lucide icons (thay thế toàn bộ MUI & svg cũ) ===
import {
  TrendingUp,
  Star,
  BookOpen,
  Eye,
  Bookmark,
  PencilLine,
} from "lucide-react";

import VerticalColumn from "./discovery/VerticalColumn";
import HorizontalRail from "./discovery/HorizontalRail";
import { Metric } from "./components/ListRow/Metric";

export const HomePage = () => {
  const [nNovelsIndex, setNNovelsIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const visibleCount = 5;

  const navigate = useNavigate();
  const { auth } = useAuth();
  const toast = useToast();

  const { data: tagData } = useQuery({
    queryKey: ["home-tags"],
    queryFn: () => getTags().then((res) => res.data.data),
    staleTime: 5 * 60_000,
  });

  const { data: recommend } = useQuery({
    queryKey: ["recommendedNovels", { topN: 10 }],
    queryFn: () =>
      GetRecommendedNovels({ topN: 10 }).then((res) => res.data.data),
    staleTime: 60_000,
  });

  const maxIndex = useMemo(
    () => Math.max(0, (recommend?.novels?.length || 0) - visibleCount),
    [recommend, visibleCount]
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

  const { data: trendingData } = useSortedNovels(
    SORT_BY_FIELDS.CREATED_AT,
    SORT_DIRECTIONS.DESC,
    0,
    15
  );
  const { data: mostViewed } = useSortedNovels(
    SORT_BY_FIELDS.TOTAL_VIEWS,
    SORT_DIRECTIONS.DESC,
    0,
    5
  );
  const { data: topRated } = useSortedNovels(
    SORT_BY_FIELDS.RATING_AVG,
    SORT_DIRECTIONS.DESC,
    0,
    5
  );

  const handleNextNovels = () => {
    const len = trendingData?.length || 0;
    if (!len) return;
    setNNovelsIndex((p) => (p + 1) % len);
  };
  const handlePrevNovels = () => {
    const len = trendingData?.length || 0;
    if (!len) return;
    setNNovelsIndex((p) => (p - 1 + len) % len);
  };
  const handleSlide = (dir: "left" | "right") =>
    setCurrentIndex((prev) =>
      dir === "right" ? Math.min(prev + 1, maxIndex) : Math.max(prev - 1, 0)
    );

  const handleConfirmFavourite = async (selectedTypes: Tag[]) => {
    const formData = new FormData();
    if (auth?.user) {
      formData.append("userId", auth.user.userId);
      formData.append("displayName", auth.user.displayName);
      formData.append("bio", auth.user.bio ?? "");
      selectedTypes.forEach((t) => formData.append("favouriteType", t.tagId));
    }
    if (auth?.user?.badgeId)
      auth.user.badgeId.forEach((id: string) => formData.append("badgeId", id));
    if (auth?.user?.avatarUrl) {
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

  const trending = (trendingData as Novel[]) ?? [];
  const hero = trending[nNovelsIndex];

  return (
    <div className="min-h-screen w-full bg-white text-white dark:bg-[#0f0f11]">
      <div className={`mx-auto ${TOKENS.container} px-6 lg:px-10 py-10`}>
        <Hero
          title="Truyện Vừa Ra Mắt"
          hero={hero}
          index={nNovelsIndex}
          onPrev={handlePrevNovels}
          onNext={handleNextNovels}
          onRead={() => {
            console.log(hero.slug);
            navigate(`/novels/${hero.slug}`);
          }}
        />

        <div className="mt-10 grid gap-7 md:grid-cols-2">
          <VerticalColumn
            title="Đọc nhiều nhất"
            icon={<BookOpen className="h-5 w-5 text-gray-700" />}
            items={(mostViewed as Novel[]) ?? []}
            onClickItem={(n) => navigate(`/novels/${n.slug ?? n.novelId}`)}
            leftMeta={(n) => (
              <Metric
                icon={<Eye className="h-4 w-4 shrink-0 text-gray-600" />}
                value={n.totalViews}
              />
            )}
            rightMeta={(n) => (
              <Metric
                icon={<Bookmark className="h-4 w-4 shrink-0 text-gray-600" />}
                value={n.ratingCount}
              />
            )}
          />

          <VerticalColumn
            title="Đánh giá cao"
            icon={<Star className="h-5 w-5 text-gray-700" fill="currentColor"/>} 
            items={(topRated as Novel[]) ?? []}
            onClickItem={(n) => navigate(`/novels/${n.slug ?? n.novelId}`)}
            leftMeta={(n) => (
              <Metric
                icon={
                  <Star
                    className="h-4 w-4 shrink-0 text-yellow-400"
                    fill="currentColor"
                    stroke="none"
                  />
                }
                value={n.ratingCount}
              />
            )}
            rightMeta={(n) => (
              <Metric
                icon={<PencilLine className="h-4 w-4 shrink-0 text-gray-600" />}
                value={n.totalViews}
              />
            )}
          />

          <HorizontalRail
            title="Xu hướng mới"
            icon={<TrendingUp className="h-4 w-4" />}
            items={trending}
            onClickItem={(n) => navigate(`/novels/${n.slug ?? n.novelId}`)}
            onSeeMore={() => navigate("/trending")}
          />
        </div>

        {recommend?.novels?.length ? (
          <div className="mt-10">
            <RecommendCarousel
              title="InkWave Đề cử"
              novels={recommend.novels as Novel[]}
              currentIndex={currentIndex}
              visibleCount={5}
              onPrev={() => handleSlide("left")}
              onNext={() => handleSlide("right")}
              onClickItem={(n) => navigate(`/novels/${n.slug ?? n.novelId}`)}
            />
          </div>
        ) : null}
      </div>

      {showModal && (
        <FavouriteTypeModal
          allTypes={tagData as any}
          selected={auth?.user?.favouriteType ?? []}
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirmFavourite}
          isLoading={updateUserMutation.isPending}
        />
      )}
    </div>
  );
};
