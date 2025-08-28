import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useRef, useEffect, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { MoreVertical, Edit3, Trash2, Flag, ShieldBan, Heart, MessageCircle } from "lucide-react";

import { BlogCommentUser } from "../Comment/BlogCommentUser";
import { AuthContext } from "../../../context/AuthContext/AuthProvider";

import { PostContent } from "./components/PostContent";
import { PostImages } from "./components/PostImages";
import PostInlineEditor from "./components/PostInlineEditor";

import type { Post, VisibleRootComments } from "../types";

interface PostItemProps {
  post: Post;
  menuOpenPostId: string | null;
  setMenuOpenPostId: (value: string | null) => void;
  editingPostId: string | null;
  setEditingPostId: (value: string | null) => void;
  setReportPostId: (value: string | null) => void;

  openComments?: Set<string>;
  setOpenComments?: (value: Set<string>) => void;
  visibleRootComments?: VisibleRootComments;
  setVisibleRootComments?: (value: VisibleRootComments) => void;
  isMobile?: boolean;

  openReplyId?: string | null;
  setOpenReplyId?: (value: string | null) => void;
  menuOpenCommentId?: string | null;
  setMenuOpenCommentId?: (value: string | null) => void;
  editingCommentId?: string | null;
  setEditingCommentId?: (value: string | null) => void;
  editedContent?: string;
  setEditedContent?: (value: string) => void;
  setReportCommentId?: (value: string | null) => void;

  replyingTo?: { commentId: string; username: string } | null;
  setReplyingTo?: (value: { commentId: string; username: string } | null) => void;
  commentInput?: string;
  setCommentInput?: (value: string) => void;

  onRequestDelete: (type: "post" | "comment", id: string) => void;
  onToggleLike?: (postId: string) => void;
  isLiked?: boolean;
  onUpdatePost?: (postId: string, content: string) => void;
  updatedTimestamp?: string;
}

