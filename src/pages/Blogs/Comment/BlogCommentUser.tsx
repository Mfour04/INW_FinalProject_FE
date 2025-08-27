import { useContext, useMemo, useRef, useState, useCallback, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import type { Comment } from "../../commentUser/types";
import { AuthContext } from "../../../context/AuthContext/AuthProvider";

import {
  blogFormatVietnamTimeFromTicks,
  blogFormatVietnamTimeFromTicksForUpdate,
  blogGetCurrentTicks,
} from "../../../utils/date_format";


import { Composer } from "../../../components/ui/Composer";
import { ReplyThread } from "../../../components/ui/ReplyThread";

import {
  UseForumComments,
  UseCreateForumComment,
  UseUpdateForumComment,
  UseDeleteForumComment,
} from "../HooksBlog";
import {
  LikeForumComment,
  UnlikeForumComment,
} from "../../../api/ForumComment/forum-comment.api";

type Props = {
  postId: string;
};

export const BlogCommentUser = ({ postId }: Props) => {
  const { auth } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const [composerValue, setComposerValue] = useState("");
  const [replyInputs, setReplyInputs] = useState<Record<string, boolean>>({});
  const [replyValues, setReplyValues] = useState<Record<string, string>>({});
  const inputRefs = useRef<Record<string, HTMLTextAreaElement | null>>({});

  const { data: rawComments, refetch: refetchComments } = UseForumComments(postId);

  useEffect(() => {
    queryClient.removeQueries({ queryKey: ["forum-comments", postId] });
    refetchComments();
  }, [refetchComments, postId, queryClient]);

  const { mutate: postComment } = UseCreateForumComment(postId);
  const { mutate: updateComment } = UseUpdateForumComment(postId);
  const { mutate: deleteComment } = UseDeleteForumComment(postId);

  const currentUser = {
    id: auth?.user?.userId || "",
    name: auth?.user?.displayName || auth?.user?.userName || "Ẩn danh",
    user: "@" + (auth?.user?.userName || "user"),
    avatarUrl: auth?.user?.avatarUrl || null,
  };

  const [likedComments, setLikedComments] = useState<Record<string, boolean>>(() => {
    const m: Record<string, boolean> = {};
    Object.keys(localStorage).forEach((k) => {
      if (k.startsWith("liked_")) m[k.replace("liked_", "")] = true;
    });
    return m;
  });

  const [editedComments, setEditedComments] = useState<
    Record<string, { content?: string; timestamp?: string; likes?: number; replies?: number }>
  >({});

  const serverComments: Comment[] = useMemo(() => {
    const flat: Comment[] = [];
    const replyCountMap: Record<string, number> = {};

    const collect = (c: any) => {
      if (!c?.id) return;

      const created = Number(c.createdAt) || 0;
      const updated = Number(c.updatedAt) || 0;
      const local = Number(localStorage.getItem(`updatedAt_${c.id}`)) || 0;
      const latest = Math.max(created, updated, local);
      const timestamp =
        latest > 0 ? blogFormatVietnamTimeFromTicks(latest) : "Không rõ thời gian";

      const author = c.author || c.user || c.Author || {};
      const name =
        author.displayName ||
        author.username ||
        c.authorName ||
        c.displayName ||
        "Ẩn danh";
      const user = author.username ? `@${author.username}` : `@${author.userName || "user"}`;
      const avatar =
        author.avatar ||
        author.avatarUrl ||
        c.avatarUrl ||
        c.Author?.Avatar

      flat.push({
        id: c.id,
        content: c.content,
        parentId: c.parentId ?? c.parent_comment_id ?? c.parentCommentId ?? null,
        likes: c.likeCount ?? 0,
        replies: replyCountMap[c.id] || 0,
        name,
        user,
        avatarUrl: avatar,
        timestamp,
      });

      if (Array.isArray(c.replies)) c.replies.forEach(collect);
    };

    if (Array.isArray(rawComments)) {
      rawComments.forEach(collect);
    }
    return flat;
  }, [rawComments]);

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

  const topLevel = useMemo(
    () => enrichedComments.filter((c) => !c.parentId && c.id),
    [enrichedComments]
  );

  const handlePost = useCallback(
    (content: string) => {
      if (!content.trim()) return;
      if (!auth?.user) return alert("Đăng nhập để bình luận");

      postComment(
        { content },
        {
          onSuccess: (res: any) => {
            setComposerValue("");
            if (res?.data?.success === false && res?.data?.message?.includes("Duplicate")) {
              alert("Bạn đã comment nội dung này rồi. Vui lòng đợi 5 phút hoặc comment nội dung khác.");
              return;
            }
            queryClient.removeQueries({ queryKey: ["forum-comments", postId] });
            queryClient.invalidateQueries({ queryKey: ["forum-comments", postId] });
            queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
            queryClient.invalidateQueries({ queryKey: ["user-blog-posts"] });
            queryClient.invalidateQueries({ queryKey: ["following-blog-posts"] });
          },
        }
      );
    },
    [auth?.user, postId, postComment, queryClient]
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
        { content, parentCommentId: parentId },
        {
          onSuccess: () => {
            queryClient.removeQueries({ queryKey: ["forum-comments", postId] });
            queryClient.invalidateQueries({ queryKey: ["forum-comments", postId] });
            queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
            queryClient.invalidateQueries({ queryKey: ["user-blog-posts"] });
            queryClient.invalidateQueries({ queryKey: ["following-blog-posts"] });
            setReplyValues((v) => ({ ...v, [parentId]: "" }));
          },
        }
      );
    },
    [auth?.user, postId, postComment, queryClient, replyValues]
  );

  const handleToggleLike = useCallback(
    async (commentId: string) => {
      if (!auth?.user) return;
      const hasLiked = likedComments[commentId];
      const original = enrichedComments.find((c) => c.id === commentId);
      const currentLikes = editedComments[commentId]?.likes ?? original?.likes ?? 0;

      if (hasLiked) {
        const res = await UnlikeForumComment(commentId, currentUser.id);
        if (res.data.success) {
          const next = Math.max(0, currentLikes - 1);
          setLikedComments((m) => ({ ...m, [commentId]: false }));
          localStorage.removeItem(`liked_${commentId}`);
          localStorage.setItem(`likes_${commentId}`, String(next));
          setEditedComments((m) => ({ ...m, [commentId]: { ...(m[commentId] || {}), likes: next } }));
        }
      } else {
        const res = await LikeForumComment(commentId, currentUser.id, 1);
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
            const ticks = blogGetCurrentTicks();
            const ts = blogFormatVietnamTimeFromTicksForUpdate(ticks);
            setEditedComments((m) => ({ ...m, [id]: { ...(m[id] || {}), content, timestamp: ts } }));
            localStorage.setItem(`updatedAt_${id}`, String(ticks));
            queryClient.invalidateQueries({ queryKey: ["forum-comments", postId] });
          },
        }
      );
    },
    [postId, updateComment, queryClient]
  );

  const handleDelete = useCallback(
    (id: string) => {
      deleteComment(id, {
        onSuccess: () => {
          queryClient.removeQueries({ queryKey: ["forum-comments", postId] });
          queryClient.invalidateQueries({ queryKey: ["forum-comments", postId] });
          queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
          queryClient.invalidateQueries({ queryKey: ["user-blog-posts"] });
          queryClient.invalidateQueries({ queryKey: ["following-blog-posts"] });

          setEditedComments((m) => {
            const n = { ...m };
            delete n[id];
            return n;
          });
          setLikedComments((m) => {
            const n = { ...m };
            delete n[id];
            return n;
          });
          localStorage.removeItem(`liked_${id}`);
          localStorage.removeItem(`likes_${id}`);
          localStorage.removeItem(`updatedAt_${id}`);
        },
      });
    },
    [deleteComment, enrichedComments, postId, queryClient, currentUser.id]
  );

  return (
    <section className="">
      <div className="px-4 md:px-2 py-2">
        <div className="rounded-xl bg-white/[0.02] ring-1 ring-white/12 p-4">
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

        <div className="mt-6 space-y-3">
          {topLevel.length === 0 ? (
            <div className="py-2 text-center text-white/70">Chưa có bình luận nào.</div>
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
                  onDelete={handleDelete}
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
    </section>
  );
};

export default BlogCommentUser;