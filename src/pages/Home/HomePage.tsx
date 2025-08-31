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
import { Hero } from "./components/Hero";
// import { RecommendCarousel } from "./sections/RecommendCarousel";
import {
  useSortedNovels,
  SORT_BY_FIELDS,
  SORT_DIRECTIONS,
} from "./hooks/useSortedNovels";
import { useBreakpoint } from "./hooks/useBreakpoint";
import type { TagType as Tag } from "./types";

// === Lucide icons (thay thế toàn bộ MUI & svg cũ) ===
import {
  TrendingUp,
  Star,
  BookOpen,
  Eye,
  Bookmark,
  PencilLine,
  Lightbulb
} from "lucide-react";

import VerticalColumn from "./discovery/VerticalColumn";
import HorizontalRail from "./discovery/HorizontalRail";
import { Metric } from "./components/ListRow/Metric";
import type { Novel } from "../../entity/novel";
import { DESIGN_TOKENS } from "../../components/ui/tokens";
import { GetCurrentUserInfo } from "../../api/User/user-settings.api";

export const HomePage = () => {
  const [nNovelsIndex, setNNovelsIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const navigate = useNavigate();
  const { auth } = useAuth();
  const toast = useToast();
  const bp = useBreakpoint();

  const { data: user } = useQuery({
    queryKey: ["user-homepage"],
    queryFn: () => GetCurrentUserInfo().then((res) => res.data),
  });

  const visibleCount = useMemo(() => {
    if (bp.x4k) return 6;
    if (bp.x2k) return 5;
    if (bp.xl) return 5;
    if (bp.lg) return 4;
    if (bp.md) return 3; // tablet
    if (bp.sm) return 2; // mobile M/L
    return 1; // mobile S
  }, [bp]);

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
    10
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
      user &&
      Array.isArray(user.favouriteType) &&
      user.favouriteType.length === 0
    ) {
      setShowModal(true);
    }
  }, [user]);

  const trending = ((trendingData as Novel[]) ?? []).filter((n) => n.isPublic);
  const hero =
    trending.length > 0 ? trending[nNovelsIndex % trending.length] : undefined;

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white text-white dark:bg-[#0f0f11]">
      <div
        className={`${DESIGN_TOKENS.container} ${DESIGN_TOKENS.sectionPad} ${DESIGN_TOKENS.sectionY}`}
      >
        {hero ? (
          <Hero
            title="Truyện Vừa Ra Mắt"
            hero={hero}
            index={nNovelsIndex}
            onPrev={handlePrevNovels}
            onNext={handleNextNovels}
            onRead={() => {
              if (hero?.slug) navigate(`/novels/${hero.slug}`);
            }}
          />
        ) : null}

        <div className="mt-10 grid min-w-0 grid-cols-1 gap-7 sm:gap-8 lg:gap-10 md:grid-cols-12">
          <div className="min-w-0 md:col-span-6">
            <VerticalColumn
              title="Đọc nhiều nhất"
              icon={<BookOpen className="h-5 w-5 text-white" />}
              items={(mostViewed as Novel[]) ?? []}
              onClickItem={(n) => navigate(`/novels/${n.slug ?? n.novelId}`)}
              leftMeta={(n) => (
                <Metric
                  icon={
                    <Eye className="h-4 w-4 shrink-0 text-gray-600 dark:text-white/50" />
                  }
                  value={n.totalViews}
                />
              )}
              rightMeta={(n) => (
                <Metric
                  icon={
                    <Bookmark className="h-4 w-4 shrink-0 text-gray-600 dark:text-white/50" />
                  }
                  value={n.ratingCount}
                />
              )}
            />
          </div>

          <div className="min-w-0 md:col-span-6">
            <VerticalColumn
              title="Đánh giá cao"
              icon={<Star className="h-5 w-5 text-white" fill="currentColor" />}
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
                  value={n.ratingAvg}
                />
              )}
              rightMeta={(n) => (
                <Metric
                  icon={
                    <PencilLine className="h-4 w-4 shrink-0 text-gray-600 dark:text-white/50" />
                  }
                  value={n.ratingCount}
                />
              )}
            />
          </div>

          <div className="min-w-0 md:col-span-12">
            <HorizontalRail
              title="Xu hướng mới"
              icon={
                <TrendingUp className="h-4 w-4 shrink-0 text-black dark:text-white" />
              }
              items={trending}
              onClickItem={(n) => navigate(`/novels/${n.slug ?? n.novelId}`)}
              onSeeMore={() => navigate("/novels")}
            />
          </div>

          {recommend?.novels?.length ? (
          <div className="min-w-0 md:col-span-12">
            <HorizontalRail
              title="InkWave Đề cử"
              icon={
                <Lightbulb className="h-4 w-4 shrink-0 text-black dark:text-white" />
              }
              items={recommend.novels as Novel[]}
              onClickItem={(n) => navigate(`/novels/${n.slug ?? n.novelId}`)}
              onSeeMore={() => navigate("/novels/recommended")}
              // Bạn có thể chỉnh riêng tham số cho block này:
              // scrollStep={400}
              // cardWidth={176}
            />
          </div>
        ) : null}
        </div>
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
