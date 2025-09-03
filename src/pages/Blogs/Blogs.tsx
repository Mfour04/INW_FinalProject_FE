import { useState, useRef, useEffect, useContext, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext/AuthProvider";
import { useToast } from "../../context/ToastContext/toast-context";

import PostForm from "../Blogs/Post/PostForm";
import PostItem from "../Blogs/Post/PostItem";
import ReportPopup from "../Blogs/Modals/ReportPopup";
import ProfileSidebar from "../Blogs/Sidebar/ProfileSidebar";
import { ConfirmModal } from "../../components/ConfirmModal/ConfirmModal";

import {
  useBlogPosts,
  useUserBlogPosts,
  useCreateBlogPost,
  useDeleteBlogPost,
  useUpdateBlogPost,
} from "./HooksBlog";
import { useQuery } from "@tanstack/react-query";
import {
  GetFollowers,
  GetFollowing,
} from "../../api/UserFollow/user-follow.api";
import { LikeBlogPost, UnlikeBlogPost } from "../../api/Blogs/blogs.api";
import {
  blogFormatVietnamTimeFromTicks,
  blogFormatVietnamTimeFromTicksForUpdate,
  blogGetCurrentTicks,
} from "../../utils/date_format";

import type { Tabs } from "./types";
import {
  REPORT_REASON_CODE,
  ReportCommentModal,
  ReportPostModal,
  type ReportPayload,
} from "../../components/ReportModal/ReportModal";
import { useReport } from "../../hooks/useReport";
import type { ReportRequest } from "../../api/Report/report.type";

/** Card: dual-theme */
const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={[
      // Light
      "rounded-2xl bg-white ring-1 ring-zinc-200 shadow-sm",
      // Dark
      "dark:bg-white/[0.035] dark:ring-white/10 dark:backdrop-blur-md dark:shadow-none",
      className,
    ].join(" ")}
  >
    {children}
  </div>
);

