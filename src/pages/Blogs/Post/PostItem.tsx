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
  setConfirmDeletePostId: React.Dispatch<React.SetStateAction<string | null>>;
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

const PostItem: React.FC<PostItemProps> = ({
  post,
  menuOpenPostId,
  setMenuOpenPostId,
  editingPostId,
  setEditingPostId,
  setConfirmDeletePostId,
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
  setConfirmDeleteCommentId,
  setReportCommentId,
  replyingTo,
  setReplyingTo,
  commentInput,
  setCommentInput,
}) => {
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

  return (
    <div className="bg-[#1e1e21] rounded-[10px] p-5">
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
            className="p-1 hover:bg-gray-700 rounded-full"
          >
            <MoreHorizOutlinedIcon />
          </button>
          {menuOpenPostId === post.id && (
            <div
              ref={menuRef}
              className="absolute right-0 mt-2 bg-[#2b2b2c] text-white rounded-md shadow-md overflow-hidden w-[120px] text-sm z-10"
            >
              <button
                onClick={() => {
                  setEditingPostId(post.id);
                  setMenuOpenPostId(null);
                }}
                className="w-full text-left px-4 py-2 hover:bg-[#3a3a3a]"
              >
                Cập nhật
              </button>
              <button
                onClick={() => {
                  setConfirmDeletePostId(post.id);
                  setMenuOpenPostId(null);
                }}
                className="w-full text-left px-4 py-2 hover:bg-[#3a3a3a]"
              >
                Xóa bài viết
              </button>
              <button
                onClick={() => {
                  setReportPostId(post.id);
                  setMenuOpenPostId(null);
                }}
                className="w-full text-left px-4 py-2 hover:bg-[#3a3a3a]"
              >
                Báo cáo bài viết
              </button>
            </div>
          )}
        </div>
      </div>
      {editingPostId === post.id ? (
        <div className="mb-4">
          <textarea
            defaultValue={post.content}
            className="w-full bg-transparent text-base sm:text-lg text-white placeholder-[#656565] resize-none border-none outline-none min-h-[80px] sm:min-h-[100px] md:min-h-[120px] font-ibm-plex mb-2"
          />
          <div className="flex flex-wrap gap-2 mb-2"></div>
          <input type="file" multiple className="text-white text-sm mb-2" />
          <div className="flex gap-2">
            <button
              onClick={() => setEditingPostId(null)}
              className="bg-gray-600 text-white px-3 py-1 rounded-lg"
            >
              Hủy
            </button>
            <button className="bg-[#ff6740] text-white px-3 py-1 rounded-lg">
              Lưu
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-4">
          <p className="text-base sm:text-lg text-white leading-relaxed">
            {post.content}
          </p>
        </div>
      )}
      <div className="border-t border-[#656565] pt-4">
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-1 group hover:text-[#ff6740]">
            <FavoriteBorderOutlinedIcon className="w-5 h-5 text-white group-hover:text-[#ff6740]" />
            <span className="text-sm sm:text-base font-medium text-white group-hover:text-[#ff6740]">
              Yêu thích
            </span>
          </button>
          <button
            onClick={() => {
              setOpenComments((prev) => {
                const newSet = new Set(prev);
                if (newSet.has(post.id)) {
                  newSet.delete(post.id);
                } else {
                  newSet.add(post.id);
                  setVisibleRootComments((prevVisible) => ({
                    ...prevVisible,
                    [post.id]: 3,
                  }));
                }
                return newSet;
              });
            }}
            className="flex items-center gap-1 group hover:text-[#ff6740]"
          >
            <AddCommentOutlinedIcon className="w-5 h-5 text-white group-hover:text-[#ff6740]" />
            <span className="text-sm sm:text-base font-medium text-white group-hover:text-[#ff6740]">
              Bình luận
            </span>
          </button>
        </div>
      </div>
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
        setConfirmDeleteCommentId={setConfirmDeleteCommentId}
        setReportCommentId={setReportCommentId}
        replyingTo={replyingTo}
        setReplyingTo={setReplyingTo}
        commentInput={commentInput}
        setCommentInput={setCommentInput}
      />
    </div>
  );
};

export default PostItem;
