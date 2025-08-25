import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect, useContext } from "react";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AddCommentOutlinedIcon from "@mui/icons-material/AddCommentOutlined";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "../../../assets/svg/CommentUser/delete.svg";
import Button from "../../../components/ButtonComponent";
import ReactPicker from "../Modals/ReactPicker";
import CommentPopup from "../Comment/CommentPopup";
import { BlogCommentUser } from "../Comment/BlogCommentUser";
import { type Post, type VisibleRootComments } from "../types";
import CommentAdd01Icon from "../../../assets/svg/CommentUser/comment-add-01-stroke-rounded.svg";
import favorite from "../../../assets/svg/CommentUser/favorite.svg";
import red_favorite from "../../../assets/svg/CommentUser/red_favorite.svg";
import Flag02Icon from "../../../assets/svg/CommentUser/flag-02-stroke-rounded.svg";
import block from "../../../assets/svg/CommentUser/block.svg";
import { AuthContext } from "../../../context/AuthContext/AuthProvider";
import { getAvatarUrl } from "../../../utils/avatar";


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
  onToggleLike?: (postId: string) => void;
  isLiked?: boolean;
  onUpdatePost?: (postId: string, content: string) => void;
  updatedTimestamp?: string;
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
  onToggleLike,
  isLiked = false,
  onUpdatePost,
  updatedTimestamp,
}: PostItemProps) => {
  const { auth } = useContext(AuthContext);
  const isOwnPost = post.user.username === auth?.user?.userName;
  const menuRef = useRef<HTMLDivElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [showCommentPopup, setShowCommentPopup] = useState(false);
  const hoverTimeoutRef = useRef<number | null>(null);
  const [editContent, setEditContent] = useState(post.content);
  const [realTimeCommentCount, setRealTimeCommentCount] = useState<number | undefined>(undefined);
  const [realTimeLikeCount, setRealTimeLikeCount] = useState<number | undefined>(undefined);

  const emojiTextMap: { [key: string]: string } = {
    "👍": "Thích",
    "❤️": "Yêu thích",
    "😂": "Haha",
    "😮": "Ê nha",
    "😢": "Sầu",
    "😣": "Thương thương",
  };

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

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
  }, [post.id, openComments, showCommentPopup, isMobile]);

  useEffect(() => {
    setRealTimeLikeCount(undefined);
  }, [post.likes]);

  useEffect(() => {
    if (realTimeCommentCount === undefined) {
      setRealTimeCommentCount(post.comments);
    }
  }, [post.comments, realTimeCommentCount]);

  useEffect(() => {
  }, [realTimeCommentCount]);

  useEffect(() => {
    setRealTimeCommentCount(undefined);
  }, [post.id]);

  const handleToggleComments = () => {
    setShowCommentPopup(!showCommentPopup);
  };

  const handleEmojiClick = (emoji: string) => {
    setSelectedEmoji(emoji);
    setShowEmojiPicker(false);
  };

  const handleMouseEnter = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setShowEmojiPicker(true);
    }, 1000);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setShowEmojiPicker(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-[#1e1e21] rounded-[10px] p-5"
    >
      <div className="flex items-start justify-between sm:items-center mb-4 gap-3">
        <div className="flex items-start gap-4">
          <img
            src={getAvatarUrl(post.user.avatar)}
            alt={post.user.name}
            className="w-10 h-10 rounded-full object-cover flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => {
              const username = post.user.username?.replace('@', '');
              if (username) {
                window.location.href = `/profile/${username}`;
              }
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = getAvatarUrl(null);
            }}
          />
          <div className="min-w-0 flex-1">
            <h3
              className="text-base font-semibold text-white truncate hover:text-orange-400 transition-colors cursor-pointer"
              onClick={() => {
                const username = post.user.username?.replace('@', '');
                if (username) {
                  window.location.href = `/profile/${username}`;
                }
              }}
              title={`Xem profile của ${post.user.name}`}
            >
              {post.user.name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>@{post.user.username?.replace('@', '')}</span>
              <div className="w-[4px] h-[4px] bg-gray-400 rounded-full"></div>
              <span className="text-[#cecece]">{updatedTimestamp || post.timestamp}</span>
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
            <MoreHorizOutlinedIcon className="text-white" />
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
                className="absolute right-0 mt-2 bg-[#2b2b2c] text-white rounded-md shadow-lg overflow-hidden w-[140px] text-sm z-10 border border-[#444]"
              >
                {isOwnPost ? (
                  <>
                    <motion.button
                      onClick={() => {
                        setEditingPostId(post.id);
                        setEditContent(post.content);
                        setMenuOpenPostId(null);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#3a3a3a] transition-colors duration-200 flex items-center gap-2"
                      whileHover={{ backgroundColor: "#3a3a3a" }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <EditIcon className="w-4 h-4" />
                      Cập nhật
                    </motion.button>
                    <motion.button
                      onClick={() => {
                        onRequestDelete("post", post.id);
                        setMenuOpenPostId(null);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#3a3a3a] transition-colors duration-200 flex items-center gap-2"
                      whileHover={{ backgroundColor: "#3a3a3a" }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <img src={DeleteIcon} className="w-4 h-4" />
                      Xóa bài viết
                    </motion.button>
                  </>
                ) : (
                  <>
                    <motion.button
                      onClick={() => {
                        alert("Chức năng chặn người dùng sẽ được phát triển sau");
                        setMenuOpenPostId(null);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#3a3a3a] transition-colors duration-200 flex items-center gap-2"
                      whileHover={{ backgroundColor: "#3a3a3a" }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <img src={block} className="w-4 h-4" />
                      Chặn người dùng
                    </motion.button>
                    <motion.button
                      onClick={() => {
                        setReportPostId(post.id);
                        setMenuOpenPostId(null);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#3a3a3a] transition-colors duration-200 flex items-center gap-2"
                      whileHover={{ backgroundColor: "#3a3a3a" }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <img src={Flag02Icon} className="w-4 h-4" />
                      Báo cáo bài viết
                    </motion.button>
                  </>
                )}
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
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
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
                  onClick={() => {
                    if (onUpdatePost) {
                      onUpdatePost(post.id, editContent);
                      setEditingPostId(null);
                      setEditContent(post.content);
                    }
                  }}
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
            {post.imgUrls && post.imgUrls.length > 0 && (
              <div className="mt-4">
                {post.imgUrls?.length === 1 ? (
                  <div className="w-full max-w-md">
                    <img
                      src={post.imgUrls[0]}
                      alt="post-image"
                      className="w-full aspect-square object-cover rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 max-w-md">
                    {post.imgUrls?.slice(0, 4).map((imgUrl, index) => (
                      <div key={index} className="relative aspect-square">
                        <img
                          src={imgUrl}
                          alt={`post-image-${index}`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        {index === 3 && post.imgUrls && post.imgUrls.length > 4 && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                            <span className="text-white font-semibold">+{post.imgUrls.length - 4}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="border-t border-[#656565] pt-4">
        <div className="flex items-center gap-6">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              isLoading={false}
              onClick={() => {
                if (onToggleLike) {
                  onToggleLike(post.id);
                  const currentCount = realTimeLikeCount !== undefined ? realTimeLikeCount : post.likes;
                  setRealTimeLikeCount(isLiked ? Math.max(0, currentCount - 1) : currentCount + 1);
                }
              }}
              className="flex items-center gap-2 group hover:text-[#ff6740] hover:bg-transparent transition-colors duration-200 bg-transparent border-none"
              aria-label={isLiked ? "Hủy yêu thích" : "Yêu thích bài viết"}
            >
              <div className="flex items-center gap-2">
                <img
                  src={isLiked ? red_favorite : favorite}
                  className="w-5 h-5"
                  alt={isLiked ? "Đã yêu thích" : "Yêu thích"}
                />
                <span
                  className={`text-sm sm:text-base font-medium ${isLiked ? "text-red-500" : "text-white"
                    } group-hover:text-[#ff6740] transition-colors duration-200`}
                >
                  {realTimeLikeCount !== undefined ? realTimeLikeCount : post.likes}
                </span>
              </div>
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleToggleComments}
              className="flex items-center gap-2 group hover:text-[#ff6740] hover:bg-transparent transition-colors duration-200 bg-transparent border-none"
              aria-label={showCommentPopup ? "Đóng bình luận" : "Mở bình luận"}
            >
              <div className="flex items-center gap-2">
                <img src={CommentAdd01Icon} className="w-5 h-5" alt="Bình luận" />
                <span className="text-sm sm:text-base font-medium text-white group-hover:text-[#ff6740] transition-colors duration-200">
                  {realTimeCommentCount !== undefined ? realTimeCommentCount : post.comments}
                </span>
              </div>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Comment Section */}
      {showCommentPopup && (
        <div className="mt-4">
          <BlogCommentUser
            postId={post.id}
            onCommentCountChange={setRealTimeCommentCount}
          />
        </div>
      )}
    </motion.div>
  );
};

export default PostItem;
