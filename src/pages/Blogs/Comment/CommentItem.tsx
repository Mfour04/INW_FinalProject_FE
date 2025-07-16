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
  setConfirmDeleteCommentId: React.Dispatch<
    React.SetStateAction<string | null>
  >;
  setReportCommentId: React.Dispatch<React.SetStateAction<string | null>>;
  onReply: (commentId: string, username: string) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({
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
  setConfirmDeleteCommentId,
  setReportCommentId,
  onReply,
}) => {
  const user = users[comment.user_id] || {
    name: "Người dùng ẩn danh",
    username: "",
    avatar: "/images/default-avatar.png",
  };

  const menuRef = useRef<HTMLDivElement>(null); // Ref for the menu element

  // Close menu when clicking outside
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
              <button className="flex items-center gap-1 hover:text-[#ff6740]">
                <FavoriteBorderOutlinedIcon className="w-4 h-4" />
                <span>{comment.like_count}</span>
              </button>
              {comment.reply_count > 0 && (
                <button
                  onClick={() => onToggleReply(comment.id)}
                  className="hover:text-[#ff6740] font-medium whitespace-nowrap"
                >
                  {isOpenReply
                    ? "Ẩn trả lời"
                    : `Xem ${comment.reply_count} trả lời`}
                </button>
              )}
              <button
                onClick={() => onReply(comment.id, user.username || user.name)}
                className="hover:text-[#ff6740] font-medium whitespace-nowrap"
              >
                Trả lời
              </button>
              <div className="relative">
                <button
                  onClick={() =>
                    setMenuOpenCommentId(
                      menuOpenCommentId === comment.id ? null : comment.id
                    )
                  }
                  className="text-[#aaa] hover:text-white px-2"
                >
                  <MoreHorizOutlinedIcon fontSize="small" />
                </button>
                {menuOpenCommentId === comment.id && (
                  <div
                    ref={menuRef}
                    className="absolute right-0 mt-1 bg-[#2b2b2c] text-white rounded-md shadow-md overflow-hidden w-[120px] text-sm z-20"
                  >
                    <button
                      onClick={() => {
                        setEditingCommentId(comment.id);
                        setEditedContent(comment.content);
                        setMenuOpenCommentId(null);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#3a3a3a]"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => {
                        setConfirmDeleteCommentId(comment.id);
                        setMenuOpenCommentId(null);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#3a3a3a]"
                    >
                      Xoá
                    </button>
                    <button
                      onClick={() => {
                        setReportCommentId(comment.id);
                        setMenuOpenCommentId(null);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#3a3a3a]"
                    >
                      Báo cáo
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          {editingCommentId === comment.id ? (
            <div className="mt-2">
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full bg-[#1e1e21] text-white text-sm sm:text-base p-2 rounded resize-none"
                rows={2}
              />
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => {
                    console.log("Saving comment:", editedContent);
                    setEditingCommentId(null);
                  }}
                  className="bg-[#ff6740] text-white px-3 py-1 rounded"
                >
                  Lưu
                </button>
                <button
                  onClick={() => setEditingCommentId(null)}
                  className="bg-gray-600 text-white px-3 py-1 rounded"
                >
                  Hủy
                </button>
              </div>
            </div>
          ) : (
            <p className="text-[#ccc] mt-1 text-sm sm:text-base break-words">
              {comment.content}
            </p>
          )}
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
                setConfirmDeleteCommentId={setConfirmDeleteCommentId}
                setReportCommentId={setReportCommentId}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CommentItem;
