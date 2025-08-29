import { Loader2 } from "lucide-react";

type ActionsBarProps = {
  busy?: boolean;
  isUpdate: boolean;
  isPublic: boolean;
  onCancel: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
};

export const ActionsBar = ({
  busy = false,
  onCancel,
  onSaveDraft,
  onPublish,
  isUpdate,
  isPublic,
}: ActionsBarProps) => {
  return (
    <div className="rounded-lg bg-white/80 dark:bg-[#0e1117]/95 backdrop-blur-sm p-4">
      <div className={`grid ${isUpdate ? "grid-cols-3" : "grid-cols-2"} gap-2`}>
        {/* Cancel button */}
        <button
          onClick={onCancel}
          disabled={busy}
          className="px-3 py-2 rounded-md text-[13px] font-semibold 
                     bg-zinc-100 text-zinc-900 ring-1 ring-zinc-300 
                     hover:bg-zinc-200 active:scale-[0.98] transition
                     dark:bg-white dark:text-[#0b0d11] dark:ring-black/10 
                     dark:hover:bg-white/95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Hủy
        </button>

        {/* Save Draft button */}
        <button
          onClick={onSaveDraft}
          disabled={busy}
          className="px-3 py-2 rounded-md text-[13px] font-semibold border 
                     border-orange-400/50 text-orange-500 bg-transparent 
                     hover:bg-orange-500/10 
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {busy ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Đang lưu…
            </span>
          ) : isUpdate ? (
            "Lưu"
          ) : (
            "Tạo truyện"
          )}
        </button>

        {/* Publish button */}
        {isUpdate && (
          <button
            onClick={onPublish}
            disabled={busy}
            className="px-3 py-2 rounded-md text-[13px] font-semibold text-white 
                       bg-gradient-to-r from-[#ff512f] via-[#ff6740] to-[#ff9966] 
                       hover:brightness-110 shadow-[0_14px_34px_-14px_rgba(255,102,64,0.65)] 
                       flex items-center justify-center gap-1.5
                       disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {busy ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang xử lý…
              </>
            ) : isPublic ? (
              "Mình tôi"
            ) : (
              "Xuất bản"
            )}
          </button>
        )}
      </div>
    </div>
  );
};
