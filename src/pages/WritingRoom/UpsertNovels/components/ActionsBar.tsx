import Button from "../../../../components/ButtonComponent";

type ActionsBarProps = {
  busy?: boolean;
  onCancel: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
};

export const ActionsBar = ({
  busy = false,
  onCancel,
  onSaveDraft,
  onPublish,
}: ActionsBarProps) => {
  return (
    <div className="rounded-lg bg-[#0e1117]/95 ring-1 ring-white/8 backdrop-blur-sm p-4 shadow-[0_20px_48px_-28px_rgba(0,0,0,0.55)]">
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={onCancel}
          className="px-3 py-2 rounded-md text-[13px] font-semibold bg-white text-[#0b0d11] ring-1 ring-black/10 hover:bg-white/95 active:scale-[0.98] transition"
        >
          Hủy
        </button>

        <Button
          isLoading={busy}
          onClick={onSaveDraft}
          className="px-3 py-2 rounded-md text-[13px] font-semibold border border-[#ff7a59]/50 text-[#ff7a59] bg-transparent hover:bg-[#ff7a59]/10"
        >
          Tạo truyện
        </Button>

        <Button
          isLoading={busy}
          onClick={onPublish}
          className="px-3 py-2 rounded-md text-[13px] font-semibold text-white bg-[linear-gradient(90deg,#ff512f,0%,#ff6740,55%,#ff9966)] hover:brightness-110 shadow-[0_14px_34px_-14px_rgba(255,102,64,0.65)] flex items-center justify-center gap-1.5"
        >
          Xuất bản
        </Button>
      </div>
    </div>
  );
};