export const Blogs = () => {
  const { auth } = useContext(AuthContext);
  const toast = useToast();
  const [searchParams] = useSearchParams();
  const targetPostId = searchParams.get("post");

  const [tab, setTab] = useState<Tabs>("all");
  const [content, setContent] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isPosting, setIsPosting] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [reportPostId, setReportPostId] = useState<string | null>(null);
  const [reportCommentId, setReportCommentId] = useState<string | null>(null);

  const [menuOpenPostId, setMenuOpenPostId] = useState<string | null>(null);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [openComments, setOpenComments] = useState<Set<string>>(new Set());
  const [isMobile, setIsMobile] = useState(false);
  const [openReplyId, setOpenReplyId] = useState<string | null>(null);

  const [menuOpenCommentId, setMenuOpenCommentId] = useState<string | null>(
    null
  );
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<string>("");
  const [updatedTimestamps, setUpdatedTimestamps] = useState<
    Record<string, string>
  >({});
  const resetFileInputRef = useRef<(() => void) | null>(null);
  const [hasScrolledToTarget, setHasScrolledToTarget] = useState(false);

  const [visibleRootComments, setVisibleRootComments] = useState<{
    [postId: string]: number;
  }>({});
  const [replyingTo, setReplyingTo] = useState<{
    commentId: string;
    username: string;
  } | null>(null);
  const [commentInput, setCommentInput] = useState<string>("");
  const [reportPost, setReportPost] = useState<boolean>(false);
  const [reportComment, setReportComment] = useState<boolean>(false);

  const report = useReport();

  const {
    data: allBlogPosts = [],
    isLoading: isLoadingAll,
    refetch: refetchAll,
  } = useBlogPosts();

  const { data: followingUsers = [], isLoading: isLoadingFollowingUsers } =
    useQuery({
      queryKey: ["following", auth?.user?.userName],
      queryFn: () => GetFollowing(auth?.user?.userName!),
      enabled: !!auth?.user?.userName,
      staleTime: 1000 * 60 * 5,
    });

  const followingUserIds = Array.isArray(followingUsers?.data)
    ? followingUsers.data.map((user: any) => user.id)
    : [];

  const followingBlogPosts = useMemo(() => {
    if (!followingUserIds.length) return [];

    const filteredPosts = allBlogPosts.filter((post: any) =>
      followingUserIds.includes(post.author?.id || post.user_id)
    );

    return filteredPosts.sort(
      (a: any, b: any) => (b.createdAt || 0) - (a.createdAt || 0)
    );
  }, [followingUserIds, allBlogPosts]);

  const isLoadingFollowing = isLoadingFollowingUsers;

  const { data: followersData, isLoading: isLoadingFollowers } = useQuery({
    queryKey: ["followers", auth?.user?.userName],
    queryFn: () => GetFollowers(auth?.user?.userName!),
    enabled: !!auth?.user?.userName,
    staleTime: 1000 * 60 * 5,
  });

  const { data: followingData, isLoading: isLoadingFollowingStats } = useQuery({
    queryKey: ["following", auth?.user?.userName],
    queryFn: () => GetFollowing(auth?.user?.userName!),
    enabled: !!auth?.user?.userName,
    staleTime: 1000 * 60 * 5,
  });

  const followingCount = Array.isArray(followingData?.data)
    ? followingData.data.length
    : 0;
  const followersCount = Array.isArray(followersData?.data)
    ? followersData.data.length
    : 0;

  useEffect(() => {
    const savedTimestamps: Record<string, string> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("blog_updated_")) {
        const postId = key.replace("blog_updated_", "");
        const timestamp = localStorage.getItem(key);
        if (timestamp) {
          savedTimestamps[postId] = timestamp;
        }
      }
    }
    setUpdatedTimestamps(savedTimestamps);
  }, []);

  const blogPosts = tab === "following" ? followingBlogPosts : allBlogPosts;
  const isLoading = tab === "following" ? isLoadingFollowing : isLoadingAll;
  const refetch = tab === "following" ? () => {} : refetchAll;
  const createBlogPostMutation = useCreateBlogPost();
  const deleteBlogPostMutation = useDeleteBlogPost();
  const updateBlogPostMutation = useUpdateBlogPost();

  const [likedPosts, setLikedPosts] = useState<{ [id: string]: boolean }>(
    () => {
      const map: { [id: string]: boolean } = {};
      for (const key in localStorage)
        if ((key as string).startsWith("blog_liked_"))
          map[(key as string).replace("blog_liked_", "")] = true;
      return map;
    }
  );

  useEffect(() => {
    if (targetPostId && blogPosts.length > 0 && !hasScrolledToTarget) {
      const targetPost = blogPosts.find(
        (post: any) => post.id === targetPostId
      );
      if (targetPost) {
        setTimeout(() => {
          const el = document.getElementById(`post-${targetPostId}`);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
            el.classList.add(
              "ring-2",
              "ring-[#ff6740]",
              "ring-offset-2",
              "ring-offset-transparent"
            );
            setTimeout(
              () =>
                el.classList.remove(
                  "ring-2",
                  "ring-[#ff6740]",
                  "ring-offset-2",
                  "ring-offset-transparent"
                ),
              1400
            );
          }
        }, 380);
        setHasScrolledToTarget(true);
      }
    }
  }, [targetPostId, blogPosts, hasScrolledToTarget]);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handlePost = async () => {
    if (!content.trim() && selectedImages.length === 0) return;
    if (!auth?.user) {
      toast?.onOpen({
        message: "Vui lòng đăng nhập để đăng bài!",
        variant: "error",
      });
      return;
    }
    setIsPosting(true);
    createBlogPostMutation.mutate(
      {
        content: content.trim(),
        images: selectedImages.length ? selectedImages : undefined,
      },
      {
        onSuccess: () => {
          setContent("");
          setSelectedImages([]);
          resetFileInputRef.current?.();
          toast?.onOpen({
            message: "Đăng bài thành công!",
            variant: "success",
          });
          setIsPosting(false);

          refetchAll();
        },
        onError: () => {
          toast?.onOpen({
            message: "Có lỗi xảy ra khi đăng bài!",
            variant: "error",
          });
          setIsPosting(false);
        },
      }
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handlePost();
    }
  };

  const handleTabChange = (newTab: Tabs) => {
    if (newTab === tab) return;
    setOpenComments(new Set());
    setTransitioning(true);
    setTimeout(() => {
      setTab(newTab);
      setTransitioning(false);
    }, 180);
  };

  const handleDelete = () => {
    if (!confirmDeleteId) return;
    deleteBlogPostMutation.mutate(confirmDeleteId, {
      onSuccess: () => {
        toast?.onOpen({
          message: "Xóa bài viết thành công!",
          variant: "success",
        });
        refetchAll();
      },
      onError: () =>
        toast?.onOpen({
          message: "Có lỗi xảy ra khi xóa bài viết!",
          variant: "error",
        }),
    });
    setConfirmDeleteId(null);
  };

  const handleRequestDelete = (_type: "post" | "comment", id: string) =>
    setConfirmDeleteId(id);

  const handleUpdatePost = (postId: string, content: string) => {
    updateBlogPostMutation.mutate(
      { postId, content },
      {
        onSuccess: () => {
          const nowTicks = blogGetCurrentTicks();
          const formatted = blogFormatVietnamTimeFromTicksForUpdate(nowTicks);
          setUpdatedTimestamps((prev) => ({ ...prev, [postId]: formatted }));
          localStorage.setItem(`blog_updated_${postId}`, formatted);
           toast?.onOpen({
             message: "Cập nhật bài viết thành công!",
             variant: "success",
           });

          refetchAll();
        },
        onError: () =>
          toast?.onOpen({
            message: "Có lỗi xảy ra khi cập nhật bài viết!",
            variant: "error",
          }),
      }
    );
  };

  const handleToggleLike = async (postId: string) => {
    const hasLiked = likedPosts[postId];
    try {
      if (hasLiked) {
        await UnlikeBlogPost(postId);
        setLikedPosts((p) => ({ ...p, [postId]: false }));
        localStorage.removeItem(`blog_liked_${postId}`);
      } else {
        await LikeBlogPost(postId);
        setLikedPosts((p) => ({ ...p, [postId]: true }));
        localStorage.setItem(`blog_liked_${postId}`, "true");
      }
      refetchAll();
    } catch {
      toast?.onOpen({
        message: "Có lỗi xảy ra khi thao tác yêu thích!",
        variant: "error",
      });
    }
  };

  const handleSubmitReport = (payload: ReportPayload) => {
    const reportRequest: ReportRequest = {
      scope: 3,
      forumPostId: payload.postId,
      reason: REPORT_REASON_CODE[payload.reason],
      message: payload.message,
    };
    report.mutate(reportRequest);
  };

  const handleSubmitCommentReport = (payload: ReportPayload) => {
    const reportRequest: ReportRequest = {
      scope: 4,
      forumCommentId: payload.commentId,
      reason: REPORT_REASON_CODE[payload.reason],
      message: payload.message,
    };
    report.mutate(reportRequest);
  };
  useEffect(() => {
    if (reportPostId) setReportPost(true);
  }, [reportPostId]);

  useEffect(() => {
    if (reportCommentId) setReportComment(true);
  }, [reportCommentId]);

  return (
    <div className="relative w-full text-zinc-900 dark:text-white">
      {/* Background: light vs dark */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60rem 32rem at 110% -10%, rgba(255,103,64,0.08), transparent 60%), radial-gradient(36rem 26rem at -20% 40%, rgba(120,170,255,0.10), transparent 60%)",
        }}
      />
      <div className="fixed inset-0 -z-10 hidden dark:block bg-[#0b0d11]" />

      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {/* Toggle tabs */}
        <div className="mb-6 flex justify-center">
          <div
            className="inline-flex rounded-xl gap-2 px-2 py-2
                          bg-zinc-100/60 ring-1 ring-zinc-200
                          dark:bg-white/[0.06] dark:ring-white/10"
          >
            {(["all", "following"] as Tabs[]).map((t) => {
              const active = tab === t;
              const isFollowingTab = t === "following";
              const isDisabled = isFollowingTab && !auth?.user;

              return (
                <button
                  key={t}
                  onClick={() => handleTabChange(t)}
                  disabled={isDisabled}
                  className={[
                    "h-9 px-6 rounded-lg text-sm transition-all",
                    active
                      ? "bg-gradient-to-r from-[#ff7847] to-[#ff4d40] text-white font-semibold shadow"
                      : isDisabled
                      ? "text-zinc-400 dark:text-white/35 cursor-not-allowed opacity-50"
                      : "text-zinc-700 hover:text-zinc-900 hover:bg-black/5 dark:text-white/70 dark:hover:text-white dark:hover:bg-white/10",
                  ].join(" ")}
                >
                  {t === "all" ? "Dành cho bạn" : `Đang theo dõi`}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3">
            <div
              className={[
                "transition-all duration-300",
                transitioning
                  ? "opacity-0 translate-y-2"
                  : "opacity-100 translate-y-0",
              ].join(" ")}
            >
              {tab === "all" && (
                <Card className="p-3 sm:p-4 mb-5">
                  {auth?.user?.isBanned ? (
                    <div
                      className="
          rounded-xl border border-red-300 bg-red-50 p-4
          text-sm text-red-600 dark:border-red-500/40
          dark:bg-red-500/10 dark:text-red-400
        "
                    >
                      Tài khoản của bạn đang bị hạn chế, không thể đăng bài.
                    </div>
                  ) : (
                    <PostForm
                      content={content}
                      setContent={setContent}
                      isPosting={isPosting || createBlogPostMutation.isPending}
                      handlePost={handlePost}
                      handleKeyPress={handleKeyPress}
                      selectedImages={selectedImages}
                      setSelectedImages={setSelectedImages}
                      resetFileInput={resetFileInputRef}
                    />
                  )}
                </Card>
              )}

              {tab === "following" ? (
                <>
                  {isLoading ? (
                    <Card className="p-10 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff6740] mx-auto" />
                      <p className="text-zinc-600 dark:text-white/70 mt-3">
                        Đang tải bài viết từ người đang theo dõi...
                      </p>
                    </Card>
                  ) : followingUserIds.length === 0 ? (
                    <Card className="p-10 text-center">
                      <p className="text-zinc-600 dark:text-white/70 mb-2">
                        Bạn chưa theo dõi ai.
                      </p>
                      <p className="text-zinc-500 dark:text-white/50 text-sm">
                        Hãy theo dõi một số người dùng để xem bài viết của họ ở
                        đây.
                      </p>
                    </Card>
                  ) : !blogPosts || blogPosts.length === 0 ? (
                    <Card className="p-10 text-center">
                      <p className="text-zinc-600 dark:text-white/70">
                        Chưa có bài viết nào từ người đang theo dõi.
                      </p>
                      <p className="text-zinc-500 dark:text-white/50 text-sm mt-2">
                        Hãy theo dõi một số người dùng để xem bài viết của họ ở
                        đây.
                      </p>
                    </Card>
                  ) : (
                    (Array.isArray(blogPosts) ? blogPosts : []).map(
                      (post: any) => (
                        <Card
                          key={post.id}
                          className="mb-5 hover:bg-zinc-50 dark:hover:bg-white/[0.05] transition"
                        >
                          <div id={`post-${post.id}`}>
                            <PostItem
                              post={{
                                id: post.id,
                                user: {
                                  name:
                                    post.author?.displayName ||
                                    post.author?.username ||
                                    "Ẩn danh",
                                  username: post.author?.username || "user",
                                  avatar:
                                    post.author?.avatar ||
                                    "/images/default-avatar.png",
                                },
                                content: post.content,
                                timestamp: post.createdAt
                                  ? blogFormatVietnamTimeFromTicks(
                                      post.createdAt
                                    )
                                  : "Không rõ thời gian",
                                likes: post.likeCount || 0,
                                comments: post.commentCount || 0,
                                isLiked: post.isLiked || false,
                                imgUrls: post.imgUrls || [],
                              }}
                              menuOpenPostId={menuOpenPostId}
                              setMenuOpenPostId={setMenuOpenPostId}
                              editingPostId={editingPostId}
                              setEditingPostId={setEditingPostId}
                              setReportPostId={setReportPostId}
                              openComments={openComments}
                              setOpenComments={setOpenComments}
                              visibleRootComments={visibleRootComments}
                              setVisibleRootComments={setVisibleRootComments}
                              isMobile={isMobile}
                              openReplyId={openReplyId}
                              setOpenReplyId={setOpenReplyId}
                              menuOpenCommentId={menuOpenCommentId}
                              setMenuOpenCommentId={setMenuOpenCommentId}
                              editingCommentId={editingCommentId}
                              setEditingCommentId={setEditingCommentId}
                              editedContent={editedContent}
                              setEditedContent={setEditedContent}
                              setReportCommentId={setReportCommentId}
                              replyingTo={replyingTo}
                              setReplyingTo={setReplyingTo}
                              commentInput={commentInput}
                              setCommentInput={setCommentInput}
                              onRequestDelete={handleRequestDelete}
                              onToggleLike={handleToggleLike}
                              isLiked={Boolean(likedPosts[post.id])}
                              onUpdatePost={handleUpdatePost}
                              updatedTimestamp={updatedTimestamps[post.id]}
                            />
                          </div>
                        </Card>
                      )
                    )
                  )}
                </>
              ) : (
                <>
                  {isLoading ? (
                    <Card className="p-10 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff6740] mx-auto" />
                      <p className="text-zinc-600 dark:text-white/70 mt-3">
                        Đang tải bài viết...
                      </p>
                    </Card>
                  ) : !blogPosts || blogPosts.length === 0 ? (
                    <Card className="p-10 text-center">
                      <p className="text-zinc-600 dark:text-white/70">
                        Chưa có bài viết nào.
                      </p>
                    </Card>
                  ) : (
                    (Array.isArray(blogPosts) ? blogPosts : []).map(
                      (post: any) => (
                        <Card
                          key={post.id}
                          className="mb-5 hover:bg-zinc-50 dark:hover:bg-white/[0.05] transition"
                        >
                          <div id={`post-${post.id}`}>
                            <PostItem
                              post={{
                                id: post.id,
                                user: {
                                  name:
                                    post.author?.displayName ||
                                    post.author?.username ||
                                    "Ẩn danh",
                                  username: post.author?.username || "user",
                                  avatar:
                                    post.author?.avatar ||
                                    "/images/default-avatar.png",
                                },
                                content: post.content,
                                timestamp: post.createdAt
                                  ? blogFormatVietnamTimeFromTicks(
                                      post.createdAt
                                    )
                                  : "Không rõ thời gian",
                                likes: post.likeCount || 0,
                                comments: post.commentCount || 0,
                                isLiked: post.isLiked || false,
                                imgUrls: post.imgUrls || [],
                              }}
                              menuOpenPostId={menuOpenPostId}
                              setMenuOpenPostId={setMenuOpenPostId}
                              editingPostId={editingPostId}
                              setEditingPostId={setEditingPostId}
                              setReportPostId={setReportPostId}
                              openComments={openComments}
                              setOpenComments={setOpenComments}
                              visibleRootComments={visibleRootComments}
                              setVisibleRootComments={setVisibleRootComments}
                              isMobile={isMobile}
                              openReplyId={openReplyId}
                              setOpenReplyId={setOpenReplyId}
                              menuOpenCommentId={menuOpenCommentId}
                              setMenuOpenCommentId={setMenuOpenCommentId}
                              editingCommentId={editingCommentId}
                              setEditingCommentId={setEditingCommentId}
                              editedContent={editedContent}
                              setEditedContent={setEditedContent}
                              setReportCommentId={setReportCommentId}
                              replyingTo={replyingTo}
                              setReplyingTo={setReplyingTo}
                              commentInput={commentInput}
                              setCommentInput={setCommentInput}
                              onRequestDelete={handleRequestDelete}
                              onToggleLike={handleToggleLike}
                              isLiked={Boolean(likedPosts[post.id])}
                              onUpdatePost={handleUpdatePost}
                              updatedTimestamp={updatedTimestamps[post.id]}
                            />
                          </div>
                        </Card>
                      )
                    )
                  )}
                </>
              )}
            </div>
          </div>

          {auth?.user && (
            <div className="xl:col-span-1">
              <ConfirmModal
                isOpen={!!confirmDeleteId}
                title="Xóa bài viết"
                message="Bạn có chắc chắn muốn xóa mục này không? Thao tác này không thể hoàn tác."
                onConfirm={handleDelete}
                onCancel={() => setConfirmDeleteId(null)}
              />
              <Card className="p-4 sm:p-5">
                <ProfileSidebar />
              </Card>
            </div>
          )}
        </div>
      </div>

      <ReportPostModal
        isOpen={reportPost}
        onClose={() => setReportPost(false)}
        onSubmit={handleSubmitReport}
        postId={reportPostId!}
      />

      <ReportCommentModal
        isOpen={reportComment}
        onClose={() => setReportComment(false)}
        onSubmit={handleSubmitCommentReport}
        commentId={reportCommentId!}
      />
    </div>
  );
};
