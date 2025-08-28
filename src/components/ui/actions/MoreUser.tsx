import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EllipsisVertical, Edit3, Trash2 } from "lucide-react";
import { ConfirmModal } from "../../ConfirmModal/ConfirmModal";

type Props = {
  commentId: string;
  onEdit: () => void;
  onDelete: (id: string) => void;
};

export const MoreUser: React.FC<Props> = ({ commentId, onEdit, onDelete }) => {
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const popRef = useRef<HTMLDivElement | null>(null);

  // Close on outside click / ESC
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (popRef.current?.contains(t) || anchorRef.current?.contains(t)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <div className="relative inline-block">
        <button
          ref={anchorRef}
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label="Mở menu quản lý bình luận"
          className={[
            "inline-flex h-8 w-8 items-center justify-center rounded-md border transition",
            "bg-white hover:bg-zinc-100 border-zinc-200 text-zinc-700",
            "dark:bg:white/10 dark:hover:bg-white/15 dark:border-white/15 dark:text-white",
            "dark:bg-white/10",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10 dark:focus-visible:ring-white/20",
          ].join(" ")}
        >
          <EllipsisVertical className="h-4 w-4" />
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              ref={popRef}
              initial={{ opacity: 0, y: -4, scale: 0.98 }}
              animate={{ opacity: 1, y: 4, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: 0.12 }}
              role="menu"
              className={[
                "absolute right-0 z-50 mt-2 min-w-[180px] overflow-hidden rounded-xl p-1 backdrop-blur-md shadow-2xl ring-1",
                "bg-white/95 text-zinc-900 ring-black/10",
                "dark:bg-[#0f1217]/95 dark:text-white dark:ring-white/10",
              ].join(" ")}
            >
              <button
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  onEdit();
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-white/10"
              >
                <Edit3 className="h-4 w-4" />
                Chỉnh sửa
              </button>

              <button
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  setConfirm(true);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-white/10"
              >
                <Trash2 className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                Xoá
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ConfirmModal
        isOpen={confirm}
        title="Xoá bình luận"
        message={"Hành động này không thể hoàn tác. Bạn có chắc muốn xoá bình luận này?"}
        confirmText="Xoá"
        cancelText="Hủy"
        tone="danger"
        onCancel={() => setConfirm(false)}
        onConfirm={() => {
          setConfirm(false);
          onDelete(commentId);
        }}
      />
    </>
  );
};
