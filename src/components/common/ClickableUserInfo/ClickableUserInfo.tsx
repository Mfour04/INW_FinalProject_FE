import React from "react";
import { useNavigate } from "react-router-dom";
import { getAvatarUrl as getAvatarUrlUtil } from "../../../utils/avatar";

interface ClickableUserInfoProps {
  userId?: string;
  username?: string;
  displayName?: string;
  avatarUrl?: string;
  size?: "small" | "medium" | "large";
  showUsername?: boolean;
  className?: string;
}

export const ClickableUserInfo: React.FC<ClickableUserInfoProps> = ({
  userId,
  username,
  displayName,
  avatarUrl,
  size = "medium",
  showUsername = true,
  className = "",
}) => {
  const navigate = useNavigate();

  const sizeClasses = {
    small: {
      avatar: "w-6 h-6",
      name: "text-xs",
      username: "text-[11px]",
    },
    medium: {
      avatar: "w-8 h-8",
      name: "text-sm",
      username: "text-xs",
    },
    large: {
      avatar: "w-10 h-10",
      name: "text-base",
      username: "text-sm",
    },
  } as const;

  const targetSlug = username ?? userId;
  const goProfile = () => {
    if (!targetSlug) return;
    try {
      navigate(`/profile/${targetSlug}`);
    } catch {
      window.location.href = `/profile/${targetSlug}`;
    }
  };

  // Block “non-clickable” khi thiếu cả username & userId
  if (!targetSlug) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <img
          src={getAvatarUrlUtil(avatarUrl)}
          alt={displayName || "User"}
          className={`${sizeClasses[size].avatar} rounded-full object-cover flex-shrink-0`}
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = getAvatarUrlUtil(null);
          }}
        />
        <div className="min-w-0">
          {/* Tên hiển thị: light/dark */}
          <p
            className={`${sizeClasses[size].name} font-semibold truncate text-gray-900 dark:text-white`}
          >
            {displayName || "Người dùng"}
          </p>
        </div>
      </div>
    );
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      goProfile();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={goProfile}
      onKeyDown={handleKey}
      title={`Xem profile của ${displayName || username}`}
      className={[
        "group flex items-center space-x-2 cursor-pointer hover:opacity-90 transition-opacity",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff6f45]/70 rounded-md",
        className,
      ].join(" ")}
    >
      <img
        src={getAvatarUrlUtil(avatarUrl)}
        alt={displayName || username!}
        className={`${sizeClasses[size].avatar} rounded-full object-cover flex-shrink-0`}
        loading="lazy"
        onError={(e) => {
          (e.target as HTMLImageElement).src = getAvatarUrlUtil(null);
        }}
      />
      <div className="min-w-0">
        {/* Tên hiển thị: đổi màu theo theme + hover màu brand */}
        <p
          className={[
            sizeClasses[size].name,
            "font-semibold truncate transition-colors",
            "text-gray-900 dark:text-white",
            "group-hover:text-[#ff6f45]",
          ].join(" ")}
        >
          {displayName || username}
        </p>

        {showUsername && (
          <p
            className={[
              sizeClasses[size].username,
              "truncate",
              "text-gray-600 dark:text-zinc-400",
            ].join(" ")}
          >
            @{username}
          </p>
        )}
      </div>
    </div>
  );
};

export default ClickableUserInfo;
