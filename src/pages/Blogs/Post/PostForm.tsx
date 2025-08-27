import { motion } from "framer-motion";
import React from "react";
import { AuthContext } from "../../../context/AuthContext/AuthProvider";
import abc from "../../../assets/img/default_avt.png";
import Button from "../../../components/ButtonComponent";
import { EmojiPickerBox } from "../../../components/ui/EmojiPickerBox";
import { ImagePlus, Smile, SendHorizontal, X, Loader2 } from "lucide-react";

interface PostFormProps {
  content: string;
  setContent: (value: string) => void;
  isPosting: boolean;
  handlePost: () => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  selectedImages?: File[];
  setSelectedImages?: (images: File[]) => void;
  resetFileInput?: React.MutableRefObject<(() => void) | null>;
}

const MAX_FILES = 10;
const MAX_SIZE_MB = 5;
const MAX_WORDS = 1500;

function useAutoGrow(ref: React.RefObject<HTMLTextAreaElement | null>, value: string) {
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "0px";
    const next = Math.min(el.scrollHeight, 240);
    el.style.height = next + "px";
  }, [ref, value]);
}

const splitWords = (text: string) =>
  text.trim().split(/\s+/).filter(Boolean);

const countWords = (text: string) => splitWords(text).length;

const clampToMaxWords = (text: string, maxWords = MAX_WORDS) => {
  const parts = splitWords(text);
  if (parts.length <= maxWords) return text;
  return parts.slice(0, maxWords).join(" ");
};

