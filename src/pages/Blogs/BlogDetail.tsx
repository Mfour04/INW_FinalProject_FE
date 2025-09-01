import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Heart, MessageCircle, MoreVertical, Edit3, Trash2, Flag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { AuthContext } from "../../context/AuthContext/AuthProvider";
import { BlogCommentUser } from "./Comment/BlogCommentUser";
import { PostContent } from "./Post/components/PostContent";
import { PostImages } from "./Post/components/PostImages";
import PostInlineEditor from "./Post/components/PostInlineEditor";
import { ConfirmModal } from "../../components/ConfirmModal/ConfirmModal";
import { ReportPostModal } from "../../components/ReportModal/ReportModal";
import { useReport } from "../../hooks/useReport";
import { useUpdateBlogPost, useDeleteBlogPost, useBlogPostById, useBlogPosts } from "./HooksBlog";
import { LikeBlogPost, UnlikeBlogPost } from "../../api/Blogs/blogs.api";
import { blogFormatVietnamTimeFromTicks } from "../../utils/date_format";
import type { Comment } from "../CommentUser/types";
import type { ReportPayload } from "../../components/ReportModal/ReportModal";
import type { ReportRequest } from "../../api/Report/report.type";
import { REPORT_REASON_CODE } from "../../components/ReportModal/ReportModal";

