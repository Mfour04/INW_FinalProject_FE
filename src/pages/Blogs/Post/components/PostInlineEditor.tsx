import React from "react";
import { EmojiPickerBox } from "../../../../components/ui/EmojiPickerBox";
import { Smile, Pencil, Loader2 } from "lucide-react";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onCancel: () => void;
  onSave: () => void;
  saving?: boolean;
  maxHeightPx?: number; 
};

function useAutoGrow(
  ref: React.RefObject<HTMLTextAreaElement | null>,
  value: string,
  maxPx = 160
) {
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "0px";
    const next = Math.min(el.scrollHeight, maxPx);
    el.style.height = next + "px";
  }, [ref, value, maxPx]);
}

const PostInlineEditor: React.FC<Props> = ({
  value,
  onChange,
  onCancel,
  onSave,
  saving = false,
  maxHeightPx = 160,
}) => {
  const taRef = React.useRef<HTMLTextAreaElement>(null);
  const emojiBtnRef = React.useRef<HTMLButtonElement>(null);
  const [emojiOpen, setEmojiOpen] = React.useState(false);

  useAutoGrow(taRef, value, maxHeightPx);

  const disabled = saving || value.trim().length === 0;

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      if (!disabled) onSave();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      onCancel();
    }
  };

  const pickEmoji = (emoji: string) => {
    const el = taRef.current;
    const current = value || "";
    if (!el) {
      onChange(current + emoji);
      setEmojiOpen(false);
      return;
    }
    const start = el.selectionStart ?? current.length;
    const end = el.selectionEnd ?? current.length;
    const next = current.slice(0, start) + emoji + current.slice(end);
    onChange(next);
    setEmojiOpen(false);
    requestAnimationFrame(() => {
      el.focus();
      const caret = Math.min(start + emoji.length, (next || "").length);
      el.setSelectionRange(caret, caret);
    });
  };

  return (
    <div
      className={[
        // light
        "rounded-2xl bg-white ring-1 ring-zinc-200 shadow-sm",
        // dark
        "dark:bg-[rgb(14,16,22)]/70 dark:backdrop-blur dark:ring-white/12 dark:focus-within:ring-white/25 dark:shadow-none",
        "focus-within:ring-2 focus-within:ring-zinc-300",
      ].join(" ")}
    >
      <div className="px-3.5 pt-3 pb-2">
        <textarea
          ref={taRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Chỉnh sửa nội dung…"
          className="w-full bg-transparent resize-none focus:outline-none text-[15px] leading-6 text-zinc-900 placeholder:text-zinc-400 dark:text-white dark:placeholder:text-white/35"
          rows={1}
          autoFocus
        />
      </div>

      {/* Divider */}
      <div className="px-3.5">
        <div className="h-px w-full bg-zinc-200 dark:bg-white/[0.08]" />
      </div>

      <div className="px-3.5 py-2 flex items-center justify-between">
        <div className="relative">
          <button
            ref={emojiBtnRef}
            type="button"
            onClick={() => setEmojiOpen((v) => !v)}
            className="h-9 w-9 inline-grid place-items-center rounded-xl ring-1 ring-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-900 transition
                       dark:ring-white/10 dark:bg-white/[0.03] dark:hover:bg-white/[0.06] dark:text-white"
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

        {/* Hủy / Lưu */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            className={[
              "rounded-full px-3.5 py-1.5 text-[12px] font-semibold whitespace-nowrap transition",
              "ring-1 ring-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-900",
              "dark:ring-white/10 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] dark:text-white",
            ].join(" ")}
            title="Hủy (Esc)"
          >
            Hủy
          </button>

          <button
            type="button"
            onClick={() => {
              if (!disabled) onSave();
            }}
            disabled={disabled}
            className={[
              "rounded-full px-3.5 py-1.5 text-[12px] font-semibold text-white whitespace-nowrap flex items-center gap-2 transition",
              "bg-[linear-gradient(90deg,#ff512f_0%,#ff6740_40%,#ff9966_100%)]",
              disabled ? "opacity-60 cursor-not-allowed" : "hover:brightness-110 active:brightness-95",
            ].join(" ")}
            title="Lưu (Ctrl/Cmd + Enter)"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                <span>Đang lưu…</span>
              </>
            ) : (
              <>
                <Pencil className="h-4 w-4 shrink-0" />
                <span>Lưu</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostInlineEditor;
export { useAutoGrow };
