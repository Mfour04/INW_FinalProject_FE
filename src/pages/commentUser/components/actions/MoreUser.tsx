import React, { useEffect, useRef, useState } from "react";
import { MoreHorizontal, Edit3, Trash2, X } from "lucide-react";

interface MoreUserProps {
  commentId: string;
  onEdit: () => void;
  onDelete: (id: string) => void;
}

export const MoreUser = ({ commentId, onEdit, onDelete }: MoreUserProps) => {
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const popRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!btnRef.current || !popRef.current) return;
      if (!btnRef.current.contains(target) && !popRef.current.contains(target)) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  useEffect(() => {
    if (!openDialog) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenDialog(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openDialog]);

  return (
    <div className="relative flex-shrink-0">
      <button
        ref={btnRef}
        onClick={(e) => setOpen((v) => !v)}
        aria-label="Mở menu quản lý bình luận"
        aria-expanded={open}
        className={[
          "inline-flex items-center justify-center h-6 w-6 rounded-[5px] transition-all",
          // light
          "border border-gray-300 bg-white/80 hover:bg-white shadow-sm",
          // dark
          "dark:border-white/20 dark:bg-white/12 dark:hover:bg-white/18",
          "dark:focus-visible:ring-2 dark:focus-visible:ring-white/40",
          open ? "dark:bg-white/18 dark:border-white/30" : "",
        ].join(" ")}
      >
        <MoreHorizontal className="h-3.5 w-3.5 opacity-90" />
      </button>

      {open && (
        <div
          ref={popRef}
          role="menu"
          className={[
            "absolute right-0 mt-2 min-w-[200px] rounded-xl px-1.5 py-0.5 z-50",
            // light
            "bg-white/95 text-gray-900 border border-gray-200 shadow-[0_8px_24px_rgba(0,0,0,0.12)] backdrop-blur",
            // dark
            "dark:bg-[rgba(18,20,26,0.96)] dark:text-white dark:border dark:border-white/12 dark:shadow-[0_8px_24px_rgba(0,0,0,0.55)]",
          ].join(" ")}
        >
          <div className="grid grid-cols-2 gap-1">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onEdit();
              }}
              className="inline-flex items-center justify-center gap-1.5 h-7 rounded-lg px-1.5 text-[12px] transition hover:bg-gray-100 dark:hover:bg-white/10"
            >
              <Edit3 className="h-[14px] w-[14px]" />
              Chỉnh sửa
            </button>

            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setOpenDialog(true);
              }}
              className="inline-flex items-center justify-center gap-1.5 h-7 rounded-lg px-1.5 text-[12px] transition hover:bg-gray-100 dark:hover:bg-white/10"
            >
              <Trash2 className="h-[14px] w-[14px]" />
              Xoá
            </button>
          </div>
        </div>
      )}

      {/* Dialog xác nhận xoá */}
      {openDialog && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[9999] flex items-center justify-center"
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
            onClick={() => setOpenDialog(false)}
          />
          <div
            className={[
              "relative z-10 w-[92vw] max-w-[440px] rounded-2xl p-4",
              // light
              "bg-white/95 text-gray-900 border border-gray-200 shadow-[0_12px_36px_rgba(0,0,0,0.18)] backdrop-blur",
              // dark
              "dark:bg-[rgba(18,20,26,0.97)] dark:text-white dark:border dark:border-white/10 dark:shadow-[0_12px_36px_rgba(0,0,0,0.55)]",
            ].join(" ")}
          >
            <div className="flex items-start justify-between">
              <h2 className="text-[18px] font-bold">Xác nhận xoá</h2>
              <button
                onClick={() => setOpenDialog(false)}
                className="h-8 w-8 inline-grid place-items-center rounded-md border border-gray-200 bg-gray-100 hover:bg-gray-200 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 transition"
                aria-label="Đóng"
                title="Đóng"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-2 text-[14px] text-gray-700 dark:text-white/90">
              Hành động này không thể hoàn tác. Bạn có chắc muốn xoá bình luận này?
            </div>

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                onClick={() => setOpenDialog(false)}
                className="px-3 py-2 rounded-full text-[14px] border border-gray-300 bg-white hover:bg-gray-100 transition dark:border-white/12 dark:bg-white/6 dark:hover:bg-white/10"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  setOpenDialog(false);
                  onDelete(commentId);
                }}
                className="px-3 py-2 rounded-full text-[14px] border border-red-300 bg-red-500/15 text-red-600 hover:bg-red-500/25 transition dark:border-[rgba(255,120,120,0.45)] dark:text-white dark:bg-[rgba(220,70,70,0.20)] dark:hover:bg-[rgba(220,70,70,0.30)]"
              >
                Xoá
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
