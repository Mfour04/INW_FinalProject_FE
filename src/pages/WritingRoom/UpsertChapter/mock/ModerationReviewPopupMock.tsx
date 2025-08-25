// src/pages/ModerationReviewPopupMock.tsx
import React, { useState } from "react";
import type { ModerationAIResponse } from "../../../../api/AI/ai.type";
import ModerationReviewModal from "./ModerationReviewModal";

// dùng UI minimal mới
import PlagiarismModalMock from "./PlagiarismModalMinimal";
import type { MatchItem } from "./plagiarism.mock";

// import mocks
import {
  mockModerationFlagged,
  mockModerationSafe,
} from "./moderation.mock";
import { mockMatches, generateMockMatches } from "./plagiarism.mock";

export default function ModerationReviewPopupMock() {
  const [openModeration, setOpenModeration] = useState(false);
  const [data, setData] = useState<ModerationAIResponse | null>(null);

  const [openPlagiarism, setOpenPlagiarism] = useState(false);
  const [plagData, setPlagData] = useState<MatchItem[]>(mockMatches);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0f16] text-white p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Popup Mock</h1>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => {
            setData(mockModerationFlagged);
            setOpenModeration(true);
          }}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:brightness-110"
        >
          Mở Moderation (Flagged)
        </button>

        <button
          onClick={() => {
            setData(mockModerationSafe);
            setOpenModeration(true);
          }}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:brightness-110"
        >
          Mở Moderation (Safe)
        </button>

        <button
          onClick={() => {
            setPlagData(mockMatches);
            setOpenPlagiarism(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:brightness-110"
        >
          Mở Plagiarism (Default 10 bản ghi)
        </button>

        <button
          onClick={() => {
            setPlagData(generateMockMatches(25));
            setOpenPlagiarism(true);
          }}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:brightness-110"
        >
          Mở Plagiarism (Sinh 25 bản ghi)
        </button>
      </div>

      {/* Moderation popup */}
      <ModerationReviewModal
        open={openModeration}
        onClose={() => setOpenModeration(false)}
        onContinue={() => {
          alert("Tiếp tục");
          setOpenModeration(false);
        }}
        data={data}
      />

      {/* Plagiarism popup (mock) */}
      <PlagiarismModalMock
        open={openPlagiarism}
        onClose={() => setOpenPlagiarism(false)}
        matches={plagData}
        onGoNovel={(slug) => alert(`Đi tới tiểu thuyết: ${slug}`)}
        onGoChapter={(slug, cid) => alert(`Đi tới chương: ${slug}/${cid}`)}
      />
    </div>
  );
}
