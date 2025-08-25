// src/mocks/moderation.mock.ts
import type { ModerationAIResponse } from "../../../../api/AI/ai.type";

export const mockModerationFlagged: ModerationAIResponse = {
  flagged: true,
  sensitive: [
    { category: "Nội dung nhạy cảm", score: 0.87 },
    { category: "Bạo lực", score: 0.63 },
    { category: "Thù ghét / Quấy rối", score: 0.42 },
    { category: "Tự hại", score: 0.31 },
    { category: "Ma túy", score: 0.22 },
  ],
};

export const mockModerationSafe: ModerationAIResponse = {
  flagged: false,
  sensitive: [
    { category: "Nội dung nhạy cảm", score: 0.04 },
    { category: "Bạo lực", score: 0.06 },
    { category: "Thù ghét / Quấy rối", score: 0.03 },
    { category: "Tự hại", score: 0.02 },
    { category: "Ma túy", score: 0.01 },
  ],
};
