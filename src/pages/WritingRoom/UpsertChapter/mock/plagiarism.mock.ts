import type { Matches } from "../../../../api/AI/ai.type";

// src/mocks/plagiarism.mock.ts
export type MatchChunk = {
  inputChunk: string;
  matchedChunk: string;
  similarity: number;
};
export type MatchItem = {
  novelSlug: string;
  novelTitle: string;
  chapterId: string;
  chapterTitle: string;
  similarity: number; // 0..1
  matches: MatchChunk[];
};

const lorem = (n: number) =>
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ".repeat(n).trim();

const makeMatch = (sim: number): Matches => ({
  novelSlug: `tieu-thuyet-${Math.random().toString(36).slice(2, 6)}`,
  novelTitle: `Tiểu thuyết ${Math.random()
    .toString(36)
    .slice(2, 4)
    .toUpperCase()}`,
  chapterId: `chuong-${Math.floor(Math.random() * 50) + 1}`,
  chapterTitle: `Chương ${Math.floor(Math.random() * 50) + 1}: ${
    ["Khởi đầu", "Cao trào", "Bí ẩn", "Kết thúc"][Math.floor(Math.random() * 4)]
  }`,
  similarity: sim,
  matches: Array.from({ length: Math.floor(Math.random() * 6) + 3 }).map(
    () => ({
      inputChunk: lorem(2 + Math.floor(Math.random() * 3)),
      matchedChunk: lorem(2 + Math.floor(Math.random() * 3)),
      similarity: Math.min(1, Math.max(0, Math.random() * 0.5 + sim * 0.5)), // quanh tổng
    })
  ),
  novelId: "ancd",
});

export const mockMatches: Matches[] = [
  makeMatch(0.91),
  makeMatch(0.86),
  makeMatch(0.81),
  makeMatch(0.73),
  makeMatch(0.67),
  makeMatch(0.65),
  makeMatch(0.58),
  makeMatch(0.52),
  makeMatch(0.44),
  makeMatch(0.39),
];

// nếu muốn tự sinh số lượng tuỳ ý:
export const generateMockMatches = (n = 10): Matches[] =>
  Array.from({ length: n }).map(() =>
    makeMatch(Number((0.35 + Math.random() * 0.6).toFixed(2)))
  );
