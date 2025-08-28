import React from "react";
import { SectionCard } from "../components/SectionCard";
import { InputShell } from "../components/InputShell";
import { getAvatarUrl } from "../../../utils/avatar";

type Props = {
  displayName: string;
  username: string;
  bio: string;
  errors: { displayName?: string; bio?: string };
  joinDate: string;
  currentUserName: string;
  avatarUrl?: string;
  coverUrl?: string;
  avatarPreview: string;
  coverPreview: string;
  setDisplayName: (v: string) => void;
  setBio: (v: string) => void;
  onSelectFile: (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "avatar" | "cover"
  ) => void;
  avatarInputRef:
    | React.RefObject<HTMLInputElement>
    | React.MutableRefObject<HTMLInputElement | null>;
  coverInputRef:
    | React.RefObject<HTMLInputElement>
    | React.MutableRefObject<HTMLInputElement | null>;
  onSave: () => void;
  hasChanges: boolean;
  isLoading: boolean;
};

export const DisplaySection = ({
  displayName,
  username,
  bio,
  errors,
  joinDate,
  currentUserName,
  avatarUrl,
  coverUrl,
  avatarPreview,
  coverPreview,
  setDisplayName,
  setBio,
  onSelectFile,
  avatarInputRef,
  coverInputRef,
  onSave,
  hasChanges,
  isLoading,
}: Props) => {
  return (
    <div className="space-y-6">
      <SectionCard className="overflow-hidden">
        <div className="relative">
          <div className="h-36 sm:h-48 rounded-xl overflow-hidden ring-1 ring-zinc-200 dark:ring-white/10">
            {coverPreview || coverUrl ? (
              <img
                src={coverPreview || coverUrl}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-[radial-gradient(120%_100%_at_0%_0%,rgba(255,103,64,0.12)_0%,rgba(255,103,64,0.06)_38%,rgba(0,0,0,0)_70%)] dark:bg-[radial-gradient(120%_100%_at_0%_0%,rgba(255,103,64,0.28)_0%,rgba(255,103,64,0.12)_38%,rgba(255,255,255,0)_70%)]" />
            )}
          </div>

          <div className="absolute -bottom-8 left-4 sm:left-6">
            <div className="rounded-full p-[3px] bg-[conic-gradient(from_210deg,#ff512f_0%,#ff6740_40%,#ff9966_75%,#ff512f_100%)] shadow-[0_8px_30px_rgba(255,103,64,0.25)]">
              <img
                src={avatarPreview || getAvatarUrl(avatarUrl)}
                alt="Profile"
                className="w-[88px] h-[88px] sm:w-[104px] sm:h-[104px] rounded-full object-cover ring-4 ring-white dark:ring-[#121418]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = getAvatarUrl(null);
                }}
              />
            </div>
          </div>
        </div>

        <div className="mt-12 sm:mt-16 pl-4 sm:pl-6">
          <h2 className="text-lg sm:text-xl font-semibold text-zinc-900 dark:text-white">
            {displayName || "Chưa có tên hiển thị"}
          </h2>
          <p className="text-[13px] text-zinc-600 dark:text-zinc-400 mt-1">
            @{username || currentUserName || "username"}{" "}
            <span className="mx-2">•</span> Tham gia{" "}
            {joinDate || "Tháng 3/2025"}
          </p>
          {bio && (
            <p className="text-[13.5px] sm:text-sm text-zinc-700 dark:text-zinc-300 mt-2 max-w-2xl leading-relaxed">
              {bio}
            </p>
          )}
        </div>
      </SectionCard>

      <SectionCard
        title="Thông tin cơ bản"
        desc="Cập nhật hiển thị hồ sơ của bạn."
      >
        <div className="space-y-5">
          <InputShell
            label="Tên hiển thị"
            required
            hint="Tên hiển thị có thể trùng lặp với người dùng khác"
          >
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Nhập tên hiển thị"
              className={[
                "w-full rounded-md px-3 py-2 text-sm",
                "bg-white text-zinc-800 placeholder-zinc-400",
                "ring-1 ring-zinc-300 focus:outline-none focus:ring-2 focus:ring-[#ff8a5c]/40",
                "dark:bg-[#0f1115] dark:text-white dark:placeholder-zinc-500 dark:ring-white/10 dark:focus:ring-[#ff8a5c]/35",
                "transition",
              ].join(" ")}
            />
            {errors.displayName && (
              <div className="text-red-500 text-xs mt-1">
                {errors.displayName}
              </div>
            )}
          </InputShell>

          <InputShell
            label="Tên người dùng"
            hint="Tên người dùng không thể thay đổi"
          >
            <div className="relative">
              <input
                type="text"
                value={username || currentUserName || ""}
                disabled
                className={[
                  "w-full rounded-lg px-3 sm:px-3.5 py-2.5 text-sm",
                  "bg-zinc-50 ring-1 ring-zinc-200 text-zinc-700",
                  "dark:bg-[#0f1115] dark:text-zinc-300 dark:ring-white/10",
                ].join(" ")}
                placeholder="username"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <div className="w-5 h-5 rounded-full bg-emerald-500 grid place-items-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              </div>
            </div>
          </InputShell>

          <InputShell label="Tiểu sử">
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Nhập tiểu sử..."
              className={[
                "w-full rounded-lg resize-none px-3.5 py-3 text-sm",
                "bg-zinc-50 ring-1 ring-zinc-200 text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#ff8a5c]/40",
                "dark:bg-[#0f1115] dark:text-white dark:placeholder-zinc-500 dark:ring-white/10 dark:focus:ring-[#ff8a5c]/35",
              ].join(" ")}
              rows={3}
            />
            <div className="flex items-center justify-between mt-1">
              {errors.bio && (
                <div className="text-red-500 text-xs">{errors.bio}</div>
              )}
              <span
                className={`text-xs ${
                  bio && bio.length > 450
                    ? "text-orange-500"
                    : "text-zinc-500 dark:text-zinc-400"
                }`}
              >
                {bio?.length || 0}/500
              </span>
            </div>
          </InputShell>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div>
              <InputShell label="Ảnh đại diện">
                <input
                  type="file"
                  ref={avatarInputRef}
                  onChange={(e) => onSelectFile(e, "avatar")}
                  accept="image/*"
                  className="hidden"
                />
                <div
                  onClick={() => avatarInputRef.current?.click()}
                  className={[
                    "rounded-xl grid place-items-center overflow-hidden cursor-pointer h-36",
                    "ring-1 ring-zinc-200 bg-zinc-50 hover:bg-zinc-100/80",
                    "dark:bg-white/5 dark:ring-white/10 dark:hover:bg-white/10",
                    "transition-colors",
                  ].join(" ")}
                >
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="w-full h-full object-cover"
                    />
                  ) : avatarUrl ? (
                    <img
                      src={getAvatarUrl(avatarUrl)}
                      alt="Current avatar"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = getAvatarUrl(null);
                      }}
                    />
                  ) : (
                    <div className="text-zinc-400 text-sm">+ Tải ảnh</div>
                  )}
                </div>
              </InputShell>
            </div>

            <div className="md:col-span-3">
              <InputShell label="Ảnh bìa">
                <input
                  type="file"
                  ref={coverInputRef}
                  onChange={(e) => onSelectFile(e, "cover")}
                  accept="image/*"
                  className="hidden"
                />
                <div
                  onClick={() => coverInputRef.current?.click()}
                  className={[
                    "rounded-xl grid place-items-center overflow-hidden cursor-pointer h-36",
                    "ring-1 ring-zinc-200 bg-zinc-50 hover:bg-zinc-100/80",
                    "dark:bg-white/5 dark:ring-white/10 dark:hover:bg-white/10",
                    "transition-colors",
                  ].join(" ")}
                >
                  {coverPreview ? (
                    <img
                      src={coverPreview}
                      alt="Cover preview"
                      className="w-full h-full object-cover"
                    />
                  ) : coverUrl ? (
                    <img
                      src={coverUrl}
                      alt="Current cover"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-zinc-400 text-sm">+ Tải ảnh</div>
                  )}
                </div>
              </InputShell>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={onSave}
              disabled={
                !hasChanges || isLoading || Object.keys(errors).length > 0
              }
              className={[
                "rounded-full px-5 py-2 text-sm font-semibold transition",
                hasChanges && Object.keys(errors).length === 0
                  ? "text-white bg-gradient-to-r from-[#ff512f] via-[#ff6740] to-[#ff9966] hover:brightness-110"
                  : "text-zinc-500 bg-zinc-200 dark:bg-white/10 dark:text-zinc-400 cursor-not-allowed",
              ].join(" ")}
            >
              {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </div>
      </SectionCard>
    </div>
  );
};
