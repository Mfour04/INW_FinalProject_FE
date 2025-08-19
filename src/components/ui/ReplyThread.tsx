import React, { useRef, useState } from "react";
import defaultAvatar from "../../assets/img/th.png";
import { Heart, MessageSquare, CornerDownRight, Smile } from "lucide-react";
import { MoreButton } from "./actions/MoreButton";
import { MoreUser } from "./actions/MoreUser";
import { Reply } from "./Reply";
import { EmojiPickerBox } from "./EmojiPickerBox";
import type { Comment } from "../../pages/CommentUser/types";

type UserLite = { name: string; user: string; avatarUrl?: string | null };
type EditedMap = Record<
  string,
  { content?: string; timestamp?: string; likes?: number; replies?: number }
>;

type Props = {
  parent: Comment;
  replies: Comment[];
  currentUser: UserLite | null;
  canInteract: boolean;

  liked: Record<string, boolean>;
  edited: EditedMap;

  onToggleLike: (commentId: string) => void;
  onDelete: (commentId: string) => void;

  replyOpen: boolean;
  replyValue: string;
  setReplyValue: (v: string) => void;
  onSubmitReply: (parentId: string) => void;
  setInputRef?: (el: HTMLTextAreaElement | null) => void;

  onToggleReply: () => void;

  onSaveEdit: (id: string, content: string) => void;
};

