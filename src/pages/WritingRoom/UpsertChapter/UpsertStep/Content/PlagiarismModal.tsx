import { useNavigate } from "react-router-dom";
import type { Matches } from "../../../../../api/AI/ai.type";

interface PlagiarismModalProps {
  open: boolean;
  onClose: () => void;
  matches: Matches[];
}

export const PlagiarismModal = ({ open, onClose, matches }: PlagiarismModalProps) => {
  if (!open) return null;
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-black/40 dark:bg-black/50 flex items-center justify-center z-50">
      <div
        className={[
          "rounded-lg p-4 w-[700px] max-h-[80vh] overflow-y-auto shadow-lg",
          // light
          "bg-white text-zinc-900",
          // dark
          "dark:bg-[#0e1117] dark:text-white",
        ].join(" ")}
      >
        <h2 className="text-lg font-bold mb-4">Phát hiện đạo văn</h2>

        {matches.length === 0 && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Không phát hiện nội dung trùng lặp.
          </p>
        )}

        {matches.map((match, idx) => (
          <div
            key={idx}
            className="border-b border-zinc-200 dark:border-white/10 pb-4 mb-4 text-sm"
          >
            <div className="mb-2">
              <p className="font-semibold">
                Tiểu thuyết:{" "}
                <span
                  onClick={() => navigate(`/novels/${match.novelSlug}`)}
                  className="text-blue-600 dark:text-blue-400 cursor-pointer"
                >
                  {match.novelTitle}
                </span>{" "}
                ({match.novelSlug})
              </p>
              <p>
                Chương:{" "}
                <span
                  onClick={() => navigate(`/novels/${match.novelSlug}/${match.chapterId}`)}
                  className="font-medium underline cursor-pointer"
                >
                  {match.chapterTitle}
                </span>
              </p>
              <p className="text-zinc-600 dark:text-zinc-400">
                Độ giống tổng: {(match.similarity * 100).toFixed(2)}%
              </p>
            </div>

            {match.matches.map((chunk, cIdx) => (
              <div
                key={cIdx}
                className="rounded border p-3 mb-3
                           bg-zinc-50 border-zinc-200
                           dark:bg-white/[0.04] dark:border-white/10"
              >
                <p className="font-medium">Đoạn trong bài:</p>
                <p className="text-red-600 whitespace-pre-wrap">{chunk.inputChunk}</p>

                <p className="font-medium mt-2">Đoạn trùng:</p>
                <p className="text-blue-600 dark:text-blue-400 whitespace-pre-wrap">
                  {chunk.matchedChunk}
                </p>

                <p className="mt-1 text-zinc-700 dark:text-zinc-400">
                  Độ giống: {(chunk.similarity * 100).toFixed(2)}%
                </p>
              </div>
            ))}
          </div>
        ))}

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="mt-2 rounded px-4 py-2 font-medium transition
                       bg-blue-500 text-white hover:bg-blue-600
                       dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
