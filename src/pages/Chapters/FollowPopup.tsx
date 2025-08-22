import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Bell, BellOff, BookOpen, Bookmark, Check, Slash } from "lucide-react";

type FollowPopupProps = {
  open: boolean;
  anchorRef: React.RefObject<HTMLElement | null>;
  notify: boolean;
  status: number; // 0: Đang đọc, 1: Sẽ đọc, 2: Hoàn thành
  onNotifyChange?: () => void;
  onStatusChange?: (status: number) => void;
  onUnfollow?: () => void;
  onClose?: () => void;
};

type Side = "bottom" | "top";

export const FollowPopup: React.FC<FollowPopupProps> = ({
  open,
  anchorRef,
  notify,
  status,
  onNotifyChange,
  onStatusChange,
  onUnfollow,
  onClose,
}) => {
  const popupRef = useRef<HTMLDivElement | null>(null);
  const arrowRef = useRef<HTMLDivElement | null>(null);

  const [pos, setPos] = useState<{ top: number; left: number; side: Side; width: number; height: number }>({
    top: -9999,
    left: -9999,
    side: "bottom",
    width: 0,
    height: 0,
  });

  const PADDING = 8;          // khoảng cách mép viewport
  const GAP = 10;             // khoảng cách anchor <-> popup
  const BRAND = "#ff6a3c";

  const tileBase =
    "group flex flex-col items-center justify-center gap-1 rounded-lg px-2 py-2.5 ring-1 ring-transparent transition hover:bg-gray-100 active:scale-[0.98] dark:hover:bg-white/10";
  const labelBase = "text-[12px] leading-tight truncate";

  // ---- Positioning ----
  const placePopup = () => {
    const anchor = anchorRef.current;
    const popup = popupRef.current;
    if (!anchor || !popup) return;

    // Lưu ý: getBoundingClientRect theo viewport => hợp với position: fixed
    const rect = anchor.getBoundingClientRect();

    // đo thực tế popup (nếu ẩn lần đầu thì dùng offsetWidth/Height)
    const w = popup.offsetWidth || 224;
    const h = popup.offsetHeight || 176;

    const vw = window.visualViewport?.width ?? window.innerWidth;
    const vh = window.visualViewport?.height ?? window.innerHeight;

    // Ưu tiên đặt BOTTOM nếu đủ, ngược lại TOP
    const enoughBottom = rect.bottom + GAP + h + PADDING <= vh;
    const side: Side = enoughBottom ? "bottom" : "top";

    // Căn CENTER theo anchor
    let left = rect.left + rect.width / 2 - w / 2;

    // Clamp để không tràn màn hình
    left = Math.max(PADDING, Math.min(left, vw - w - PADDING));

    // top theo side
    const top = side === "bottom" ? rect.bottom + GAP : rect.top - h - GAP;

    setPos({ top, left, side, width: w, height: h });

    // Căn mũi tên (nếu có)
    requestAnimationFrame(() => {
      const arrow = arrowRef.current;
      if (arrow) {
        // Tọa độ trung tâm anchor theo viewport
        const anchorCenterX = rect.left + rect.width / 2;
        // Vị trí left của arrow bên trong popup
        const arrowHalf = arrow.offsetWidth / 2;
        let arrowLeft = anchorCenterX - left - arrowHalf;

        // Clamp arrow trong viền popup
        arrowLeft = Math.max(12, Math.min(arrowLeft, w - 12 - arrow.offsetWidth));
        arrow.style.left = `${arrowLeft}px`;
      }
    });
  };

  // Đặt vị trí khi mở + khi scroll/resize
  useLayoutEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(placePopup);

    const onResize = () => placePopup();
    const onScroll = () => placePopup();

    window.addEventListener("resize", onResize);
    // dùng capture = true để bắt cả scroll container
    window.addEventListener("scroll", onScroll, true);

    // Quan sát kích thước popup/anchor thay đổi -> re-calc
    const ro = new ResizeObserver(() => placePopup());
    if (popupRef.current) ro.observe(popupRef.current);
    if (anchorRef.current) ro.observe(anchorRef.current);

    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll, true);
      ro.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Close on outside / ESC
  useEffect(() => {
    if (!open) return;

    const onDocClick = (e: MouseEvent) => {
      const p = popupRef.current;
      const a = anchorRef.current;
      const t = e.target as Node;
      if (!p) return;
      if (p.contains(t)) return;
      if (a && a.contains(t)) return;
      onClose?.();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose?.();
    };

    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, anchorRef]);

  if (!open) return null;

  return createPortal(
    <div
  ref={popupRef}
  style={{ position: "fixed", top: pos.top, left: pos.left, willChange: "top,left" }}
  className={[
    "z-[9999] w-[224px] select-none rounded-xl border bg-white shadow-lg",
    "border-gray-200 dark:border-white/10 dark:bg-[#1a1a1a] dark:shadow-none",
    // ❌ bỏ "max-h-[60vh] overflow-auto"
    "p-2"
  ].join(" ")}
  role="menu"
  aria-orientation="vertical"
>

      {/* Arrow */}
      <div
        ref={arrowRef}
        aria-hidden
        className={[
          "pointer-events-none absolute h-2 w-2 rotate-45",
          pos.side === "bottom"
            ? "-top-1 border-l border-t border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a]"
            : "-bottom-1 border-r border-b border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a]",
        ].join(" ")}
        style={{
          // left set ở placePopup()
        }}
      />

      {/* Grid actions: 2 columns */}
      <div className="grid grid-cols-2 gap-2 dark:text-white">
        {/* Notify */}
        <button
          role="menuitem"
          onClick={onNotifyChange}
          className={tileBase}
          title={notify ? "Tắt thông báo" : "Bật thông báo"}
        >
          {notify ? (
            <Bell className="h-5 w-5" style={{ color: BRAND }} />
          ) : (
            <BellOff className="h-5 w-5 text-gray-600 dark:text-white/80" />
          )}
          <span
            className={[
              labelBase,
              notify ? "font-semibold" : "text-gray-700 dark:text-white/80",
            ].join(" ")}
            style={notify ? { color: BRAND } : {}}
          >
            {notify ? "Thông báo" : "Tắt báo"}
          </span>
        </button>

        {/* Đang đọc */}
        <button
          role="menuitemradio"
          aria-checked={status === 0}
          onClick={() => onStatusChange?.(0)}
          className={[tileBase, status === 0 ? "bg-[rgba(255,106,60,0.08)]" : ""].join(" ")}
        >
          <BookOpen className="h-5 w-5" style={{ color: status === 0 ? BRAND : undefined }} />
          <span
            className={[labelBase, status === 0 ? "font-semibold" : "text-gray-700 dark:text-white/80"].join(" ")}
            style={status === 0 ? { color: BRAND } : {}}
          >
            Đang đọc
          </span>
        </button>

        {/* Sẽ đọc */}
        <button
          role="menuitemradio"
          aria-checked={status === 1}
          onClick={() => onStatusChange?.(1)}
          className={[tileBase, status === 1 ? "bg-[rgba(255,106,60,0.08)]" : ""].join(" ")}
        >
          <Bookmark className="h-5 w-5" style={{ color: status === 1 ? BRAND : undefined }} />
          <span
            className={[labelBase, status === 1 ? "font-semibold" : "text-gray-700 dark:text-white/80"].join(" ")}
            style={status === 1 ? { color: BRAND } : {}}
          >
            Sẽ đọc
          </span>
        </button>

        {/* Hoàn thành */}
        <button
          role="menuitemradio"
          aria-checked={status === 2}
          onClick={() => onStatusChange?.(2)}
          className={[tileBase, status === 2 ? "bg-[rgba(255,106,60,0.08)]" : ""].join(" ")}
        >
          <Check className="h-5 w-5" style={{ color: status === 2 ? BRAND : undefined }} />
          <span
            className={[labelBase, status === 2 ? "font-semibold" : "text-gray-700 dark:text-white/80"].join(" ")}
            style={status === 2 ? { color: BRAND } : {}}
          >
            Hoàn thành
          </span>
        </button>

        {/* Danger: full width */}
        <button
          role="menuitem"
          onClick={onUnfollow}
          className={[
            "col-span-2",
            "flex items-center justify-center gap-2 rounded-lg px-2 py-2.5",
            "text-[13px] font-medium text-red-600 ring-1 ring-transparent",
            "hover:bg-red-50 active:scale-[0.98]",
            "dark:text-red-400 dark:hover:bg-red-500/10",
            "transition",
          ].join(" ")}
          title="Bỏ theo dõi"
        >
          <Slash className="h-4 w-4" />
          Bỏ theo dõi
        </button>
      </div>
    </div>,
    document.body
  );
};