const PostItem = ({
  post,
  menuOpenPostId,
  setMenuOpenPostId,
  editingPostId,
  setEditingPostId,
  setReportPostId,
  onRequestDelete,
  onToggleLike,
  isLiked = false,
  onUpdatePost,
  updatedTimestamp,
}: PostItemProps) => {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isOwnPost = post.user.username === auth?.user?.userName;

  const menuRef = useRef<HTMLDivElement>(null);
  const [showCommentPopup, setShowCommentPopup] = useState(false);
  const [editContent, setEditContent] = useState(post.content ?? "");
  const [likeCount, setLikeCount] = useState<number>(post.likes ?? 0);
  const content = post.content ?? "";

  useEffect(() => setLikeCount(post.likes ?? 0), [post.likes]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpenPostId(null);
      }
    };
    if (menuOpenPostId === post.id) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [menuOpenPostId, post.id, setMenuOpenPostId]);

  const images: string[] = useMemo(() => {
    if (Array.isArray((post as any).imgUrls)) {
      return (post as any).imgUrls.filter(Boolean);
    }
    const raw = (post as any).images;
    if (Array.isArray(raw)) {
      return raw
        .map((it: any) => (typeof it === "string" ? it : it?.url))
        .filter((u: any) => typeof u === "string" && u.length > 0);
    }
    return [];
  }, [post]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className={[
        "rounded-2xl border shadow-sm",
        "bg-white border-zinc-200 text-zinc-900",            // light
        "dark:bg-[#141518] dark:border-white/[0.07] dark:text-white dark:shadow-[0_10px_28px_rgba(0,0,0,0.45)]", // dark
      ].join(" ")}
    >
      {/* HEADER */}
      <div className="px-4 pt-4 pb-3 flex items-start justify-between gap-3">
        <div className="flex items-start gap-4">
          <img
            src={post.user.avatar}
            alt={post.user.name}
            className="w-11 h-11 rounded-full object-cover ring-1 ring-zinc-200 dark:ring-white/10 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate(`/profile/${post.user.username}`)}
          />
          <div
            className="leading-tight cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="flex items-center gap-2 flex-wrap" onClick={() => navigate(`/profile/${post.user.username}`)}>
              <span className="text-[16px] font-semibold">{post.user.name}</span>
              <span className="text-[13px] text-zinc-500 dark:text-white/55">@{post.user.username}</span>
            </div>

            <div className="mt-0.5 text-[12px] text-zinc-500 dark:text-white/45">
              {updatedTimestamp || post.timestamp}
            </div>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() =>
              setMenuOpenPostId(menuOpenPostId === post.id ? null : post.id)
            }
            className="h-8 w-8 grid place-items-center rounded-lg ring-1 ring-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-700
                       dark:bg-white/[0.03] dark:hover:bg-white/[0.06] dark:ring-white/10 dark:text-white transition"
          >
            <MoreVertical size={18} />
          </button>

          <AnimatePresence>
            {menuOpenPostId === post.id && (
              <motion.div
                ref={menuRef}
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-44 rounded-xl overflow-hidden bg-white text-zinc-900 ring-1 ring-zinc-200 shadow-xl z-10
                           dark:bg-[#111214] dark:text-white dark:ring-white/10 dark:shadow-[0_12px_36px_-12px_rgba(0,0,0,0.6)]"
              >
                {isOwnPost ? (
                  <>
                    <button
                      onClick={() => {
                        setEditingPostId(post.id);
                        setEditContent(content);
                        setMenuOpenPostId(null);
                      }}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-zinc-50 dark:hover:bg-white/[0.06] flex items-center gap-2"
                    >
                      <Edit3 size={16} />
                      Cập nhật
                    </button>
                    <button
                      onClick={() => {
                        onRequestDelete("post", post.id);
                        setMenuOpenPostId(null);
                      }}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-zinc-50 dark:hover:bg-white/[0.06] flex items-center gap-2"
                    >
                      <Trash2 size={16} />
                      Xóa bài viết
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        alert("Chặn người dùng");
                        setMenuOpenPostId(null);
                      }}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-zinc-50 dark:hover:bg-white/[0.06] flex items-center gap-2"
                    >
                      <ShieldBan size={16} />
                      Chặn người dùng
                    </button>
                    <button
                      onClick={() => {
                        setReportPostId(post.id);
                        setMenuOpenPostId(null);
                      }}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-zinc-50 dark:hover:bg-white/[0.06] flex items-center gap-2"
                    >
                      <Flag size={16} />
                      Báo cáo bài viết
                    </button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* BODY */}
      <div className="px-4">
        <AnimatePresence mode="wait">
          {editingPostId === post.id ? (
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
                onSave={() => {
                  if (onUpdatePost) onUpdatePost(post.id, editContent.trim());
                  setEditingPostId(null);
                }}
              />
              {images.length > 0 && (
                <div className="mt-4">
                  <PostImages images={images} />
                </div>
              )}
            </motion.div>
          ) : (
            <>
              <PostContent content={content} clampLines={3} />
              {images.length > 0 && (
                <div className="mt-4">
                  <PostImages images={images} />
                </div>
              )}
            </>
          )}
        </AnimatePresence>
      </div>

      {/* ACTIONS */}
      <div className="mt-3 px-4 pb-4">
        <div className="h-px w-full bg-zinc-200 dark:bg-white/[0.06]" />
        <div className="mt-3 flex items-center gap-4">
          <button
            onClick={() => {
              onToggleLike?.(post.id);
              setLikeCount((c) => (isLiked ? Math.max(0, c - 1) : c + 1));
            }}
            className="inline-flex items-center gap-2 h-9 px-3 rounded-xl ring-1 bg-zinc-50 hover:bg-zinc-100 ring-zinc-200 text-zinc-900
                       dark:bg-white/[0.03] dark:hover:bg-white/[0.06] dark:ring-white/10 dark:text-white transition"
          >
            <Heart
              size={18}
              className={isLiked ? "fill-red-500 text-red-500" : "text-current"}
            />
            <span className={`text-sm ${isLiked ? "text-red-600 dark:text-red-400" : ""}`}>
              {likeCount}
            </span>
          </button>

          <button
            onClick={() => {
              setShowCommentPopup((v) => !v);
            }}
            className="inline-flex items-center gap-2 h-9 px-3 rounded-xl ring-1 bg-zinc-50 hover:bg-zinc-100 ring-zinc-200 text-zinc-900
                       dark:bg-white/[0.03] dark:hover:bg-white/[0.06] dark:ring-white/10 dark:text-white transition"
          >
            <MessageCircle size={18} />
            <span className="text-sm">{post.comments ?? 0}</span>
          </button>
        </div>

        {showCommentPopup && (
          <div className="mt-4">
            <BlogCommentUser postId={post.id} />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PostItem;
