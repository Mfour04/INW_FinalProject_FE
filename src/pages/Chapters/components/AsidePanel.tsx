import {
  Star as StarIcon,
  Bookmark as BookmarkIcon,
  MessageSquare,
  Pencil,
  Flag,
  ShoppingCart,
  Bell,
  ChevronDown,
} from "lucide-react";
import { buyBtn } from "../constants";

type Props = {
  novelInfo: any;
  novelData: any;
  follower: any;
  isCompleted: boolean;
  isAuthor: boolean;
  followBtnRef: React.Ref<HTMLDivElement>;
  onFollow: () => void;
  onToggleFollow: () => void;
  onOpenBuyNovel: () => void;
  onOpenReport: () => void;
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
  isAuthor,
  followBtnRef,
  onFollow,
  onToggleFollow,
  onOpenBuyNovel,
  onOpenReport,
  onJumpToRating,
  gradientBtn,
  loadingFollow,
  loadingUnfollow,
}: Props) => {
  return (
    <aside className="md:sticky md:top-5 self-start">
      <div className="rounded-xl overflow-hidden backdrop-blur-md border bg-white border-gray-200 text-gray-900 shadow-[0_16px_56px_-28px_rgba(0,0,0,0.08)] dark:border-white/10 dark:bg-[#121212]/80 dark:text-white dark:shadow-[0_24px_64px_-28px_rgba(0,0,0,0.7)]">
        {/* Cover */}
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
              "text-[11.5px] font-semibold backdrop-blur-sm border",
              isCompleted
                ? "bg-emerald-100 text-emerald-800 border-emerald-300 shadow-sm dark:bg-emerald-500/75 dark:text-white dark:border-emerald-300"
                : "bg-rose-100 text-rose-800 border-rose-300 shadow-sm dark:bg-rose-500/75 dark:text-white dark:border-rose-300",
            ].join(" ")}
          >
            <span
              className={[
                "h-1.5 w-1.5 rounded-full",
                isCompleted ? "bg-emerald-500" : "bg-rose-500",
                "dark:!bg-white",
              ].join(" ")}
            />
            {isCompleted ? "Hoàn thành" : "Đang diễn ra"}
          </span>
        </div>

        {/* Stats */}
        <div className="px-2.5 pt-2">
          <div className="grid grid-cols-3 gap-1.5">
            <div className="h-6 rounded-lg border px-1.5 text-center border-gray-200 bg-gray-100 text-gray-700 dark:border-white/10 dark:bg-white/[0.05]">
              <div className="h-full inline-flex items-center justify-center gap-1 text-[10.5px] leading-none">
                <StarIcon className="w-[13px] h-[13px] text-yellow-500 fill-yellow-500" />
                <span className="tabular-nums dark:text-white">
                  {novelData?.novelInfo?.ratingAvg ?? 0}
                </span>
              </div>
            </div>
            <div className="h-6 rounded-lg border px-1.5 text-center border-gray-200 bg-gray-100 text-gray-700 dark:border-white/10 dark:bg-white/[0.05]">
              <div className="h-full inline-flex items-center justify-center gap-1 text-[10.5px] dark:text-white leading-none">
                <BookmarkIcon className="w-[13px] h-[13px]" />
                <span className="tabular-nums">
                  {novelData?.novelInfo?.totalViews ?? 0}
                </span>
              </div>
            </div>
            <div className="h-6 rounded-lg border px-1.5 text-center border-gray-200 bg-gray-100 text-gray-700 dark:border-white/10 dark:bg-white/[0.05]">
              <div className="h-full inline-flex items-center justify-center gap-1 text-[10.5px] dark:text-white leading-none">
                <MessageSquare className="w-[13px] h-[13px]" />
                <span className="tabular-nums">
                  {novelData?.novelInfo?.commentCount ?? 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-2.5 flex flex-col gap-3.5">
          {/* Follow button */}
          {!isAuthor &&
            (!follower ? (
              <button
                onClick={onFollow}
                disabled={loadingFollow}
                aria-label="Theo dõi tiểu thuyết"
                className={`${gradientBtn} text-[12px] px-3 py-1.5 mt-1.5 rounded-full transition flex items-center justify-center`}
              >
                {loadingFollow ? "Đang xử lý..." : (
                  <span className="inline-flex items-center gap-1.5 leading-none">
                    <Pencil className="w-[15px] h-[15px]" />
                    Theo dõi
                  </span>
                )}
              </button>
            ) : (
              <div className="relative" ref={followBtnRef}>
                <button
                  onClick={onToggleFollow}
                  disabled={loadingUnfollow}
                  aria-label="Tùy chọn theo dõi"
                  className="w-full rounded-full text-[12px] px-4 py-2 transition border bg-white hover:bg-gray-50 border-gray-200 text-gray-900 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 dark:text-white flex items-center justify-center"
                >
                  {loadingUnfollow ? "Đang xử lý..." : (
                    <span className="inline-flex items-center justify-center gap-1.5 leading-none">
                      <Bell className="w-[15px] h-[15px]" />
                      Đang theo dõi
                      <ChevronDown className="w-[15px] h-[15px]" />
                    </span>
                  )}
                </button>
              </div>
            ))}

          {/* Buy full novel */}
          {isCompleted &&
            (isAuthor ? (
              <div className="w-full rounded-full bg-gray-100 text-gray-600 text-[12px] px-3 py-1.5 text-center dark:bg-white/5 dark:text-gray-300">
                Tiểu thuyết của bạn
              </div>
            ) : (
              <button
                onClick={onOpenBuyNovel}
                disabled={novelData?.isAccessFull}
                aria-label="Mua trọn bộ"
                className={
                  novelData?.isAccessFull
                    ? "w-full rounded-full bg-gray-100 text-gray-500 text-[12px] px-3 py-1.5 dark:bg-white/5 dark:text-gray-300"
                    : buyBtn
                }
              >
                <span className="inline-flex items-center gap-1.5 leading-none">
                  <ShoppingCart className="w-[15px] h-[15px]" />
                  {novelData?.isAccessFull ? "Đã mua" : "Mua trọn bộ"}
                </span>
              </button>
            ))}

          {/* Rating & Report */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={onJumpToRating}
              className="h-7 rounded-full transition flex items-center justify-center px-2.5 text-[11.5px] whitespace-nowrap border bg-white hover:bg-gray-50 border-gray-200 text-gray-900 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 dark:text-white"
              aria-label="Đánh giá"
              type="button"
            >
              <StarIcon className="w-[13px] h-[13px] text-yellow-500 fill-yellow-500" />
              <span className="ml-1 leading-none">Đánh giá</span>
            </button>

            <button
              onClick={onOpenReport}
              className="h-7 rounded-full transition flex items-center justify-center px-2.5 text-[11.5px] whitespace-nowrap border bg-white hover:bg-gray-50 border-gray-200 text-gray-900 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 dark:text-white"
              aria-label="Báo cáo"
              type="button"
            >
              <Flag className="w-[13px] h-[13px]" />
              <span className="ml-1 leading-none">Báo cáo</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
