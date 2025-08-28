import React, { useRef, useState } from "react";
import defaultAvatar from "../../assets/img/default_avt.png";
import { Smile, SendHorizontal, Loader2 } from "lucide-react";
import { EmojiPickerBox } from "./EmojiPickerBox";
import { useAutoGrow } from "../../pages/CommentUser/hooks/useAutoGrow";

type UserLite = { name: string; user: string; avatarUrl?: string | null };

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSubmit: (content: string) => void;
  disabled?: boolean;
  currentUser: UserLite | null;
  loginCta?: () => void;
};

const MAX_CHARS = 750;

export const Composer = ({
  value,
  onChange,
  onSubmit,
  disabled,
  currentUser,
  loginCta,
}: Props) => {
  const [emojiOpen, setEmojiOpen] = useState(false);
  const emojiBtnRef = useRef<HTMLButtonElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [focused, setFocused] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  useAutoGrow<HTMLTextAreaElement>(textareaRef, value);

  const charCount = value.length;
  const nearLimit = charCount > MAX_CHARS - 30;
  const blocked = !!disabled || value.trim().length === 0;

  const handleChangeWithCharLimit = (text: string) => {
    if (text.length <= MAX_CHARS) onChange(text);
    else onChange(text.slice(0, MAX_CHARS));
  };

  const pickEmoji = (emoji: string) => {
    const el = textareaRef.current;
    if (!el) {
      handleChangeWithCharLimit(value + emoji);
      setEmojiOpen(false);
      return;
    }
    const start = el.selectionStart ?? value.length;
    const end = el.selectionEnd ?? value.length;
    const next = value.slice(0, start) + emoji + value.slice(end);
    handleChangeWithCharLimit(next);
    setEmojiOpen(false);
    requestAnimationFrame(() => {
      el.focus();
      const caret = Math.min(start + emoji.length, MAX_CHARS);
      el.setSelectionRange(caret, caret);
    });
  };

  const trySubmit = async () => {
    if (blocked) {
      if (disabled && loginCta) loginCta?.();
      return;
    }
    setSubmitting(true);
    try {
      await Promise.resolve(onSubmit(value.trim()));
      setEmojiOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      trySubmit();
    }
  };

  if (!currentUser) {
    return (
      <div className="text-center py-4">
        <button
          onClick={loginCta}
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-semibold text-white shadow-sm shadow-black/10 bg-[linear-gradient(90deg,#ff512f_0%,#ff6740_40%,#ff9966_100%)]"
        >
          Đăng nhập để bình luận
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3">
      <img
        src={currentUser.avatarUrl || defaultAvatar}
        alt=""
        className="h-10 w-10 rounded-full object-cover ring-1 ring-zinc-200 dark:ring-white/10"
      />

      <form
        className="flex-1"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          trySubmit();
        }}
      >
        <div
          className={[
            "mt-0 rounded-2xl overflow-hidden transition-shadow",
            // Light
            "bg-white ring-1 ring-zinc-200 shadow-sm",
            // Dark
            "dark:bg-[rgb(14,16,22)]/70 dark:backdrop-blur dark:ring-white/15",
            "focus-within:ring-2 focus-within:ring-zinc-300 dark:focus-within:ring-white/25",
            "shadow-[0_0_0_0_rgba(0,0,0,0)] dark:focus-within:shadow-[0_12px_36px_-20px_rgba(255,255,255,0.35)]",
          ].join(" ")}
        >
          {/* HEADER: tên + user + counter */}
          <div className="px-4 pt-2.5 pb-1.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[14px] text-zinc-900 dark:text-white">
                {currentUser.name}
              </span>
              <span className="text-xs text-zinc-500 dark:text-white/45">
                {currentUser.user}
              </span>
            </div>

            <span
              className={[
                "text-[11px] tabular-nums transition-opacity",
                "text-zinc-500 dark:text-white/70",
                nearLimit ? "text-zinc-900 dark:text-white" : "",
                focused || nearLimit ? "opacity-100" : "opacity-0",
              ].join(" ")}
            >
              {charCount}/{MAX_CHARS}
            </span>
          </div>

          {/* Divider */}
          <div className="px-4">
            {/* light: line xám nhạt, dark: gradient đôi như cũ */}
            <div className="h-px w-full bg-zinc-200 dark:bg-transparent" />
            <div className="-mt-px h-px w-full hidden dark:block bg-gradient-to-r from-white/5 via-white/15 to-white/5" />
            <div className="-mt-px h-px w-full hidden dark:block bg-black/40 opacity-60" />
          </div>

          {/* TEXTAREA */}
          <div className="px-4 pt-4 pb-2 relative">
            <textarea
              ref={textareaRef}
              className="w-full bg-transparent resize-none placeholder:text-zinc-400 dark:placeholder:text-white/35 focus:outline-none text-[15px] leading-6 text-zinc-900 dark:text-white"
              placeholder="Viết bình luận…"
              rows={1}
              value={value.slice(0, MAX_CHARS)}
              maxLength={MAX_CHARS}
              onKeyDown={onKeyDown}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onChange={(e) => handleChangeWithCharLimit(e.target.value)}
            />
          </div>

          {/* Divider */}
          <div className="px-4">
            <div className="h-px w-full bg-zinc-200 dark:bg-transparent" />
            <div className="-mt-px h-px w-full hidden dark:block bg-gradient-to-r from-white/5 via-white/15 to-white/5" />
            <div className="-mt-px h-px w-full hidden dark:block bg-black/40 opacity-60" />
          </div>

          {/* Footer: emoji + submit */}
          <div className="mt-2 px-4 pb-3 flex items-center justify-between">
            <div className="relative flex items-center gap-1.5">
              <div className="relative">
                <button
                  ref={emojiBtnRef}
                  type="button"
                  onClick={() => setEmojiOpen((v) => !v)}
                  title="Chèn emoji"
                  className={[
                    "h-8 w-8 inline-grid place-items-center rounded-xl transition",
                    // Light
                    "bg-zinc-50 ring-1 ring-zinc-200 hover:bg-zinc-100",
                    // Dark
                    "dark:bg-white/[0.03] dark:ring-white/10 dark:hover:bg-white/[0.06]",
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
              </div>
            </div>

            <button
              type="submit"
              aria-disabled={blocked || submitting}
              disabled={blocked || submitting}
              className={[
                "inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[12px] font-semibold text-white shadow-sm",
                "bg-[linear-gradient(90deg,#ff512f_0%,#ff6740_40%,#ff9966_100%)]",
                blocked || submitting
                  ? "opacity-60 cursor-not-allowed"
                  : "hover:brightness-110 active:brightness-95",
              ].join(" ")}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang đăng…
                </>
              ) : (
                <>
                  Đăng
                  <SendHorizontal className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
