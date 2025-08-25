import { useContext, useMemo, useRef, useState, useCallback } from "react";
import { useQueryClient, useQueries } from "@tanstack/react-query";
import type { Comment } from "./types.ts";
import { AuthContext } from "../../context/AuthContext/AuthProvider.tsx";
import { formatVietnamTimeFromTicks, getCurrentTicks } from "../../utils/date_format.ts";
import defaultAvatar from "../../assets/img/default_avt.png";
import { getAvatarUrl } from "../../utils/avatar";
import { Composer } from "./components/Composer.tsx";
import { ReplyThread } from "./components/ReplyThread.tsx";
import { useComments } from "./hooks/useComments.ts";
import { useCreateComment } from "./hooks/useCreateComment.ts";
import { useUpdateComment } from "./hooks/useUpdateComment.ts";
import { useDeleteComment } from "./hooks/useDeleteComment.ts";
import { LikeComment, UnlikeComment, GetRepliesByComment } from "../../api/Comment/comment.api.ts";

type Props = { novelId: string; chapterId: string };

export const CommentUser = ({ novelId, chapterId }: Props) => {
  const { auth } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const [composerValue, setComposerValue] = useState("");
  const [replyInputs, setReplyInputs] = useState<Record<string, boolean>>({});
  const [replyValues, setReplyValues] = useState<Record<string, string>>({});
  const inputRefs = useRef<Record<string, HTMLTextAreaElement | null>>({});

  const { data: rawComments } = useComments(chapterId, novelId);
  const commentIds = Array.isArray(rawComments) ? rawComments.map((c: any) => c.id).filter(Boolean) : [];

  const repliesQueries = useQueries({
    queries: commentIds.map((commentId) => ({
      queryKey: ["replies", commentId],
      queryFn: async () => {
        const res = await GetRepliesByComment(commentId, { page: 0, limit: 50, sortBy: "created_at:desc" });
        return res.data.data;
      },
      enabled: !!commentId,
      staleTime: 60_000,
    })),
  });

  const repliesData = repliesQueries.map((q) => q.data).filter(Boolean);

  const { mutate: postComment } = useCreateComment(chapterId, novelId);
  const { mutate: deleteComment } = useDeleteComment(chapterId, novelId);
  const { mutate: updateComment } = useUpdateComment(chapterId, novelId);

  const currentUser = {
    id: auth?.user?.userId || "",
    name: auth?.user?.displayName || auth?.user?.userName || "Ẩn danh",
    user: "@" + (auth?.user?.userName || "user"),
    avatarUrl: auth?.user?.avatarUrl || null,
  };

  const [likedComments, setLikedComments] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    Object.keys(localStorage).forEach((k) => {
      if (k.startsWith("liked_")) map[k.replace("liked_", "")] = true;
    });
    return map;
  });

  const [editedComments, setEditedComments] = useState<
    Record<string, { content?: string; timestamp?: string; likes?: number; replies?: number }>
  >({});

  const serverComments: Comment[] = useMemo(() => {
    const flat: Comment[] = [];
    const replyCountMap: Record<string, number> = {};
    const collect = (c: any) => {
      if (!c?.id) return;
      const createdTicks = Number(c.createdAt) || 0;
      const updatedTicks = Number(c.updatedAt) || 0;
      const localTicks = Number(localStorage.getItem(`updatedAt_${c.id}`)) || 0;
      const latest = Math.max(createdTicks, updatedTicks, localTicks);
      const timestamp = latest > 0 ? formatVietnamTimeFromTicks(latest) : "Không rõ thời gian";
      const author = c.author;
      const name = author?.DisplayName || author?.displayName || author?.username || "Ẩn danh";
      const user = author?.username ? `@${author.username}` : "@user";
      flat.push({
        id: c.id,
        content: c.content,
        parentId: c.parent_comment_id ?? c.parentCommentId ?? null,
        likes: c.likeCount ?? 0,
        replies: replyCountMap[c.id] || 0,
        name,
        user,
        avatarUrl: getAvatarUrl(author?.avatar),
        timestamp,
      });
      if (Array.isArray(c.replies)) c.replies.forEach(collect);
    };
    if (Array.isArray(repliesData)) {
      repliesData.forEach((rs: any, idx: number) => {
        const rootId = commentIds[idx];
        replyCountMap[rootId] = Array.isArray(rs) ? rs.length : 0;
        if (Array.isArray(rs)) rs.forEach(collect);
      });
    }
    if (Array.isArray(rawComments)) rawComments.forEach(collect);
    return flat;
  }, [rawComments, repliesData, commentIds]);

  const enrichedComments: Comment[] = useMemo(
    () =>
      serverComments.map((c) => ({
        ...c,
        content: editedComments[c.id]?.content ?? c.content,
        timestamp: editedComments[c.id]?.timestamp ?? c.timestamp,
        likes: editedComments[c.id]?.likes ?? c.likes,
        replies: editedComments[c.id]?.replies ?? c.replies,
      })),
    [serverComments, editedComments]
  );

  const topLevel = useMemo(() => enrichedComments.filter((c) => !c.parentId && c.id), [enrichedComments]);

  const handlePost = useCallback(
    (content: string) => {
      if (!content.trim()) return;
      if (!auth?.user) return alert("Đăng nhập để bình luận");
      postComment(
        { content, novelId, chapterId },
        {
          onSuccess: (res: any) => {
            setComposerValue("");
            if (res?.data?.success === false && res?.data?.message?.includes("Duplicate")) {
              alert("Bạn đã comment nội dung này rồi. Vui lòng đợi 5 phút hoặc comment nội dung khác.");
              return;
            }
            queryClient.invalidateQueries({ queryKey: ["comments", chapterId, novelId] });
          },
        }
      );
    },
    [auth?.user, chapterId, novelId, postComment, queryClient]
  );

  const toggleReplyFor = useCallback((id: string) => {
    setReplyInputs((prev) => {
      const open = !prev[id];
      if (open) {
        setReplyValues((v) => ({ ...v, [id]: "" }));
        setTimeout(() => {
          inputRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "center" });
          inputRefs.current[id]?.focus();
        }, 0);
      }
      return { ...prev, [id]: open };
    });
  }, []);

  const submitReply = useCallback(
    (parentId: string) => {
      const content = (replyValues[parentId] || "").trim();
      setReplyInputs((p) => ({ ...p, [parentId]: false }));
      if (!content) return;
      if (!auth?.user) return alert("Đăng nhập để phản hồi");
      postComment(
        { content, novelId, chapterId, parentCommentId: parentId },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments", chapterId, novelId] });
            queryClient.invalidateQueries({ queryKey: ["replies", parentId] });
            setReplyValues((v) => ({ ...v, [parentId]: "" }));
          },
        }
      );
    },
    [auth?.user, chapterId, novelId, postComment, queryClient, replyValues]
  );

  const handleToggleLike = useCallback(
    async (commentId: string) => {
      if (!auth?.user) return;
      const hasLiked = likedComments[commentId];
      const original = enrichedComments.find((c) => c.id === commentId);
      const currentLikes = editedComments[commentId]?.likes ?? original?.likes ?? 0;
      if (hasLiked) {
        const res = await UnlikeComment(commentId, currentUser.id);
        if (res.data.success) {
          const next = Math.max(0, currentLikes - 1);
          setLikedComments((m) => ({ ...m, [commentId]: false }));
          localStorage.removeItem(`liked_${commentId}`);
          localStorage.setItem(`likes_${commentId}`, String(next));
          setEditedComments((m) => ({ ...m, [commentId]: { ...(m[commentId] || {}), likes: next } }));
        }
      } else {
        const res = await LikeComment(commentId, currentUser.id, 1);
        if (res.data.success) {
          const next = currentLikes + 1;
          setLikedComments((m) => ({ ...m, [commentId]: true }));
          localStorage.setItem(`liked_${commentId}`, "true");
          localStorage.setItem(`likes_${commentId}`, String(next));
          setEditedComments((m) => ({ ...m, [commentId]: { ...(m[commentId] || {}), likes: next } }));
        }
      }
    },
    [auth?.user, currentUser.id, editedComments, enrichedComments, likedComments]
  );

  const saveEdit = useCallback(
    (id: string, content: string) => {
      updateComment(
        { commentId: id, content },
        {
          onSuccess: () => {
            const ticks = getCurrentTicks();
            const ts = formatVietnamTimeFromTicks(ticks);
            setEditedComments((m) => ({ ...m, [id]: { ...(m[id] || {}), content, timestamp: ts } }));
            localStorage.setItem(`updatedAt_${id}`, String(ticks));
            queryClient.invalidateQueries({ queryKey: ["comments", chapterId, novelId] });
          },
        }
      );
    },
    [chapterId, novelId, updateComment, queryClient]
  );

  return (
    <section className="mt-10">
      <div
        className={[
          "rounded-2xl overflow-hidden backdrop-blur-md",
          // light container
          "bg-white ring-1 ring-gray-200 shadow-[0_24px_80px_-28px_rgba(0,0,0,0.14)]",
          // dark container
          "dark:bg-[#0f1012]/90 dark:ring-1 dark:ring-white/12 dark:shadow-none",
        ].join(" ")}
      >
        <header
          className={[
            "px-5 md:px-6 py-4",
            "bg-gray-50 border-b border-gray-200",
            "dark:bg-[#0b0c10]/95 dark:border-0",
          ].join(" ")}
        >
          <h3 className="text-[15px] md:text-[16px] font-semibold tracking-wide uppercase text-gray-900 dark:text-white/90">
            Bình luận
          </h3>
          <div className="mt-3 h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent dark:via-white/12" />
        </header>

        <div className="px-5 md:px-6 py-5">
          <div
            className={[
              "rounded-xl p-4 ring-1",
              "bg-white ring-gray-200",
              "dark:bg-white/[0.02] dark:ring-white/12",
            ].join(" ")}
          >
            <Composer
              value={composerValue}
              onChange={setComposerValue}
              onSubmit={handlePost}
              disabled={!auth?.user}
              currentUser={
                auth?.user
                  ? { name: currentUser.name, user: currentUser.user, avatarUrl: currentUser.avatarUrl }
                  : null
              }
              loginCta={() => alert("Đăng nhập để bình luận")}
            />
          </div>

          <div className="mt-6 space-y-6">
            {topLevel.length === 0 ? (
              <div className="py-10 text-center text-gray-600 dark:text-white/70">Chưa có bình luận nào.</div>
            ) : (
              topLevel.map((parent) => {
                const replies = enrichedComments.filter((r) => r.parentId === parent.id);
                return (
                  <ReplyThread
                    key={parent.id}
                    parent={parent}
                    replies={replies}
                    currentUser={
                      auth?.user
                        ? { name: currentUser.name, user: currentUser.user, avatarUrl: currentUser.avatarUrl }
                        : null
                    }
                    canInteract={!!auth?.user}
                    liked={likedComments}
                    edited={editedComments}
                    onToggleLike={handleToggleLike}
                    onDelete={(id) => deleteComment(id)}
                    replyOpen={!!replyInputs[parent.id]}
                    replyValue={replyValues[parent.id] ?? ""}
                    setReplyValue={(v) => setReplyValues((s) => ({ ...s, [parent.id]: v }))}
                    onSubmitReply={submitReply}
                    setInputRef={(el) => (inputRefs.current[parent.id] = el)}
                    onToggleReply={() => toggleReplyFor(parent.id)}
                    onSaveEdit={saveEdit}
                  />
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
