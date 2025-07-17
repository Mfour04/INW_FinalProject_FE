import { motion, AnimatePresence } from "framer-motion";
import { useRef, useEffect } from "react";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import { type Comment, type User } from "../types";

const users: { [key: string]: User } = {
  user_001: {
    name: "Nguyễn Văn A",
    username: "@anguyen",
    avatar: "/images/user1.png",
  },
  user_002: {
    name: "Trần Thị B",
    username: "@btran",
    avatar: "/images/user2.png",
  },
  user_003: { name: "Lê Văn C", username: "@cle", avatar: "/images/user3.png" },
  user_004: {
    name: "Phạm Thị D",
    username: "@dpham",
    avatar: "/images/user4.png",
  },
  user_005: {
    name: "Hoàng Văn E",
    username: "@ehoang",
    avatar: "/images/user5.png",
  },
};

interface CommentItemProps {
  comment: Comment;
  replies: Comment[];
  isOpenReply: boolean;
  onToggleReply: (commentId: string) => void;
  menuOpenCommentId: string | null;
  setMenuOpenCommentId: React.Dispatch<React.SetStateAction<string | null>>;
  editingCommentId: string | null;
  setEditingCommentId: React.Dispatch<React.SetStateAction<string | null>>;
  editedContent: string;
  setEditedContent: React.Dispatch<React.SetStateAction<string>>;
  setReportCommentId: React.Dispatch<React.SetStateAction<string | null>>;
  onReply: (commentId: string, username: string) => void;
  onRequestDelete: (type: "post" | "comment", id: string) => void;
}

const CommentItem = ({
  comment,
  replies,
  isOpenReply,
  onToggleReply,
  menuOpenCommentId,
  setMenuOpenCommentId,
  editingCommentId,
  setEditingCommentId,
  editedContent,
  setEditedContent,
  setReportCommentId,
  onReply,
  onRequestDelete,
}: CommentItemProps) => {
  const user = users[comment.user_id] || {
    name: "Người dùng ẩn danh",
    username: "",
    avatar: "/images/default-avatar.png",
  };
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpenCommentId(null);
      }
    };

    if (menuOpenCommentId === comment.id) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpenCommentId, comment.id, setMenuOpenCommentId]);

  return (
    <div className="mt-4 relative">
      <div className="flex items-start gap-3 sm:gap-4">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
            <div className="truncate">
              <h4 className="font-semibold text-white text-sm sm:text-base truncate">
                {user.name}
              </h4>
              {user.username && (
                <small className="text-xs text-gray-400 truncate block">
                  {user.username}
                </small>
              )}
            </div>
            <div className="flex items-center gap-3 text-sm text-[#999] mt-1 sm:mt-0">
              <button className="flex items-center gap-1 hover:text-[#ff6740] transition-colors duration-200">
                <FavoriteBorderOutlinedIcon className="w-4 h-4" />
                <span>{comment.like_count}</span>
              </button>
              {comment.reply_count > 0 && (
                <button
                  onClick={() => onToggleReply(comment.id)}
                  className="hover:text-[#ff6740] font-medium whitespace-nowrap transition-colors duration-200"
                >
                  {isOpenReply
                    ? "Ẩn trả lời"
                    : `Xem ${comment.reply_count} trả lời`}
                </button>
              )}
              <button
                onClick={() => onReply(comment.id, user.username || user.name)}
                className="hover:text-[#ff6740] font-medium whitespace-nowrap transition-colors duration-200"
              >
                Trả lời
              </button>
              <div className="relative">
                <button
                  onClick={() => {
                    setMenuOpenCommentId((prev) =>
                      prev === comment.id ? null : comment.id
                    );
                  }}
                  className="text-[#aaa] hover:text-white px-2 transition-colors duration-200"
                >
                  <MoreHorizOutlinedIcon fontSize="small" />
                </button>
                <AnimatePresence>
                  {menuOpenCommentId === comment.id && (
                    <motion.div
                      ref={menuRef}
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{
                        duration: 0.15,
                        ease: "easeOut",
                      }}
                      className="absolute right-0 mt-1 bg-[#2b2b2c] text-white rounded-md shadow-lg overflow-hidden w-[120px] text-sm z-20 border border-[#444]"
                    >
                      <motion.button
                        onClick={() => {
                          setEditingCommentId(comment.id);
                          setEditedContent(comment.content);
                          setMenuOpenCommentId(null);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-[#3a3a3a] transition-colors duration-20"
                        whileHover={{ backgroundColor: "#3a3a3a" }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Sửa
                      </motion.button>
                      <motion.button
                        onClick={() => {
                          onRequestDelete("comment", comment.id);
                          setMenuOpenCommentId(null);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-[#3a3a3a] transition-colors duration-20"
                        whileHover={{ backgroundColor: "#3a3a3a" }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Xoá
                      </motion.button>
                      <motion.button
                        onClick={() => {
                          setReportCommentId(comment.id);
                          setMenuOpenCommentId(null);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-[#3a3a3a] transition-colors duration-20"
                        whileHover={{ backgroundColor: "#3a3a3a" }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Báo cáo
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {editingCommentId === comment.id ? (
              <motion.div
                key="edit-mode"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{
                  duration: 0.25,
                  ease: "easeInOut",
                }}
                className="mt-2 overflow-hidden"
              >
                <motion.textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="w-full bg-[#1e1e21] text-white text-sm sm:text-base p-2 rounded resize-none border border-[#444] focus:border-[#ff6740] focus:outline-none transition-colors duration-200"
                  rows={2}
                  initial={{ scale: 0.98 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.15 }}
                  autoFocus
                />
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.15 }}
                  className="mt-2 flex gap-2"
                >
                  <motion.button
                    onClick={() => {
                      console.log("Saving comment:", editedContent);
                      setEditingCommentId(null);
                    }}
                    className="bg-[#ff6740] text-white px-3 py-1 rounded transition-colors duration-200 hover:bg-[#ff5722]"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Lưu
                  </motion.button>
                  <motion.button
                    onClick={() => setEditingCommentId(null)}
                    className="bg-gray-600 text-white px-3 py-1 rounded transition-colors duration-200 hover:bg-gray-500"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Hủy
                  </motion.button>
                </motion.div>
              </motion.div>
            ) : (
              <motion.p
                key="view-mode"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15 }}
                className="text-[#ccc] mt-1 text-sm sm:text-base break-words"
              >
                {comment.content}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {isOpenReply && replies.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="ml-8 sm:ml-12 border-l border-[#444] pl-4 mt-3 space-y-4"
          >
            {replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                replies={[]}
                isOpenReply={false}
                onToggleReply={onToggleReply}
                menuOpenCommentId={menuOpenCommentId}
                setMenuOpenCommentId={setMenuOpenCommentId}
                editingCommentId={editingCommentId}
                setEditingCommentId={setEditingCommentId}
                editedContent={editedContent}
                setEditedContent={setEditedContent}
                setReportCommentId={setReportCommentId}
                onReply={onReply}
                onRequestDelete={onRequestDelete}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CommentItem;
