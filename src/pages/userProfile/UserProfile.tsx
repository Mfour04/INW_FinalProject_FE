// src/components/UserProfile/UserProfile.tsx
import { useState } from "react";
import { Menu, MenuItem } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import BlockIcon from "@mui/icons-material/Block";
import { Flag } from "lucide-react";

import avatarImage from "../../assets/img/th.png";
import bannerImage from "../../assets/img/hlban.jpg";
import { CalendarUserIcon } from "./UserProfileIcon";

export const UserProfile = () => {
  const [activeTab, setActiveTab] = useState<
    "posts" | "followers" | "following" | "achievements"
  >("posts");
  const [isFollowing, setIsFollowing] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const isOwnProfile = true; // đổi sang false nếu là profile người khác

  const handleFollowClick = () => setIsFollowing((v) => !v);
  const handleMenuOpen = (e: React.MouseEvent<HTMLDivElement>) =>
    setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const gradBtn =
    "inline-flex items-center justify-center rounded-full px-4 py-2 text-[13px] font-semibold text-white bg-gradient-to-r from-[#ff512f] via-[#ff6740] to-[#ff9966] hover:from-[#ff6a3d] hover:via-[#ff6740] hover:to-[#ffa177] transition";
  const neutralBtn =
    "inline-flex items-center justify-center rounded-full px-4 py-2 text-[13px] font-semibold text-white bg-white/10 hover:bg-white/20 ring-1 ring-white/10 transition";

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white font-sans">
      <div className="relative w-full h-60 md:h-60">
        <img src={bannerImage} alt="Cover" className="w-full h-full object-cover" />
      </div>

      <div className="relative max-w-5xl mx-20 px-20">
        <div className="absolute left-6 md:left-8 -top-12 md:-top-16">
          <img
            src={avatarImage}
            alt="Avatar"
            className="w-37.5 h-37.5 md:w-45 md:h-45 rounded-full border-4 border-[#0f0f0f] shadow-lg object-cover"
          />
        </div>

        <div className="pl-3 pt-2.5 md:pt-3">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div className="pl-0 md:pl-40">
              <h1 className="text-3xl font-bold leading-tight">Hít Lê</h1>
              <p className="text-gray-400">@fromgermanwithlove</p>
            </div>

            <div className="flex items-center gap-3">
              {!isOwnProfile && (
                <button
                  onClick={handleFollowClick}
                  className={isFollowing ? neutralBtn : gradBtn}
                >
                  {isFollowing ? "Bỏ theo dõi" : "Theo dõi"}
                </button>
              )}

              {!isOwnProfile && (
                <>
                  <div
                    onClick={handleMenuOpen}
                    className="cursor-pointer border border-white/10 p-2 rounded-full hover:bg-white/10 transition"
                    title="Tùy chọn khác"
                  >
                    <MoreHorizIcon sx={{ color: "#ddd" }} />
                  </div>

                  <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleMenuClose}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                    slotProps={{
                      paper: {
                        sx: {
                          bgcolor: "#1f1f1f",
                          color: "#fff",
                          borderRadius: 2,
                          minWidth: 200,
                          boxShadow: 4,
                          border: "1px solid rgba(255,255,255,0.08)",
                        },
                      },
                    }}
                  >
                    <MenuItem
                      onClick={() => {
                        alert("Báo cáo người dùng");
                        handleMenuClose();
                      }}
                      sx={{ fontSize: 14, gap: 1 }}
                    >
                      <Flag size={16} /> Báo cáo
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        alert("Đã chặn người dùng");
                        handleMenuClose();
                      }}
                      sx={{ fontSize: 14, gap: 1 }}
                    >
                      <BlockIcon fontSize="small" /> Chặn người dùng
                    </MenuItem>
                  </Menu>
                </>
              )}
            </div>
          </div>

          <div className="mt-3 md:pl-40">
            <p className="text-gray-300 max-w-2xl">
              Một chiếc bio thật ngầu, để giới thiệu bản thân trong thế giới sáng tác.
            </p>
            <p className="text-sm text-gray-400 mt-2 flex items-center gap-2">
              <CalendarUserIcon className="w-4 h-4" /> Tham gia từ Tháng 3/2025
            </p>
            <div className="mt-2 text-gray-400 text-sm">
              <span className="font-semibold text-white">3</span> Đang theo dõi
              <span className="mx-2">•</span>
              <span className="font-semibold text-white">2</span> Người theo dõi
              <span className="mx-2">•</span>
              <span className="font-semibold text-white">12</span> Bài đăng
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-8 border-b border-white/10">
        <div className="flex gap-10 text-[15px]">
          {(["posts", "followers", "following", "achievements"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 transition ${
                activeTab === tab
                  ? "border-b-2 border-[#ff6740] text-[#ff8967] font-semibold"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab === "posts"
                ? "Bài đăng"
                : tab === "followers"
                ? "Người theo dõi"
                : tab === "following"
                ? "Đang theo dõi"
                : "Thành tựu"}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6">
        {activeTab === "posts" && <div className="text-gray-400">Danh sách bài đăng...</div>}
        {activeTab === "followers" && <div className="text-gray-400">Danh sách người theo dõi...</div>}
        {activeTab === "following" && <div className="text-gray-400">Danh sách đang theo dõi...</div>}
        {activeTab === "achievements" && <div className="text-gray-400">Chưa có thành tựu.</div>}
      </div>
    </div>
  );
};
