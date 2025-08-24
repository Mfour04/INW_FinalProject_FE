import { useState, useRef, useEffect, useContext } from "react";
import { useToast } from "../../context/ToastContext/toast-context";
import { AuthContext } from "../../context/AuthContext/AuthProvider";
import { useSearchParams, useNavigate } from "react-router-dom";
import BlogHeader from "../Blogs/Post/BlogHeader";
import PostForm from "../Blogs/Post/PostForm";
import PostItem from "../Blogs/Post/PostItem";
import ReportPopup from "../Blogs/Modals/ReportPopup";
import ProfileSidebar from "../Blogs/Sidebar/ProfileSidebar";
import { ConfirmModal } from "../../components/ConfirmModal/ConfirmModal";
import { useBlogPosts, useCreateBlogPost, useDeleteBlogPost, useUpdateBlogPost } from "./HooksBlog";
import { GetFollowing } from "../../api/UserFollow/user-follow.api";
import { LikeBlogPost, UnlikeBlogPost } from "../../api/Blogs/blogs.api";
import { useQuery } from "@tanstack/react-query";
import { blogFormatVietnamTimeFromTicks, blogFormatVietnamTimeFromTicksForUpdate, blogGetCurrentTicks } from "../../utils/date_format";
import { type Post, type Tabs } from "./types";

const posts: Post[] = [
  {
    id: "1",
    user: {
      name: "Nguyen Dinh",
      username: "@dinhvanbaonguyen",
      avatar: "/images/img_9d99678c38b6592.png",
    },
    content: "my first blog",
    timestamp: "39 giây trước",
    likes: 0,
    comments: 0,
    isLiked: false,
  },
  {
    id: "2",
    user: {
      name: "finn712",
      username: "@iamfinn7",
      avatar: "/images/img_249b93771f680a8.png",
    },
    content: "hi everyone!",
    timestamp: "1 ngày trước",
    likes: 0,
    comments: 0,
    isLiked: false,
  },
  {
    id: "3",
    user: {
      name: "Nguyễn Văn A",
      username: "@anguyen",
      avatar: "/images/user1.png",
    },
    content: "Tôi đang học ReactJS và đây là bài post đầu tiên của tôi.",
    timestamp: "5 phút trước",
    likes: 3,
    comments: 2,
    isLiked: true,
  },
  {
    id: "4",
    user: {
      name: "Trần Thị B",
      username: "@btran",
      avatar: "/images/user2.png",
    },
    content: "Chúc mọi người buổi sáng tốt lành! ☀️",
    timestamp: "3 giờ trước",
    likes: 5,
    comments: 1,
    isLiked: false,
  },
  {
    id: "5",
    user: { name: "Lê Văn C", username: "@cle", avatar: "/images/user3.png" },
    content: "Hôm nay trời đẹp thật!",
    timestamp: "6 giờ trước",
    likes: 2,
    comments: 0,
    isLiked: false,
  },
  {
    id: "6",
    user: {
      name: "Phạm Thị D",
      username: "@dpham",
      avatar: "/images/user4.png",
    },
    content: "Tôi vừa hoàn thành dự án cá nhân đầu tiên 👏",
    timestamp: "1 ngày trước",
    likes: 7,
    comments: 3,
    isLiked: true,
  },
  {
    id: "7",
    user: {
      name: "Hoàng Văn E",
      username: "@ehoang",
      avatar: "/images/user5.png",
    },
    content: "Ai có tài liệu về Redux RTK không? Cho mình xin với 🙏",
    timestamp: "2 ngày trước",
    likes: 1,
    comments: 0,
    isLiked: false,
  },
];

const postsFollowing: Post[] = [
  {
    id: "1",
    user: {
      name: "Nguyen Dinh",
      username: "@dinhvanbaonguyen",
      avatar: "/images/img_9d99678c38b6592.png",
    },
    content: "my first blog",
    timestamp: "39 giây trước",
    likes: 0,
    comments: 0,
    isLiked: false,
  },
];

