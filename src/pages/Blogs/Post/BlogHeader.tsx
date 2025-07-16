import { motion } from "framer-motion";
import { type Tabs } from "../types";

interface BlogHeaderProps {
  tab: Tabs;
  handleTabChange: (newTab: Tabs) => void;
}

const BlogHeader: React.FC<BlogHeaderProps> = ({ tab, handleTabChange }) => (
  <div className="bg-[#1e1e21] rounded-[10px] p-4 mb-5">
    <div className="flex justify-between">
      {(["all", "following"] as Tabs[]).map((t) => (
        <div
          key={t}
          onClick={() => handleTabChange(t)}
          className={`relative w-1/2 text-center px-4 py-3 rounded-[10px] text-lg font-semibold cursor-pointer transition-all duration-300 ${
            tab === t ? "text-white" : "text-[#cecece] hover:text-white"
          }`}
        >
          <span
            className={`transition-all duration-300 ${
              tab === t ? "text-white text-xl font-bold" : "text-base"
            }`}
          >
            {t === "all" ? "Tất cả" : "Đang theo dõi"}
          </span>
          {tab === t && (
            <motion.div
              layoutId="underline"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-[3px] bg-[#ff6740] rounded-full"
            />
          )}
        </div>
      ))}
    </div>
  </div>
);

export default BlogHeader;
