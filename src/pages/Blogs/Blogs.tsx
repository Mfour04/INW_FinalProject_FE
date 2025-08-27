import { useState, useRef, useEffect, useContext } from "react";
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
import { GetFollowers, GetFollowing } from "../../api/UserFollow/user-follow.api";
import { LikeBlogPost, UnlikeBlogPost } from "../../api/Blogs/blogs.api";
import {
  blogFormatVietnamTimeFromTicks,
  blogFormatVietnamTimeFromTicksForUpdate,
  blogGetCurrentTicks,
} from "../../utils/date_format";

import type { Tabs } from "./types";

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div
    className={[
      "rounded-2xl bg-white/[0.035] ring-1 ring-white/10 backdrop-blur-md",
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

  const [menuOpenCommentId, setMenuOpenCommentId] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<string>("");
  const [updatedTimestamps, setUpdatedTimestamps] = useState<Record<string, string>>({});
  const resetFileInputRef = useRef<(() => void) | null>(null);
  const [hasScrolledToTarget, setHasScrolledToTarget] = useState(false);

  const [visibleRootComments, setVisibleRootComments] = useState<{ [postId: string]: number }>({});
  const [replyingTo, setReplyingTo] = useState<{ commentId: string; username: string } | null>(null);
  const [commentInput, setCommentInput] = useState<string>("");

  const { data: allBlogPosts = [], isLoading: isLoadingAll, refetch: refetchAll } = useBlogPosts();

  const { data: followingUsers = [], isLoading: isLoadingFollowingUsers } = useQuery({
    queryKey: ['following', auth?.user?.userName],
    queryFn: () => GetFollowing(auth?.user?.userName!),
    enabled: !!auth?.user?.userName,
    staleTime: 1000 * 60 * 5,
  });

  const followingUserIds = Array.isArray(followingUsers?.data) ? followingUsers.data.map((user: any) => user.id) : [];

  const followingPostsQueries = followingUserIds.map((userId: string) =>
    useUserBlogPosts(userId)
  );

  const followingBlogPosts = followingPostsQueries
    .flatMap((query: any) => query.data || [])
    .sort((a: any, b: any) => (b.createdAt || 0) - (a.createdAt || 0));

  const isLoadingFollowing = isLoadingFollowingUsers || followingPostsQueries.some((query: any) => query.isLoading);

  const { data: followersData, isLoading: isLoadingFollowers } = useQuery({
    queryKey: ['followers', auth?.user?.userName],
    queryFn: () => GetFollowers(auth?.user?.userName!),
    enabled: !!auth?.user?.userName,
    staleTime: 1000 * 60 * 5,
  });

  const { data: followingData, isLoading: isLoadingFollowingStats } = useQuery({
    queryKey: ['following', auth?.user?.userName],
    queryFn: () => GetFollowing(auth?.user?.userName!),
    enabled: !!auth?.user?.userName,
    staleTime: 1000 * 60 * 5,
  });

  const followingCount = Array.isArray(followingData?.data) ? followingData.data.length : 0;
  const followersCount = Array.isArray(followersData?.data) ? followersData.data.length : 0;

  useEffect(() => {
    const savedTimestamps: Record<string, string> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('blog_updated_')) {
        const postId = key.replace('blog_updated_', '');
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
  const refetch = tab === "following" ? () => { } : refetchAll;
  const createBlogPostMutation = useCreateBlogPost();
  const deleteBlogPostMutation = useDeleteBlogPost();
  const updateBlogPostMutation = useUpdateBlogPost();

  const [likedPosts, setLikedPosts] = useState<{ [id: string]: boolean }>(() => {
    const map: { [id: string]: boolean } = {};
    for (const key in localStorage)
      if (key.startsWith("blog_liked_")) map[key.replace("blog_liked_", "")] = true;
    return map;
  });

  useEffect(() => {
    if (targetPostId && blogPosts.length > 0 && !hasScrolledToTarget) {
      const targetPost = blogPosts.find((post: any) => post.id === targetPostId);
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
      toast?.onOpen("Vui lòng đăng nhập để đăng bài!");
      return;
    }
    setIsPosting(true);
    createBlogPostMutation.mutate(
      { content: content.trim(), images: selectedImages.length ? selectedImages : undefined },
      {
        onSuccess: () => {
          setContent("");
          setSelectedImages([]);
          resetFileInputRef.current?.();
          toast?.onOpen("Đăng bài thành công!");
          setIsPosting(false);

          refetchAll();
          followingPostsQueries.forEach((query: any) => {
            if (query.refetch) query.refetch();
          });
        },
        onError: () => {
          toast?.onOpen("Có lỗi xảy ra khi đăng bài!");
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
        toast?.onOpen("Xóa bài viết thành công!");
        refetchAll();
        followingPostsQueries.forEach((query: any) => {
          if (query.refetch) query.refetch();
        });
      },
      onError: () => toast?.onOpen("Có lỗi xảy ra khi xóa bài viết!"),
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
          toast?.onOpen("Cập nhật bài viết thành công!");

          refetchAll();
          followingPostsQueries.forEach((query: any) => {
            if (query.refetch) query.refetch();
          });
        },
        onError: () => toast?.onOpen("Có lỗi xảy ra khi cập nhật bài viết!"),
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
      followingPostsQueries.forEach((query: any) => {
        if (query.refetch) query.refetch();
      });
    } catch {
      toast?.onOpen("Có lỗi xảy ra khi thao tác yêu thích!");
    }
  };

  return (
    <div className="relative w-full text-white px-6 lg:px-10 ">
      <div className="fixed inset-0 -z-10 bg-[#0b0d11]" />
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="mb-6 flex justify-center">
          <div className="inline-flex rounded-xl bg-white/[0.06] ring-1 ring-white/10 gap-2 px-2 py-2">
            {(["all", "following"] as Tabs[]).map((t) => {
              const active = tab === t;
              return (
                <button
                  key={t}
                  onClick={() => handleTabChange(t)}
                  className={[
                    "h-9 px-6 rounded-lg text-sm transition-all",
                    active
                      ? "bg-gradient-to-r from-[#ff7847] to-[#ff4d40] text-white font-semibold shadow-lg"
                      : "text-white/70 hover:text-white hover:bg-white/10",
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
                transitioning ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0",
              ].join(" ")}
            >
              {tab === "all" && (
                <Card className="p-3 sm:p-4 mb-5">
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
                </Card>
              )}

              {tab === "following" ? (
                <>
                  {isLoading ? (
                    <Card className="p-10 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff6740] mx-auto" />
                      <p className="text-white/70 mt-3">Đang tải bài viết từ người đang theo dõi...</p>
                    </Card>
                  ) : followingUserIds.length === 0 ? (
                    <Card className="p-10 text-center">
                      <p className="text-white/70 mb-2">Bạn chưa theo dõi ai.</p>
                      <p className="text-white/50 text-sm">Hãy theo dõi một số người dùng để xem bài viết của họ ở đây.</p>
                    </Card>
                  ) : !blogPosts || blogPosts.length === 0 ? (
                    <Card className="p-10 text-center">
                      <p className="text-white/70">Chưa có bài viết nào từ người đang theo dõi.</p>
                      <p className="text-white/50 text-sm mt-2">Hãy theo dõi một số người dùng để xem bài viết của họ ở đây.</p>
                    </Card>
                  ) : (
                    (Array.isArray(blogPosts) ? blogPosts : []).map((post: any) => (
                      <Card key={post.id} className="mb-5 hover:bg-white/[0.05] transition">
                        <div id={`post-${post.id}`}>
                          <PostItem
                            post={{
                              id: post.id,
                              user: {
                                name: post.author?.displayName || post.author?.username || "Ẩn danh",
                                username: post.author?.username || "user",
                                avatar: post.author?.avatar || "/images/default-avatar.png",
                              },
                              content: post.content,
                              timestamp: post.createdAt
                                ? blogFormatVietnamTimeFromTicks(post.createdAt)
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
                    ))
                  )}
                </>
              ) : (
                <>
                  {isLoading ? (
                    <Card className="p-10 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff6740] mx-auto" />
                      <p className="text-white/70 mt-3">Đang tải bài viết...</p>
                    </Card>
                  ) : !blogPosts || blogPosts.length === 0 ? (
                    <Card className="p-10 text-center">
                      <p className="text-white/70">Chưa có bài viết nào.</p>
                    </Card>
                  ) : (
                    (Array.isArray(blogPosts) ? blogPosts : []).map((post: any) => (
                      <Card key={post.id} className="mb-5 hover:bg-white/[0.05] transition">
                        <div id={`post-${post.id}`}>
                          <PostItem
                            post={{
                              id: post.id,
                              user: {
                                name: post.author?.displayName || post.author?.username || "Ẩn danh",
                                username: post.author?.username || "user",
                                avatar: post.author?.avatar || "/images/default-avatar.png",
                              },
                              content: post.content,
                              timestamp: post.createdAt
                                ? blogFormatVietnamTimeFromTicks(post.createdAt)
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
                    ))
                  )}
                </>
              )}
            </div>
          </div>

          <div className="xl:col-span-1">
            {reportCommentId && (
              <ReportPopup type="comment" id={reportCommentId} setReportId={setReportCommentId} />
            )}
            {reportPostId && (
              <ReportPopup type="post" id={reportPostId} setReportId={setReportPostId} />
            )}
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
        </div>
      </div>
    </div>
  );
};
