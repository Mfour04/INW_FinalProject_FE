import { motion, AnimatePresence } from "framer-motion";
import { useRef, useEffect } from "react";
import SentHugeIcon from "../../../assets/img/Blogs/sent-stroke-rounded.svg";
import CommentItem from "./CommentItem";
import { type Comment } from "../types";
import Button from "../../../components/ButtonComponent";
import CloseIcon from "@mui/icons-material/Close";
import { type VisibleRootComments } from "../types";

const forumComments: Comment[] = [
  {
    id: "cmt_001",
    post_id: "1",
    user_id: "user_001",
    content: "Bài viết rất hay, mình học được nhiều điều!",
    parent_comment_id: null,
    like_count: 12,
    reply_count: 1,
    created_at: "2025-07-11T10:00:00Z",
    updated_at: "2025-07-11T10:00:00Z",
  },
  {
    id: "cmt_002",
    post_id: "1",
    user_id: "user_002",
    content: "Bạn trình bày rõ ràng và dễ hiểu lắm!",
    parent_comment_id: null,
    like_count: 7,
    reply_count: 1,
    created_at: "2025-07-11T10:05:00Z",
    updated_at: "2025-07-11T10:05:00Z",
  },
  {
    id: "cmt_003",
    post_id: "1",
    user_id: "user_003",
    content: "Wallpapers có thể được sử dụng để làm gì vậy? 😄",
    parent_comment_id: "cmt_001",
    like_count: 2,
    reply_count: 0,
    created_at: "2025-07-11T10:07:00Z",
    updated_at: "2025-07-11T10:07:00Z",
  },
  {
    id: "cmt_004",
    post_id: "1",
    user_id: "user_004",
    content: "Chia sẻ thêm một vài nguồn tài liệu thì tuyệt hơn nữa!",
    parent_comment_id: null,
    like_count: 4,
    reply_count: 0,
    created_at: "2025-07-11T10:10:00Z",
    updated_at: "2025-07-11T10:10:00Z",
  },
  {
    id: "cmt_005",
    post_id: "1",
    user_id: "user_005",
    content: "@Trần Thị B đồng ý luôn 👍",
    parent_comment_id: "cmt_002",
    like_count: 1,
    reply_count: 0,
    created_at: "2025-07-11T10:12:00Z",
    updated_at: "2025-07-11T10:12:00Z",
  },
  {
    id: "cmt_006",
    post_id: "1",
    user_id: "user_006",
    content: "Mình nghĩ bạn có thể bổ sung thêm ví dụ thực tế.",
    parent_comment_id: null,
    like_count: 3,
    reply_count: 2,
    created_at: "2025-07-11T10:20:00Z",
    updated_at: "2025-07-11T10:20:00Z",
  },
  {
    id: "cmt_007",
    post_id: "1",
    user_id: "user_007",
    content: "@user_006 đồng ý, ví dụ sẽ giúp dễ hiểu hơn.",
    parent_comment_id: "cmt_006",
    like_count: 2,
    reply_count: 0,
    created_at: "2025-07-11T10:22:00Z",
    updated_at: "2025-07-11T10:22:00Z",
  },
  {
    id: "cmt_008",
    post_id: "1",
    user_id: "user_008",
    content: "Tớ thấy ví dụ ở phần 2 khá rõ rồi mà nhỉ?",
    parent_comment_id: "cmt_006",
    like_count: 1,
    reply_count: 0,
    created_at: "2025-07-11T10:25:00Z",
    updated_at: "2025-07-11T10:25:00Z",
  },
  {
    id: "cmt_009",
    post_id: "1",
    user_id: "user_009",
    content: "Bạn viết về AI rất hay, mình muốn tìm hiểu thêm!",
    parent_comment_id: null,
    like_count: 9,
    reply_count: 1,
    created_at: "2025-07-11T10:30:00Z",
    updated_at: "2025-07-11T10:30:00Z",
  },
  {
    id: "cmt_010",
    post_id: "1",
    user_id: "user_010",
    content: "@user_009 bạn có thể xem thêm ở trang cuối bài đó!",
    parent_comment_id: "cmt_009",
    like_count: 1,
    reply_count: 0,
    created_at: "2025-07-11T10:35:00Z",
    updated_at: "2025-07-11T10:35:00Z",
  },
];

