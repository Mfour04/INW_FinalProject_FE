import { motion, AnimatePresence } from "framer-motion";
import { useRef, useEffect } from "react";
import SentHugeIcon from "../../../assets/img/Blogs/sent-stroke-rounded.svg";
import CommentItem from "./CommentItem";
import { type Comment } from "../types";
import Button from "../../../components/ButtonComponent";

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
    content: "@Ng wallpapers có thể được sử dụng để làm gì vậy? 😄",
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
  setReportCommentId: React.Dispatch<React.SetStateAction<string | null>>;
  replyingTo: { commentId: string; username: string } | null;
  setReplyingTo: React.Dispatch<
    React.SetStateAction<{ commentId: string; username: string } | null>
  >;
  commentInput: string;
  setCommentInput: React.Dispatch<React.SetStateAction<string>>;
  onRequestDelete: (type: "post" | "comment", id: string) => void;
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
}: CommentSectionProps) => {
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
  const inputRef = useRef<HTMLInputElement>(null);
  const commentSectionRef = useRef<HTMLDivElement>(null);

  // Focus input when replying
  useEffect(() => {
    if (replyingTo && inputRef.current) {
      inputRef.current.focus();
    }
  }, [replyingTo]);

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
          className={`mt-4 ${isMobile ? "px-2" : "px-4"}`}
        >
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`bg-[#2b2b2c] rounded-lg ${
              isMobile ? "p-3" : "p-4"
            } text-white`}
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
                    <p
                      className={`text-sm mb-2 text-[#aaa] italic ${
                        isMobile ? "text-xs" : ""
                      }`}
                    >
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
                      <button
                        onClick={() =>
                          setVisibleRootComments((prev) => ({
                            ...prev,
                            [postId]: visibleCount + 3,
                          }))
                        }
                        className={`text-sm text-[#ff6740] hover:underline font-medium ${
                          isMobile ? "text-xs" : ""
                        }`}
                      >
                        Xem thêm bình luận...
                      </button>
                    )}
                    {visibleCount > INITIAL_VISIBLE_COMMENTS && (
                      <button
                        onClick={handleHideComments}
                        className={`text-sm text-[#ff6740] hover:underline font-medium ${
                          isMobile ? "text-xs" : ""
                        }`}
                      >
                        Ẩn bớt bình luận
                      </button>
                    )}
                  </div>
                </>
              );
            })()}
            <div
              className={`mt-4 flex items-center gap-2 ${
                isMobile ? "sticky bottom-0 bg-[#2b2b2c] py-2" : ""
              }`}
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
                className={`flex-1 ${
                  isMobile ? "text-sm px-3 py-1" : "text-base px-4 py-2"
                } bg-[#1e1e21] text-white rounded-full outline-none`}
              />
              <Button
                isLoading={false}
                onClick={handleCommentSubmit}
                disabled={!commentInput.trim()}
                className={`bg-[#ff6740] text-white ${
                  isMobile ? "px-3 py-1" : "px-4 py-2"
                } rounded-full disabled:bg-gray-600 disabled:cursor-not-allowed`}
                aria-label="Gửi bình luận"
              >
                <img
                  src={SentHugeIcon}
                  alt="Sent icon"
                  className={isMobile ? "w-5 h-5" : ""}
                />
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CommentSection;
