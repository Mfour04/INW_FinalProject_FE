import { motion } from "framer-motion";
import { type Tabs } from "../types";

interface BlogHeaderProps {
  tab: Tabs;
  handleTabChange: (newTab: Tabs) => void;
}

const BlogHeader = ({ tab, handleTabChange }: BlogHeaderProps) => (
  <div className="rounded-[12px] p-3 mb-5 ring-1 bg-white ring-zinc-200 shadow-sm dark:bg-[#1e1e21] dark:ring-white/10">
    <div className="flex justify-between">
      {(["all", "following"] as Tabs[]).map((t) => (
        <div
          key={t}
          onClick={() => handleTabChange(t)}
          className={[
            "relative w-1/2 text-center px-4 py-3 rounded-[10px] text-base sm:text-lg font-semibold cursor-pointer transition-all duration-300",
            tab === t
              ? "text-zinc-900 dark:text-white"
              : "text-zinc-500 hover:text-zinc-800 dark:text-[#cecece] dark:hover:text-white",
          ].join(" ")}
        >
          <span
            className={[
              "transition-all duration-300",
              tab === t
                ? "text-zinc-900 dark:text-white text-[1.125rem] sm:text-xl font-bold"
                : "text-base",
            ].join(" ")}
          >
            {t === "all" ? "Tất cả" : "Đang theo dõi"}
          </span>
          {tab === t && (
            <motion.div
              layoutId="underline"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-[3px] rounded-full bg-[#ff6740]"
            />
          )}
        </div>
      ))}
    </div>
  </div>
);

export default BlogHeader;