interface CommentSectionProps {
  postId: string;
  isMobile: boolean;
  openComments: Set<string>;
  setOpenComments: (value: Set<string>) => void;
  visibleRootComments: VisibleRootComments;
  setVisibleRootComments: (value: VisibleRootComments) => void;
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
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

const INITIAL_VISIBLE_COMMENTS = 3;

const CommentSection = ({
  postId,
  isMobile,
  openComments,
  setOpenComments,
  visibleRootComments,
  setVisibleRootComments,
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
  inputRef,
}: CommentSectionProps) => {
  const rootComments = forumComments.filter(
    (c) => c.parent_comment_id === null
  );
  const getReplies = (parentId: string) =>
    forumComments.filter((c) => c.parent_comment_id === parentId);
  const handleToggleReply = (commentId: string) => {
    setOpenReplyId(openReplyId === commentId ? null : commentId);
  };
  const handleHideComments = () => {
    setVisibleRootComments({
      ...visibleRootComments,
      [postId]: INITIAL_VISIBLE_COMMENTS,
    });
  };
  const commentSectionRef = useRef<HTMLDivElement>(null);

  // Focus input when replying
  useEffect(() => {
    if (replyingTo && inputRef && inputRef.current) {
      inputRef.current.focus();
    }
  }, [replyingTo, inputRef]);

  // Adjust scroll when keyboard opens
  useEffect(() => {
    if (!isMobile || !inputRef || !inputRef.current) return;
    const handleKeyboard = () => {
      inputRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    };
    window.addEventListener("resize", handleKeyboard);
    return () => window.removeEventListener("resize", handleKeyboard);
  }, [isMobile, inputRef]);

  // Debug log
  useEffect(() => {
    console.log("CommentSection props:", {
      postId,
      isMobile,
      openComments: Array.from(openComments),
      shouldRender: openComments.has(postId),
    });
  }, [postId, isMobile, openComments]);

  const handleCommentSubmit = () => {
    if (!commentInput.trim()) return;
    console.log("Submitting comment:", {
      post_id: postId,
      content: commentInput,
      parent_comment_id: replyingTo?.commentId || null,
    });
    setCommentInput("");
    setReplyingTo(null);
  };

  return (
    <AnimatePresence initial={false}>
      {openComments.has(postId) && (
        <motion.div
          ref={commentSectionRef}
          key={`comment-${postId}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="px-4"
        >
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`bg-[#2b2b2c] rounded-lg p-4 overscroll-contain`}
          >
            {(() => {
              const postRootComments = rootComments.filter(
                (c) => c.post_id === postId
              );
              const visibleCount =
                visibleRootComments[postId] || INITIAL_VISIBLE_COMMENTS;
              const commentsToShow = postRootComments.slice(0, visibleCount);
              return (
                <>
                  {postRootComments.length === 0 && (
                    <p className="text-[14px] sm:text-sm mb-2 text-[#aaa] italic">
                      Chưa có bình luận nào
                    </p>
                  )}
                  {commentsToShow.map((comment) => (
                    <CommentItem
                      key={comment.id}
                      comment={comment}
                      replies={getReplies(comment.id)}
                      isOpenReply={openReplyId === comment.id}
                      onToggleReply={handleToggleReply}
                      menuOpenCommentId={menuOpenCommentId}
                      setMenuOpenCommentId={setMenuOpenCommentId}
                      editingCommentId={editingCommentId}
                      setEditingCommentId={setEditingCommentId}
                      editedContent={editedContent}
                      setEditedContent={setEditedContent}
                      setReportCommentId={setReportCommentId}
                      onReply={(commentId, username) => {
                        setReplyingTo({ commentId, username });
                        setCommentInput(`@${username} `);
                      }}
                      onRequestDelete={onRequestDelete}
                    />
                  ))}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {postRootComments.length > visibleCount && (
                      <motion.button
                        onClick={() =>
                          setVisibleRootComments({
                            ...visibleRootComments,
                            [postId]: visibleCount + 3,
                          })
                        }
                        className="text-[14px] sm:text-sm text-[#ff6740] hover:underline font-medium p-2 rounded-[4px] hover:bg-transparent active:bg-[#3a3a3a] transition-colors duration-200"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Xem thêm bình luận...
                      </motion.button>
                    )}
                    {visibleCount > INITIAL_VISIBLE_COMMENTS && (
                      <motion.button
                        onClick={handleHideComments}
                        className="text-[14px] sm:text-sm text-[#ff6740] hover:underline font-medium p-2 rounded-[4px] hover:bg-transparent active:bg-[#3a3a3a] transition-colors duration-200"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Ẩn bớt bình luận
                      </motion.button>
                    )}
                  </div>
                </>
              );
            })()}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`mt-4 flex flex-col gap-2 sticky bottom-4 bg-[#1e1e21] py-3 px-3 rounded-lg shadow-sm`}
            >
              {replyingTo && (
                <div className="flex items-center gap-2">
                  <span className="text-[14px] sm:text-sm text-[#999] truncate max-w-[50%]">
                    Đang trả lời {replyingTo.username}
                  </span>
                  <motion.button
                    onClick={() => setReplyingTo(null)}
                    className="text-[#aaa] hover:text-white p-1 rounded-full hover:bg-[#3a3a3a] active:bg-[#3a3a3a] transition-colors duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Hủy trả lời"
                  >
                    <CloseIcon fontSize="small" />
                  </motion.button>
                </div>
              )}
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder={
                    replyingTo
                      ? `Trả lời ${replyingTo.username}...`
                      : "Viết bình luận..."
                  }
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleCommentSubmit();
                    }
                  }}
                  className="min-w-0 flex-[3] text-[15px] sm:text-base px-4 py-2 bg-[#1e1e21] text-white rounded-full border border-[#444] focus:border-[#ff6740] focus:ring-2 focus:ring-[#ff6740]/30 focus:outline-none transition-all duration-200 shadow-sm"
                />
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    isLoading={false}
                    onClick={handleCommentSubmit}
                    disabled={!commentInput.trim()}
                    className={`flex-[1] min-w-[48px] bg-[#ff6740] text-white px-4 py-2 rounded-full disabled:bg-[#4a4a4a] disabled:cursor-not-allowed transition-colors duration-200`}
                    aria-label="Gửi bình luận"
                  >
                    <img
                      src={SentHugeIcon}
                      alt="Sent icon"
                      className="w-6 h-6 sm:w-6 sm:h-6"
                    />
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CommentSection;
