import type { ModerationAIResponse } from "../../../api/AI/ai.type";

type ModerationModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  data: ModerationAIResponse | null;
};

export const ModerationModal = ({
  open,
  onClose,
  onConfirm,
  data,
}: ModerationModalProps) => {
  if (!open || !data) return null;

  return (
    <div className="fixed inset-0 text-black z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal content */}
      <div className="relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="text-lg font-semibold">Kết quả kiểm duyệt</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-xl"
          >
            ×
          </button>
        </div>

        {data.flagged ? (
          <div className="space-y-4">
            <p className="text-sm text-red-600 font-medium">
              Nội dung có chứa vi phạm. Chi tiết:
            </p>

            {data.sensitive.map((item, i) => (
              <div
                key={i}
                className="p-3 rounded-lg border bg-gray-50 space-y-2"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{item.category}</span>
                  <span className="text-sm font-semibold text-red-600">
                    {Math.round(item.score * 100)}%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 bg-red-500 rounded-full"
                    style={{ width: `${item.score * 100}%` }}
                  />
                </div>
              </div>
            ))}

            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={onConfirm}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Vẫn đăng
              </button>
            </div>
          </div>
        ) : (
          <p className="text-green-600 font-medium">
            ✅ Nội dung an toàn, không có vi phạm.
          </p>
        )}
      </div>
    </div>
  );
};
