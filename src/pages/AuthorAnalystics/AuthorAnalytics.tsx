import React from "react";
import AuthorRevenue from "./components/AuthorRevenue";
import AuthorViews from "./components/AuthorViews";

export type Mode = "revenue" | "views";

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
