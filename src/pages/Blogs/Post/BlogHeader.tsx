import { motion } from "framer-motion";
import { type Tabs } from "../types";

interface BlogHeaderProps {
  tab: Tabs;
  handleTabChange: (newTab: Tabs) => void;
}

const BlogHeader = ({ tab, handleTabChange }: BlogHeaderProps) => (
  <div className="mb-6 flex justify-center">
    <div className="inline-flex rounded-xl bg-white/[0.06] ring-1 ring-white/10 gap-2 px-2 py-2">
      {(["all", "following"] as Tabs[]).map((t) => {
        const active = tab === t;
        return (
          <button
            key={t}
            onClick={() => handleTabChange(t)}
            className={[
              "h-9 px-6 rounded-lg text-sm transition-all",
              active
                ? "bg-gradient-to-r from-[#ff6740] to-[#ff9966] text-white font-semibold shadow-lg"
                : "text-white/60 hover:text-white hover:bg-white/10",
            ].join(" ")}
          >
            {t === "all" ? "Dành cho bạn" : "Đang theo dõi"}
          </button>
        );
      })}
    </div>
  </div>
);

export default BlogHeader;
