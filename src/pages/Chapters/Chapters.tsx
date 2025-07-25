import StarRate from "@mui/icons-material/StarRate";
import BookMark from "@mui/icons-material/Bookmark";
import Comment from "@mui/icons-material/Comment";
import Share from "@mui/icons-material/Share";
import ModeEdit from "@mui/icons-material/ModeEdit";
import Add from "@mui/icons-material/Add";
import Lock from "@mui/icons-material/Lock";
import Report from "@mui/icons-material/Report";
import NotificationActive from "@mui/icons-material/NotificationsActive";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { formatTicksToRelativeTime } from "../../utils/date_format";
import { GetNovelById } from "../../api/Novels/novel.api";
import { useToast } from "../../context/ToastContext/toast-context";
import { useAuth } from "../../hooks/useAuth";
import type {
  NovelFollowerRequest,
  NovelFollowRequest,
} from "../../api/NovelFollow/novel-follow.type";
import {
  FollowNovel,
  GetNovelFollowers,
  UnfollowNovel,
} from "../../api/NovelFollow/novel-follow.api";
import { FollowPopup } from "./FollowPopup";
import Button from "../../components/ButtonComponent";

type Tabs = "Chapter" | "Comment";

export const Chapters = () => {
  const [tab, setTab] = useState<Tabs>("Chapter");
  const [showFollowPopup, setShowFollowPopup] = useState(false);

  const { novelId } = useParams();
  const navigate = useNavigate();

  const toast = useToast();
  const { auth } = useAuth();

  const { data: novelData, isLoading: isLoadingNovel } = useQuery({
    queryKey: ["novel", novelId],
    queryFn: () => GetNovelById(novelId!).then((res) => res.data.data),
    enabled: !!novelId,
  });

  const { data: novelFollowers, refetch: refetchNovelFollowers } = useQuery({
    queryKey: ["novelFollower", novelId],
    queryFn: () =>
      GetNovelFollowers({ novelId: novelId! }).then((res) => res.data.data),
    enabled: !!novelId,
  });

  const NovelFollowMutation = useMutation({
    mutationFn: (request: NovelFollowRequest) => FollowNovel(request),
    onSuccess: () => {
      toast?.onOpen("Bạn đã theo dõi tiểu thuyết!");
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

  const novelInfo = novelData?.novelInfo;
  const chapters = novelData?.allChapters;
  const lastChapter = chapters?.[chapters?.length - 1];

  const follower = Array.isArray(novelFollowers?.followers)
    ? novelFollowers.followers.find(
        (follower) => follower.userId === auth?.user.userId
      )
    : undefined;

  const handleClickChapter = (chapterId: string, isPaid: boolean) => {
    if (isPaid) {
      if (!auth?.user)
        toast?.onOpen(
          "Bạn cần đăng nhập để có thể tiếp tục với các chương bị khóa"
        );
      else toast?.onOpen("Bạn không sở hữu chương này!");
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

  return (
    <div className="max-w-6xl mx-[50px] p-4 text-white">
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
                <div className="flex items-center">4.9</div>
              </div>
              <div className="flex items-center gap-1 text-[20px]">
                <BookMark sx={{ height: "20px", width: "20px" }} />
                <div className="flex items-center">11K</div>
              </div>
              <div className="flex items-center gap-1 text-[20px]">
                <Comment sx={{ height: "20px", width: "20px" }} />
                <div className="flex items-center">123</div>
              </div>
              <div className="w-[150px] h-full text-[18px] px-3 py-2.5 gap-3 flex items-center rounded-[5px] text-white bg-[#2e2e2e]">
                <span
                  className={`h-2 w-2 rounded-full inline-block bg-green-400`}
                />
                Đang diễn ra
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-7 mt-10 h-[37px]">
            {!follower ? (
              <Button
                onClick={() => handleFollowNovel(novelId!)}
                isLoading={NovelFollowMutation.isPending}
                className="bg-[#ff6740] w-[228px] hover:bg-orange-600 px-4 py-1 rounded text-[18px]"
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
                  isLoading={UnfollowNovelMutaion.isPending}
                  className="bg-[#45454e] w-[228px] hover:bg-gray-700 px-4 py-1 rounded text-[18px]"
                >
                  <div className="flex items-center justify-center gap-2.5">
                    {!UnfollowNovelMutaion.isPending && (
                      <>
                        <NotificationActive
                          sx={{ height: "20px", width: "20px" }}
                        />
                        <p>Đang theo dõi</p>
                        <KeyboardArrowDown
                          sx={{ height: "20px", width: "20px" }}
                        />
                      </>
                    )}
                  </div>
                </Button>

                {showFollowPopup && (
                  <div className="absolute left-57 top-[-15px] z-50 mt-2">
                    <FollowPopup
                      notify={false}
                      status="Đang đọc"
                      onUnfollow={() =>
                        handleUnfollowNovel(follower.followerId)
                      }
                    />
                  </div>
                )}
              </div>
            )}

            <button className="flex items-center justify-center gap-2.5 px-4 py-1 text-sm text-[#ff6740] text-[18px]">
              <Share sx={{ height: "20px", width: "20px" }} />
              <Add sx={{ height: "20px", width: "20px" }} />
              <p>Chia sẻ</p>
            </button>
            <button className="flex items-center justify-center gap-2.5 px-4 py-1 text-sm text-[#ff6740] text-[18px]">
              <Report sx={{ height: "20px", width: "20px" }} />
              <p>Báo cáo</p>
            </button>
          </div>

          <div className="flex flex-wrap mt-7 gap-2 text-xs text-gray-300">
            <div className="border-2 rounded-[5px] px-2 py-1 bg-black text-white text-sm">
              Trường học{" "}
            </div>
            <div className="border-2 rounded-[5px] px-2 py-1 bg-black text-white text-sm">
              Phiêu lưu{" "}
            </div>
            <div className="border-2 rounded-[5px] px-2 py-1 bg-black text-white text-sm">
              Hài hước{" "}
            </div>
          </div>
        </div>
      </div>

      <div className="text-[18px] text-white mt-7 h-[130px] line-clamp-5 overflow-hidden">
        {novelInfo?.description}
      </div>

      {/* Tabs */}
      <div className="flex gap-6 text-[20px] h-[44px] mt-6 mb-4">
        <button
          onClick={() => setTab("Chapter")}
          className={`cursor-pointer hover:bg-gray-800 flex items-center justify-center rounded-[10px] ${
            tab === "Chapter" ? "bg-[#2e2e2e]" : undefined
          } w-[263px]`}
        >
          Danh sách chương
        </button>
        <button
          onClick={() => setTab("Comment")}
          className={`cursor-pointer hover:bg-gray-800 flex items-center justify-center rounded-[10px] ${
            tab === "Comment" ? "bg-[#2e2e2e]" : undefined
          } w-[263px]`}
        >
          Bình luận (2)
        </button>
      </div>

      <div className="flex items-center h-[54px] text-[18px] gap-6 pb-[20px] border-b-2 border-[#d9d9d9]">
        <p className="flex items-center">Cập nhật gần nhất:</p>
        <p className="flex items-center text-[#ff6740]">
          Chương {lastChapter?.chapterNumber}: {lastChapter?.title}
        </p>
        <p className="flex items-center text-[#cfcfcf]">
          {formatTicksToRelativeTime(lastChapter?.updateAt!)}
        </p>
      </div>

      {/* Chapter List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-[25px]">
        {chapters?.map((chapter) => (
          <div
            onClick={() =>
              handleClickChapter(chapter.chapterId, chapter.isPaid)
            }
            key={chapter.chapterId}
            className="h-[72px] rounded cursor-pointer hover:bg-gray-700 transition-colors duration-200"
          >
            <div className="flex items-center h-full px-4 border-b-2 border-[#d9d9d9] mr-10 justify-between">
              <div className="flex items-center">
                <h1 className="w-[60px] text-[20px]">
                  {chapter.chapterNumber}
                </h1>
                <div className="ml-2">
                  <p className="text-[18px] font-normal line-clamp-1">
                    {chapter.title}
                  </p>
                  <p className="text-sm text-gray-400">
                    {formatTicksToRelativeTime(chapter.updateAt)}
                  </p>
                </div>
              </div>
              {chapter.isPaid && <Lock />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
