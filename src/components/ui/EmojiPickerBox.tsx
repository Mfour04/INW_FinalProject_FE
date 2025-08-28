import React, {
  Suspense,
  useEffect,
  useLayoutEffect,
  useMemo,
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
  /** "system" => theo class 'dark' hoặc prefers-color-scheme */
  mode?: "light" | "dark" | "system";
};

function useColorMode(mode: Props["mode"] = "system") {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (mode === "dark") return true;
    if (mode === "light") return false;
    if (typeof window === "undefined") return true;
    const hasClass = document.documentElement.classList.contains("dark");
    if (hasClass) return true;
    return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? false;
  });

  useEffect(() => {
    if (mode !== "system") {
      setIsDark(mode === "dark");
      return;
    }
    const root = document.documentElement;
    const update = () => {
      const hasClass = root.classList.contains("dark");
      const prefers =
        window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? false;
      setIsDark(hasClass || prefers);
    };

    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onMql = () => update();

    const obs = new MutationObserver(update);
    obs.observe(root, { attributes: true, attributeFilter: ["class"] });

    mql.addEventListener?.("change", onMql);
    update();

    return () => {
      obs.disconnect();
      mql.removeEventListener?.("change", onMql);
    };
  }, [mode]);

  return isDark;
}

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
  mode = "system",
}: Props) => {
  const isDark = useColorMode(mode);

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

  // ❗ Hooks phải đặt trước mọi early-return
  const palette = useMemo(() => {
    if (isDark) {
      return {
        frameGrad:
          "linear-gradient(140deg, rgba(255,255,255,0.18), rgba(255,255,255,0.08))",
        frameShadow:
          "0 18px 48px rgba(0,0,0,0.55), 0 6px 18px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(255,255,255,0.10)",
        panelBg: "rgba(15,17,23,0.94)",
        panelInset:
          "inset 0 1px 0 rgba(255,255,255,0.06), inset 0 0 0 1px rgba(255,255,255,0.08)",
        labelColor: "#D8DEE9",
        catIcon: "#B9C0CC",
        catIconActive: "#FFFFFF",
        scrollTrack: "rgba(255,255,255,0.08)",
        scrollThumb: "rgba(255,255,255,0.55)",
        scrollThumbHover: "rgba(255,255,255,0.75)",
        textColor: "rgba(255,255,255,0.75)",
        backdrop: "transparent",
        theme: "dark" as const,
      };
    }
    // LIGHT
    return {
      frameGrad:
        "linear-gradient(140deg, rgba(0,0,0,0.06), rgba(255,255,255,0.55))",
      frameShadow:
        "0 18px 48px rgba(0,0,0,0.20), 0 8px 18px rgba(0,0,0,0.10), inset 0 0 0 1px rgba(0,0,0,0.06)",
      panelBg: "rgba(255,255,255,0.98)",
      panelInset:
        "inset 0 1px 0 rgba(255,255,255,1), inset 0 0 0 1px rgba(0,0,0,0.06)",
      labelColor: "#334155",
      catIcon: "#64748b",
      catIconActive: "#0f172a",
      scrollTrack: "rgba(0,0,0,0.06)",
      scrollThumb: "rgba(0,0,0,0.25)",
      scrollThumbHover: "rgba(0,0,0,0.45)",
      textColor: "rgba(17,24,39,0.75)",
      backdrop: "transparent",
      theme: "light" as const,
    };
  }, [isDark]);

  // Early-return SAU tất cả hooks để không đổi thứ tự hook
  if (!open || !pos) return null;

  const backdropStyle: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    zIndex: 10000,
    background: palette.backdrop,
  };

  const frameStyle: React.CSSProperties = {
    position: "fixed",
    top: pos.top,
    left: pos.left,
    width,
    height,
    padding: 2,
    borderRadius: 16,
    background: palette.frameGrad,
    boxShadow: palette.frameShadow,
    backdropFilter: "blur(3px)",
    WebkitBackdropFilter: "blur(3px)",
    pointerEvents: "auto",
    zIndex: 10001,
    transform: mounted ? "translateY(0) scale(1)" : "translateY(8px) scale(0.97)",
    opacity: mounted ? 1 : 0,
    transition: "opacity 140ms ease, transform 160ms ease",
  };

  const panelStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    borderRadius: 14,
    overflow: "hidden",
    background: palette.panelBg,
    boxShadow: palette.panelInset,
    ["--epr-emoji-size" as any]: "16px",
    ["--epr-emoji-gap" as any]: "4px",
  };

  const inlineCss = `
    .EmojiPickerReact .epr-header { padding: 0px 0px !important; }
    .EmojiPickerReact .epr-category-nav .epr-cat-btn { border: none !important; outline: none !important; box-shadow: none !important; border-radius: 6px !important; }
    .EmojiPickerReact .epr-category-nav .epr-cat-btn .epr-cat-icon { color: ${palette.catIcon} !important; transition: color .15s ease; }
    .EmojiPickerReact .epr-category-nav .epr-cat-btn.epr-active .epr-cat-icon { color: ${palette.catIconActive} !important; }
    .EmojiPickerReact .epr-category-nav .epr-cat-btn:focus,
    .EmojiPickerReact .epr-category-nav .epr-cat-btn:active { border: none !important; outline: none !important; box-shadow: none !important; }
    .EmojiPickerReact .epr-search { font-size: 12px !important; padding: 6px 8px !important; border-radius: 8px !important; }
    .EmojiPickerReact .epr-body { padding: 4px !important; }
    .EmojiPickerReact .epr-emoji-category-content { gap: 4px !important; }
    .EmojiPickerReact .epr-emoji { padding: 2px !important; }
    .EmojiPickerReact .epr-emoji-category-label { font-size: 12px !important; font-weight: 600 !important; position: relative !important; top: auto !important; background: transparent !important; padding: 0 6px !important; color: ${palette.labelColor} !important; }
    .EmojiPickerReact ::-webkit-scrollbar { width: 8px; height: 8px; }
    .EmojiPickerReact ::-webkit-scrollbar-track { background: ${palette.scrollTrack}; border-radius: 999px; }
    .EmojiPickerReact ::-webkit-scrollbar-thumb { background: ${palette.scrollThumb}; border-radius: 999px; border: 2px solid rgba(0,0,0,0); }
    .EmojiPickerReact ::-webkit-scrollbar-thumb:hover { background: ${palette.scrollThumbHover}; }
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
              <div style={{ padding: 10, fontSize: 12, color: palette.textColor }}>
                Đang tải biểu tượng…
              </div>
            }
          >
            <Picker
              theme={palette.theme === "dark" ? Theme.DARK : Theme.LIGHT}
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

export const Hairline = ({ className = "" }: { className?: string }) => (
  <div className={`relative h-px ${className}`}>
    <div className="absolute inset-0 bg-white/8" />
    <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
  </div>
);
