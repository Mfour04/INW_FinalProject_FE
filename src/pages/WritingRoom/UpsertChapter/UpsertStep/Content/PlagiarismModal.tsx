import type { Matches } from "../../../../../api/AI/ai.type";

interface PlagiarismModalProps {
  open: boolean;
  onClose: () => void;
  matches: Matches[];
}

export const PlagiarismModal = ({
  open,
  onClose,
  matches,
}: PlagiarismModalProps) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 w-[600px] max-h-[80vh] overflow-y-auto shadow-lg">
        <h2 className="text-lg font-bold mb-4 text-black">Phát hiện đạo văn</h2>
        {matches.map((match, idx) => (
          <div key={idx} className="border-b border-gray-200 pb-3 mb-3">
            <p className="text-sm text-gray-500">
              Chương: {match.chapterId} — Độ giống:{" "}
              {(match.similarity * 100).toFixed(2)}%
            </p>
            {match.matches.map((chunk, cIdx) => (
              <div key={cIdx} className="bg-gray-100 p-2 rounded mt-2">
                <p className="font-medium text-black">Đoạn trong bài:</p>
                <p className="text-red-600 whitespace-pre-wrap">
                  {chunk.inputChunk}
                </p>
                <p className="font-medium mt-2 text-black">Đoạn trùng:</p>
                <p className="text-blue-600 whitespace-pre-wrap">
                  {chunk.matchedChunk}
                </p>
                <p className="text-sm mt-1 text-black">
                  Độ giống: {(chunk.similarity * 100).toFixed(2)}%
                </p>
              </div>
            ))}
          </div>
        ))}
        <button
          onClick={onClose}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Đóng
        </button>
      </div>
    </div>
  );
};
