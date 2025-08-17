import React, {
  Suspense,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import type { EmojiClickData, PickerProps } from "emoji-picker-react";
import { Theme } from "emoji-picker-react";

const LazyEmojiPicker = React.lazy(() => import("emoji-picker-react"));
const Picker = LazyEmojiPicker as unknown as React.ComponentType<PickerProps>;

type Props = {
  open: boolean;
  onPick: (emoji: string) => void;
  anchorRef?: React.RefObject<HTMLElement | null>;
  anchorEl?: HTMLElement | null;
  align?: "right" | "left";
  placement?: "top" | "bottom";
  onRequestClose?: () => void;
  width?: number;
  height?: number;
  closeOnPick?: boolean;
};

export const EmojiPickerBox = ({
  open,
  onPick,
  anchorRef,
  anchorEl,
  align = "right",
  placement = "top",
  onRequestClose,
  width = 320,
  height = 260,
  closeOnPick = true,
}: Props) => {
  const GAP = 10;
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const [mounted, setMounted] = useState(false);

  const frameRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<MutationObserver | null>(null);

  const getAnchorRect = (): DOMRect | null => {
    const el = anchorEl ?? anchorRef?.current ?? null;
    return el ? el.getBoundingClientRect() : null;
  };

  const computePos = () => {
    const r = getAnchorRect();
    if (!r) return setPos(null);

    const spaceAbove = r.top;
    const spaceBelow = window.innerHeight - r.bottom;
    const preferTop = placement === "top";
    const canFitTop = spaceAbove >= height + GAP;
    const canFitBottom = spaceBelow >= height + GAP;
    const useTop = preferTop
      ? canFitTop || !canFitBottom
      : !(canFitBottom || !canFitTop);

    let top = useTop ? r.top - height - GAP : r.bottom + GAP;
    let left = align === "right" ? r.right - width : r.left;

    left = Math.max(8, Math.min(left, window.innerWidth - width - 8));
    top = Math.max(8, Math.min(top, window.innerHeight - height - 8));

    setPos({ top, left });
  };

  useLayoutEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => {
      computePos();
      setMounted(true);
    });
    return () => {
      cancelAnimationFrame(id);
      setMounted(false);
    };
  }, [open, align, placement, width, height, anchorEl, anchorRef]);

  useEffect(() => {
    if (!open) return;
    const onWin = () => computePos();
    window.addEventListener("resize", onWin);
    window.addEventListener("scroll", onWin, true);
    return () => {
      window.removeEventListener("resize", onWin);
      window.removeEventListener("scroll", onWin, true);
    };
  }, [open]);

  const handleBackdropMouseDown = () => onRequestClose?.();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onRequestClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onRequestClose]);

  useEffect(() => {
    if (!open) return;

    const translations: Record<string, string> = {
      "Frequently Used": "Thường dùng",
      "Smileys & People": "Mặt cười & Con người",
      "Animals & Nature": "Động vật & Thiên nhiên",
      "Food & Drink": "Thức ăn & Đồ uống",
      "Travel & Places": "Du lịch & Địa điểm",
      Activities: "Hoạt động",
      Objects: "Đồ vật",
      Symbols: "Biểu tượng",
      Flags: "Cờ",
    };

    const translateLabels = () => {
      const root = panelRef.current;
      if (!root) return;

      root.querySelectorAll(".epr-emoji-category-label").forEach((el) => {
        const raw = (el.textContent || "").trim().replace(/\s+/g, " ");
        const vi = translations[raw];
        if (vi && el.textContent !== vi) el.textContent = vi;
      });

      root
        .querySelectorAll(".epr-header span, .epr-preview span")
        .forEach((el) => {
          const raw = (el.textContent || "").trim().replace(/\s+/g, " ");
          const vi = translations[raw];
          if (vi && el.textContent !== vi) el.textContent = vi;
        });
    };

    const t = setTimeout(translateLabels, 0);
    const obs = new MutationObserver(() => translateLabels());
    const node = panelRef.current;
    if (node)
      obs.observe(node, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    observerRef.current = obs;

    return () => {
      clearTimeout(t);
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, [open]);

  if (!open || !pos) return null;

  const backdropStyle: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    zIndex: 10000,
    background: "transparent",
  };

  const frameStyle: React.CSSProperties = {
    position: "fixed",
    top: pos.top,
    left: pos.left,
    width,
    height,
    padding: 2,
    borderRadius: 16,
    background:
      "linear-gradient(140deg, rgba(255,255,255,0.28), rgba(255,255,255,0.12))",
    boxShadow:
      "0 18px 48px rgba(0,0,0,0.55), 0 6px 18px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(255,255,255,0.10)",
    backdropFilter: "blur(3px)",
    WebkitBackdropFilter: "blur(3px)",
    pointerEvents: "auto",
    zIndex: 10001,
    transform: mounted
      ? "translateY(0) scale(1)"
      : "translateY(8px) scale(0.97)",
    opacity: mounted ? 1 : 0,
    transition: "opacity 140ms ease, transform 160ms ease",
  };

  const panelStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    borderRadius: 14,
    overflow: "hidden",
    background: "rgba(15,17,23,0.94)",
    boxShadow:
      "inset 0 1px 0 rgba(255,255,255,0.06), inset 0 0 0 1px rgba(255,255,255,0.08)",
    ["--epr-emoji-size" as any]: "16px",
    ["--epr-emoji-gap" as any]: "4px",
  };

  const inlineCss = `
    .EmojiPickerReact .epr-header { padding: 0px 0px !important; }
    .EmojiPickerReact .epr-category-nav .epr-cat-btn { border: none !important; outline: none !important; box-shadow: none !important; border-radius: 6px !important; }
    .EmojiPickerReact .epr-category-nav .epr-cat-btn .epr-cat-icon { color: #B9C0CC !important; transition: color .15s ease; }
    .EmojiPickerReact .epr-category-nav .epr-cat-btn.epr-active .epr-cat-icon { color: #FFFFFF !important; }
    .EmojiPickerReact .epr-category-nav .epr-cat-btn:focus,
    .EmojiPickerReact .epr-category-nav .epr-cat-btn:active { border: none !important; outline: none !important; box-shadow: none !important; }
    .EmojiPickerReact .epr-search { font-size: 12px !important; padding: 6px 8px !important; border-radius: 8px !important; }
    .EmojiPickerReact .epr-body { padding: 4px !important; }
    .EmojiPickerReact .epr-emoji-category-content { gap: 4px !important; }
    .EmojiPickerReact .epr-emoji { padding: 2px !important; }
    .EmojiPickerReact .epr-emoji-category-label { font-size: 12px !important; font-weight: 600 !important; position: relative !important; top: auto !important; background: transparent !important; padding: 0 6px !important; color: #D8DEE9 !important; }
    .EmojiPickerReact ::-webkit-scrollbar { width: 8px; height: 8px; }
    .EmojiPickerReact ::-webkit-scrollbar-track { background: rgba(255,255,255,0.08); border-radius: 999px; }
    .EmojiPickerReact ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.55); border-radius: 999px; border: 2px solid rgba(0,0,0,0); }
    .EmojiPickerReact ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.75); }
  `;

  const node = (
    <>
      <div style={backdropStyle} onMouseDown={handleBackdropMouseDown} />
      <div
        ref={frameRef}
        style={frameStyle}
        onMouseDown={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div ref={panelRef} style={panelStyle}>
          <style>{inlineCss}</style>
          <Suspense
            fallback={
              <div
                style={{
                  padding: 10,
                  fontSize: 12,
                  color: "rgba(255,255,255,0.75)",
                }}
              >
                Đang tải biểu tượng…
              </div>
            }
          >
            <Picker
              theme={Theme.DARK}
              width="100%"
              height={height}
              searchDisabled={false}
              skinTonesDisabled={true}
              previewConfig={{ showPreview: false }}
              lazyLoadEmojis
              searchPlaceHolder="Tìm biểu tượng…"
              onEmojiClick={(d: EmojiClickData) => {
                onPick(d.emoji);
                if (closeOnPick) onRequestClose?.();
              }}
            />
          </Suspense>
        </div>
      </div>
    </>
  );

  return createPortal(node, document.body);
};
