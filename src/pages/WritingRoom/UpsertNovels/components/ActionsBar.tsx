import { Loader2 } from "lucide-react";

type ActionsBarProps = {
  saving?: boolean;
  publishing?: boolean;
  completing?: boolean;
  isUpdate: boolean;
  isPublic: boolean;
  isCompleted: boolean;
  onCancel: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
  onCompleted: () => void;
};

export const ActionsBar = ({
  saving = false,
  publishing = false,
  completing = false,
  onCancel,
  onSaveDraft,
  onPublish,
  onCompleted,
  isUpdate,
  isPublic,
  isCompleted,
}: ActionsBarProps) => {
  return (
    <div className="rounded-lg bg-white/80 dark:bg-[#0e1117]/95 backdrop-blur-sm p-4">
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onCancel}
          className="px-3 py-2 rounded-md text-[13px] font-bold
                     bg-gradient-to-r from-zinc-200 to-zinc-300 text-zinc-800 
                     shadow-sm hover:brightness-105 active:scale-[0.98] transition"
        >
          Hủy
        </button>

        <button
          onClick={onSaveDraft}
          disabled={saving}
          className="px-3 py-2 rounded-md text-[13px] font-bold text-white 
                     bg-gradient-to-r from-orange-400 to-orange-500 
                     shadow-sm hover:brightness-105 active:scale-[0.98] transition
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
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

        {isUpdate && (
          <>
            <button
              onClick={onPublish}
              disabled={publishing}
              className="px-3 py-2 rounded-md text-[13px] font-bold text-white 
                         bg-gradient-to-r from-sky-400 to-blue-500 
                         shadow-sm hover:brightness-105 flex items-center justify-center gap-1.5
                         active:scale-[0.98] transition
                         disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {publishing ? (
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

            <button
              onClick={onCompleted}
              disabled={completing}
              className="px-3 py-2 rounded-md text-[13px] font-bold text-white 
                         bg-gradient-to-r from-emerald-400 to-teal-500 
                         shadow-sm hover:brightness-105 flex items-center justify-center gap-1.5
                         active:scale-[0.98] transition
                         disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {completing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang xử lý…
                </>
              ) : isCompleted ? (
                "Hoàn thành"
              ) : (
                "Tiếp tục"
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
};
