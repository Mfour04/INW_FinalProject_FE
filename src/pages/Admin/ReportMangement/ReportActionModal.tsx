import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { X, ChevronDown, Check } from "lucide-react";
import type { UpdateActionRequest } from "../../../api/Admin/Report/report.type";

const STATUS_OPTIONS = [
  { value: 1, label: "Đã xử lý" },
  { value: 2, label: "Từ chối báo cáo" },
  { value: 3, label: "Bỏ qua" },
] as const;

const ACTION_OPTIONS = [
  { value: 0, label: "Không thực hiện" },
  { value: 1, label: "Ẩn nội dung" },
  { value: 2, label: "Xóa nội dung" },
  { value: 3, label: "Cảnh cáo tác giả" },
  { value: 4, label: "Khóa tạm thời" },
  { value: 5, label: "Cấm vĩnh viễn" },
] as const;

export interface ReportActionPopupProps {
  reportId: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reportId: string, data: UpdateActionRequest) => void;
}

const initialActionRequest: UpdateActionRequest = {
  action: 0,
  status: 0,
  moderatorNote: "",
};

function useOutsideClose<T extends HTMLElement>(open: boolean, onClose: () => void) {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const t = e.target as Node;
      if (ref.current && !ref.current.contains(t)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onClose]);
  return ref;
}

type Opt = { value: number; label: string };

function SmallSelect({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: number;
  onChange: (v: number) => void;
  options: readonly Opt[];
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const boxRef = useOutsideClose<HTMLDivElement>(open, () => setOpen(false));
  const active = options.find((o) => o.value === value);

  return (
    <div className="relative" ref={boxRef}>
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="w-full h-10 px-3.5 rounded-xl bg-white text-zinc-900 ring-1 ring-zinc-200 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-400/60 inline-flex items-center justify-between gap-2 dark:bg-zinc-900/40 dark:text-zinc-100 dark:ring-white/10 dark:hover:bg-zinc-900/55 dark:focus:ring-white/20"
        aria-expanded={open}
      >
        <span className="truncate">{active ? active.label : placeholder}</span>
        <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="absolute z-50 mt-2 w-full rounded-xl bg-white/95 text-zinc-900 ring-1 ring-zinc-200 shadow-xl backdrop-blur-sm dark:bg-[#181a1f]/95 dark:text-zinc-100 dark:ring-zinc-700/60"
          >
            <div className="max-h-64 overflow-auto scrollbar-thin py-1">
              {options.map((o) => {
                const selected = o.value === value;
                return (
                  <button
                    key={o.value}
                    onClick={() => {
                      onChange(o.value);
                      setOpen(false);
                    }}
                    type="button"
                    className={`w-full px-3 py-2.5 text-left flex items-center justify-between gap-3 transition ${
                      selected
                        ? ""
                        : "hover:bg-zinc-100/60 dark:hover:bg-[#1f232a]"
                    }`}
                  >
                    <span className="text-sm font-medium truncate">{o.label}</span>
                    {selected && <Check className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export const ReportActionModal = ({
  reportId,
  isOpen,
  onClose,
  onSubmit,
}: ReportActionPopupProps) => {
  const [actionRequest, setActionRequest] = useState<UpdateActionRequest>(initialActionRequest);

  const handleSubmit = () => {
    onSubmit(reportId, actionRequest);
    setActionRequest(initialActionRequest);
    onClose();
  };

  const handleCloseClick = () => {
    setActionRequest(initialActionRequest);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleCloseClick} />

          <motion.div
            className="relative w-full max-w-xl mx-4 overflow-hidden rounded-2xl bg-white/95 text-zinc-900 ring-1 ring-zinc-200 shadow-2xl backdrop-blur dark:bg-[#111318]/95 dark:text-zinc-100 dark:ring-zinc-700/60"
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 12, opacity: 0 }}
          >
            <div className="flex items-center justify-between px-5 pt-5">
              <h2 className="text-base md:text-lg font-semibold">Xử lý báo cáo</h2>
              <button
                onClick={handleCloseClick}
                className="h-8 w-8 grid place-items-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/60 dark:text-zinc-400 dark:hover:bg-[#1b1e24] dark:hover:text-zinc-200 dark:focus-visible:ring-zinc-500"
                aria-label="Đóng"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <div className="px-5 pb-5">
              <div className="my-4 h-px bg-zinc-200/80 dark:bg-zinc-700/60" />
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-200">Trạng thái</label>
                    <SmallSelect
                      value={actionRequest.status}
                      onChange={(v) =>
                        setActionRequest((prev) => ({
                          ...prev,
                          status: v,
                        }))
                      }
                      options={STATUS_OPTIONS}
                      placeholder="Chọn trạng thái"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-200">Hành động</label>
                    <SmallSelect
                      value={actionRequest.action}
                      onChange={(v) =>
                        setActionRequest((prev) => ({
                          ...prev,
                          action: v,
                        }))
                      }
                      options={ACTION_OPTIONS}
                      placeholder="Chọn hành động"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-200">Ghi chú</label>
                  <textarea
                    rows={4}
                    className="w-full rounded-xl px-3.5 py-2.5 bg-white text-zinc-900 placeholder-zinc-400 ring-1 ring-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-400/60 dark:bg-[#181a1f] dark:text-zinc-100 dark:placeholder-zinc-500 dark:ring-zinc-700/60 dark:focus:ring-zinc-500"
                    value={actionRequest.moderatorNote}
                    onChange={(e) =>
                      setActionRequest((prev) => ({
                        ...prev,
                        moderatorNote: e.target.value,
                      }))
                    }
                    placeholder="Ghi chú..."
                  />
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 px-5 pb-5">
              <div className="mb-3 h-px bg-zinc-200/80 dark:bg-zinc-700/60" />
              <div className="flex justify-end gap-3">
                <button
                  className="h-9 px-3 rounded-xl text-sm font-medium bg-zinc-100 text-zinc-800 ring-1 ring-zinc-200 hover:bg-zinc-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/60 dark:bg-[#181a1f] dark:text-zinc-200 dark:ring-zinc-700/60 dark:hover:bg-[#1b1e24] dark:focus-visible:ring-zinc-500"
                  onClick={handleCloseClick}
                >
                  Hủy
                </button>
                <button
                  className="h-9 px-3 rounded-xl text-sm font-semibold bg-zinc-900 text-white hover:bg-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
                  onClick={handleSubmit}
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
