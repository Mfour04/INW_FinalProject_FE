import { motion, AnimatePresence } from "framer-motion";
import { useRef, useEffect } from "react";
import SentHugeIcon from "../../../assets/img/Blogs/sent-stroke-rounded.svg";
import CommentItem from "./CommentItem";
import { type Comment } from "../types";

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
    content: "@Nguyễn Văn A cảm ơn bạn nhé 😄",
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
  setOpenComments: React.Dispatch<React.SetStateAction<Set<string>>>;
  visibleRootComments: { [postId: string]: number };
  setVisibleRootComments: React.Dispatch<
    React.SetStateAction<{ [postId: string]: number }>
  >;
  openReplyId: string | null;
  setOpenReplyId: React.Dispatch<React.SetStateAction<string | null>>;
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
  replyingTo: { commentId: string; username: string } | null; // Added replyingTo prop
  setReplyingTo: React.Dispatch<
    React.SetStateAction<{ commentId: string; username: string } | null>
  >; // Added setReplyingTo prop
  commentInput: string; // Added commentInput prop
  setCommentInput: React.Dispatch<React.SetStateAction<string>>; // Added setCommentInput prop
}

const INITIAL_VISIBLE_COMMENTS = 3;

const CommentSection: React.FC<CommentSectionProps> = ({
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
  setConfirmDeleteCommentId,
  setReportCommentId,
  replyingTo,
  setReplyingTo,
  commentInput,
  setCommentInput,
}) => {
  const rootComments = forumComments.filter(
    (c) => c.parent_comment_id === null
  );
  const getReplies = (parentId: string) =>
    forumComments.filter((c) => c.parent_comment_id === parentId);
  const handleToggleReply = (commentId: string) => {
    setOpenReplyId((prev) => (prev === commentId ? null : commentId));
  };
  const handleHideComments = () => {
    setVisibleRootComments((prev) => ({
      ...prev,
      [postId]: INITIAL_VISIBLE_COMMENTS,
    }));
  };
  const inputRef = useRef<HTMLInputElement>(null); // Ref for focusing input

  // Focus input when replyingTo changes
  useEffect(() => {
    if (replyingTo && inputRef.current) {
      inputRef.current.focus();
    }
  }, [replyingTo]);

  const handleCommentSubmit = () => {
    if (!commentInput.trim()) return;
    console.log("Submitting comment:", {
      post_id: postId,
      content: commentInput,
      parent_comment_id: replyingTo?.commentId || null,
    });
    // Reset input and replyingTo state after submission
    setCommentInput("");
    setReplyingTo(null);
  };

  return (
    <AnimatePresence initial={false}>
      {openComments.has(postId) &&
        (isMobile ? (
          <motion.div
            key={`comment-mobile-${postId}`}
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-50 bg-black bg-opacity-90 backdrop-blur-sm flex flex-col p-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white text-lg font-bold">Bình luận</h2>
              <button
                onClick={() => {
                  setOpenComments((prev) => {
                    const newSet = new Set(prev);
                    newSet.delete(postId);
                    return newSet;
                  });
                  setReplyingTo(null); // Reset replyingTo when closing
                }}
                className="text-white text-2xl font-bold px-2"
                aria-label="Đóng bình luận"
              >
                ×
              </button>
            </div>
            <motion.div
              className="flex-1 overflow-y-auto text-white"
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              {(() => {
                const postRootComments = rootComments.filter(
                  (c) => c.post_id === postId
                );
                const visibleCount =
                  visibleRootComments[postId] || INITIAL_VISIBLE_COMMENTS;
                const commentsToShow = postRootComments.slice(0, visibleCount);
                if (postRootComments.length === 0) {
                  return (
                    <p className="text-sm text-[#aaa] italic">
                      Chưa có bình luận nào
                    </p>
                  );
                }
                return (
                  <>
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
                        setConfirmDeleteCommentId={setConfirmDeleteCommentId}
                        setReportCommentId={setReportCommentId}
                        onReply={(commentId, username) => {
                          setReplyingTo({ commentId, username });
                          setCommentInput(`@${username} `);
                        }}
                      />
                    ))}
                    <div className="mt-3">
                      {postRootComments.length > visibleCount && (
                        <button
                          onClick={() =>
                            setVisibleRootComments((prev) => ({
                              ...prev,
                              [postId]: visibleCount + 3,
                            }))
                          }
                          className="text-sm text-[#ff6740] hover:underline font-medium mr-4"
                        >
                          Xem thêm bình luận...
                        </button>
                      )}
                      {visibleCount > INITIAL_VISIBLE_COMMENTS && (
                        <button
                          onClick={handleHideComments}
                          className="text-sm text-[#ff6740] hover:underline font-medium"
                        >
                          Ẩn bớt bình luận
                        </button>
                      )}
                    </div>
                  </>
                );
              })()}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.3 }}
              className="mt-4 flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                placeholder="Viết bình luận..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") handleCommentSubmit();
                }}
                className="flex-1 bg-[#2b2b2c] text-white px-4 py-2 rounded-full outline-none"
              />
              <button
                onClick={handleCommentSubmit}
                disabled={!commentInput.trim()}
                className="bg-[#ff6740] text-white px-4 py-2 rounded-full disabled:bg-gray-600 disabled:cursor-not-allowed"
                aria-label="Gửi bình luận"
              >
                <img src={SentHugeIcon} alt="Sent icon" />
              </button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key={`comment-desktop-${postId}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden mt-4"
          >
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="bg-[#2b2b2c] rounded-lg p-4 text-white"
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
                      <p className="text-sm mb-2 text-[#aaa] italic">
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
                        setConfirmDeleteCommentId={setConfirmDeleteCommentId}
                        setReportCommentId={setReportCommentId}
                        onReply={(commentId, username) => {
                          setReplyingTo({ commentId, username });
                          setCommentInput(`@${username} `);
                        }}
                      />
                    ))}
                    <div className="mt-3">
                      {postRootComments.length > visibleCount && (
                        <button
                          onClick={() =>
                            setVisibleRootComments((prev) => ({
                              ...prev,
                              [postId]: visibleCount + 3,
                            }))
                          }
                          className="text-sm text-[#ff6740] hover:underline font-medium mr-4"
                        >
                          Xem thêm bình luận...
                        </button>
                      )}
                      {visibleCount > INITIAL_VISIBLE_COMMENTS && (
                        <button
                          onClick={handleHideComments}
                          className="text-sm text-[#ff6740] hover:underline font-medium"
                        >
                          Ẩn bớt bình luận
                        </button>
                      )}
                    </div>
                  </>
                );
              })()}
              <div className="mt-4 flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Viết bình luận..."
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") handleCommentSubmit();
                  }}
                  className="flex-1 bg-[#1e1e21] px-4 py-2 rounded-full outline-none"
                />
                <button
                  onClick={handleCommentSubmit}
                  disabled={!commentInput.trim()}
                  className="bg-[#ff6740] text-white px-4 py-2 rounded-full disabled:bg-gray-600 disabled:cursor-not-allowed"
                  aria-label="Gửi bình luận"
                >
                  <img src={SentHugeIcon} alt="Sent icon" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        ))}
    </AnimatePresence>
  );
};

export default CommentSection;
