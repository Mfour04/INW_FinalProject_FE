import { motion, AnimatePresence } from "framer-motion";
import { useRef, useEffect } from "react";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import AddCommentOutlinedIcon from "@mui/icons-material/AddCommentOutlined";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import CommentSection from "../Comment/CommentSection";
import { type Post } from "../types";

interface PostItemProps {
  post: Post;
  menuOpenPostId: string | null;
  setMenuOpenPostId: React.Dispatch<React.SetStateAction<string | null>>;
  editingPostId: string | null;
  setEditingPostId: React.Dispatch<React.SetStateAction<string | null>>;
  setReportPostId: React.Dispatch<React.SetStateAction<string | null>>;
  openComments: Set<string>;
  setOpenComments: React.Dispatch<React.SetStateAction<Set<string>>>;
  visibleRootComments: { [postId: string]: number };
  setVisibleRootComments: React.Dispatch<
    React.SetStateAction<{ [postId: string]: number }>
  >;
  isMobile: boolean;
  openReplyId: string | null;
  setOpenReplyId: React.Dispatch<React.SetStateAction<string | null>>;
  menuOpenCommentId: string | null;
  setMenuOpenCommentId: React.Dispatch<React.SetStateAction<string | null>>;
  editingCommentId: string | null;
  setEditingCommentId: React.Dispatch<React.SetStateAction<string | null>>;
  editedContent: string;
  setEditedContent: React.Dispatch<React.SetStateAction<string>>;
  setReportCommentId: React.Dispatch<React.SetStateAction<string | null>>;
  replyingTo: { commentId: string; username: string } | null;
  setReplyingTo: React.Dispatch<
    React.SetStateAction<{ commentId: string; username: string } | null>
  >;
  commentInput: string;
  setCommentInput: React.Dispatch<React.SetStateAction<string>>;
  onRequestDelete: (type: "post" | "comment", id: string) => void;
}

