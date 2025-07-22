import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import AddCommentOutlinedIcon from "@mui/icons-material/AddCommentOutlined";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import Button from "../../../components/ButtonComponent";
import ReactPicker from "../Modals/ReactPicker";
import CommentPopup from "../Comment/CommentPopup";
import { type Post, type VisibleRootComments } from "../types";

interface PostItemProps {
  post: Post;
  menuOpenPostId: string | null;
  setMenuOpenPostId: (value: string | null) => void;
  editingPostId: string | null;
  setEditingPostId: (value: string | null) => void;
  setReportPostId: (value: string | null) => void;
  openComments: Set<string>;
  setOpenComments: (value: Set<string>) => void;
  visibleRootComments: VisibleRootComments;
  setVisibleRootComments: (value: VisibleRootComments) => void;
  isMobile: boolean;
  openReplyId: string | null;
  setOpenReplyId: (value: string | null) => void;
  menuOpenCommentId: string | null;
  setMenuOpenCommentId: (value: string | null) => void;
  editingCommentId: string | null;
  setEditingCommentId: (value: string | null) => void;
  editedContent: string;
  setEditedContent: (value: string) => void;
  setReportCommentId: (value: string | null) => void;
  replyingTo: { commentId: string; username: string } | null;
  setReplyingTo: (
    value: { commentId: string; username: string } | null
  ) => void;
  commentInput: string;
  setCommentInput: (value: string) => void;
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
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [showCommentPopup, setShowCommentPopup] = useState(false);
  const hoverTimeoutRef = useRef<number | null>(null);

  // Emoji to text mapping
  const emojiTextMap: { [key: string]: string } = {
    "👍": "Thích",
    "❤️": "Yêu thích",
    "😂": "Haha",
    "😮": "Ê nha",
    "😢": "Sầu",
    "😣": "Thương thương",
  };

  // Emoji to color mapping
  const emojiColorMap: { [key: string]: string } = {
    "👍": "#3b82f6",
    "❤️": "#ef4444",
    "😂": "#eab308",
    "😮": "#8b5cf6",
    "😢": "#06b6d4",
    "😣": "#ec4899",
  };

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

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  // Debug log
  useEffect(() => {
    console.log("PostItem props:", {
      postId: post.id,
      openComments: Array.from(openComments),
      showCommentPopup,
      isMobile,
    });
  }, [post.id, openComments, showCommentPopup, isMobile]);

  const handleToggleComments = () => {
    setShowCommentPopup(!showCommentPopup);
    console.log(
      !showCommentPopup
        ? `Opened comment popup for post ${post.id}`
        : `Closed comment popup for post ${post.id}`
    );
    if (!showCommentPopup) {
      const newSet = new Set(openComments);
      newSet.add(post.id);
      setOpenComments(newSet);
      setVisibleRootComments({ ...visibleRootComments, [post.id]: 3 });
    }
  };

  const handleEmojiClick = (emoji: string) => {
    setSelectedEmoji(emoji);
    console.log(`Selected emoji ${emoji} for post ${post.id}`);
    setShowEmojiPicker(false);
  };

  const handleMouseEnter = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setShowEmojiPicker(true);
      console.log("Show emoji picker for post", post.id);
    }, 1000);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setShowEmojiPicker(false);
    console.log("Hide emoji picker for post", post.id);
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
            onClick={() =>
              setMenuOpenPostId(menuOpenPostId === post.id ? null : post.id)
            }
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
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  isLoading={false}
                  className="bg-[#ff6740] text-white px-3 py-1 rounded-lg transition-colors duration-200 hover:bg-[#ff5722]"
                >
                  Lưu
                </Button>
              </motion.div>
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
          <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                isLoading={false}
                onClick={() => {
                  if (selectedEmoji) {
                    setSelectedEmoji(null);
                    console.log(`Unliked post ${post.id}`);
                  } else {
                    setSelectedEmoji("❤️");
                    console.log(
                      `Selected default emoji ❤️ for post ${post.id}`
                    );
                  }
                }}
                className="flex items-center gap-1 group hover:text-[#ff6740] hover:bg-transparent transition-colors duration-200 bg-transparent border-none"
                aria-label={
                  selectedEmoji
                    ? `Hủy ${emojiTextMap[selectedEmoji]}`
                    : "Yêu thích bài viết"
                }
              >
                {selectedEmoji ? (
                  <span
                    className="text-[20px]"
                    style={{
                      color: selectedEmoji
                        ? emojiColorMap[selectedEmoji]
                        : "#ffffff",
                    }}
                  >
                    {selectedEmoji}
                  </span>
                ) : (
                  <FavoriteBorderOutlinedIcon className="w-5 h-5 text-white group-hover:text-[#ff6740] transition-colors duration-200" />
                )}
                <span
                  className="text-sm sm:text-base font-medium"
                  style={{
                    color: selectedEmoji
                      ? emojiColorMap[selectedEmoji]
                      : "#ffffff",
                  }}
                  onMouseEnter={(e) =>
                    !selectedEmoji && (e.currentTarget.style.color = "#ff6740")
                  }
                  onMouseLeave={(e) =>
                    !selectedEmoji && (e.currentTarget.style.color = "#ffffff")
                  }
                >
                  {selectedEmoji ? emojiTextMap[selectedEmoji] : "Yêu thích"}
                </span>
              </Button>
            </motion.div>
            <ReactPicker show={showEmojiPicker} onSelect={handleEmojiClick} />
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleToggleComments}
              className="flex items-center gap-1 group hover:text-[#ff6740] hover:bg-transparent transition-colors duration-200 bg-transparent border-none"
              aria-label={showCommentPopup ? "Đóng bình luận" : "Mở bình luận"}
            >
              <AddCommentOutlinedIcon className="w-5 h-5 text-white group-hover:text-[#ff6740] transition-colors duration-200" />
              <span className="text-sm sm:text-base font-medium text-white group-hover:text-[#ff6740] transition-colors duration-200">
                Bình luận
              </span>
            </Button>
          </motion.div>
        </div>
      </div>

      <CommentPopup
        post={post}
        show={showCommentPopup}
        onClose={() => {
          setShowCommentPopup(false);
          console.log(`Closed comment popup for post ${post.id}`);
        }}
        openComments={openComments}
        setOpenComments={setOpenComments}
        visibleRootComments={visibleRootComments}
        setVisibleRootComments={setVisibleRootComments}
        isMobile={isMobile}
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
  );
};

export default PostItem;