export const Blogs = () => {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const targetPostId = searchParams.get('post');
  const [hasScrolledToTarget, setHasScrolledToTarget] = useState(false);
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
  const [updatedTimestamps, setUpdatedTimestamps] = useState<Record<string, string>>({});
  const resetFileInputRef = useRef<(() => void) | null>(null);

  const [visibleRootComments, setVisibleRootComments] = useState<{
    [postId: string]: number;
  }>({});
  const [replyingTo, setReplyingTo] = useState<{
    commentId: string;
    username: string;
  } | null>(null);

  const [commentInput, setCommentInput] = useState<string>("");
  const toast = useToast();
  const { data: blogPosts = [], isLoading, refetch } = useBlogPosts();
  const { data: followingData, isLoading: isLoadingFollowing } = useQuery({
    queryKey: ['following', auth?.user?.userName],
    queryFn: () => GetFollowing(auth?.user?.userName!),
    enabled: !!auth?.user?.userName,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const followingPosts = followingData?.data || [];
  const createBlogPostMutation = useCreateBlogPost();
  const deleteBlogPostMutation = useDeleteBlogPost();
  const updateBlogPostMutation = useUpdateBlogPost();

  const [likedPosts, setLikedPosts] = useState<{ [id: string]: boolean }>(() => {
    const map: { [id: string]: boolean } = {};
    for (const key in localStorage) {
      if (key.startsWith("blog_liked_")) {
        const postId = key.replace("blog_liked_", "");
        map[postId] = true;
      }
    }
    return map;
  });

  useEffect(() => {
    if (targetPostId && blogPosts.length > 0 && !hasScrolledToTarget) {
      const targetPost = blogPosts.find(post => post.id === targetPostId);
      if (targetPost) {
        setTimeout(() => {
          const postElement = document.getElementById(`post-${targetPostId}`);
          if (postElement) {
            postElement.scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            });
            postElement.style.backgroundColor = '#ff4500';
            postElement.style.transition = 'background-color 0.3s ease';
            setTimeout(() => {
              postElement.style.backgroundColor = '';
            }, 2000);
          }
        }, 500);
        setHasScrolledToTarget(true);
      }
    }
  }, [targetPostId, blogPosts, hasScrolledToTarget]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handlePost = async () => {
    if (!content.trim() && selectedImages.length === 0) return;

    if (!auth?.user) {
      toast?.onOpen("Vui lòng đăng nhập để đăng bài!");
      return;
    }

    setIsPosting(true);
    createBlogPostMutation.mutate(
      {
        content: content.trim(),
        images: selectedImages.length > 0 ? selectedImages : undefined
      },
      {
        onSuccess: () => {
          setContent("");
          setSelectedImages([]);

          if (resetFileInputRef.current) {
            resetFileInputRef.current();
          }
          toast?.onOpen("Đăng bài thành công!");
          setIsPosting(false);
        },
        onError: (error: any) => {
          console.error("Error creating post:", error);
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
    }, 200);
  };

  const handleDelete = () => {
    if (confirmDeleteId) {
      deleteBlogPostMutation.mutate(confirmDeleteId, {
        onSuccess: () => {
          toast?.onOpen("Xóa bài viết thành công!");
        },
        onError: (error) => {
          console.error("Error deleting post:", error);
          toast?.onOpen("Có lỗi xảy ra khi xóa bài viết!");
        },
      });
    }
    setConfirmDeleteId(null);
  };

  const handleRequestDelete = (type: "post" | "comment", id: string) => {
    setConfirmDeleteId(id);
  };

  const handleUpdatePost = (postId: string, content: string) => {
    updateBlogPostMutation.mutate(
      { postId, content },
      {
        onSuccess: () => {
          const currentTime = blogGetCurrentTicks();
          const formattedTime = blogFormatVietnamTimeFromTicksForUpdate(currentTime);
          setUpdatedTimestamps(prev => ({
            ...prev,
            [postId]: formattedTime
          }));
          toast?.onOpen("Cập nhật bài viết thành công!");
        },
        onError: (error) => {
          console.error("Error updating post:", error);
          toast?.onOpen("Có lỗi xảy ra khi cập nhật bài viết!");
        },
      }
    );
  };

  const handleToggleLike = async (postId: string) => {
    const hasLiked = likedPosts[postId];

    try {
      if (hasLiked) {
        await UnlikeBlogPost(postId);
        setLikedPosts(prev => ({ ...prev, [postId]: false }));
        localStorage.removeItem(`blog_liked_${postId}`);
      } else {
        await LikeBlogPost(postId);
        setLikedPosts(prev => ({ ...prev, [postId]: true }));
        localStorage.setItem(`blog_liked_${postId}`, "true");
      }

      refetch();
    } catch (error) {
      console.error("Error toggling like:", error);
      toast?.onOpen("Có lỗi xảy ra khi thao tác yêu thích!");
    }
  };

  const renderTabContent = () => {
    if (tab === "all") {
      return (
        <div className="space-y-5">
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
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
              <p className="text-gray-400 mt-2">Đang tải bài viết...</p>
            </div>
          ) : !blogPosts || blogPosts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">Chưa có bài viết nào.</p>
            </div>
          ) : (
            (Array.isArray(blogPosts) ? blogPosts : []).map((post) => {
              // Debug: log mapping result
              const mappedUser = {
                name: post.author?.DisplayName || post.author?.displayName || post.author?.username || "Ẩn danh",
                username: post.author?.username || "user",
                avatar: post.author?.avatar || "/images/default-avatar.png",
                displayName: post.author?.DisplayName || post.author?.displayName || post.author?.username || "Ẩn danh",
              };

              return (
                <div key={post.id} id={`post-${post.id}`}>
                  <PostItem
                    post={{
                      id: post.id,
                      user: mappedUser,
                      content: post.content,
                      timestamp: post.createdAt ? blogFormatVietnamTimeFromTicks(post.createdAt) : "Không rõ thời gian",
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
              );
            })
          )}
        </div>
      );
    } else if (tab === "following") {
      return (
        <div className="space-y-5">
          {isLoadingFollowing ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
              <p className="text-gray-400 mt-2">Đang tải danh sách người theo dõi...</p>
            </div>
          ) : !followingPosts || followingPosts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">Chưa theo dõi ai.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {followingPosts.map((following: any) => (
                <div key={following.id} className="bg-gray-900 p-4 rounded-lg border border-gray-700 flex flex-col items-center">
                  <img
                    src={following.avatar || "/images/default-avatar.png"}
                    alt={following.displayName}
                    className="w-16 h-16 rounded-full mb-2 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/images/default-avatar.png";
                    }}
                  />
                  <p className="font-semibold text-white text-sm text-center truncate w-full">{following.displayName}</p>
                  <p className="text-xs text-gray-400 text-center">@{following.userName}</p>
                  <button
                    className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 mt-2 rounded text-sm"
                    onClick={() => {
                      if (following.userName) {
                        navigate(`/profile/${following.userName}`);
                      } else {
                        console.error('Username is missing for following user:', following);
                      }
                    }}
                  >
                    Xem profile
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div className="text-center py-8">
          <p className="text-gray-400">Chức năng đang theo dõi sẽ được phát triển sau.</p>
        </div>
      );
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6">
        {/* Main Content - Left Side */}
        <div className="xl:col-span-3">
          <BlogHeader tab={tab} handleTabChange={handleTabChange} />
          <div className="min-h-screen">
            <div
              className={`transition-all duration-300 ${transitioning
                ? "opacity-0 translate-y-2 pointer-events-none"
                : "opacity-100 translate-y-0"
                }`}
            >
              {renderTabContent()}
            </div>
          </div>
        </div>

        {/* Sidebar - Right Side */}
        <div className="xl:col-span-1">
          {reportCommentId && (
            <ReportPopup
              type="comment"
              id={reportCommentId}
              setReportId={setReportCommentId}
            />
          )}
          {reportPostId && (
            <ReportPopup
              type="post"
              id={reportPostId}
              setReportId={setReportPostId}
            />
          )}
          <ConfirmModal
            isOpen={!!confirmDeleteId}
            title="Xóa bài viết"
            message="Bạn có chắc chắn muốn xóa mục này không? Thao tác này không thể hoàn tác."
            onConfirm={handleDelete}
            onCancel={() => {
              setConfirmDeleteId(null);
            }}
          />
          <ProfileSidebar />
        </div>
      </div>
    </div>
  );
};
