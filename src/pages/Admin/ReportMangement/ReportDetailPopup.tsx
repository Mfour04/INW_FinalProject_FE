// ReportDetailPopup.tsx
import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ReportReasonLabel,
  type Report,
} from "../../../api/Admin/Report/report.type";
import { GetReportById } from "../../../api/Admin/Report/report.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GetNovelById } from "../../../api/Novels/novel.api";
import { GetChapter } from "../../../api/Chapters/chapter.api";
import {
  DeleteForumPost,
  GetForumPostById,
} from "../../../api/Admin/Forum/forum.api";
import {
  DeleteForumComment,
  GetForumCommentById,
} from "../../../api/Admin/ForumComment/forumComment.api";
import { GetUserById } from "../../../api/Admin/User/user.api";
import { useNavigate } from "react-router-dom";
import { ConfirmModal } from "../../../components/ConfirmModal/ConfirmModal";
import { formatVietnamTimeFromTicks } from "../../../utils/date_format";
import {
  X,
  Info,
  UserRound,
  Tag,
  CalendarClock,
  MessageSquare,
  FileText,
  ShieldAlert,
} from "lucide-react";
import {
  DeleteComment,
  GetCommentById,
} from "../../../api/Admin/Comment/comment.api";

interface ReportDetailPopupProps {
  isOpen: boolean;
  onClose: () => void;
  reportId: string | null;
}

const Chip = ({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "success" | "warn" | "danger";
}) => {
  const map = {
    neutral:
      "bg-zinc-100 text-zinc-800 ring-1 ring-zinc-300 dark:bg-white/10 dark:text-zinc-100 dark:ring-white/10",
    success:
      "bg-emerald-100 text-emerald-900 ring-1 ring-emerald-300/60 dark:bg-emerald-400/10 dark:text-emerald-200 dark:ring-emerald-300/20",
    warn: "bg-amber-100 text-amber-900 ring-1 ring-amber-300/60 dark:bg-amber-400/10 dark:text-amber-200 dark:ring-amber-300/20",
    danger:
      "bg-rose-100 text-rose-900 ring-1 ring-rose-300/60 dark:bg-rose-400/10 dark:text-rose-200 dark:ring-rose-300/20",
  } as const;
  return (
    <span
      className={`inline-flex items-center h-7 px-2.5 rounded-xl text-xs font-semibold ${map[tone]}`}
    >
      {children}
    </span>
  );
};

const Row = ({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value?: React.ReactNode;
}) => (
  <div className="grid grid-cols-12 gap-3 items-start">
    <div className="col-span-4 flex items-center gap-2 text-xs md:text-sm text-zinc-500 dark:text-zinc-400">
      {icon ? <span className="shrink-0">{icon}</span> : null}
      <span className="truncate">{label}</span>
    </div>
    <div className="col-span-8 text-xs md:text-sm font-medium text-zinc-900 dark:text-zinc-100 break-words">
      {value ?? "—"}
    </div>
  </div>
);

const Section = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div className="rounded-2xl ring-1 ring-zinc-200 bg-white/90 backdrop-blur p-4 dark:ring-white/10 dark:bg-white/[0.04]">
    <div className="flex items-center gap-2 mb-3">
      {icon ? (
        <span className="text-zinc-600 dark:text-zinc-300">{icon}</span>
      ) : null}
      <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        {title}
      </h3>
    </div>
    <div className="space-y-2.5">{children}</div>
  </div>
);

