// src/components/common/FollowButton.tsx
import React from "react";
import { UserPlus, UserCheck, Loader2 } from "lucide-react";
import { useFollow } from "../../../pages/userProfile";

type Size = "sm" | "md" | "lg";

type FollowButtonProps = {
  targetUserId: string;
  enabled?: boolean;
  size?: Size;
  className?: string;
  fullWidth?: boolean;
  hideText?: boolean; // chỉ icon
  labels?: {
    follow?: string;
    following?: string;
    followBack?: string;
  };
};

// gộp class tiện dụng
function cn(...args: Array<string | false | null | undefined>) {
  return args.filter(Boolean).join(" ");
}

const SIZE_MAP: Record<
  Size,
  { h: string; px: string; text: string; gap: string; icon: string }
> = {
  sm: {
    h: "h-7",
    px: "px-2.5",
    text: "text-[12px]",
    gap: "gap-1.5",
    icon: "h-3.5 w-3.5",
  },
  md: {
    h: "h-8",
    px: "px-3",
    text: "text-[13px]",
    gap: "gap-2",
    icon: "h-4 w-4",
  },
  lg: {
    h: "h-9",
    px: "px-3.5",
    text: "text-[14px]",
    gap: "gap-2.5",
    icon: "h-4 w-4",
  },
};

export const FollowButton: React.FC<FollowButtonProps> = ({
  targetUserId,
  enabled = true,
  size = "md",
  className,
  fullWidth = false,
  hideText = false,
  labels,
}) => {
  const { isFollowing, isFollowedBy, isLoading, isPending, toggleFollow } =
    useFollow(targetUserId, enabled);

  if (!enabled) return null;

  const L = {
    follow: labels?.follow ?? "Theo dõi",
    following: labels?.following ?? "Đang theo dõi",
    followBack: labels?.followBack ?? "Theo dõi lại",
  };

  const t = SIZE_MAP[size];

  const icon = isPending ? (
    <Loader2 className={cn(t.icon, "animate-spin")} aria-hidden />
  ) : isFollowing ? (
    <UserCheck className={t.icon} aria-hidden />
  ) : (
    <UserPlus className={t.icon} aria-hidden />
  );

  const text = isFollowing
    ? L.following
    : isFollowedBy
    ? L.followBack
    : L.follow;

  // Minimal pill: khi chưa follow => brand gradient; khi đã follow => neutral subtle
  const classes = cn(
    "inline-flex items-center justify-center select-none rounded-full font-semibold",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#ff7a55] dark:focus-visible:ring-offset-0",
    "transition",
    "disabled:opacity-60 disabled:cursor-not-allowed",
    t.h,
    t.px,
    t.text,
    t.gap,
    fullWidth && "w-full",
    isFollowing
      ? [
          // light (neutral)
          "bg-zinc-100 text-zinc-800 ring-1 ring-zinc-200 hover:bg-zinc-200/80",
          // dark
          "dark:bg-white/10 dark:text-white dark:ring-1 dark:ring-white/12 dark:hover:bg-white/16",
        ].join(" ")
      : [
          // light brand
          "text-white ring-0",
          "bg-gradient-to-r from-[#ff512f] via-[#ff6740] to-[#ff9966]",
          "hover:brightness-110 active:brightness-95",
          // dark giữ gradient
          "dark:text-white",
        ].join(" "),
    className
  );

  return (
    <button
      type="button"
      onClick={toggleFollow}
      disabled={isPending || isLoading}
      aria-pressed={isFollowing}
      aria-busy={isPending}
      title={text}
      className={classes}
    >
      {icon}
      {!hideText && <span className="whitespace-nowrap">{text}</span>}
    </button>
  );
};

export default FollowButton;
