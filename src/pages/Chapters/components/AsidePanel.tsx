import StarRate from "@mui/icons-material/StarRate";
import BookMark from "@mui/icons-material/Bookmark";
import Comment from "@mui/icons-material/Comment";
import ModeEdit from "@mui/icons-material/ModeEdit";
import Report from "@mui/icons-material/Report";
import ShoppingCart from "@mui/icons-material/ShoppingCart";
import NotificationsActive from "@mui/icons-material/NotificationsActive";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import Button from "../../../components/ButtonComponent";
import { FollowPopup } from "../FollowPopup";

type Props = {
  novelInfo: any;
  novelData: any;
  follower: any;
  isCompleted: boolean;
  showFollowPopup: boolean;
  setShowFollowPopup: (v: boolean) => void;
  followBtnRef: React.Ref<HTMLDivElement>;
  onFollow: () => void;
  onToggleFollow: () => void;
  onUnfollow: () => void;
  onNotifyChange: () => void;
  onStatusChange: (s: number) => void;
  onOpenBuyNovel: () => void;
  onJumpToRating: () => void;
  gradientBtn: string;
  loadingFollow: boolean;
  loadingUnfollow: boolean;
};

export const AsidePanel = ({
  novelInfo,
  novelData,
  follower,
  isCompleted,
  showFollowPopup,
  setShowFollowPopup,
  followBtnRef,
  onFollow,
  onToggleFollow,
  onUnfollow,
  onNotifyChange,
  onStatusChange,
  onOpenBuyNovel,
  onJumpToRating,
  gradientBtn,
  loadingFollow,
  loadingUnfollow,
}: Props) => {
  const buyBtn = [
    "relative w-full rounded-full text-white font-semibold",
    "text-[12px] px-3 py-1.5",
    "!bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#a78bfa]",
    "hover:from-[#7c83ff] hover:via-[#9d6cff] hover:to-[#b59cff]",
    "transition-colors duration-300",
  ].join(" ");

  return (
    <aside className="md:sticky md:top-5 self-start">
      <div className="rounded-xl ring-1 ring-white/12 bg-[#0b0c0e]/90 backdrop-blur-md shadow-[0_16px_56px_-28px_rgba(0,0,0,0.75)] overflow-hidden">
        <div className="relative">
          <img
            src={novelInfo?.novelImage || undefined}
            alt={novelInfo?.title || "Novel Cover"}
            className="w-full aspect-[1/1.05] object-cover"
            loading="lazy"
          />
          <span
            className={[
              "absolute right-2 top-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1",
              "text-[11.5px] font-semibold backdrop-blur-sm border text-white",
              isCompleted
                ? "bg-emerald-500/75 border-emerald-300 shadow-[0_8px_24px_rgba(16,185,129,0.55)]"
                : "bg-rose-500/75 border-rose-300 shadow-[0_8px_24px_rgba(244,63,94,0.55)]",
            ].join(" ")}
          >
            <span
              className={[
                "h-1.5 w-1.5 rounded-full",
                isCompleted ? "bg-emerald-100" : "bg-rose-100",
              ].join(" ")}
            />
            {isCompleted ? "Hoàn thành" : "Đang diễn ra"}
          </span>
        </div>

        <div className="px-2.5 pt-2">
          <div className="grid grid-cols-3 gap-1.5">
            <div className="h-6 rounded-lg border border-white/10 bg-white/[0.05] px-1.5 text-center">
              <div className="h-full inline-flex items-center justify-center gap-1 text-[10.5px] text-gray-200 leading-none">
                <StarRate sx={{ fontSize: 13 }} />
                <span className="tabular-nums">
                  {novelData?.novelInfo.ratingAvg ?? 0}
                </span>
              </div>
            </div>
            <div className="h-6 rounded-lg border border-white/10 bg-white/[0.05] px-1.5 text-center">
              <div className="h-full inline-flex items-center justify-center gap-1 text-[10.5px] text-gray-200 leading-none">
                <BookMark sx={{ fontSize: 13 }} />
                <span className="tabular-nums">
                  {novelData?.novelInfo.totalViews ?? 0}
                </span>
              </div>
            </div>
            <div className="h-6 rounded-lg border border-white/10 bg-white/[0.05] px-1.5 text-center">
              <div className="h-full inline-flex items-center justify-center gap-1 text-[10.5px] text-gray-200 leading-none">
                <Comment sx={{ fontSize: 13 }} />
                <span className="tabular-nums">
                  {novelData?.novelInfo.commentCount ?? 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-2.5 flex flex-col gap-3.5">
          {!follower ? (
            <Button
              onClick={onFollow}
              isLoading={loadingFollow}
              aria-label="Theo dõi tiểu thuyết"
              className={[gradientBtn, "text-[12px] px-3 py-1.5 mt-1.5"].join(" ")}
            >
              <span className="inline-flex items-center gap-1.5 leading-none">
                <ModeEdit sx={{ fontSize: 15 }} />
                Theo dõi
              </span>
            </Button>
          ) : (
            <div className="relative" ref={followBtnRef}>
              <Button
                onClick={onToggleFollow}
                isLoading={loadingUnfollow}
                aria-label="Tùy chọn theo dõi"
                className="w-full rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-[12px] px-3 py-1.5 transition"
              >
                <span className="inline-flex items-center justify-center gap-1.5 leading-none">
                  <NotificationsActive sx={{ fontSize: 15 }} />
                  Đang theo dõi
                  <KeyboardArrowDown sx={{ fontSize: 15 }} />
                </span>
              </Button>

              {showFollowPopup && (
                <div className="absolute right-0 z-50 mt-2 rounded-xl border border-white/10 bg-[#161617] shadow-2xl">
                  <FollowPopup
                    notify={follower!.isNotification}
                    status={follower!.readingStatus}
                    onUnfollow={onUnfollow}
                    onNotifyChange={onNotifyChange}
                    onStatusChange={onStatusChange}
                  />
                </div>
              )}
            </div>
          )}

          {isCompleted && (
            <Button
              onClick={onOpenBuyNovel}
              disabled={novelData?.isAccessFull}
              aria-label="Mua trọn bộ"
              className={
                novelData?.isAccessFull
                  ? "w-full rounded-full bg-white/5 text-gray-300 text-[12px] px-3 py-1.5"
                  : buyBtn
              }
            >
              <span className="inline-flex items-center gap-1.5 leading-none">
                <ShoppingCart sx={{ fontSize: 15 }} />
                {novelData?.isAccessFull ? "Đã mua" : "Mua trọn bộ"}
              </span>
            </Button>
          )}

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={onJumpToRating}
              className="h-7 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition flex items-center justify-center px-2.5 text-[11.5px] whitespace-nowrap"
              aria-label="Đánh giá"
              type="button"
            >
              <span className="inline-flex items-center gap-1.5 leading-none">
                <StarRate sx={{ fontSize: 13 }} />
                <span className="leading-none">Đánh giá</span>
              </span>
            </button>

            <button
              className="h-7 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition flex items-center justify-center px-2.5 text-[11.5px] whitespace-nowrap"
              aria-label="Báo cáo"
              type="button"
            >
              <span className="inline-flex items-center gap-1.5 leading-none">
                <Report sx={{ fontSize: 13 }} />
                <span className="leading-none">Báo cáo</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