export const ReplyThread = ({
  parent,
  replies,
  currentUser,
  canInteract,
  liked,
  edited,
  onToggleLike,
  onDelete,
  replyOpen,
  replyValue,
  setReplyValue,
  onSubmitReply,
  setInputRef,
  onToggleReply,
  onSaveEdit,
}: Props) => {
  const [expanded, setExpanded] = useState(false);

  const [activeEditId, setActiveEditId] = useState<string | null>(null);
  // KHÔNG dùng localEdit state nữa -> textarea uncontrolled
  const editRef = useRef<HTMLTextAreaElement | null>(null);

  const [emojiOpenId, setEmojiOpenId] = useState<string | null>(null);
  const emojiBtnRef = useRef<HTMLButtonElement | null>(null);

  const startLocalEdit = (id: string, content: string) => {
    setActiveEditId(id);
    setEmojiOpenId(null);
    // delay để textarea mount xong rồi set value + focus + caret
    requestAnimationFrame(() => {
      const ta = editRef.current;
      if (!ta) return;
      ta.value = content ?? "";
      ta.focus();
      const pos = ta.value.length;
      ta.setSelectionRange(pos, pos);
    });
  };

  const cancelLocalEdit = () => {
    setActiveEditId(null);
    setEmojiOpenId(null);
  };

  const saveLocalEdit = (id: string) => {
    const content = (editRef.current?.value || "").trim();
    if (!content) return;
    onSaveEdit(id, content);
    setActiveEditId(null);
    setEmojiOpenId(null);
  };

  const insertEmojiAtCaret = (emoji: string) => {
    const ta = editRef.current;
    if (!ta) return;
    // dùng setRangeText để chèn đúng caret, không đổi selection ngoài ý muốn
    const start = ta.selectionStart ?? ta.value.length;
    const end = ta.selectionEnd ?? ta.value.length;
    ta.setRangeText(emoji, start, end, "end");
    // giới hạn 300 ký tự nếu cần
    if (ta.value.length > 300) {
      ta.value = ta.value.slice(0, 300);
      ta.setSelectionRange(300, 300);
    }
    ta.focus();
  };

  const parentLikes = edited[parent.id]?.likes ?? parent.likes;
  const replyCount = replies.length;

  const Header = ({
    name,
    user,
    timestamp,
    actions,
  }: {
    name: string;
    user: string;
    timestamp: string;
    actions?: React.ReactNode;
  }) => (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="truncate text-[14px] font-semibold">{name}</p>
          <span className="truncate text-[11px] text-white/55">{user}</span>
        </div>
        <p className="mt-0.5 text-[11px] text-white/45">{timestamp}</p>
      </div>
      {actions}
    </div>
  );

  const Body = ({ id, content }: { id: string; content: string }) => (
    <div className="mt-2">
      {activeEditId === id ? (
        <div className="space-y-2">
          <div className="relative">
            <textarea
              ref={(el) => {
                editRef.current = el;
              }}
              defaultValue={content}
              placeholder="Chỉnh sửa bình luận…"
              rows={3}
              maxLength={300}
              className="w-full rounded-lg bg-[#0b0e12] px-3 py-2 text-[14px] leading-6 outline-none ring-1 ring-white/10 focus:ring-[#8ecbff]/35 resize-none"
            />
            <div className="absolute bottom-2 left-2">
              <button
                ref={emojiBtnRef}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setEmojiOpenId((v) => (v === id ? null : id))}
                className="inline-grid place-items-center h-7 w-7 rounded-md ring-1 ring-white/10 bg-white/[0.05] hover:bg-white/[0.1] mb-2"
              >
                <Smile className="w-4 h-4" />
              </button>
              <EmojiPickerBox
                open={emojiOpenId === id}
                onPick={(emoji) => insertEmojiAtCaret(emoji)}
                anchorRef={emojiBtnRef}
                align="left"
                placement="top"
                onRequestClose={() => setEmojiOpenId(null)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => saveLocalEdit(id)}
              className="rounded-full px-3.5 py-1.5 text-[12.5px] text-white bg-white/10 hover:bg-white/15"
            >
              Lưu
            </button>
            <button
              onClick={cancelLocalEdit}
              className="rounded-full px-3.5 py-1.5 text-[12.5px] border border-white/10 hover:bg-white/5"
            >
              Hủy
            </button>
          </div>
        </div>
      ) : (
        <p className="whitespace-pre-wrap text-[14px] leading-relaxed">
          {content}
        </p>
      )}
    </div>
  );

  const LikeButton = ({
    id,
    count,
    hover = true,
  }: {
    id: string;
    count: number;
    hover?: boolean;
  }) => (
    <button
      onClick={() => canInteract && onToggleLike(id)}
      title={liked[id] ? "Bỏ thích" : "Thích"}
      className={[
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12.5px]",
        "bg-white/[0.06] ring-1 ring-white/10",
        hover ? "hover:bg-white/[0.1]" : "",
        canInteract ? "" : "opacity-50 cursor-not-allowed",
      ].join(" ")}
    >
      <Heart
        className={[
          "h-4 w-4",
          liked[id] ? "text-rose-400 fill-current" : "text-white/80",
        ].join(" ")}
      />
      <span>{count}</span>
    </button>
  );

  const ReplyCountToggle = ({
    count,
    onClick,
  }: {
    count: number;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      title="Xem phản hồi"
      className="relative inline-flex items-center justify-center rounded-full px-2.5 py-1 ring-1 ring-white/10 bg-white/[0.06] hover:bg-white/[0.1]"
      aria-label={`Có ${count} phản hồi`}
    >
      <MessageSquare className="h-4 w-4 text-white/85" />
      <span className="ml-1 text-[12.5px]">{count}</span>
    </button>
  );

  return (
    <div className="rounded-2xl bg-[#0e1014] ring-1 ring-white/[0.05] p-3 md:p-4">
      <div className="grid grid-cols-[40px_1fr] gap-3 items-start">
        <img
          src={parent.avatarUrl || defaultAvatar}
          className="h-10 w-10 rounded-full object-cover ring-1 ring-white/10"
        />
        <div className="min-w-0">
          <Header
            name={parent.name}
            user={parent.user}
            timestamp={edited[parent.id]?.timestamp ?? parent.timestamp}
            actions={
              canInteract ? (
                parent.user === currentUser?.user ||
                parent.name === currentUser?.name ? (
                  <MoreUser
                    commentId={parent.id}
                    onDelete={onDelete}
                    onEdit={() =>
                      startLocalEdit(
                        parent.id,
                        edited[parent.id]?.content ?? parent.content
                      )
                    }
                  />
                ) : (
                  <MoreButton />
                )
              ) : null
            }
          />

          <Body
            id={parent.id}
            content={edited[parent.id]?.content ?? parent.content}
          />

          <div className="mt-3 flex items-center gap-2 text-[12.5px]">
            <LikeButton id={parent.id} count={parentLikes} />
            {replyCount > 0 && (
              <ReplyCountToggle
                count={replyCount}
                onClick={() => setExpanded((v) => !v)}
              />
            )}
            <button
              onClick={() => canInteract && onToggleReply()}
              className={[
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12.5px]",
                "bg-white/[0.06] ring-1 ring-white/10 hover:bg-white/[0.1]",
                canInteract ? "" : "opacity-50 cursor-not-allowed",
              ].join(" ")}
              title={replyOpen ? "Đóng hộp trả lời" : "Trả lời"}
              aria-label="Trả lời"
            >
              <CornerDownRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {expanded && replyCount > 0 && (
        <div className="mt-5 space-y-3">
          {replies.map((r) => {
            const rLikes = edited[r.id]?.likes ?? r.likes;
            const isOwner =
              canInteract &&
              (r.user === currentUser?.user || r.name === currentUser?.name);

            return (
              <div
                key={r.id}
                className="ml-8 md:ml-12 grid grid-cols-[40px_1fr] gap-3 items-start"
              >
                <img
                  src={r.avatarUrl || defaultAvatar}
                  className="h-10 w-10 rounded-full object-cover ring-1 ring-white/10"
                />
                <div className="min-w-0">
                  <Header
                    name={r.name}
                    user={r.user}
                    timestamp={edited[r.id]?.timestamp ?? r.timestamp}
                    actions={
                      canInteract ? (
                        isOwner ? (
                          <MoreUser
                            commentId={r.id}
                            onDelete={onDelete}
                            onEdit={() =>
                              startLocalEdit(
                                r.id,
                                edited[r.id]?.content ?? r.content
                              )
                            }
                          />
                        ) : (
                          <MoreButton />
                        )
                      ) : null
                    }
                  />
                  <Body
                    id={r.id}
                    content={edited[r.id]?.content ?? r.content}
                  />
                  <div className="mt-2">
                    <LikeButton id={r.id} count={rLikes} hover={false} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {canInteract && replyOpen && (
        <div className="mt-4 ml-8 md:ml-12">
          <Reply
            currentUser={
              currentUser || {
                name: "Ẩn danh",
                user: "@user",
                avatarUrl: defaultAvatar,
              }
            }
            replyValue={replyValue}
            onReplyChange={(e) => setReplyValue(e.target.value)}
            onReplySubmit={() => onSubmitReply(parent.id)}
            inputRef={(el) => setInputRef?.(el as HTMLTextAreaElement | null)}
          />
        </div>
      )}
    </div>
  );
};