export const BlogDetail = () => {
    const { postId } = useParams<{ postId: string }>();
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const report = useReport();

    const [editingPostId, setEditingPostId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState("");
    const [likeCount, setLikeCount] = useState<number>(0);
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [processingLike, setProcessingLike] = useState(false);
    const queryClient = useQueryClient();
    const updateBlogPostMutation = useUpdateBlogPost();
    const deleteBlogPostMutation = useDeleteBlogPost();
    const { data: post, isLoading, error } = useBlogPostById(postId!);
    const { data: allPosts } = useBlogPosts();
    const cachedPost = allPosts?.find((p: any) => p.id === postId);

    const localStoragePost = (() => {
        try {
            const stored = localStorage.getItem('currentBlogPost');

            if (stored) {
                const parsed = JSON.parse(stored);

                if (parsed.id === postId) {
                    return parsed;
                } else {
                }
            } else {
            }
        } catch (error) {
            console.error('Error parsing localStorage post:', error);
        }
        return null;
    })();

    const normalizePostData = (rawPost: any) => {
        if (!rawPost) return null;

        if (rawPost.success && rawPost.data) {
            const apiPost = rawPost.data;
            return {
                id: apiPost.id,
                content: apiPost.content,
                author: apiPost.author,
                likeCount: apiPost.likeCount || 0,
                commentCount: apiPost.commentCount || 0,
                createdAt: apiPost.createdAt,
                imgUrls: apiPost.imgUrls || [],
                isLiked: apiPost.isLiked || false
            };
        }

        if (rawPost.author) {
            return {
                id: rawPost.id,
                content: rawPost.content,
                author: rawPost.author,
                likeCount: rawPost.likeCount || 0,
                commentCount: rawPost.commentCount || 0,
                createdAt: rawPost.createdAt,
                imgUrls: rawPost.imgUrls || [],
                isLiked: rawPost.isLiked || false
            };
        }

        if (rawPost.user) {
            const storedLike = localStorage.getItem(`blog_liked_${rawPost.id}`);
            const isLikedFromStorage = storedLike === 'true';

            return {
                id: rawPost.id,
                content: rawPost.content,
                author: {
                    id: rawPost.user.id || rawPost.user.username,
                    username: rawPost.user.username,
                    avatar: rawPost.user.avatar,
                    displayName: rawPost.user.name
                },
                likeCount: rawPost.likes || 0,
                commentCount: rawPost.comments || 0,
                createdAt: rawPost.createdAt || rawPost.timestamp,
                imgUrls: rawPost.imgUrls || [],
                isLiked: rawPost.isLiked !== undefined ? rawPost.isLiked : isLikedFromStorage
            };
        }

        return {
            id: rawPost.id,
            content: rawPost.content,
            author: {
                id: rawPost.authorId || "unknown",
                username: rawPost.authorUsername || "unknown",
                avatar: rawPost.authorAvatar || "/images/default-avatar.png",
                displayName: rawPost.authorName || "Ẩn danh"
            },
            likeCount: rawPost.likeCount || rawPost.likes || 0,
            commentCount: rawPost.commentCount || rawPost.comments || 0,
            createdAt: rawPost.createdAt || rawPost.timestamp || Date.now(),
            imgUrls: rawPost.imgUrls || [],
            isLiked: rawPost.isLiked || false
        };
    };

    const finalPost = normalizePostData(post) || normalizePostData(localStoragePost) || normalizePostData(cachedPost);


    useEffect(() => {
        if (finalPost) {
            setLikeCount(finalPost.likeCount || 0);

            if (auth?.user) {
                let likedStatus = false;

                const storedLike = localStorage.getItem(`blog_liked_${postId}`);
                if (storedLike !== null) {
                    likedStatus = storedLike === 'true';
                }

                else if (finalPost.isLiked !== undefined) {
                    likedStatus = finalPost.isLiked;
                    localStorage.setItem(`blog_liked_${postId}`, likedStatus ? 'true' : 'false');
                }

                setIsLiked(likedStatus);
            } else {
                setIsLiked(false);
            }
        }
    }, [finalPost, postId, auth?.user]);

    const handleToggleLike = async () => {
        if (!auth?.user || processingLike) return;
        setProcessingLike(true);
        const nextLiked = !isLiked;
        setIsLiked(nextLiked);
        setLikeCount(prev => Math.max(0, prev + (nextLiked ? 1 : -1)));
        localStorage.setItem(`blog_liked_${postId}`, nextLiked ? 'true' : 'false');

        try {
            if (nextLiked) {
                await LikeBlogPost(postId!);
            } else {
                await UnlikeBlogPost(postId!);
            }
        } catch (error) {
            console.error("Error toggling like:", error);
            setIsLiked(!nextLiked);
            setLikeCount(prev => Math.max(0, prev + (nextLiked ? -1 : 1)));
            localStorage.setItem(`blog_liked_${postId}`, (!nextLiked) ? 'true' : 'false');
        } finally {
            queryClient.invalidateQueries({ queryKey: ["blog-post", postId] });
            queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
            setProcessingLike(false);
        }
    };

    const handleUpdatePost = (content: string) => {
        updateBlogPostMutation.mutate(
            { postId: postId!, content },
            {
                onSuccess: () => {
                    setEditingPostId(null);
                },
            }
        );
    };

    const handleDeletePost = () => {
        deleteBlogPostMutation.mutate(postId!, {
            onSuccess: () => {
                navigate("/blogs");
            },
        });
    };

    const handleSubmitReport = (payload: ReportPayload) => {
        const reportRequest: ReportRequest = {
            scope: 3,
            forumPostId: postId!,
            reason: REPORT_REASON_CODE[payload.reason],
            message: payload.message,
        };
        report.mutate(reportRequest);
    };

    const handleReport = (comment: Comment) => {
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-zinc-50 dark:bg-[#0b0d11] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff6740]" />
            </div>
        );
    }

    if (error || !finalPost) {

        return (
            <div className="min-h-screen bg-zinc-50 dark:bg-[#0b0d11] flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
                        Không tìm thấy bài viết
                    </h1>
                    <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                        Vui lòng quay lại trang blogs và thử lại
                    </p>
                    <button
                        onClick={() => navigate("/blogs")}
                        className="text-[#ff6740] hover:underline"
                    >
                        Quay lại trang chủ
                    </button>
                </div>
            </div>
        );
    }

    const safePost = {
        id: finalPost.id || postId,
        content: finalPost.content || "Không có nội dung",
        author: finalPost.author || {
            id: "unknown",
            username: "unknown",
            avatar: "/images/default-avatar.png",
            displayName: "Ẩn danh"
        },
        likeCount: finalPost.likeCount || 0,
        commentCount: finalPost.commentCount || 0,
        createdAt: finalPost.createdAt || Date.now(),
        imgUrls: finalPost.imgUrls || [],
        isLiked: finalPost.isLiked || false
    };

    const isOwnPost = safePost.author?.username === auth?.user?.userName;
    const images = safePost.imgUrls || [];

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-[#0b0d11]">
            {/* Background */}
            <div
                className="fixed inset-0 -z-10"
                style={{
                    background:
                        "radial-gradient(60rem 32rem at 110% -10%, rgba(255,103,64,0.08), transparent 60%), radial-gradient(36rem 26rem at -20% 40%, rgba(120,170,255,0.10), transparent 60%)",
                }}
            />
            <div className="fixed inset-0 -z-10 hidden dark:block bg-[#0b0d11]" />

            <div className="max-w-4xl mx-auto px-4 py-6">
                {/* Header */}
                <div className="mb-6 flex items-center gap-4">
                    <button
                        onClick={() => navigate("/blogs")}
                        className="inline-flex items-center gap-2 h-10 px-4 rounded-xl ring-1 bg-white hover:bg-zinc-50 ring-zinc-200 text-zinc-900 dark:bg-white/[0.02] dark:hover:bg-white/[0.06] dark:ring-white/10 dark:text-white transition"
                    >
                        <ArrowLeft size={18} />
                        <span>Quay lại</span>
                    </button>
                </div>

                {/* Blog Post */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-[#141518] rounded-2xl border border-zinc-200 dark:border-white/[0.07] shadow-sm overflow-hidden"
                >
                    {/* Post Header */}
                    <div className="px-6 pt-6 pb-4 flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                            <img
                                src={safePost.author?.avatar || "/images/default-avatar.png"}
                                alt={safePost.author?.displayName}
                                className="w-12 h-12 rounded-full object-cover ring-1 ring-zinc-200 dark:ring-white/10 cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => navigate(`/profile/${safePost.author?.username}`)}
                            />
                            <div className="leading-tight cursor-pointer hover:opacity-80 transition-opacity">
                                <div
                                    className="flex items-center gap-2 flex-wrap"
                                    onClick={() => navigate(`/profile/${safePost.author?.username}`)}
                                >
                                    <span className="text-lg font-semibold text-zinc-900 dark:text-white">
                                        {safePost.author?.displayName || safePost.author?.username || "Ẩn danh"}
                                    </span>
                                    <span className="text-sm text-zinc-500 dark:text-white/55">
                                        @{safePost.author?.username || "user"}
                                    </span>
                                </div>
                                <div className="mt-1 text-sm text-zinc-500 dark:text-white/45">
                                    {safePost.createdAt ? blogFormatVietnamTimeFromTicks(safePost.createdAt) : "Không rõ thời gian"}
                                </div>
                            </div>
                        </div>

                        {/* Menu */}
                        <div className="relative">
                            <button
                                onClick={() => setMenuOpen(!menuOpen)}
                                className="h-10 w-10 grid place-items-center rounded-xl ring-1 ring-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 dark:bg-white/[0.03] dark:hover:bg-white/[0.06] dark:ring-white/10 dark:text-white transition"
                            >
                                <MoreVertical size={18} />
                            </button>

                            <AnimatePresence>
                                {menuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -6, scale: 0.98 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -6, scale: 0.98 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute right-0 mt-2 w-44 rounded-xl overflow-hidden bg-white text-zinc-900 ring-1 ring-zinc-200 shadow-xl z-10 dark:bg-[#111214] dark:text-white dark:ring-white/10"
                                    >
                                        {isOwnPost ? (
                                            <>
                                                <button
                                                    onClick={() => {
                                                        setEditingPostId(safePost.id);
                                                        setEditContent(safePost.content);
                                                        setMenuOpen(false);
                                                    }}
                                                    className="w-full px-3 py-2 text-left text-sm hover:bg-zinc-50 dark:hover:bg-white/[0.06] flex items-center gap-2"
                                                >
                                                    <Edit3 size={16} />
                                                    Cập nhật
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setShowDeleteModal(true);
                                                        setMenuOpen(false);
                                                    }}
                                                    className="w-full px-3 py-2 text-left text-sm hover:bg-zinc-50 dark:hover:bg-white/[0.06] flex items-center gap-2"
                                                >
                                                    <Trash2 size={16} />
                                                    Xóa bài viết
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => {
                                                    setShowReportModal(true);
                                                    setMenuOpen(false);
                                                }}
                                                className="w-full px-3 py-2 text-left text-sm hover:bg-zinc-50 dark:hover:bg-white/[0.06] flex items-center gap-2"
                                            >
                                                <Flag size={16} />
                                                Báo cáo bài viết
                                            </button>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Post Content */}
                    <div className="px-6">
                        <AnimatePresence mode="wait">
                            {editingPostId === safePost.id ? (
                                <motion.div
                                    key="edit"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                >
                                    <PostInlineEditor
                                        value={editContent}
                                        onChange={setEditContent}
                                        onCancel={() => setEditingPostId(null)}
                                        onSave={() => handleUpdatePost(editContent.trim())}
                                    />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="content"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <PostContent content={safePost.content} />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Images */}
                        {images.length > 0 && (
                            <div className="mt-6">
                                <PostImages images={images} />
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="mt-6 px-6 pb-6">
                        <div className="h-px w-full bg-zinc-200 dark:bg-white/[0.06]" />
                        <div className="mt-4 flex items-center gap-4">
                            <button
                                onClick={() => {
                                    handleToggleLike();
                                }}
                                disabled={!auth?.user || processingLike}
                                className={`inline-flex items-center gap-2 h-10 px-4 rounded-xl ring-1 transition ${!auth?.user
                                    ? "bg-zinc-100 ring-zinc-200 text-zinc-400 dark:bg-white/[0.03] dark:ring-white/10 dark:text-white/35 cursor-not-allowed opacity-50"
                                    : `${processingLike ? "opacity-70" : ""} bg-zinc-50 hover:bg-zinc-100 ring-zinc-200 text-zinc-900 dark:bg-white/[0.03] dark:hover:bg-white/[0.06] dark:ring-white/10 dark:text-white`
                                    }`}
                            >
                                <Heart
                                    size={20}
                                    className={isLiked ? "fill-red-500 text-red-500" : "text-current"}
                                />
                                <span
                                    className={`text-sm font-medium ${isLiked ? "text-red-600 dark:text-red-400" : ""}`}
                                >
                                    {likeCount}
                                </span>
                            </button>

                            <div className="inline-flex items-center gap-2 h-10 px-4 rounded-xl ring-1 bg-zinc-50 ring-zinc-200 text-zinc-900 dark:bg-white/[0.03] dark:ring-white/10 dark:text-white">
                                <MessageCircle size={20} />
                                <span className="text-sm font-medium">{safePost.commentCount || 0}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Comments Section */}
                <div className="mt-6">
                    <BlogCommentUser postId={safePost.id} onReport={handleReport} />
                </div>
            </div>

            {/* Modals */}
            <ConfirmModal
                isOpen={showDeleteModal}
                title="Xóa bài viết"
                message="Bạn có chắc chắn muốn xóa bài viết này không? Thao tác này không thể hoàn tác."
                onConfirm={handleDeletePost}
                onCancel={() => setShowDeleteModal(false)}
            />

            <ReportPostModal
                isOpen={showReportModal}
                onClose={() => setShowReportModal(false)}
                onSubmit={handleSubmitReport}
                postId={safePost.id}
            />
        </div>
    );
};

export default BlogDetail;
