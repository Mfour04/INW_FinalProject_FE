import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type Post } from "../types";
import CommentSection from "../Comment/CommentSection";
import CloseIcon from "@mui/icons-material/Close";
import { createPortal } from "react-dom";
import { type VisibleRootComments } from "../types";

interface CommentPopupProps {
  post: Post;
  show: boolean;
  onClose: () => void;
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

const CommentPopup = ({
  post,
  show,
  onClose,
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
}: CommentPopupProps) => {
  const modalRoot = document.getElementById("modal-root") || document.body;
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Lock/unlock body scroll and auto-focus input
  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
      console.log(`Locked body scroll for comment popup of post ${post.id}`);
      inputRef.current?.focus();
      inputRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    } else {
      document.body.style.overflow = "auto";
      console.log(`Unlocked body scroll for comment popup of post ${post.id}`);
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [show, post.id]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && show) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [show, onClose]);

  const popupContent = (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-[#1e1e21] rounded-[8px] w-[calc(100%-24px)] sm:max-w-[800px] max-h-[85vh] mx-3 sm:mx-2 shadow-xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Pop-up bình luận"
          >
            {/* Post header */}
            <div className="p-4 border-b border-[#444] flex items-center justify-center bg-[#1e1e21] relative flex-shrink-0">
              <h3 className="text-lg sm:text-xl font-bold text-white text-center">
                Bài viết của {post.user.name}
              </h3>
              <motion.button
                onClick={onClose}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-[#aaa] hover:text-white p-2 rounded-full hover:bg-[#3a3a3a] active:bg-[#3a3a3a] transition-colors duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Đóng pop-up bình luận"
                title="Đóng pop-up bình luận"
              >
                <CloseIcon fontSize="small" />
              </motion.button>
            </div>

            {/* Comment section */}
            <div className="p-4 pb-3 sm:p-5 sm:pb-4 flex-1 max-h-full ">
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
                inputRef={inputRef}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(popupContent, modalRoot);
};

export default CommentPopup;
