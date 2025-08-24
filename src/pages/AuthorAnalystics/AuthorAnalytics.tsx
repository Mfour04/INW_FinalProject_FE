import React from "react";
import { AuthorRevenue } from "./AuthorRevenue/AuthorRevenue";
import { AuthorViews } from "./AuthorViews/AuthorViews";

export type Mode = "revenue" | "views";

export type Purchase = {
  id: string;
  ts: string;
  buyerName: string;
  buyerId: string;
  novelId: string;
  novelTitle: string;
  chapterId?: string;
  chapterTitle?: string;
  priceCoins: number;
  type: "BuyChapter" | "BuyNovel";
  orderId: string;
};

export type SeriesPoint = { ts: string; coins: number; orders: number };

export default function AuthorAnalytics() {
  const [mode, setMode] = React.useState<Mode>("revenue");

  return (
    <div className="max-w-[95rem] mx-auto w-full px-4">
      {mode === "revenue" ? (
        <AuthorRevenue mode={mode} onChangeMode={setMode} />
      ) : (
        <AuthorViews mode={mode} onChangeMode={setMode} />
      )}
    </div>
  );
}