const PostForm = ({
  content,
  setContent,
  isPosting,
  handlePost,
  handleKeyPress,
  selectedImages = [],
  setSelectedImages,
  resetFileInput,
}: PostFormProps) => {
  const { auth } = React.useContext(AuthContext);
  const [dragOver, setDragOver] = React.useState(false);
  const [fileError, setFileError] = React.useState<string | null>(null);
  const [focused, setFocused] = React.useState(false);
  const [emojiOpen, setEmojiOpen] = React.useState(false);
  const emojiBtnRef = React.useRef<HTMLButtonElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useAutoGrow(textareaRef, content);

  const wordCount = countWords(content);
  const nearLimit = wordCount > MAX_WORDS - 30;
  const remainingSlots = Math.max(0, MAX_FILES - selectedImages.length);

  const setContentWithLimit = (text: string) => {
    setContent(clampToMaxWords(text, MAX_WORDS));
  };

  const pickEmoji = (emoji: string) => {
    const el = textareaRef.current;
    if (!el) {
      setContentWithLimit(content + emoji);
      setEmojiOpen(false);
      return;
    }
    const start = el.selectionStart ?? content.length;
    const end = el.selectionEnd ?? content.length;
    const next = content.slice(0, start) + emoji + content.slice(end);
    setContentWithLimit(next);
    setEmojiOpen(false);
    requestAnimationFrame(() => {
      el.focus();
      const caret = Math.min(start + emoji.length, (next || "").length);
      el.setSelectionRange(caret, caret);
    });
  };

  const acceptFiles = (incoming: File[]) => {
    if (!setSelectedImages) return;
    const errs: string[] = [];
    const onlyImages = incoming.filter((f) => {
      const ok = f.type.startsWith("image/");
      if (!ok) errs.push(`"${f.name}" không phải ảnh hợp lệ.`);
      return ok;
    });
    const sizeOk = onlyImages.filter((f) => {
      const ok = f.size <= MAX_SIZE_MB * 1024 * 1024;
      if (!ok) errs.push(`"${f.name}" vượt ${MAX_SIZE_MB}MB.`);
      return ok;
    });
    const clipped = sizeOk.slice(0, remainingSlots);
    if (sizeOk.length > remainingSlots) {
      errs.push(`Chỉ thêm tối đa ${remainingSlots} ảnh nữa (tối đa ${MAX_FILES} ảnh).`);
    }
    if (clipped.length > 0) {
      setSelectedImages([...(selectedImages || []), ...clipped]);
    }
    setFileError(errs.length ? errs.join(" ") : null);
  };

  const handleSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length) acceptFiles(files);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    if (!remainingSlots) {
      setFileError(`Đã đạt tối đa ${MAX_FILES} ảnh.`);
      return;
    }
    const dropped = Array.from(e.dataTransfer.files || []);
    if (dropped.length) acceptFiles(dropped);
  };

  const removeImage = (index: number) => {
    if (!setSelectedImages) return;
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  const openFileDialog = () => fileInputRef.current?.click();

  React.useEffect(() => {
    if (resetFileInput) {
      resetFileInput.current = () => {
        if (fileInputRef.current) fileInputRef.current.value = "";
      };
    }
  }, [resetFileInput]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      if (!isPosting && (content.trim().length > 0 || selectedImages.length > 0)) {
        handlePost();
        setEmojiOpen(false);
      }
      return;
    }
  };

  const disabledSubmit =
    isPosting || (content.trim().length === 0 && selectedImages.length === 0);

  return (
    <div
      className={[
        "rounded-2xl overflow-hidden transition-shadow",
        // Light
        "bg-white ring-1 ring-zinc-200 shadow-sm",
        // Dark
        "dark:bg-[rgb(14,16,22)]/70 dark:backdrop-blur dark:ring-white/15 dark:shadow-none",
        dragOver ? "ring-2 ring-orange-400/70 dark:ring-orange-400/70" : "",
        "focus-within:ring-2 focus-within:ring-zinc-300 dark:focus-within:ring-white/25",
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
      <div className="px-4 pt-3 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={auth?.user?.avatarUrl || abc}
            alt="avatar"
            className="h-10 w-10 rounded-full object-cover ring-1 ring-zinc-200 dark:ring-white/10"
          />
          <div className="leading-tight">
            <div className="font-semibold text-[14px] text-zinc-900 dark:text-white">
              {auth?.user?.displayName || auth?.user?.userName || "User"}
            </div>
            <div className="text-xs text-zinc-500 dark:text-white/50">
              @{auth?.user?.userName || "user"}
            </div>
          </div>
        </div>
        <span
          className={[
            "text-[11px] tabular-nums transition-opacity",
            nearLimit ? "text-zinc-900 dark:text-white" : "text-zinc-500 dark:text-white/70",
            focused || nearLimit ? "opacity-100" : "opacity-0",
          ].join(" ")}
        >
          {wordCount}/{MAX_WORDS} từ
        </span>
      </div>

      <div className="px-4">
        <div className="h-px w-full bg-zinc-200 dark:bg-white/10" />
      </div>

      <div className="px-4 pt-4 pb-2 relative">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContentWithLimit(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Chia sẻ điều gì đó…"
          className="w-full bg-transparent resize-none placeholder:text-zinc-400 dark:placeholder:text-white/35 focus:outline-none text-[15px] leading-6 text-zinc-900 dark:text-white"
          rows={1}
        />
      </div>

      {fileError && (
        <div className="px-4 -mt-1 pb-1">
          <p className="text-[12px] text-red-600 dark:text-red-300">{fileError}</p>
        </div>
      )}

      {selectedImages.length > 0 && (
        <div className="px-3 pb-3 grid [grid-template-columns:repeat(auto-fill,minmax(110px,1fr))] gap-2">
          {selectedImages.map((image, index) => {
            const url = URL.createObjectURL(image);
            return (
              <div
                key={index}
                className="relative group rounded-xl overflow-hidden ring-1 ring-zinc-200 dark:ring-white/10"
              >
                <div className="w-full aspect-[4/3]">
                  <img
                    src={url}
                    alt={image.name}
                    className="h-full w-full object-cover"
                    onLoad={() => URL.revokeObjectURL(url)}
                  />
                </div>
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 inline-flex items-center justify-center h-6 w-6 rounded-full bg-black/60 ring-1 ring-white/20 opacity-90 hover:opacity-100 transition"
                  title="Xoá ảnh"
                  type="button"
                >
                  <X className="h-3.5 w-3.5 text-white" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black/45 backdrop-blur-[1px] text-white text-[11px] px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity truncate">
                  {image.name}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="px-4">
        <div className="h-px w-full bg-zinc-200 dark:bg-white/10" />
      </div>

      <div className="px-4 py-3 flex items-center justify-between">
        <div className="relative flex items-center gap-2">
          <button
            type="button"
            onClick={openFileDialog}
            title={remainingSlots ? `Thêm ảnh (${remainingSlots} còn lại)` : "Đã đạt giới hạn ảnh"}
            className={[
              "h-9 px-3 inline-flex items-center gap-2 rounded-xl ring-1",
              "bg-zinc-50 hover:bg-zinc-100 ring-zinc-200 text-zinc-900",
              "dark:bg-white/[0.03] dark:hover:bg-white/[0.06] dark:ring-white/10 dark:text-white",
              remainingSlots ? "" : "opacity-50 cursor-not-allowed",
            ].join(" ")}
            aria-disabled={!remainingSlots}
          >
            <ImagePlus className="h-4 w-4" />
            <span className="text-xs hidden sm:inline">Ảnh</span>
            {selectedImages.length > 0 && (
              <span className="ml-1 inline-flex items-center justify-center h-4 min-w-4 px-1 rounded-full bg-[#ff6740] text-[10px] text-white">
                {selectedImages.length}
              </span>
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleSelect}
            className="hidden"
          />

          <div className="relative">
            <button
              ref={emojiBtnRef}
              type="button"
              onClick={() => setEmojiOpen((v) => !v)}
              className="h-9 w-9 inline-grid place-items-center rounded-xl ring-1 bg-zinc-50 hover:bg-zinc-100 ring-zinc-200 text-zinc-900 dark:ring-white/10 dark:bg-white/[0.03] dark:hover:bg-white/[0.06] dark:text-white transition"
              title="Chèn emoji"
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
              width={320}
              height={260}
            />
          </div>
        </div>

        <Button
          isLoading={isPosting}
          onClick={() => {
            if (disabledSubmit) return;
            handlePost();
            setEmojiOpen(false);
          }}
          disabled={disabledSubmit}
          className={[
            "rounded-full px-3.5 py-1.5 text-[12px] font-semibold text-white shadow-sm",
            "whitespace-nowrap",
            "bg-[linear-gradient(90deg,#ff512f_0%,#ff6740_40%,#ff9966_100%)]",
            disabledSubmit ? "opacity-60 cursor-not-allowed" : "hover:brightness-110 active:brightness-95",
          ].join(" ")}
        >
          <span className="inline-flex items-center gap-2 whitespace-nowrap leading-none align-middle">
            {isPosting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                <span>Đang đăng…</span>
              </>
            ) : (
              <>
                <span>Đăng</span>
                <SendHorizontal className="h-4 w-4 shrink-0" />
              </>
            )}
          </span>
        </Button>
      </div>
    </div>
  );
};

export default PostForm;
