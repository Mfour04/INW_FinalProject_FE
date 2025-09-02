import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import {
  MoreHorizontal,
  Ban,
  Flag,
  Heart,
  MessageCircle,
  Calendar
} from "lucide-react";

import avatarImage from "../../assets/img/default_avt.png";
import { getAvatarUrl } from "../../utils/avatar";
import { useAuth } from "../../hooks/useAuth";
import {
  blogFormatVietnamTimeFromTicks,
  blogFormatVietnamTimeFromTicksForUpdate,
  blogGetCurrentTicks,
} from "../../utils/date_format";
import { useUserBlogPosts, useUpdateBlogPost } from "../Blogs/HooksBlog";
import { useGetCurrentUserInfo } from "../setting/useUserSettings";
import { GetUserProfile } from "../../api/User/user-search.api";
import { FollowButton } from "../../components/common/FollowButton";
import { GetFollowers, GetFollowing } from "../../api/UserFollow/user-follow.api";

export const UserProfile = () => {
  const { username } = useParams<{ username: string }>();
  const [activeTab, setActiveTab] = useState<
    "posts" | "followers" | "following" | "achievements"
  >("posts");

  // simple dropdown (thay MUI Menu)
  const [menuOpen, setMenuOpen] = useState(false);
  const menuBtnRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const [updatedTimestamps, setUpdatedTimestamps] = useState<
    Record<string, string>
  >({});
  const navigate = useNavigate();
  const { auth } = useAuth();

  const isOwnProfile = !username || username === auth?.user?.userName;
  const targetUsername = username || auth?.user?.userName;
  const currentUserQuery = useGetCurrentUserInfo();

  const otherUserQuery = useQuery({
    queryKey: ["otherUserProfile", targetUsername],
    queryFn: () => GetUserProfile(targetUsername!),
    enabled: !isOwnProfile && !!targetUsername,
  });

  const userInfo = isOwnProfile ? currentUserQuery : otherUserQuery;
  const isLoadingUser = isOwnProfile
    ? currentUserQuery.isLoading
    : otherUserQuery.isLoading;
  const userError = isOwnProfile ? (currentUserQuery as any).error : (otherUserQuery as any).error;

  const userId =
    (userInfo as any)?.data?.id ||
    (userInfo as any)?.data?.data?.id ||
    auth?.user?.userId ||
    "";

  const { data: userPosts = [], isLoading: postsLoading } = useUserBlogPosts(userId);
  const updateBlogPostMutation = useUpdateBlogPost();

  useEffect(() => {
    const savedTimestamps: Record<string, string> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("blog_updated_")) {
        const postId = key.replace("blog_updated_", "");
        const timestamp = localStorage.getItem(key);
        if (timestamp) savedTimestamps[postId] = timestamp;
      }
    }
    setUpdatedTimestamps(savedTimestamps);
  }, []);

  // close dropdown khi click ra ngoài
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (
        menuOpen &&
        menuRef.current &&
        menuBtnRef.current &&
        !menuRef.current.contains(t) &&
        !menuBtnRef.current.contains(t)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [menuOpen]);

  const { data: followersData, isLoading: isLoadingFollowers } = useQuery({
    queryKey: ["followers", targetUsername || auth?.user?.userName],
    queryFn: () => GetFollowers(targetUsername || auth?.user?.userName!),
    enabled: !!(targetUsername || auth?.user?.userName),
    staleTime: 1000 * 60 * 5,
  });

  const { data: followingData, isLoading: isLoadingFollowing } = useQuery({
    queryKey: ["following", targetUsername || auth?.user?.userName],
    queryFn: () => GetFollowing(targetUsername || auth?.user?.userName!),
    enabled: !!(targetUsername || auth?.user?.userName),
    staleTime: 1000 * 60 * 5,
  });

  let backendData: any = null;
  if ((userInfo as any)?.data) {
    if ((userInfo as any).data.id) backendData = (userInfo as any).data;
    else if ((userInfo as any)?.data?.data) backendData = (userInfo as any).data.data;
  }

  const normalizedData = {
    AvatarUrl: backendData?.AvatarUrl || backendData?.avatarUrl,
    CoverUrl: backendData?.CoverUrl || backendData?.coverUrl,
    Bio: backendData?.Bio || backendData?.bio,
    DisplayName: backendData?.DisplayName || backendData?.displayName,
    UserName: backendData?.UserName || backendData?.userName,
    FollowerCount:
      backendData?.FollowerCount || backendData?.followerCount || 0,
    FollowingCount:
      backendData?.FollowingCount || backendData?.followingCount || 0,
  };

  const currentAvatar = getAvatarUrl(backendData?.avatarUrl);
  const currentCover = backendData?.coverUrl || "";
  const currentBio = normalizedData.Bio || auth?.user?.bio || "";
  const currentDisplayName =
    normalizedData.DisplayName || auth?.user?.displayName || "Unknown User";
  const currentUserName =
    backendData?.username || username || auth?.user?.userName || "unknown";
  const currentFollowerCount = Array.isArray(followersData?.data)
    ? followersData.data.length
    : 0;
  const currentFollowingCount = Array.isArray(followingData?.data)
    ? followingData.data.length
    : 0;
  const createdAt = backendData?.CreatedAt || backendData?.createdAt;
  const joinDate = createdAt
    ? blogFormatVietnamTimeFromTicks(createdAt)
    : "Tháng 3/2025";
  const targetUserId =
    backendData?.id ||
    backendData?.Id ||
    backendData?.UserId ||
    backendData?.userId ||
    "";

  const handleUpdatePost = (postId: string, content: string) => {
    updateBlogPostMutation.mutate(
      { postId, content },
      {
        onSuccess: () => {
          const nowTicks = blogGetCurrentTicks();
          const formatted = blogFormatVietnamTimeFromTicksForUpdate(nowTicks);
          setUpdatedTimestamps((prev) => ({ ...prev, [postId]: formatted }));
          localStorage.setItem(`blog_updated_${postId}`, formatted);
        },
        onError: () => {
          console.error("Có lỗi xảy ra khi cập nhật bài viết!");
        },
      }
    );
  };

  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-white text-zinc-900 dark:bg-[#0f0f0f] dark:text-white font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-zinc-500 dark:text-gray-400 text-lg">
            Đang tải thông tin người dùng...
          </p>
        </div>
      </div>
    );
  }

  if (userError) {
    return (
      <div className="min-h-screen bg-white text-zinc-900 dark:bg-[#0f0f0f] dark:text-white font-sans flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 text-lg mb-4">
            Có lỗi xảy ra khi tải thông tin người dùng
          </p>
          <p className="text-zinc-600 dark:text-gray-400 text-sm mb-4">
            Username: {targetUsername}
          </p>
          <p className="text-zinc-600 dark:text-gray-400 text-sm mb-4">
            Error: {(userError as any)?.message}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="rounded px-4 py-2 font-semibold text-white bg-gradient-to-r from-[#ff512f] via-[#ff6740] to-[#ff9966] hover:brightness-110"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!userInfo && !isLoadingUser) {
    return (
      <div className="min-h-screen bg-white text-zinc-900 dark:bg-[#0f0f0f] dark:text-white font-sans flex items-center justify-center">
        <div className="text-center">
          <p className="text-amber-600 dark:text-yellow-400 text-lg mb-4">
            Không có dữ liệu người dùng
          </p>
          <p className="text-zinc-600 dark:text-gray-400 text-sm mb-4">
            isOwnProfile: {isOwnProfile.toString()}
          </p>
          <p className="text-zinc-600 dark:text-gray-400 text-sm mb-4">
            targetUsername: {targetUsername}
          </p>
          <p className="text-zinc-600 dark:text-gray-400 text-sm mb-4">
            auth user: {auth?.user?.userName}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="rounded px-4 py-2 font-semibold text-white bg-gradient-to-r from-[#ff512f] via-[#ff6740] to-[#ff9966] hover:brightness-110"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  const gradBtn =
    "inline-flex items-center justify-center rounded-full px-4 py-2 text-[13px] font-semibold text-white bg-gradient-to-r from-[#ff512f] via-[#ff6740] to-[#ff9966] hover:brightness-110 transition";
  const neutralBtn =
    "inline-flex items-center justify-center rounded-full px-4 py-2 text-[13px] font-semibold bg-zinc-100 text-zinc-800 ring-1 ring-zinc-200 hover:bg-zinc-200/80 dark:bg-white/10 dark:text-white dark:ring-white/10 dark:hover:bg-white/20 transition";

  const renderTabContent = () => {
    switch (activeTab) {
      case "posts":
        return (
          <div className="mt-6">
            {postsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                <p className="text-zinc-600 dark:text-gray-400 mt-2">
                  Đang tải bài đăng...
                </p>
              </div>
            ) : userPosts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-zinc-600 dark:text-gray-400">
                  Chưa có bài đăng nào.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {userPosts.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => navigate(`/blogs?post=${post.id}`)}
                    className={[
                      "p-4 rounded-lg cursor-pointer transition-all duration-200",
                      // light
                      "bg-white ring-1 ring-zinc-200 hover:bg-zinc-50 shadow-sm",
                      // dark
                      "dark:bg-white/[0.02] dark:ring-1 dark:ring-white/10 dark:hover:bg-white/[0.05] dark:shadow-none",
                    ].join(" ")}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <img
                        src={getAvatarUrl(post.author?.avatar)}
                        alt="Avatar"
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-white dark:ring-white/10"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = getAvatarUrl(null);
                        }}
                      />
                      <div>
                        <p className="font-semibold text-zinc-900 dark:text-white">
                          {post.author?.displayName ||
                            post.author?.username ||
                            "Ẩn danh"}
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-gray-400">
                          @{post.author?.username || "user"}
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-gray-400">
                          {updatedTimestamps[post.id] ||
                            (post.createdAt
                              ? blogFormatVietnamTimeFromTicks(post.createdAt)
                              : "Không rõ thời gian")}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed text-zinc-700 dark:text-gray-300 line-clamp-3">
                      {post.content}
                    </p>
                    {post.imgUrls && post.imgUrls.length > 0 && (
                      <div className="mt-3">
                        {post.imgUrls.length === 1 ? (
                          <img
                            src={post.imgUrls[0]}
                            alt="Post image"
                            className="max-h-96 rounded-lg object-cover w-full"
                          />
                        ) : (
                          <div className="flex gap-2">
                            {post.imgUrls.slice(0, 4).map((img, index) => (
                              <img
                                key={index}
                                src={img}
                                alt={`Post image ${index + 1}`}
                                className="h-32 rounded-lg object-cover"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    <div className="mt-3 flex items-center space-x-4 text-sm text-zinc-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        <span>{post.likeCount || 0}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.commentCount || 0}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "followers":
        return (
          <div className="mt-6">
            {isLoadingFollowers ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                <p className="text-zinc-600 dark:text-gray-400 mt-2">
                  Đang tải danh sách người theo dõi...
                </p>
              </div>
            ) : !followersData?.data ||
              !Array.isArray(followersData.data) ||
              followersData.data.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-zinc-600 dark:text-gray-400">
                  Chưa có người theo dõi nào.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {followersData.data.map((follower: any) => (
                  <div
                    key={follower.id}
                    className="rounded-2xl p-[1px] bg-[linear-gradient(135deg,rgba(255,103,64,0.18),rgba(0,0,0,0.03)_28%,rgba(0,0,0,0)_100%)] dark:bg-[linear-gradient(135deg,rgba(255,103,64,0.35),rgba(255,255,255,0.08)_28%,rgba(255,255,255,0)_100%)]"
                  >
                    <div className="rounded-2xl p-4 flex flex-col items-center h-full bg-white ring-1 ring-zinc-200 shadow-sm dark:bg-[#0b0d11] dark:ring-0">
                      <img
                        src={getAvatarUrl(follower.avatar)}
                        alt={follower.displayName}
                        className="w-16 h-16 rounded-full mb-2 object-cover ring-2 ring-white/80 dark:ring-white/10"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = getAvatarUrl(null);
                        }}
                      />
                      <p className="font-semibold text-zinc-900 dark:text-white text-sm text-center truncate w-full">
                        {follower.displayName}
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-gray-400 text-center">
                        @{follower.userName}
                      </p>
                      <button
                        className={gradBtn + " mt-2"}
                        onClick={() => {
                          if (follower.userName) navigate(`/profile/${follower.userName}`);
                          else console.error("Username is missing for follower user:", follower);
                        }}
                      >
                        Trang cá nhân
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "following":
        return (
          <div className="mt-6">
            {isLoadingFollowing ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                <p className="text-zinc-600 dark:text-gray-400 mt-2">
                  Đang tải danh sách đang theo dõi...
                </p>
              </div>
            ) : !followingData?.data ||
              !Array.isArray(followingData.data) ||
              followingData.data.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-zinc-600 dark:text-gray-400">
                  Chưa theo dõi ai.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {followingData.data.map((following: any) => (
                  <div
                    key={following.id}
                    className="rounded-2xl p-[1px] bg-[linear-gradient(135deg,rgba(255,103,64,0.18),rgba(0,0,0,0.03)_28%,rgba(0,0,0,0)_100%)] dark:bg-[linear-gradient(135deg,rgba(255,103,64,0.35),rgba(255,255,255,0.08)_28%,rgba(255,255,255,0)_100%)]"
                  >
                    <div className="rounded-2xl p-4 flex flex-col items-center h-full bg-white ring-1 ring-zinc-200 shadow-sm dark:bg-[#0b0d11] dark:ring-0">
                      <img
                        src={getAvatarUrl(following.avatar)}
                        alt={following.displayName}
                        className="w-16 h-16 rounded-full mb-2 object-cover ring-2 ring-white/80 dark:ring-white/10"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = getAvatarUrl(null);
                        }}
                      />
                      <p className="font-semibold text-zinc-900 dark:text-white text-sm text-center truncate w-full">
                        {following.displayName}
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-gray-400 text-center">
                        @{following.userName}
                      </p>
                      <button
                        className={gradBtn + " mt-2"}
                        onClick={() => {
                          if (following.userName) navigate(`/profile/${following.userName}`);
                          else console.error("Username is missing for following user:", following);
                        }}
                      >
                        Trang cá nhân
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return (
          <p className="mt-6 text-zinc-600 dark:text-gray-400">
            Chưa có thành tựu.
          </p>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 dark:bg-[#0f0f0f] dark:text-white font-sans">
      {/* Cover */}
      <div className="relative w-full h-60 md:h-60">
        <img
          src={currentCover || avatarImage}
          alt="Cover"
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = avatarImage;
          }}
        />
      </div>

      {/* Header */}
      <div className="relative max-w-5xl mx-auto px-6 md:px-8">
        <div className="absolute left-6 md:left-8 -top-12 md:-top-16">
          <img
            src={getAvatarUrl(currentAvatar)}
            alt="Avatar"
            className="w-[150px] h-[150px] md:w-[180px] md:h-[180px] rounded-full border-4 border-white dark:border-[#0f0f0f] shadow-lg object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = getAvatarUrl(null);
            }}
          />
        </div>

        <div className="pl-3 pt-2.5 md:pt-3">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div className="pl-0 md:pl-48">
              <h1 className="text-3xl font-bold leading-tight">
                {currentDisplayName}
              </h1>
              <p className="text-zinc-500 dark:text-gray-400">@{currentUserName}</p>
            </div>

            <div className="flex items-center gap-3">
              {!isOwnProfile && auth?.user && (
                <FollowButton
                  targetUserId={targetUserId}
                  enabled={!!targetUserId}
                  size="lg"
                // variant="contained"
                />
              )}

              {!isOwnProfile && auth?.user && (
                <>
                  <div
                    ref={menuBtnRef}
                    onClick={() => setMenuOpen((v) => !v)}
                    className="cursor-pointer ring-1 ring-zinc-200 bg-zinc-100 hover:bg-zinc-200/80 dark:bg-white/10 dark:ring-white/10 dark:hover:bg-white/20 p-2 rounded-full transition"
                    title="Tùy chọn khác"
                    role="button"
                    aria-haspopup="menu"
                    aria-expanded={menuOpen}
                  >
                    <MoreHorizontal className="h-5 w-5 text-zinc-700 dark:text-zinc-200" />
                  </div>

                  {/* Dropdown */}
                  {menuOpen && (
                    <div
                      ref={menuRef}
                      className="absolute right-6 md:right-8 mt-22 w-52 rounded-xl overflow-hidden ring-1 ring-zinc-200 shadow-lg bg-white text-zinc-900 dark:bg-[#1b1e24] dark:text-white dark:ring-white/10 z-50"
                      role="menu"
                    >
                      <button
                        onClick={() => {
                          alert("Báo cáo người dùng");
                          setMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/10 flex items-center gap-2"
                        role="menuitem"
                      >
                        <Flag size={16} /> Báo cáo
                      </button>
                      {/* <button
                        onClick={() => {
                          alert("Đã chặn người dùng");
                          setMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2.5 text-sm hover:bg-zinc-100 dark:hover:bg-white/10 flex items-center gap-2"
                        role="menuitem"
                      >
                        <Ban size={16} /> Chặn người dùng
                      </button> */}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="mt-1 md:pl-48">
            <p className="text-zinc-700 dark:text-gray-300 max-w-2xl">
              {currentBio ||
                "Một chiếc bio thật ngầu, để giới thiệu bản thân trong thế giới sáng tác."}
            </p>

            <div className="mt-2 text-sm text-zinc-600 dark:text-gray-400 flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="font-semibold text-zinc-900 dark:text-white">
                {currentFollowingCount}
              </span>{" "}
              Đang theo dõi
              <span className="mx-1">•</span>
              <span className="font-semibold text-zinc-900 dark:text-white">
                {currentFollowerCount}
              </span>{" "}
              Người theo dõi
              <span className="mx-1">•</span>
              <span className="font-semibold text-zinc-900 dark:text-white">
                {userPosts.length}
              </span>{" "}
              Bài đăng

              <span className="mx-1">•</span>
              <span className="flex items-center gap-1 text-sm text-zinc-900 dark:text-white">
                <Calendar className="w-3 h-3" /> Tham gia {joinDate}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mt-8 border-b border-zinc-200 dark:border-white/10">
        <div className="flex gap-10 text-[15px]">
          {(
            ["posts", "followers", "following", "achievements"] as const
          ).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={[
                "pb-3 transition",
                activeTab === tab
                  ? "border-b-2 border-[#ff6740] text-[#ff8967] font-semibold"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-gray-400 dark:hover:text-white",
              ].join(" ")}
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

      <div className="max-w-5xl mx-auto px-6 py-6">{renderTabContent()}</div>
    </div>
  );
};
