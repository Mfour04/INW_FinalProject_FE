import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 w-[700px] max-h-[80vh] overflow-y-auto shadow-lg">
        <h2 className="text-lg font-bold mb-4 text-black">Phát hiện đạo văn</h2>

        {matches.length === 0 && (
          <p className="text-gray-600 text-sm">
            Không phát hiện nội dung trùng lặp.
          </p>
        )}

        {matches.map((match, idx) => (
          <div key={idx} className="border-b border-gray-200 pb-4 mb-4 text-sm">
            <div className="mb-2">
              <p className="text-black font-semibold ">
                Tiểu thuyết:{" "}
                <span
                  onClick={() => navigate(`/novels/${match.novelSlug}`)}
                  className="text-blue-600 cursor-pointer"
                >
                  {match.novelTitle}{" "}
                </span>
                ({match.novelSlug})
              </p>
              <p className="text-black">
                Chương:{" "}
                <span
                  onClick={() =>
                    navigate(`/novels/${match.novelSlug}/${match.chapterId}`)
                  }
                  className="font-medium underline cursor-pointer"
                >
                  {match.chapterTitle}
                </span>
              </p>
              <p className="text-gray-600">
                Độ giống tổng: {(match.similarity * 100).toFixed(2)}%
              </p>
            </div>

            {match.matches.map((chunk, cIdx) => (
              <div
                key={cIdx}
                className="bg-gray-50 border border-gray-200 p-3 rounded mb-3"
              >
                <p className="font-medium text-black">Đoạn trong bài:</p>
                <p className="text-red-600 whitespace-pre-wrap">
                  {chunk.inputChunk}
                </p>

                <p className="font-medium mt-2 text-black">Đoạn trùng:</p>
                <p className="text-blue-600 whitespace-pre-wrap">
                  {chunk.matchedChunk}
                </p>

                <p className="text-gray-700 mt-1">
                  Độ giống: {(chunk.similarity * 100).toFixed(2)}%
                </p>
              </div>
            ))}
          </div>
        ))}

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
