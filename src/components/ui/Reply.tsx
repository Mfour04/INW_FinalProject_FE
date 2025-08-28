import React, { useEffect, useRef, useState } from "react";
import avatarImage from "../../assets/img/default_avt.png";
import { Smile, SendHorizontal } from "lucide-react";
import { EmojiPickerBox } from "./EmojiPickerBox";

interface ReplyProps {
  currentUser: { name: string; user: string; avatarUrl?: string | null };
  replyValue: string;
  onReplyChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onReplySubmit: () => void;
  inputRef?: (el: HTMLInputElement | HTMLTextAreaElement | null) => void;
}

const MAX_CHARS = 300;

export const Reply = ({
  currentUser,
  replyValue,
  onReplyChange,
  onReplySubmit,
  inputRef,
}: ReplyProps) => {
  const name = currentUser.name || "Người dùng";
  const user = currentUser.user || "@anonymous";
  const avatarSrc = currentUser.avatarUrl || avatarImage;

  const len = replyValue.length;
  const disabled = replyValue.trim().length === 0;

  const [focused, setFocused] = useState(false);
  const areaRef = useRef<HTMLTextAreaElement | null>(null);

  const [emojiOpen, setEmojiOpen] = useState(false);
  const emojiBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${el.scrollHeight}px`;
  }, [replyValue, focused]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (!disabled) onReplySubmit();
  };

  const emitChange = (next: string) => {
    const target = { value: next } as unknown as HTMLTextAreaElement;
    const evt = { target } as React.ChangeEvent<HTMLTextAreaElement>;
    onReplyChange(evt);
  };

  const pickEmoji = (emoji: string) => {
    const el = areaRef.current;
    if (!el) {
      emitChange((replyValue + emoji).slice(0, MAX_CHARS));
      setEmojiOpen(false);
      return;
    }
    const start = el.selectionStart ?? replyValue.length;
    const end = el.selectionEnd ?? replyValue.length;
    const next = replyValue.slice(0, start) + emoji + replyValue.slice(end);
    const clipped = next.slice(0, MAX_CHARS);
    emitChange(clipped);
    setEmojiOpen(false);
    requestAnimationFrame(() => {
      el.focus();
      const caret = Math.min(start + emoji.length, clipped.length);
      el.setSelectionRange(caret, caret);
    });
  };

  return (
    <div className="flex items-start gap-3">
      <img
        src={avatarSrc}
        alt={name}
        className="h-8 w-8 rounded-full object-cover ring-1 ring-zinc-200 dark:ring-white/10 select-none"
      />
      <form className="flex-1" onSubmit={handleSubmit}>
        <div
          className={[
            "rounded-xl p-2.5 transition-all",
            // Light
            "bg-white ring-1 ring-zinc-200 shadow-sm",
            // Dark
            "dark:bg-[rgba(14,16,22,0.75)] dark:backdrop-blur-md dark:ring-white/10",
            focused
              ? "ring-zinc-300 dark:ring-white/25 shadow-[0_12px_24px_-18px_rgba(0,0,0,0.25)] dark:shadow-[0_12px_36px_-18px_rgba(255,255,255,0.25)]"
              : "shadow-none",
          ].join(" ")}
        >
          <div className="px-2 mb-1 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[14px] text-zinc-900 dark:text-white">{name}</span>
              <span className="text-xs text-zinc-500 dark:text-white/45">{user}</span>
            </div>
            <span
              className={[
                "text-[11px] tabular-nums transition-opacity",
                "text-zinc-500 dark:text-white/70",
                len > MAX_CHARS - 30 ? "text-zinc-900 dark:text-white" : "",
                focused || len > MAX_CHARS - 30 ? "opacity-100" : "opacity-0",
              ].join(" ")}
            >
              {len}/{MAX_CHARS}
            </span>
          </div>

          {/* Divider */}
          <div className="px-2">
            <div className="h-px w-full bg-zinc-200 dark:bg-transparent" />
            <div className="-mt-px h-px w-full hidden dark:block bg-gradient-to-r from-white/5 via-white/15 to-white/5" />
            <div className="-mt-px h-px w-full hidden dark:block bg-black/40 opacity-60" />
          </div>

          <div className="px-2 pt-6">
            <textarea
              ref={(el) => {
                areaRef.current = el;
                inputRef?.(el);
              }}
              value={replyValue}
              onChange={onReplyChange}
              placeholder="Viết phản hồi…"
              maxLength={MAX_CHARS}
              rows={1}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                  e.preventDefault();
                  handleSubmit();
                } else if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              className="w-full min-w-[260px] bg-transparent text-[14px] leading-5 focus:outline-none placeholder:text-zinc-400 dark:placeholder:text-white/45 resize-none text-zinc-900 dark:text-white"
            />
          </div>

          <div className="px-2 mt-2">
            <div className="h-px w-full bg-zinc-200 dark:bg-transparent" />
            <div className="-mt-px h-px w-full hidden dark:block bg-gradient-to-r from-white/5 via-white/15 to-white/5" />
            <div className="-mt-px h-px w-full hidden dark:block bg-black/40 opacity-60" />
          </div>

          <div className="px-2 pt-2 flex items-center justify-between relative">
            <button
              ref={emojiBtnRef}
              type="button"
              title="Chèn emoji"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setEmojiOpen((v) => !v);
              }}
              className={[
                "inline-grid place-items-center h-8 w-8 rounded-xl transition focus:outline-none focus:ring-2",
                // Light
                "bg-zinc-50 ring-1 ring-zinc-200 hover:bg-zinc-100 focus:ring-zinc-300",
                // Dark
                "dark:bg-white/[0.03] dark:ring-white/10 dark:hover:bg-white/[0.06] dark:focus:ring-white/25",
              ].join(" ")}
            >
              <Smile className="h-4 w-4 text-zinc-700 dark:text-white" />
            </button>

            <EmojiPickerBox
              open={emojiOpen}
              onPick={pickEmoji}
              anchorRef={emojiBtnRef}
              align="left"
              placement="top"
              onRequestClose={() => setEmojiOpen(false)}
            />

            <button
              type="submit"
              disabled={disabled}
              aria-disabled={disabled}
              className={[
                "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[12px] font-semibold text-white shadow-sm",
                "bg-[linear-gradient(90deg,#ff512f_0%,#ff6740_40%,#ff9966_100%)]",
                disabled
                  ? "opacity-60 cursor-not-allowed"
                  : "hover:brightness-110 active:brightness-95",
              ].join(" ")}
            >
              Đăng
              <SendHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
