import StarRate from "@mui/icons-material/StarRate";
import BookMark from "@mui/icons-material/Bookmark";
import Comment from "@mui/icons-material/Comment";
import ModeEdit from "@mui/icons-material/ModeEdit";
import Report from "@mui/icons-material/Report";
import SwapVert from "@mui/icons-material/SwapVert";

import NotificationActive from "@mui/icons-material/NotificationsActive";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import { useEffect, useMemo, useState } from "react";
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
import { FollowPopup } from "./FollowPopup";
import Button from "../../components/ButtonComponent";
import { ConfirmModal } from "../../components/ConfirmModal/ConfirmModal";
import ShoppingCart from "@mui/icons-material/ShoppingCart";
import { BuyChapter } from "../../api/Chapters/chapter.api";
import type { BuyChapterRequest } from "../../api/Chapters/chapter.type";
import type { BuyNovelRequest } from "../../api/Novels/novel.type";
import { TagView } from "../../components/TagComponent";
import { ChapterList } from "./TabContent/ChapterList";
import RatingSection from "./TabContent/RatingSection";

type Tabs = "Chapter" | "Comment" | "Rating";

export const Chapters = () => {
  const [tab, setTab] = useState<Tabs>("Chapter");
  const [showFollowPopup, setShowFollowPopup] = useState(false);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [isBuyNovelOpen, setIsBuyNovelOpen] = useState(false);
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

  const { data: novelData, refetch: refetchNovelData } = useQuery({
    queryKey: ["novel", novelId, params],
    queryFn: () =>
      GetNovelByUrl(novelId!, {
        page: params.page,
        limit: params.limit,
        sortBy: params.sortBy,
        ...(params.chapterNumber
          ? { chapterNumber: params.chapterNumber }
          : {}),
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
    enabled: !!novelId,
  });

  const follower = Array.isArray(novelFollowers?.followers)
    ? novelFollowers.followers.find(
        (follower) => follower.userId === auth?.user.userId
      )
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

  const handleFollowNovel = (novelId: string) => {
    if (novelId) NovelFollowMutation.mutate({ novelId });
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
    UpdateFollowStatusMutation.mutate({
      isNotification: !follower?.isNotification,
      novelFollowId: follower?.followerId!,
      readingStatus: follower?.readingStatus!,
    });
  };

  const handleStatusChange = (status: number) => {
    UpdateFollowStatusMutation.mutate({
      isNotification: follower?.isNotification!,
      novelFollowId: follower?.followerId!,
      readingStatus: status,
    });
  };

  const tabContent = useMemo(() => {
    switch (tab) {
      case "Comment":
        break;
      case "Rating":
        return <RatingSection novelInfo={novelInfo!} />;
      case "Chapter":
        return (
          <ChapterList
            handleClickChapter={handleClickChapter}
            novelData={novelData}
            params={params}
            setParams={setParams}
          />
        );
      default:
        return (
          <ChapterList
            handleClickChapter={handleClickChapter}
            novelData={novelData}
            params={params}
            setParams={setParams}
          />
        );
    }
  }, [
    tab,
    setTab,
    handleClickChapter,
    novelData,
    params,
    setParams,
    novelInfo,
  ]);

  return (
    <div className=" mx-[50px] p-4 text-white">
      <div className="flex flex-col md:flex-row gap-4 ">
        <img
          src={novelInfo?.novelImage || undefined}
          alt="Novel Cover"
          className="w-[200px] h-[320px] rounded-lg shadow-md"
        />

        <div className="flex-1 space-y-2">
          <h1 className="text-[44px] font-bold h-[130px]">
            {novelInfo?.title}
          </h1>
          <div className="flex justify-between h-[40px]">
            <p className="h-9 w-[198px] border border-white rounded-[10px] flex items-center justify-center text-xl text-white">
              {novelInfo?.authorName}
            </p>
            <div className="flex gap-2.5">
              <div className="flex items-center gap-1 text-[20px]">
                <StarRate sx={{ height: "20px", width: "20px" }} />
                <div className="flex items-center">
                  {novelData?.novelInfo.ratingAvg}
                </div>
              </div>
              <div className="flex items-center gap-1 text-[20px]">
                <BookMark sx={{ height: "20px", width: "20px" }} />
                <div className="flex items-center">
                  {novelData?.novelInfo.totalViews}
                </div>
              </div>
              <div className="flex items-center gap-1 text-[20px]">
                <Comment sx={{ height: "20px", width: "20px" }} />
                <div className="flex items-center">
                  {novelData?.novelInfo.commentCount}
                </div>
              </div>
              <div className="w-[150px] h-full text-[18px] px-3 py-2.5 gap-3 flex items-center rounded-[5px] text-white bg-[#2e2e2e]">
                <span
                  className={`h-2 w-2 rounded-full inline-block ${
                    novelInfo?.status === 1 ? "bg-gray-400" : "bg-green-400"
                  }`}
                />
                {novelInfo?.status === 1 ? "Hoàn thành" : "Đang diễn ra"}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-7 mt-10 h-[37px]">
            {!follower ? (
              <Button
                onClick={() => handleFollowNovel(novelData?.novelInfo.novelId!)}
                isLoading={
                  NovelFollowMutation.isPending ||
                  isFollowersLoading ||
                  isFollowersFetching
                }
                className="bg-[#ff6740] w-[228px] border-none hover:bg-orange-600 px-4 py-1 rounded text-[18px]"
              >
                <div className="flex items-center justify-center gap-2.5">
                  {!NovelFollowMutation.isPending && (
                    <>
                      <ModeEdit sx={{ height: "20px", width: "20px" }} />
                      <p>Theo dõi</p>
                    </>
                  )}
                </div>
              </Button>
            ) : (
              <div className="relative inline-block">
                <Button
                  onClick={() => setShowFollowPopup((prev) => !prev)}
                  isLoading={
                    UnfollowNovelMutaion.isPending ||
                    isFollowersLoading ||
                    isFollowersFetching
                  }
                  className="bg-[#45454e] w-[228px]  border-none hover:bg-gray-700 px-4 py-1 rounded text-[18px]"
                >
                  <div className="flex items-center justify-center gap-2.5">
                    <NotificationActive
                      sx={{ height: "20px", width: "20px" }}
                    />
                    <p>Đang theo dõi</p>
                    <KeyboardArrowDown sx={{ height: "20px", width: "20px" }} />
                  </div>
                </Button>

                {showFollowPopup && (
                  <div className="absolute left-57 top-[-15px] z-50 mt-2">
                    <FollowPopup
                      notify={follower.isNotification}
                      status={follower.readingStatus}
                      onUnfollow={() =>
                        handleUnfollowNovel(follower.followerId)
                      }
                      onNotifyChange={handleNotifyChange}
                      onStatusChange={(status) => handleStatusChange(status)}
                    />
                  </div>
                )}
              </div>
            )}

            {novelInfo?.status === 1 && (
              <Button
                onClick={() => setIsBuyNovelOpen(true)}
                disabled={novelData?.isAccessFull}
                className={` ${
                  novelData?.isAccessFull
                    ? `bg-[#45454e]`
                    : `bg-[#ff6740] hover:bg-orange-600`
                } w-[100px]  border-none px-4 py-1 rounded text-[18px]`}
              >
                <div className="flex items-center justify-center gap-2.5 w-fit whitespace-nowrap">
                  <ShoppingCart sx={{ height: "20px", width: "20px" }} />
                  {novelData?.isAccessFull ? <p>Đã Mua</p> : <p>Mua</p>}
                </div>
              </Button>
            )}

            <button className="flex items-center justify-center gap-2.5 px-4 py-1 text-sm text-[#ff6740] text-[18px]">
              {/* <Share sx={{ height: "20px", width: "20px" }} /> */}
              <StarRate sx={{ height: "20px", width: "20px" }} />
              <p>Đánh giá</p>
            </button>
            <button className="flex items-center justify-center gap-2.5 px-4 py-1 text-sm text-[#ff6740] text-[18px]">
              <Report sx={{ height: "20px", width: "20px" }} />
              <p>Báo cáo</p>
            </button>
          </div>

          <div className="flex flex-wrap mt-7 gap-2 text-xs text-gray-300">
            {novelData?.novelInfo.tags.map((tag) => (
              <TagView key={tag.tagId} tag={tag} />
            ))}
          </div>
        </div>
      </div>

      <div className="text-[18px] text-white mt-7 h-[130px] line-clamp-5 overflow-hidden">
        {novelInfo?.description}
      </div>

      {/* Tabs */}
      <div className="flex gap-6 items-center justify-between text-[20px] h-[44px] mt-6 mb-4">
        <div className="flex h-full gap-6">
          <button
            onClick={() => setTab("Chapter")}
            className={`px-5 cursor-pointer hover:bg-gray-800 flex items-center justify-center rounded-[10px] ${
              tab === "Chapter" ? "bg-[#2e2e2e]" : undefined
            } `}
          >
            Danh sách chương
          </button>
          {/* <button
            onClick={() => setTab("Comment")}
            className={`px-5 cursor-pointer hover:bg-gray-800 flex items-center justify-center rounded-[10px] ${
              tab === "Comment" ? "bg-[#2e2e2e]" : undefined
            } `}
          >
            Bình luận (2)
          </button> */}
          <button
            onClick={() => setTab("Rating")}
            className={`px-5 cursor-pointer hover:bg-gray-800 flex items-center justify-center rounded-[10px] ${
              tab === "Rating" ? "bg-[#2e2e2e]" : undefined
            } `}
          >
            Đánh giá
          </button>
        </div>
        {tab === "Chapter" && (
          <div className="flex h-full gap-6 items-center justify-between">
            <button
              className="cursor-pointer rounded-[10px] hover:bg-[#2e2e2e] p-2 h-full"
              onClick={() =>
                setParams((prev) => ({
                  ...prev,
                  sortBy:
                    params.sortBy === "chapter_number:desc"
                      ? "chapter_number:asc"
                      : "chapter_number:desc",
                }))
              }
            >
              <SwapVert />
            </button>
          </div>
        )}
      </div>
      {tabContent}

      <ConfirmModal
        isOpen={isBuyModalOpen}
        title={`Hiện tại bạn đang có ${auth?.user.coin} coin`}
        message={`Chương truyện này có giá ${chapterPrice} coin. Bạn có muốn mua không?`}
        onConfirm={confirmBuy}
        onCancel={() => setIsBuyModalOpen(false)}
      />

      <ConfirmModal
        isOpen={isBuyNovelOpen}
        title={`Hiện tại bạn đang có ${auth?.user.coin} coin`}
        message={`Tiểu thuyết này có giá ${novelInfo?.price} coin. Bạn có muốn mua không?`}
        onConfirm={confirmBuyNovel}
        onCancel={() => setIsBuyNovelOpen(false)}
      />
    </div>
  );
};