const Skeleton = ({ rows = 3 }: { rows?: number }) => (
  <div className="space-y-2">
    {Array.from({ length: rows }).map((_, i) => (
      <div
        key={i}
        className="h-4 w-full rounded bg-zinc-200/80 animate-pulse dark:bg-white/10"
      />
    ))}
  </div>
);

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
    enabled: isOpen && !!report?.novelId && report?.scope === 0,
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
    enabled: isOpen && !!report?.chapterId && report?.scope === 1,
  });

  const {
    data: commentData,
    isLoading: isCommentLoading,
    error: commentError,
  } = useQuery({
    queryKey: ["Comment", report?.commentId],
    queryFn: () =>
      report?.commentId
        ? GetCommentById(report.commentId).then((res) => res.data)
        : Promise.reject("No comment ID"),
    enabled:
      isOpen &&
      !!report?.commentId &&
      report?.scope === 2 &&
      !report?.isTargetDisappear,
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
    enabled:
      isOpen &&
      !!report?.forumPostId &&
      report?.scope === 3 &&
      !report?.isTargetDisappear,
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
    enabled:
      isOpen &&
      !!report?.forumCommentId &&
      report?.scope === 4 &&
      !report?.isTargetDisappear,
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
      if (!deleteResult.success)
        throw new Error(deleteResult.message || "Delete failed");
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
        navigate(`/admin/users`);
        break;
      case 0:
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

  const scopeLabel = useMemo(() => {
    if (!report) return "";
    return report.scope === 5
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
      : `Loại ${report.scope}`;
  }, [report]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="rdp"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm grid place-items-center p-4"
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 12, opacity: 0 }}
            className="w-full max-w-3xl overflow-hidden rounded-2xl ring-1 ring-zinc-200 bg-white/98 text-zinc-900 shadow-2xl backdrop-blur dark:ring-white/12 dark:bg-[#0b0f15]/98 dark:text-zinc-100"
          >
            <div className="flex items-center justify-between gap-3 px-5 py-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                  <h2 className="text-base md:text-lg font-semibold">
                    Chi tiết báo cáo
                  </h2>
                </div>
              </div>
              <button
                onClick={onClose}
                className="h-9 w-9 grid place-items-center rounded-xl text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/60 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-zinc-200 dark:focus-visible:ring-white/20"
                aria-label="Đóng"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <div className="h-px w-full bg-zinc-200/90 dark:bg-white/12" />

            <div className="max-h-[75vh] overflow-auto px-5 py-4 space-y-4">
              {isReportLoading ? (
                <Section title="Đang tải dữ liệu">
                  <Skeleton rows={6} />
                </Section>
              ) : reportError || !report ? (
                <Section
                  title="Không thể tải báo cáo"
                  icon={<ShieldAlert className="w-4 h-4 text-rose-500" />}
                >
                  <p className="text-sm text-rose-600 dark:text-rose-300">
                    Đã xảy ra lỗi khi tải dữ liệu.
                  </p>
                </Section>
              ) : (
                <>
                  <Section
                    title="Thông tin báo cáo"
                    icon={<Info className="w-4 h-4" />}
                  >
                    <Row
                      icon={<UserRound className="w-4 h-4" />}
                      label="Người báo cáo"
                      value={
                        isUserLoading
                          ? "Đang tải…"
                          : userError || !userData
                          ? "Không rõ"
                          : `${userData.userName} (${
                              userData.displayName ?? "—"
                            })`
                      }
                    />
                    <Row
                      icon={<Tag className="w-4 h-4" />}
                      label="Loại"
                      value={<Chip tone="neutral">{scopeLabel}</Chip>}
                    />
                    <Row
                      icon={<MessageSquare className="w-4 h-4" />}
                      label="Lý do"
                      value={
                        ReportReasonLabel[report.reason] || "Không có lý do"
                      }
                    />
                    <Row
                      icon={<FileText className="w-4 h-4" />}
                      label="Trạng thái"
                      value={
                        report.status === 0 ? (
                          <Chip tone="warn">Đang xử lý</Chip>
                        ) : report.status === 1 ? (
                          <Chip tone="success">Đã giải quyết</Chip>
                        ) : report.status === 3 ? (
                          <Chip tone="neutral">Bỏ qua</Chip>
                        ) : (
                          <Chip tone="danger">Bị từ chối</Chip>
                        )
                      }
                    />
                    <Row
                      icon={<CalendarClock className="w-4 h-4" />}
                      label="Ngày tạo"
                      value={formatVietnamTimeFromTicks(report.createdAt)}
                    />
                    <Row
                      icon={<CalendarClock className="w-4 h-4" />}
                      label="Ngày xử lý"
                      value={
                        report.moderatedAt
                          ? formatVietnamTimeFromTicks(report.moderatedAt)
                          : "Chưa xử lý"
                      }
                    />
                  </Section>

                  <Section
                    title="Thông tin đối tượng"
                    icon={<Tag className="w-4 h-4" />}
                  >
                    {report.isTargetDisappear ? (
                      <p className="text-sm text-rose-600 dark:text-rose-300">
                        Đối tượng đã bị xóa
                      </p>
                    ) : report.scope === 5 ? (
                      isUserLoading || isMemberLoading ? (
                        <Skeleton rows={3} />
                      ) : memberError || !memberData ? (
                        <p className="text-sm text-rose-600 dark:text-rose-300">
                          Không thể lấy thông tin người dùng
                        </p>
                      ) : (
                        <>
                          <Row
                            label="Người bị báo cáo"
                            value={`${memberData.userName} (${memberData.displayName})`}
                          />
                          <Row
                            label="Email"
                            value={memberData.email || "Không có"}
                          />
                          <Row label="Vai trò" value={memberData.role} />
                        </>
                      )
                    ) : report.scope === 0 ? (
                      isNovelLoading ? (
                        <Skeleton rows={3} />
                      ) : novelError || !novelData?.data ? (
                        <p className="text-sm text-rose-600 dark:text-rose-300">
                          Không thể lấy tiểu thuyết
                        </p>
                      ) : (
                        <>
                          <Row
                            label="Tiêu đề"
                            value={novelData.data.novelInfo.title}
                          />
                          <Row
                            label="Giá"
                            value={
                              novelData.data.novelInfo.price === 0
                                ? "Miễn phí"
                                : `${novelData.data.novelInfo.price} xu`
                            }
                          />
                          <Row
                            label="Trạng thái"
                            value={
                              novelData.data.novelInfo.status === 1
                                ? "Hoàn thành"
                                : "Đang tiến hành"
                            }
                          />
                        </>
                      )
                    ) : report.scope === 1 ? (
                      isChapterLoading ? (
                        <Skeleton rows={2} />
                      ) : chapterError || !chapterData?.data ? (
                        <p className="text-sm text-rose-600 dark:text-rose-300">
                          Không thể lấy chương
                        </p>
                      ) : (
                        <>
                          <Row
                            label="Tiêu đề"
                            value={chapterData.data.chapter.title}
                          />
                          <Row
                            label="Giá"
                            value={`${chapterData.data.chapter.price || 0} xu`}
                          />
                        </>
                      )
                    ) : report.scope === 2 ? (
                      isCommentLoading ? (
                        <Skeleton rows={2} />
                      ) : commentError || !commentData?.data ? (
                        <p className="text-sm text-rose-600 dark:text-rose-300">
                          Không thể tải bình luận:{" "}
                          {commentError?.message || "Dữ liệu không hợp lệ"}
                        </p>
                      ) : (
                        <>
                          <Row
                            label="Nội dung"
                            value={
                              commentData.data.content || "Không có nội dung"
                            }
                          />
                          <Row
                            label="Người bình luận"
                            value={
                              commentData.data.author?.username || "Không rõ"
                            }
                          />
                          <div className="pt-1">
                            <button
                              onClick={() =>
                                setDeleteTarget({
                                  type: "comment",
                                  id: commentData.data.id,
                                })
                              }
                              className="inline-flex items-center gap-2 h-9 px-3 rounded-xl text-sm font-medium bg-rose-600/90 hover:bg-rose-600 text-white"
                            >
                              Xóa bình luận
                            </button>
                          </div>
                        </>
                      )
                    ) : report.scope === 3 ? (
                      isForumPostLoading ? (
                        <Skeleton rows={3} />
                      ) : forumPostsError || !postsData?.data ? (
                        <p className="text-sm text-rose-600 dark:text-rose-300">
                          Không thể tải bài viết
                        </p>
                      ) : (
                        <>
                          <Row label="Tiêu đề" value={postsData.data.title} />
                          <Row
                            label="Nội dung"
                            value={postsData.data.content}
                          />
                          <Row
                            label="Người đăng"
                            value={postsData.data.author.username}
                          />
                          <div className="pt-1">
                            <button
                              onClick={() =>
                                setDeleteTarget({
                                  type: "forumPost",
                                  id: postsData.data.id,
                                })
                              }
                              className="inline-flex items-center gap-2 h-9 px-3 rounded-xl text-sm font-medium bg-rose-600/90 hover:bg-rose-600 text-white"
                            >
                              Xóa bài viết
                            </button>
                          </div>
                        </>
                      )
                    ) : report.scope === 4 ? (
                      isForumPostCommentLoading ? (
                        <Skeleton rows={2} />
                      ) : forumPostCommentsError || !forumCommentsData?.data ? (
                        <p className="text-sm text-rose-600 dark:text-rose-300">
                          Không thể tải bình luận
                        </p>
                      ) : (
                        <>
                          <Row
                            label="Nội dung"
                            value={forumCommentsData.data.content}
                          />
                          <Row
                            label="Người bình luận"
                            value={forumCommentsData.data.author.username}
                          />
                          <div className="pt-1">
                            <button
                              onClick={() =>
                                setDeleteTarget({
                                  type: "forumComment",
                                  id: forumCommentsData.data.id,
                                })
                              }
                              className="inline-flex items-center gap-2 h-9 px-3 rounded-xl text-sm font-medium bg-rose-600/90 hover:bg-rose-600 text-white"
                            >
                              Xóa bình luận
                            </button>
                          </div>
                        </>
                      )
                    ) : (
                      <p className="text-sm text-zinc-600 dark:text-zinc-300">
                        Chưa có thông tin
                      </p>
                    )}
                  </Section>

                  {report.moderator && (
                    <Section
                      title="Người xử lý"
                      icon={<UserRound className="w-4 h-4" />}
                    >
                      <Row
                        label="Người xử lý"
                        value={`${report.moderator.username} (${report.moderator.displayName})`}
                      />
                      <Row
                        label="Thời điểm"
                        value={formatVietnamTimeFromTicks(report.moderatedAt!)}
                      />
                      <Row
                        label="Ghi chú"
                        value={report.moderatorNote || "—"}
                      />
                    </Section>
                  )}

                  <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
                    {(report.scope === 5 ||
                      report.scope === 0 ||
                      report.scope === 1) &&
                      !report.moderator &&
                      !report.isTargetDisappear && (
                        <button
                          onClick={handleNavigate}
                          className="h-9 px-3 rounded-xl text-sm font-medium bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
                        >
                          Chuyển đến trang quản lý
                        </button>
                      )}
                    {!!deleteTarget && !report.isTargetDisappear && (
                      <button
                        onClick={() => setIsConfirmOpen(true)}
                        className="h-9 px-3 rounded-xl text-sm font-medium bg-rose-600/90 hover:bg-rose-600 text-white"
                      >
                        Xoá đối tượng
                      </button>
                    )}
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
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReportDetailPopup;