const PostItem = ({
  post,
  menuOpenPostId,
  setMenuOpenPostId,
  editingPostId,
  setEditingPostId,
  setReportPostId,
  openComments,
  setOpenComments,
  visibleRootComments,
  setVisibleRootComments,
  isMobile,
  openReplyId,
  setOpenReplyId,
  menuOpenCommentId,
  setMenuOpenCommentId,
  editingCommentId,
  setEditingCommentId,
  editedContent,
  setEditedContent,
  setReportCommentId,
  replyingTo,
  setReplyingTo,
  commentInput,
  setCommentInput,
  onRequestDelete,
}: PostItemProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpenPostId(null);
      }
    };

    if (menuOpenPostId === post.id) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpenPostId, post.id, setMenuOpenPostId]);

  // Debug log
  useEffect(() => {
    console.log("PostItem props:", {
      postId: post.id,
      openComments: Array.from(openComments),
      isMobile,
    });
  }, [post.id, openComments, isMobile]);

  const handleToggleComments = () => {
    setOpenComments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(post.id)) {
        newSet.delete(post.id);
        console.log(`Closed comments for post ${post.id}`);
      } else {
        newSet.add(post.id);
        console.log(`Opened comments for post ${post.id}`);
        setVisibleRootComments((prevVisible) => ({
          ...prevVisible,
          [post.id]: 3,
        }));
      }
      console.log("openComments:", Array.from(newSet));
      return newSet;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-[#1e1e21] rounded-[10px] p-5"
    >
      <div className="flex items-start justify-between sm:items-center mb-4 gap-3">
        <div className="flex items-start sm:items-center gap-4">
          <img
            src={post.user.avatar}
            alt={post.user.name}
            className="w-[50px] h-[50px] rounded-full object-cover"
          />
          <div className="flex flex-col">
            <h3 className="text-base sm:text-lg font-bold text-white">
              {post.user.name}
            </h3>
            <div className="flex items-center gap-2 text-[#cecece] text-sm sm:text-base">
              <span>{post.user.username}</span>
              <div className="w-[6px] h-[6px] bg-[#cecece] rounded-full"></div>
              <span>{post.timestamp}</span>
            </div>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={() => {
              setMenuOpenPostId((prev) => (prev === post.id ? null : post.id));
            }}
            className="p-1 hover:bg-gray-700 rounded-full transition-colors duration-200"
          >
            <MoreHorizOutlinedIcon />
          </button>
          <AnimatePresence>
            {menuOpenPostId === post.id && (
              <motion.div
                ref={menuRef}
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{
                  duration: 0.15,
                  ease: "easeOut",
                }}
                className="absolute right-0 mt-2 bg-[#2b2b2c] text-white rounded-md shadow-lg overflow-hidden w-[120px] text-sm z-10 border border-[#444]"
              >
                <motion.button
                  onClick={() => {
                    setEditingPostId(post.id);
                    setMenuOpenPostId(null);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-[#3a3a3a] transition-colors duration-20"
                  whileHover={{ backgroundColor: "#3a3a3a" }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cập nhật
                </motion.button>
                <motion.button
                  onClick={() => {
                    onRequestDelete("post", post.id);
                    setMenuOpenPostId(null);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-[#3a3a3a] transition-colors duration-20"
                  whileHover={{ backgroundColor: "#3a3a3a" }}
                  whileTap={{ scale: 0.98 }}
                >
                  Xóa bài viết
                </motion.button>
                <motion.button
                  onClick={() => {
                    setReportPostId(post.id);
                    setMenuOpenPostId(null);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-[#3a3a3a] transition-colors duration-20"
                  whileHover={{ backgroundColor: "#3a3a3a" }}
                  whileTap={{ scale: 0.98 }}
                >
                  Báo cáo bài viết
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {editingPostId === post.id ? (
          <motion.div
            key="edit-mode"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
            className="mb-4 overflow-hidden"
          >
            <motion.textarea
              defaultValue={post.content}
              className="w-full bg-transparent text-base sm:text-lg text-white placeholder-[#656565] resize-none border border-[#444] focus:border-[#ff6740] outline-none min-h-[80px] sm:min-h-[100px] md:min-h-[120px] font-ibm-plex mb-2 p-2 rounded transition-colors duration-200"
              initial={{ scale: 0.98 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.15 }}
              autoFocus
            />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.15 }}
              className="flex flex-wrap gap-2 mb-2"
            >
              {/* Placeholder for tags */}
            </motion.div>
            <motion.input
              type="file"
              multiple
              className="text-white text-sm mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.15 }}
            />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.15 }}
              className="flex gap-2"
            >
              <motion.button
                onClick={() => setEditingPostId(null)}
                className="bg-gray-600 text-white px-3 py-1 rounded-lg transition-colors duration-200 hover:bg-gray-500"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Hủy
              </motion.button>
              <motion.button
                className="bg-[#ff6740] text-white px-3 py-1 rounded-lg transition-colors duration-200 hover:bg-[#ff5722]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Lưu
              </motion.button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="view-mode"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
            className="mb-4"
          >
            <p className="text-base sm:text-lg text-white leading-relaxed">
              {post.content}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="border-t border-[#656565] pt-4">
        <div className="flex items-center gap-6">
          <motion.button
            className="flex items-center gap-1 group hover:text-[#ff6740] transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FavoriteBorderOutlinedIcon className="w-5 h-5 text-white group-hover:text-[#ff6740] transition-colors duration-200" />
            <span className="text-sm sm:text-base font-medium text-white group-hover:text-[#ff6740] transition-colors duration-200">
              Yêu thích
            </span>
          </motion.button>
          <motion.button
            onClick={handleToggleComments}
            className={`flex items-center gap-1 group hover:text-[#ff6740] transition-colors duration-200 ${
              openComments.has(post.id) ? "text-[#ff6740]" : ""
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <AddCommentOutlinedIcon
              className={`w-5 h-5 text-white group-hover:text-[#ff6740] transition-colors duration-200 ${
                openComments.has(post.id) ? "text-[#ff6740]" : ""
              }`}
            />
            <span
              className={`text-sm sm:text-base font-medium text-white group-hover:text-[#ff6740] transition-colors duration-200 ${
                openComments.has(post.id) ? "text-[#ff6740]" : ""
              }`}
            >
              Bình luận
            </span>
          </motion.button>
          {isMobile && openComments.has(post.id) && (
            <motion.button
              onClick={handleToggleComments}
              className="flex items-center gap-1 group text-[#ff6740]"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-sm font-medium">Đóng</span>
            </motion.button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {openComments.has(post.id) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <CommentSection
              postId={post.id}
              isMobile={isMobile}
              openComments={openComments}
              setOpenComments={setOpenComments}
              visibleRootComments={visibleRootComments}
              setVisibleRootComments={setVisibleRootComments}
              openReplyId={openReplyId}
              setOpenReplyId={setOpenReplyId}
              menuOpenCommentId={menuOpenCommentId}
              setMenuOpenCommentId={setMenuOpenCommentId}
              editingCommentId={editingCommentId}
              setEditingCommentId={setEditingCommentId}
              editedContent={editedContent}
              setEditedContent={setEditedContent}
              setReportCommentId={setReportCommentId}
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
              commentInput={commentInput}
              setCommentInput={setCommentInput}
              onRequestDelete={onRequestDelete}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PostItem;
