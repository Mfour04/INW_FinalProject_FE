interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal = ({
  isOpen,
  title = "Xác nhận",
  message,
  onConfirm,
  onCancel,
}: ConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="bg-[#1e1e21] text-white rounded-lg shadow-lg p-6 w-[350px]">
        <h2 className="text-lg font-semibold mb-3">{title}</h2>
        <p className="text-sm mb-6">{message}</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-[#ff6740] hover:bg-orange-600 text-sm"
          >
            Xác nhận
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500 text-sm"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};
