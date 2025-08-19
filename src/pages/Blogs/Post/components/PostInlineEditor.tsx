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
        "rounded-2xl bg-[rgb(14,16,22)]/70 backdrop-blur",
        "border border-white/12 focus-within:border-white/25",
      ].join(" ")}
    >
      <div className="px-3.5 pt-3 pb-2">
        <textarea
          ref={taRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Chỉnh sửa nội dung…"
          className="w-full bg-transparent resize-none placeholder:text-white/35 focus:outline-none text-[15px] leading-6"
          rows={1}
          autoFocus
        />
      </div>

      {/* Divider trong hộp để viền không bị “đứt khúc” cảm giác */}
      <div className="px-3.5">
        <div className="h-px w-full bg-white/[0.08]" />
      </div>

      <div className="px-3.5 py-2 flex items-center justify-between">
        <div className="relative">
          <button
            ref={emojiBtnRef}
            type="button"
            onClick={() => setEmojiOpen((v) => !v)}
            className="h-9 w-9 inline-grid place-items-center rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition"
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
              "rounded-full px-3.5 py-1.5 text-[12px] font-semibold text-white shadow-sm shadow-black/10",
              "border border-white/10 bg-white/[0.06] hover:bg-white/[0.1]",
              "whitespace-nowrap transition",
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
              "rounded-full px-3.5 py-1.5 text-[12px] font-semibold text-white shadow-sm shadow-black/10",
              "whitespace-nowrap flex items-center gap-2 transition",
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
