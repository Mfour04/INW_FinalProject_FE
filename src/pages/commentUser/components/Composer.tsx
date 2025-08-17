import React, { useCallback, useMemo, useRef, useState } from "react";
import { useAutoGrow } from "../hooks/useAutoGrow";
import defaultAvatar from "../../../assets/img/th.png";
import { ImagePlus, Smile, SendHorizontal, X, Loader2 } from "lucide-react";
import { EmojiPickerBox } from "./EmojiPickerBox";

type UserLite = { name: string; user: string; avatarUrl?: string | null };

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSubmit: (content: string, files?: File[]) => void;
  disabled?: boolean;
  currentUser: UserLite | null;
  loginCta?: () => void;
};

const MAX_FILES = 5;
const MAX_SIZE_MB = 10;
const MAX_CHARS = 750;

export const Composer: React.FC<Props> = ({
  value,
  onChange,
  onSubmit,
  disabled,
  currentUser,
  loginCta,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  useAutoGrow<HTMLTextAreaElement>(textareaRef, value);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const emojiBtnRef = useRef<HTMLButtonElement>(null);

  const [dragOver, setDragOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const [focused, setFocused] = useState(false);

  const charCount = value.length;
  const nearLimit = charCount > MAX_CHARS - 30;

  const handleChangeWithCharLimit = (text: string) => {
    if (text.length <= MAX_CHARS) {
      onChange(text);
    } else {
      onChange(text.slice(0, MAX_CHARS));
    }
  };

  const blocked = !!disabled || value.trim().length === 0;

  const remaining = useMemo(
    () => Math.max(0, MAX_FILES - files.length),
    [files.length]
  );

  const acceptFiles = useCallback(
    (incoming: File[]) => {
      let errMsg: string[] = [];

      const onlyImages = incoming.filter((f) => {
        const ok = f.type.startsWith("image/");
        if (!ok) errMsg.push(`"${f.name}" không phải ảnh hợp lệ.`);
        return ok;
      });

      const sizeOk = onlyImages.filter((f) => {
        const ok = f.size <= MAX_SIZE_MB * 1024 * 1024;
        if (!ok) errMsg.push(`"${f.name}" vượt ${MAX_SIZE_MB}MB.`);
        return ok;
      });

      const slots = Math.max(0, MAX_FILES - files.length);
      const clipped = sizeOk.slice(0, slots);
      if (sizeOk.length > slots) {
        errMsg.push(`Chỉ thêm tối đa ${slots} ảnh nữa (tối đa ${MAX_FILES} ảnh).`);
      }

      if (clipped.length > 0) {
        setFiles((prev) => [...prev, ...clipped]);
      }

      setFileError(errMsg.length ? errMsg.join(" ") : null);
    },
    [files.length]
  );

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files || []);
    if (picked.length) acceptFiles(picked);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    if (!remaining) {
      setFileError(`Đã đạt tối đa ${MAX_FILES} ảnh.`);
      return;
    }
    const dropped = Array.from(e.dataTransfer.files || []);
    if (dropped.length) acceptFiles(dropped);
  };

  const removeFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
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
      if (disabled && loginCta) loginCta();
      return;
    }
    setSubmitting(true);
    try {
      await Promise.resolve(onSubmit(value.trim(), files));
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
        className="h-10 w-10 rounded-full object-cover ring-1 ring-white/10"
      />

      <form
        className="flex-1"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          trySubmit();
        }}
      >
        {/* BỌC — giống Reply: khung có header + counter */}
        <div
          className={[
            "mt-0 rounded-2xl overflow-hidden transition-shadow",
            "bg-[rgb(14,16,22)]/70 backdrop-blur",
            "ring-1 ring-white/15",
            dragOver ? "ring-2 ring-orange-400/70" : "",
            "focus-within:ring-2 focus-within:ring-white/25",
            "shadow-[0_0_0_0_rgba(0,0,0,0)] focus-within:shadow-[0_12px_36px_-20px_rgba(255,255,255,0.35)]",
          ].join(" ")}
          onDragEnter={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setDragOver(false);
          }}
          onDrop={handleDrop}
        >
          {/* HEADER: tên + user bên trái, đếm chữ bên phải */}
          <div className="px-4 pt-2.5 pb-1.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[14px]">{currentUser.name}</span>
              <span className="text-xs text-white/45">{currentUser.user}</span>
            </div>

            <span
              className={[
                "text-[11px] tabular-nums transition-opacity",
                nearLimit ? "text-white" : "text-white/70",
                focused || nearLimit ? "opacity-100" : "opacity-0",
              ].join(" ")}
            >
              {charCount}/{MAX_CHARS}
            </span>
          </div>

          {/* Divider đôi (giống Reply) */}
          <div className="px-4">
            <div className="h-px w-full bg-gradient-to-r from-white/5 via-white/15 to-white/5" />
            <div className="-mt-px h-px w-full bg-black/40 opacity-60" />
          </div>

          {/* TEXTAREA */}
          <div className="px-4 pt-4 pb-2 relative">
            <textarea
              ref={textareaRef}
              className="w-full bg-transparent resize-none placeholder:text-white/35 focus:outline-none text-[15px] leading-6"
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

          {fileError && (
            <div className="px-4 -mt-1 pb-1">
              <p className="text-[12px] text-red-300">{fileError}</p>
            </div>
          )}

          {files.length > 0 && (
            <div className="px-3 pb-3 grid [grid-template-columns:repeat(auto-fill,minmax(96px,1fr))] gap-2">
              {files.map((f, idx) => {
                const url = URL.createObjectURL(f);
                return (
                  <div
                    key={idx}
                    className="relative group rounded-xl overflow-hidden ring-1 ring-white/10"
                  >
                    <div className="w-full aspect-[4/3]">
                      <img
                        src={url}
                        alt={f.name}
                        className="h-full w-full object-cover"
                        onLoad={() => URL.revokeObjectURL(url)}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(idx)}
                      className="absolute top-1 right-1 inline-flex items-center justify-center h-6 w-6 rounded-full bg-black/60 ring-1 ring-white/20 opacity-90 hover:opacity-100 transition"
                      title="Xoá ảnh"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Divider đôi trước hàng nút */}
          <div className="px-4">
            <div className="h-px w-full bg-gradient-to-r from-white/5 via-white/15 to-white/5" />
            <div className="-mt-px h-px w-full bg-black/40 opacity-60" />
          </div>

          {/* HÀNG NÚT */}
          <div className="mt-2 px-4 pb-3 flex items-center justify-between">
            <div className="relative flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title={
                  remaining
                    ? `Thêm ảnh (${remaining} còn lại)`
                    : "Đã đạt giới hạn ảnh"
                }
                className={[
                  "h-8 px-2 inline-flex items-center gap-2 rounded-xl ring-1 ring-white/10",
                  "bg-white/[0.03] hover:bg-white/[0.06] transition",
                  remaining ? "" : "opacity-50 cursor-not-allowed",
                ].join(" ")}
                aria-disabled={!remaining}
              >
                <ImagePlus className="h-4 w-4" />
                <span className="text-xs hidden sm:inline">Ảnh</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleSelect}
                onClick={(e) => {
                  (e.target as HTMLInputElement).value = "";
                }}
                className="hidden"
              />

              <div className="relative">
                <button
                  ref={emojiBtnRef}
                  type="button"
                  onClick={() => setEmojiOpen((v) => !v)}
                  title="Chèn emoji"
                  className="h-8 w-8 inline-grid place-items-center rounded-xl ring-1 ring-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition"
                >
                  <Smile className="h-4 w-4" />
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
                "inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[12px] font-semibold text-white shadow-sm shadow-black/10",
                "bg-[linear-gradient(90deg,#ff512f_0%,#ff6740_40%,#ff9966_100%)]",
                blocked || submitting ? "opacity-60 cursor-not-allowed" : "hover:brightness-110 active:brightness-95",
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
