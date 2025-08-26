import React, { useState } from "react";
import { motion } from "framer-motion";

import {
  ReportReasonLabel,
  type Report,
} from "../../../api/Admin/Report/report.type";
import { GetReportById } from "../../../api/Admin/Report/report.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GetNovelById } from "../../../api/Novels/novel.api";
import { GetCommentById } from "../../../api/Comment/comment.api";
import { GetChapter } from "../../../api/Chapters/chapter.api";
import {
  DeleteForumPost,
  GetForumPostById,
} from "../../../api/Admin/Forum/forum.api";
import {
  DeleteForumComment,
  GetForumCommentById,
} from "../../../api/Admin/ForumComment/forumComment.api";
import { DeleteComment } from "../../../api/Comment/comment.api";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/ButtonComponent";
import { ConfirmModal } from "../../../components/ConfirmModal/ConfirmModal";
import { GetUserById } from "../../../api/Admin/User/user.api";
import { formatVietnamTimeFromTicks } from "../../../utils/date_format";

interface ReportDetailPopupProps {
  isOpen: boolean;
  onClose: () => void;
  reportId: string | null;
}

const ReportDetailPopup = ({
  isOpen,
  onClose,
  reportId,
}: ReportDetailPopupProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "comment" | "forumPost" | "forumComment";
    id: string;
  } | null>(null);

  const {
    data: reportData,
    isLoading: isReportLoading,
    error: reportError,
  } = useQuery({
    queryKey: ["Report", reportId],
    queryFn: () =>
      reportId
        ? GetReportById(reportId).then((res) => res.data)
        : Promise.reject("No report ID"),
    enabled: isOpen && !!reportId,
  });

  const report: Report | undefined = reportData?.data;

  const {
    data: userData,
    isLoading: isUserLoading,
    error: userError,
  } = useQuery({
    queryKey: ["User", report?.reporter.id],
    queryFn: () =>
      report?.reporter.id
        ? GetUserById(report.reporter.id).then((res) => res.data)
        : Promise.reject("No user ID"),
    enabled: isOpen && !!report?.reporter.id,
  });

  const {
    data: memberData,
    isLoading: isMemberLoading,
    error: memberError,
  } = useQuery({
    queryKey: ["Member", report?.targetUserId],
    queryFn: () =>
      report?.targetUserId
        ? GetUserById(report.targetUserId).then((res) => res.data)
        : Promise.reject("No member ID"),
    enabled: isOpen && !!report?.targetUserId,
    // &&
    // report.scope === 5,
  });

  const {
    data: novelData,
    isLoading: isNovelLoading,
    error: novelError,
  } = useQuery({
    queryKey: ["Novel", report?.novelId],
    queryFn: () =>
      report?.novelId
        ? GetNovelById(report.novelId).then((res) => res.data)
        : Promise.reject("No novel ID"),
    enabled: isOpen && !!report?.novelId && report.scope === 0,
  });

  const {
    data: commentData,
    isLoading: isCommentsLoading,
    error: commentError,
  } = useQuery({
    queryKey: ["Comment", report?.commentId],
    queryFn: () =>
      report?.commentId
        ? GetCommentById(report.commentId).then((res) => res.data)
        : Promise.reject("No comment ID"),
    enabled: isOpen && !!report?.commentId && report.scope === 2,
  });

  const {
    data: chapterData,
    isLoading: isChapterLoading,
    error: chapterError,
  } = useQuery({
    queryKey: ["Chapter", report?.chapterId],
    queryFn: () =>
      report?.chapterId
        ? GetChapter(report.chapterId).then((res) => res.data)
        : Promise.reject("No chapter ID"),
    enabled: isOpen && !!report?.chapterId && report.scope === 1,
  });

  const {
    data: postsData,
    isLoading: isForumPostLoading,
    error: forumPostsError,
  } = useQuery({
    queryKey: ["ForumPost", report?.forumPostId],
    queryFn: () =>
      report?.forumPostId
        ? GetForumPostById(report.forumPostId).then((res) => res.data)
        : Promise.reject("No post ID"),
    enabled: isOpen && !!report?.forumPostId && report.scope === 3,
  });

  const {
    data: forumCommentsData,
    isLoading: isForumPostCommentLoading,
    error: forumPostCommentsError,
  } = useQuery({
    queryKey: ["ForumPostComment", report?.forumCommentId],
    queryFn: () =>
      report?.forumCommentId
        ? GetForumCommentById(report.forumCommentId).then((res) => res.data)
        : Promise.reject("No comment ID"),
    enabled: isOpen && !!report?.forumCommentId && report.scope === 4,
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!deleteTarget || !report) throw new Error("No delete target");
      let deleteResult;
      switch (deleteTarget.type) {
        case "comment":
          deleteResult = await DeleteComment(deleteTarget.id).then(
            (res) => res.data
          );
          break;
        case "forumPost":
          deleteResult = await DeleteForumPost(deleteTarget.id).then(
            (res) => res.data
          );
          break;
        case "forumComment":
          deleteResult = await DeleteForumComment(deleteTarget.id).then(
            (res) => res.data
          );
          break;
        default:
          throw new Error("Invalid delete type");
      }
      if (!deleteResult.success) {
        throw new Error(deleteResult.message || "Delete failed");
      }
      // Cập nhật trạng thái báo cáo thành Resolved

      return deleteResult;
    },
    onSuccess: () => {
      setIsConfirmOpen(false);
      setDeleteTarget(null);
      queryClient.invalidateQueries({ queryKey: ["Reports"] });
      onClose();
    },
    onError: (err) => {
      console.error("Delete or update status error:", err);
      alert("Xóa hoặc cập nhật trạng thái thất bại! Vui lòng thử lại.");
    },
  });

  const handleNavigate = () => {
    if (!report) return;
    switch (report.scope) {
      case 5:
        navigate(`/admin/users}`);
        break;
      case 0:
        navigate(`/admin/novels`);
        break;
      case 1:
        navigate(`/admin/novels`);
        break;
    }
  };

  const getDeleteMessage = () => {
    if (!deleteTarget) return "";
    switch (deleteTarget.type) {
      case "comment":
        return "Bạn có chắc muốn xóa bình luận này?";
      case "forumPost":
        return "Bạn có chắc muốn xóa bài viết diễn đàn này?";
      case "forumComment":
        return "Bạn có chắc muốn xóa bình luận diễn đàn này?";
      default:
        return "";
    }
  };

  if (!isOpen || !reportId) return null;

  if (isReportLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50"
      >
        <div className="bg-white dark:bg-[#1a1a1c] p-6 rounded-[10px] shadow-lg max-w-md w-full border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </motion.div>
    );
  }

  if (reportError || !report) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50"
      >
        <div className="bg-white dark:bg-[#1a1a1c] p-6 rounded-[10px] shadow-lg max-w-md w-full border border-gray-200 dark:border-gray-700">
          <p className="text-red-600 dark:text-red-400">
            Failed to load report
          </p>
          <div className="flex justify-end mt-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="px-4 py-2 rounded-[10px] bg-[#ff4d4f] dark:bg-[#ff6740] text-white hover:bg-[#e64547] dark:hover:bg-[#e14b2e]"
            >
              Đóng
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  let detailContent: React.ReactNode = null;
  switch (report.scope) {
    case 5: {
      if (isUserLoading || isMemberLoading) {
        detailContent = (
          <p className="text-gray-600 dark:text-gray-400">Đang tải...</p>
        );
      } else if (userError || memberError || !userData || !memberData) {
        detailContent = (
          <p className="text-red-600 dark:text-red-400">
            Không thể lấy thông tin người dùng
          </p>
        );
      } else {
        const member = memberData;
        detailContent = (
          <div className="space-y-2">
            <p className="text-gray-900 dark:text-gray-100">
              <strong>Người bị báo cáo:</strong> {member.userName} (
              {member.displayName})
            </p>
            <p className="text-gray-900 dark:text-gray-100">
              <strong>Email:</strong> {member.email || "Không có"}
            </p>
            <p className="text-gray-900 dark:text-gray-100">
              <strong>Vai trò:</strong> {member.role}
            </p>
          </div>
        );
      }
      break;
    }
    case 0: {
      if (isNovelLoading) {
        detailContent = (
          <p className="text-gray-600 dark:text-gray-400">Đang tải...</p>
        );
      } else if (novelError || !novelData?.data) {
        detailContent = (
          <p className="text-red-600 dark:text-red-400">
            Không thể lấy tiểu thuyết
          </p>
        );
      } else {
        const novel = novelData.data.novelInfo;
        detailContent = (
          <div className="space-y-2">
            <p className="text-gray-900 dark:text-gray-100">
              <strong>Tiêu đề:</strong> {novel.title}
            </p>
            <p className="text-gray-900 dark:text-gray-100">
              <strong>Giá:</strong>{" "}
              {novel.price === 0 ? "Miễn phí" : `${novel.price} "xu"`}
            </p>
            <p className="text-gray-900 dark:text-gray-100">
              <strong>Trạng thái:</strong>{" "}
              {novel.status === 1 ? "Hoàn thành" : "Đang tiến hành"}
            </p>
          </div>
        );
      }
      break;
    }
    case 1: {
      if (isChapterLoading) {
        detailContent = (
          <p className="text-gray-600 dark:text-gray-400">Đang tải...</p>
        );
      } else if (chapterError || !chapterData?.data) {
        detailContent = (
          <p className="text-red-600 dark:text-red-400">
            Không thể lấy chương truyện
          </p>
        );
      } else {
        const chapter = chapterData.data.chapter;
        detailContent = (
          <div className="space-y-2">
            <p className="text-gray-900 dark:text-gray-100">
              <strong>Tiêu đề:</strong> {chapter.title}
            </p>
            <p className="text-gray-900 dark:text-gray-100">
              <strong>Chương truyện:</strong>{" "}
              {chapter.title || "Không có mô tả"}
            </p>
            <p className="text-gray-900 dark:text-gray-100">
              <strong>Giá:</strong> {chapter.price || 0} coin
            </p>
          </div>
        );
      }
      break;
    }
    case 2: {
      if (isCommentsLoading) {
        detailContent = (
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        );
      } else if (commentError || !commentData?.data) {
        detailContent = (
          <p className="text-red-600 dark:text-red-400">
            Failed to load comment
          </p>
        );
      } else {
        const comment = commentData.data;
        detailContent = (
          <div className="space-y-2">
            <p className="text-gray-900 dark:text-gray-100">
              <strong>Nội dung:</strong> {comment.content}
            </p>
            <p className="text-gray-900 dark:text-gray-100">
              <strong>Người bình luận:</strong>{" "}
              {report.commentAuthor?.displayName}
            </p>
          </div>
        );
      }
      break;
    }
    case 3: {
      if (isForumPostLoading) {
        detailContent = (
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        );
      } else if (forumPostsError || !postsData?.data) {
        detailContent = (
          <p className="text-red-600 dark:text-red-400">Failed to load post</p>
        );
      } else {
        const post = postsData.data;
        detailContent = (
          <div className="space-y-2">
            <p className="text-gray-900 dark:text-gray-100">
              <strong>Tiêu đề:</strong> {post.title}
            </p>
            <p className="text-gray-900 dark:text-gray-100">
              <strong>Nội dung:</strong> {post.content}
            </p>
            <p className="text-gray-900 dark:text-gray-100">
              <strong>Người đăng:</strong> {post.author.username}
            </p>
          </div>
        );
      }
      break;
    }
    case 4: {
      if (isForumPostCommentLoading) {
        detailContent = (
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        );
      } else if (forumPostCommentsError || !forumCommentsData?.data) {
        detailContent = (
          <p className="text-red-600 dark:text-red-400">
            Failed to load comment
          </p>
        );
      } else {
        const forumComment = forumCommentsData.data;
        detailContent = (
          <div className="space-y-2">
            <p className="text-gray-900 dark:text-gray-100">
              <strong>Nội dung:</strong> {forumComment.content}
            </p>
            <p className="text-gray-900 dark:text-gray-100">
              <strong>Người bình luận:</strong> {forumComment.author.username}
            </p>
          </div>
        );
      }
      break;
    }
    default:
      detailContent = (
        <p className="text-gray-900 dark:text-gray-100">
          Loại báo cáo không hợp lệ.
        </p>
      );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 10, opacity: 0 }}
        className="bg-white dark:bg-[#1a1a1c] p-6 rounded-[10px] shadow-lg max-w-md w-full border border-gray-200 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Chi tiết báo cáo
        </h2>
        <div className="mb-4 space-y-2">
          <p className="text-gray-900 dark:text-gray-100">
            <strong>Người báo cáo:</strong>{" "}
            {isUserLoading
              ? "Đang tải..."
              : userError || !userData
              ? "Không rõ"
              : userData.userName}
          </p>
          <p className="text-gray-900 dark:text-gray-100">
            <strong>Loại:</strong>{" "}
            {report.scope === 5
              ? "Người dùng"
              : report.scope === 0
              ? "Tiểu thuyết"
              : report.scope === 1
              ? "Chương"
              : report.scope === 2
              ? "Bình luận"
              : report.scope === 3
              ? "Bài viết diễn đàn"
              : report.scope === 4
              ? "Bình luận diễn đàn"
              : `Loại ${report.scope}`}
          </p>
          <p className="text-gray-900 dark:text-gray-100">
            <strong>Lý do:</strong>{" "}
            {ReportReasonLabel[report.reason] || "Không có lý do"}
          </p>
          <p className="text-gray-900 dark:text-gray-100">
            <strong>Trạng thái:</strong>{" "}
            {report.status === 0
              ? "Đang xử lý"
              : report.status === 1
              ? "Đã giải quyết"
              : "Bị từ chối"}
          </p>
          <p className="text-gray-900 dark:text-gray-100">
            <strong>Ngày tạo:</strong>{" "}
            {formatVietnamTimeFromTicks(report.createdAt)}
          </p>
          <p className="text-gray-900 dark:text-gray-100">
            <strong>Ngày cập nhật:</strong>{" "}
            {report.updatedAt !== 0
              ? formatVietnamTimeFromTicks(report.updatedAt)
              : "Không có"}
          </p>
        </div>
        <hr className="border-gray-200 dark:border-gray-700 mb-4" />
        <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-2">
          Thông tin đối tượng
        </h3>
        <div className="mb-2">{detailContent}</div>
        {report.moderator && (
          <>
            <hr className="border-gray-200 dark:border-gray-700 mb-2" />
            <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-2">
              Người xử lý
            </h3>
            <div className="space-y-1">
              <p className="text-gray-900 dark:text-gray-100">
                <strong>Người xử lý:</strong> {report.moderator.username} (
                {report.moderator.displayName})
              </p>
              <p className="text-gray-900 dark:text-gray-100">
                <strong>Thời điểm xử lý:</strong>{" "}
                {formatVietnamTimeFromTicks(report.moderatedAt!)}
              </p>
              <p className="text-gray-900 dark:text-gray-100">
                <strong>Ghi chú:</strong> {report.moderatorNote}
              </p>
            </div>
          </>
        )}
        <div className="flex justify-end gap-4 mt-6">
          {(report.scope === 5 || report.scope === 0 || report.scope === 1) &&
            !report.moderator && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  isLoading={false}
                  onClick={handleNavigate}
                  className="px-4 py-2 rounded-[10px] text-white bg-[#ff6740] hover:bg-[#e14b2e] text-sm border-none"
                >
                  Chuyển đến trang quản lý
                </Button>
              </motion.div>
            )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="px-4 py-2 rounded-[10px] bg-gray-600 hover:bg-gray-500 text-white text-sm"
          >
            Đóng
          </motion.button>
        </div>
        <ConfirmModal
          isOpen={isConfirmOpen}
          title="Xác nhận xóa"
          message={getDeleteMessage()}
          onConfirm={() => deleteMutation.mutate()}
          onCancel={() => {
            setIsConfirmOpen(false);
            setDeleteTarget(null);
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default ReportDetailPopup;
