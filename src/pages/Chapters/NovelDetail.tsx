import { ArrowUpDown } from "lucide-react";
import { useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

import {
  BuyNovel,
  GetNovelByUrl,
  type GetNovelChaptersParams,
} from "../../api/Novels/novel.api";
import { useToast } from "../../context/ToastContext/toast-context";
import { useAuth } from "../../hooks/useAuth";
import type {
  NovelFollowerRequest,
  NovelFollowRequest,
  UpdateFollowStatusReq,
} from "../../api/NovelFollow/novel-follow.type";
import {
  FollowNovel,
  GetNovelFollowers,
  UnfollowNovel,
  UpdateFollowStatus,
} from "../../api/NovelFollow/novel-follow.api";
import { ConfirmModal } from "../../components/ConfirmModal/ConfirmModal";
import { BuyChapter } from "../../api/Chapters/chapter.api";
import type { BuyChapterRequest } from "../../api/Chapters/chapter.type";
import type { BuyNovelRequest } from "../../api/Novels/novel.type";
import { ChapterList } from "./components/ChapterList/ChapterList";
import RatingSection from "./components/Rating/RatingSection";
import { AsidePanel } from "./components/AsidePanel";
import { InfoCard } from "./components/InfoCard";
import { gradientBtn } from "./constants";
import type { Tag } from "../../entity/tag";
import { FollowPopup } from "./FollowPopup"; // <== import popup

export const NovelDetail = () => {
  const [showFollowPopup, setShowFollowPopup] = useState(false);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [isBuyNovelOpen, setIsBuyNovelOpen] = useState(false);
  const [expandedDesc, setExpandedDesc] = useState(false);

  const [params, setParams] = useState<GetNovelChaptersParams>({
    limit: 20,
    page: 0,
    sortBy: "chapter_number:asc",
  });

  const [chapterPrice, setChapterPrice] = useState(0);
  const [selectedChapterId, setSelectedChapterId] = useState<string>("");

  const { novelId } = useParams();
  const navigate = useNavigate();

  const toast = useToast();
  const { auth } = useAuth();

  const {
    data: novelData,
    refetch: refetchNovelData,
    isFetching,
  } = useQuery({
    queryKey: ["novel", novelId, params],
    queryFn: () =>
      GetNovelByUrl(novelId!, {
        page: params.page,
        limit: params.limit,
        sortBy: params.sortBy,
        ...(params.chapterNumber ? { chapterNumber: params.chapterNumber } : {}),
      }).then((res) => res.data.data),
    enabled: !!novelId,
  });

  const acceptedChapterIds = [
    ...(novelData?.purchasedChapterIds ?? []),
    ...(novelData?.freeChapters ?? []),
  ];
  const novelInfo = novelData?.novelInfo;

  const {
    data: novelFollowers,
    refetch: refetchNovelFollowers,
    isLoading: isFollowersLoading,
    isFetching: isFollowersFetching,
  } = useQuery({
    queryKey: ["novelFollower", novelData?.novelInfo.novelId],
    queryFn: () =>
      GetNovelFollowers({ novelId: novelData?.novelInfo.novelId! }).then(
        (res) => res.data.data
      ),
    enabled: !!novelId && !!novelData?.novelInfo.novelId,
  });

  const follower = Array.isArray(novelFollowers?.followers)
    ? novelFollowers.followers.find((f) => f.userId === auth?.user.userId)
    : undefined;

  const NovelFollowMutation = useMutation({
    mutationFn: (request: NovelFollowRequest) => FollowNovel(request),
    onSuccess: (data) => {
      toast?.onOpen(data.data.message);
      refetchNovelFollowers();
    },
  });

  const UnfollowNovelMutaion = useMutation({
    mutationFn: (request: NovelFollowerRequest) => UnfollowNovel(request),
    onSuccess: () => {
      toast?.onOpen("Bạn đã hủy theo dõi tiểu thuyết!");
      refetchNovelFollowers();
    },
  });

  const UpdateFollowStatusMutation = useMutation({
    mutationFn: (request: UpdateFollowStatusReq) => UpdateFollowStatus(request),
  });

  const BuyChapterMutation = useMutation({
    mutationFn: ({
      chapterId,
      request,
    }: {
      chapterId: string;
      request: BuyChapterRequest;
    }) => BuyChapter(chapterId, request),
    onSuccess: (res) => {
      toast?.onOpen(res.data.message);
      refetchNovelData();
    },
  });

  const BuyNovelMutation = useMutation({
    mutationFn: ({
      novelId,
      request,
    }: {
      novelId: string;
      request: BuyNovelRequest;
    }) => BuyNovel(novelId, request),
    onSuccess: (res) => {
      toast?.onOpen(res.data.message);
      refetchNovelData();
    },
  });

  const handleClickChapter = (
    chapterId: string,
    isPaid: boolean,
    price: number
  ) => {
    setSelectedChapterId(chapterId);
    if (
      isPaid &&
      !novelData?.isAccessFull &&
      !acceptedChapterIds.includes(chapterId)
    ) {
      setChapterPrice(price);
      if (!auth?.user)
        toast?.onOpen(
          "Bạn cần đăng nhập để có thể tiếp tục với các chương bị khóa"
        );
      else setIsBuyModalOpen(true);
    } else navigate(`/novels/${novelId}/${chapterId}`);
  };

  const handleFollowNovel = (nid: string) => {
    if (nid) NovelFollowMutation.mutate({ novelId: nid });
  };

  const handleUnfollowNovel = (novelFollowId: string) => {
    if (novelFollowId) {
      setShowFollowPopup(false);
      UnfollowNovelMutaion.mutate({ novelFollowId });
    }
  };

  const confirmBuy = () => {
    if (selectedChapterId)
      BuyChapterMutation.mutate({
        chapterId: selectedChapterId,
        request: { coinCost: chapterPrice },
      });
    setIsBuyModalOpen(false);
  };

  const confirmBuyNovel = () => {
    if (novelId && novelInfo)
      BuyNovelMutation.mutate({
        novelId: novelInfo.novelId,
        request: { coinCost: novelInfo?.price },
      });
    setIsBuyNovelOpen(false);
  };

  const handleNotifyChange = () => {
    if (!follower) return;
    UpdateFollowStatusMutation.mutate({
      isNotification: !follower?.isNotification,
      novelFollowId: follower?.followerId!,
      readingStatus: follower?.readingStatus!,
    });
  };

  const handleStatusChange = (status: number) => {
    if (!follower) return;
    UpdateFollowStatusMutation.mutate({
      isNotification: follower?.isNotification!,
      novelFollowId: follower?.followerId!,
      readingStatus: status,
    });
  };

  const followBtnRef = useRef<HTMLDivElement | null>(null);

  const isCompleted = novelInfo?.status === 1;

  const ratingRef = useRef<HTMLDivElement | null>(null);
  const jumpToRating = () => {
    ratingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="mx-auto max-w-5xl px-2 py-4 text-gray-900 dark:text-white">
      <div className="grid grid-cols-1 md:grid-cols-[236px_1fr] gap-5">
        <AsidePanel
          novelInfo={novelInfo}
          novelData={novelData}
          follower={follower}
          isCompleted={isCompleted}
          showFollowPopup={showFollowPopup}
          setShowFollowPopup={setShowFollowPopup}
          onFollow={() => handleFollowNovel(novelData?.novelInfo.novelId!)}
          onToggleFollow={() => setShowFollowPopup((v) => !v)}
          onUnfollow={() => follower && handleUnfollowNovel(follower.followerId)}
          onNotifyChange={handleNotifyChange}
          onStatusChange={(s) => handleStatusChange(s)}
          onOpenBuyNovel={() => setIsBuyNovelOpen(true)}
          onJumpToRating={jumpToRating}
          gradientBtn={gradientBtn}
          loadingFollow={
            NovelFollowMutation.isPending ||
            isFollowersLoading ||
            isFollowersFetching
          }
          loadingUnfollow={
            UnfollowNovelMutaion.isPending ||
            isFollowersLoading ||
            isFollowersFetching
          }
          /** 👇 dùng đúng tên prop theo AsidePanel của bạn */
          followBtnRef={followBtnRef}
        />

        <main className="space-y-5">
          <InfoCard
            title={novelInfo?.title || ""}
            author={novelInfo?.authorName || ""}
            tags={
              (novelData?.novelInfo?.tags ?? novelInfo?.tags ?? []) as Tag[]
            }
            description={novelInfo?.description || ""}
            expanded={expandedDesc}
            onToggleExpand={() => setExpandedDesc((v) => !v)}
          />

          {/* Section danh sách chương */}
          <section
            className="
              rounded-2xl overflow-hidden backdrop-blur-md
              border bg-white border-gray-200 text-gray-900
              shadow-[0_16px_52px_-20px_rgba(0,0,0,0.08)]
              dark:border-white/10 dark:bg-[#121212]/80 dark:text-white
              dark:shadow-[0_24px_64px_-28px_rgba(0,0,0,0.7)]
            "
          >
            <div className="flex items-center justify-between px-3 md:px-4 pt-3">
              <h2 className="text-[15px] font-semibold tracking-wide uppercase">
                Danh sách chương
              </h2>
              <button
                className="
                  group inline-flex items-center gap-1.5 rounded-full
                  border bg-white hover:bg-gray-50 border-gray-200 text-gray-800
                  px-3 py-1.5 text-[12.5px] transition
                  dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 dark:text-white
                "
                onClick={() =>
                  setParams((prev) => ({
                    ...prev,
                    sortBy:
                      prev.sortBy === "chapter_number:desc"
                        ? "chapter_number:asc"
                        : "chapter_number:desc",
                  }))
                }
                title="Đổi thứ tự chương"
              >
                <ArrowUpDown
                  className={`w-[18px] h-[18px] transition-transform ${
                    params.sortBy === "chapter_number:desc"
                      ? "rotate-180"
                      : "rotate-0"
                  }`}
                />
                <span className="hidden md:inline">
                  {params.sortBy === "chapter_number:desc"
                    ? "Mới → Cũ"
                    : "Cũ → Mới"}
                </span>
              </button>
            </div>

            <div className="mt-3 border-t border-gray-200 dark:border-white/10" />

            <div className="p-3 md:p-4">
              {isFetching ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="h-12 rounded-lg bg-gray-100 animate-pulse dark:bg-white/5"
                    />
                  ))}
                </div>
              ) : (
                <ChapterList
                  handleClickChapter={handleClickChapter}
                  novelData={novelData}
                  params={params}
                  setParams={setParams}
                />
              )}
            </div>
          </section>

          <div ref={ratingRef}>
            {novelInfo && <RatingSection novelInfo={novelInfo} />}
          </div>
        </main>
      </div>

      {/* Mua chương */}
      <ConfirmModal
        isOpen={isBuyModalOpen}
        title={`Hiện tại bạn đang có ${auth?.user.coin} coin`}
        message={`Chương truyện này có giá ${chapterPrice} coin. Bạn có muốn mua không?`}
        onConfirm={confirmBuy}
        onCancel={() => setIsBuyModalOpen(false)}
      />

      {/* Mua trọn bộ */}
      <ConfirmModal
        isOpen={isBuyNovelOpen}
        title={`Hiện tại bạn đang có ${auth?.user.coin} coin`}
        message={`Tiểu thuyết này có giá ${novelInfo?.price} coin. Bạn có muốn mua không?`}
        onConfirm={confirmBuyNovel}
        onCancel={() => setIsBuyNovelOpen(false)}
      />

      <FollowPopup
        open={showFollowPopup}
        anchorRef={followBtnRef as React.RefObject<HTMLElement>}
        notify={!!follower?.isNotification}
        status={follower?.readingStatus ?? 0}
        onNotifyChange={handleNotifyChange}
        onStatusChange={(s) => handleStatusChange(s)}
        onUnfollow={() => follower && handleUnfollowNovel(follower.followerId)}
        onClose={() => setShowFollowPopup(false)}
      />
    </div>
  );
};
