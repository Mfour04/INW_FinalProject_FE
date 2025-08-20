import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ReportSearchBar from "./ReportSearchBar";
import FilterButtons from "../AdminModal/FilterButtons";
import ReportDataTable from "./ReportDataTable";
import Pagination from "../AdminModal/Pagination";
import ReportDetailPopup from "./ReportDetailPopup";
import ReportTypeFilter from "./ReportTypeFilter";
import { ConfirmModal } from "../../../components/ConfirmModal/ConfirmModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ReportTypeStatus,
  ReportTypeStatusLabels,
  ReportStatus,
  ReportStatusLabels,
} from "../../../api/Admin/Report/report.type";
import {
  GetReports,
  UpdateReportStatus,
} from "../../../api/Admin/Report/report.api";
import type { ReportEntity } from "../../../api/Admin/Report/report.type";
import { GetNovelById } from "../../../api/Novels/novel.api";
import { GetCommentById } from "../../../api/Comment/comment.api";
import { GetChapter } from "../../../api/Chapters/chapter.api";
import { GetForumPostById } from "../../../api/Admin/Forum/forum.api";
import { GetForumCommentById } from "../../../api/Admin/ForumComment/forumComment.api";
import type { User } from "../../../api/Admin/User/user.type";
import { GetUserById } from "../../../api/Admin/User/user.api";

const ReportList = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ReportStatus | "All">("All");
  const [typeFilter, setTypeFilter] = useState<ReportTypeStatus | "All">("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [dialog, setDialog] = useState<{
    open: boolean;
    reportId: string | null;
    action: "resolve" | "reject" | null;
  }>({ open: false, reportId: null, action: null });
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [usersMap, setUsersMap] = useState<{ [key: string]: string }>({});
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState<Error | null>(null);
  const [novelsMap, setNovelsMap] = useState<{ [key: string]: string }>({});
  const [isNovelsLoading, setIsNovelsLoading] = useState(false);
  const [novelsError, setNovelsError] = useState<Error | null>(null);
  const [commentsMap, setCommentsMap] = useState<{ [key: string]: string }>({});
  const [isCommentsLoading, setIsCommentsLoading] = useState(false);
  const [commentsError, setCommentsError] = useState<Error | null>(null);
  const [chaptersMap, setChaptersMap] = useState<{ [key: string]: string }>({});
  const [isChapterLoading, setIsChaptersLoading] = useState(false);
  const [chaptersError, setChaptersError] = useState<Error | null>(null);
  const [forumPostMap, setForumPostMap] = useState<{ [key: string]: string }>(
    {}
  );
  const [isForumPostLoading, setIsForumPostsLoading] = useState(false);
  const [forumPostsError, setForumPostsError] = useState<Error | null>(null);
  const [forumPostCommentMap, setForumPostCommentMap] = useState<{
    [key: string]: string;
  }>({});
  const [isForumPostCommentLoading, setIsForumPostCommentsLoading] =
    useState(false);
  const [forumPostCommentsError, setForumPostCommentsError] =
    useState<Error | null>(null);
  const itemsPerPage = 10;

  // API cho danh sách báo cáo
  const {
    data: reportsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["Reports", currentPage],
    queryFn: () =>
      GetReports(currentPage - 1, itemsPerPage).then((res) => res.data),
  });

  // Mutation để cập nhật trạng thái báo cáo
  const updateStatusMutation = useMutation({
    mutationFn: async ({
      reportId,
      status,
    }: {
      reportId: string;
      status: ReportStatus;
    }) => {
      return UpdateReportStatus(reportId, status).then((res) => res.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Reports"] });
      setDialog({ open: false, reportId: null, action: null });
    },
    onError: (err) => {
      console.error("Update status error:", err);
      alert("Cập nhật trạng thái thất bại! Vui lòng thử lại.");
      setDialog({ open: false, reportId: null, action: null });
    },
  });

  // Gọi API GetUserById cho tất cả userId và memberId
  useEffect(() => {
    if (!reportsData?.data || isLoading) return;

    const fetchUsers = async () => {
      setIsUsersLoading(true);
      setUsersError(null);

      try {
        const userIds = Array.from(
          new Set(
            reportsData.data
              .flatMap((report: ReportEntity) => [
                report.userId,
                report.memberId,
              ])
              .filter(
                (id): id is string => typeof id === "string" && id.trim() !== ""
              )
          )
        );

        const usersData: { [key: string]: string } = {};
        for (const userId of userIds) {
          try {
            const response = await GetUserById(userId).then((res) => res.data);
            usersData[userId] = response.displayName ?? "Không tìm thấy";
          } catch (err) {
            console.error(`Lỗi khi lấy thông tin người dùng ${userId}:`, {});
            usersData[userId] = "Không tìm thấy";
          }
        }
        setUsersMap(usersData);
      } catch (err) {
        console.error("Lỗi khi tải danh sách người dùng:", err);
        setUsersError(
          err instanceof Error ? err : new Error("Lỗi không xác định")
        );
      } finally {
        setIsUsersLoading(false);
      }
    };

    fetchUsers();
  }, [reportsData, isLoading]);

  // Gọi API GetNovelById cho tất cả novelId
  useEffect(() => {
    if (!reportsData?.data || isLoading) return;

    const fetchNovels = async () => {
      setIsNovelsLoading(true);
      setNovelsError(null);

      try {
        const novelIds = Array.from(
          new Set(
            reportsData.data
              .filter(
                (report: ReportEntity) =>
                  report.novelId && report.novelId !== ""
              )
              .map((report: ReportEntity) => report.novelId)
          )
        ) as string[];

        const novelsData: { [key: string]: string } = {};
        for (const novelId of novelIds) {
          try {
            const response = await GetNovelById(novelId).then(
              (res) => res.data
            );
            novelsData[novelId] =
              response.data?.novelInfo?.title ?? "Không tìm thấy";
          } catch (err) {
            console.error(`Error fetching novel ${novelId}:`, err);
            novelsData[novelId] = "Failed to load novel";
          }
        }
        setNovelsMap(novelsData);
      } catch (err) {
        console.error("Error fetching novels:", err);
        setNovelsError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        setIsNovelsLoading(false);
      }
    };

    fetchNovels();
  }, [reportsData, isLoading]);

  // Gọi API GetCommentById cho tất cả commentId
  useEffect(() => {
    if (!reportsData?.data || isLoading) return;

    const fetchComments = async () => {
      setIsCommentsLoading(true);
      setCommentsError(null);

      try {
        const commentIds = Array.from(
          new Set(
            reportsData.data
              .filter(
                (report: ReportEntity) =>
                  report.commentId && report.commentId !== ""
              )
              .map((report: ReportEntity) => report.commentId)
          )
        ) as string[];

        const commentsData: { [key: string]: string } = {};
        for (const commentId of commentIds) {
          try {
            const response = await GetCommentById(commentId).then(
              (res) => res.data
            );
            commentsData[commentId] =
              response.data?.content ?? "Không tìm thấy";
          } catch (err) {
            console.error(`Error fetching comment ${commentId}:`, err);
            commentsData[commentId] = "Failed to load comment";
          }
        }
        setCommentsMap(commentsData);
      } catch (err) {
        console.error("Error fetching comments:", err);
        setCommentsError(
          err instanceof Error ? err : new Error("Unknown error")
        );
      } finally {
        setIsCommentsLoading(false);
      }
    };

    fetchComments();
  }, [reportsData, isLoading]);

  // Gọi API GetChapter cho tất cả chapterId
  useEffect(() => {
    if (!reportsData?.data || isLoading) return;

    const fetchChapters = async () => {
      setIsChaptersLoading(true);
      setChaptersError(null);

      try {
        const chapterIds = Array.from(
          new Set(
            reportsData.data
              .filter(
                (report: ReportEntity) =>
                  report.chapterId && report.chapterId !== ""
              )
              .map((report: ReportEntity) => report.chapterId)
          )
        ) as string[];

        const chaptersData: { [key: string]: string } = {};
        for (const chapterId of chapterIds) {
          try {
            const response = await GetChapter(chapterId).then(
              (res) => res.data
            );
            chaptersData[chapterId] =
              response.data?.chapter.title ?? "Không tìm thấy";
          } catch (err) {
            console.error(`Error fetching chapter ${chapterId}:`, err);
            chaptersData[chapterId] = "Failed to load chapter";
          }
        }
        setChaptersMap(chaptersData);
      } catch (err) {
        console.error("Error fetching chapters:", err);
        setChaptersError(
          err instanceof Error ? err : new Error("Unknown error")
        );
      } finally {
        setIsChaptersLoading(false);
      }
    };

    fetchChapters();
  }, [reportsData, isLoading]);

  // Gọi API GetForumPostById cho tất cả forumPostId
  useEffect(() => {
    if (!reportsData?.data || isLoading) return;

    const fetchPosts = async () => {
      setIsForumPostsLoading(true);
      setForumPostsError(null);

      try {
        const postIds = Array.from(
          new Set(
            reportsData.data
              .filter(
                (report: ReportEntity) =>
                  report.forumPostId && report.forumPostId !== ""
              )
              .map((report: ReportEntity) => report.forumPostId)
          )
        ) as string[];

        const postsData: { [key: string]: string } = {};
        for (const postId of postIds) {
          try {
            const response = await GetForumPostById(postId).then(
              (res) => res.data
            );
            postsData[postId] = response.data?.title ?? "Không tìm thấy";
          } catch (err) {
            console.error(`Error fetching post ${postId}:`, err);
            postsData[postId] = "Failed to load post";
          }
        }
        setForumPostMap(postsData);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setForumPostsError(
          err instanceof Error ? err : new Error("Unknown error")
        );
      } finally {
        setIsForumPostsLoading(false);
      }
    };

    fetchPosts();
  }, [reportsData, isLoading]);

  // Gọi API GetForumCommentById cho tất cả forumCommentId
  useEffect(() => {
    if (!reportsData?.data || isLoading) return;

    const fetchForumComments = async () => {
      setIsForumPostCommentsLoading(true);
      setForumPostCommentsError(null);

      try {
        const forumCommentIds = Array.from(
          new Set(
            reportsData.data
              .filter(
                (report: ReportEntity) =>
                  report.forumCommentId && report.forumCommentId !== ""
              )
              .map((report: ReportEntity) => report.forumCommentId)
          )
        ) as string[];

        const forumCommentsData: { [key: string]: string } = {};
        for (const forumCommentId of forumCommentIds) {
          try {
            const response = await GetForumCommentById(forumCommentId).then(
              (res) => res.data
            );
            forumCommentsData[forumCommentId] =
              response.data?.content ?? "Không tìm thấy";
          } catch (err) {
            console.error(`Error fetching comment ${forumCommentId}:`, err);
            forumCommentsData[forumCommentId] = "Failed to load comment";
          }
        }
        setForumPostCommentMap(forumCommentsData);
      } catch (err) {
        console.error("Error fetching comments:", err);
        setForumPostCommentsError(
          err instanceof Error ? err : new Error("Unknown error")
        );
      } finally {
        setIsForumPostCommentsLoading(false);
      }
    };

    fetchForumComments();
  }, [reportsData, isLoading]);

  // Lọc báo cáo theo tìm kiếm, trạng thái và loại báo cáo
  const filteredReports = (reportsData?.data || []).filter(
    (report: ReportEntity) => {
      const matchesSearch =
        report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (report.reason &&
          report.reason.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus =
        statusFilter === "All" || report.status === statusFilter;
      const matchesType = typeFilter === "All" || report.type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    }
  );

  // Phân trang
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Xử lý tìm kiếm
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  // Xử lý lọc trạng thái
  const handleStatusFilter = (value: ReportStatus | "All") => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  // Xử lý lọc loại báo cáo
  const handleTypeFilter = (value: ReportTypeStatus | "All") => {
    setTypeFilter(value);
    setCurrentPage(1);
  };

  // Xử lý hành động Resolve/Reject
  const handleAction = (reportId: string, action: "resolve" | "reject") => {
    const report = reportsData?.data.find(
      (r: ReportEntity) => r.id === reportId
    );
    if (!report || report.status !== ReportStatus.InProgress) {
      alert("Báo cáo không ở trạng thái Đang xử lý!");
      return;
    }
    setDialog({ open: true, reportId, action });
  };

  // Xử lý xác nhận hành động
  const confirmAction = () => {
    if (dialog.reportId && dialog.action) {
      const status =
        dialog.action === "resolve"
          ? ReportStatus.Resolved
          : ReportStatus.Rejected;
      updateStatusMutation.mutate({ reportId: dialog.reportId, status });
    } else {
      setDialog({ open: false, reportId: null, action: null });
    }
  };

  // Xử lý đóng modal
  const handleCancel = () => {
    setDialog({ open: false, reportId: null, action: null });
  };

  // Xử lý mở pop-up chi tiết
  const handleOpenDetail = (reportId: string) => {
    setSelectedReportId(reportId);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedReportId(null);
  };

  // Cột của ReportDataTable
  const columns = [
    {
      key: "userId",
      header: "Người báo cáo",
      render: (report: ReportEntity) => {
        if (isUsersLoading) return <span>Loading...</span>;
        if (usersError || !report.userId || !usersMap[report.userId]) {
          return <span>Không rõ</span>;
        }
        return <span>{usersMap[report.userId] ?? "Không rõ"}</span>;
      },
    },
    {
      key: "target",
      header: "Đối tượng báo cáo",
      render: (report: ReportEntity) => {
        switch (ReportTypeStatusLabels[report.type]) {
          case "UserReport": {
            if (isUsersLoading) return <span>Loading...</span>;
            if (usersError || !report.memberId || !usersMap[report.memberId]) {
              return <span>Không rõ</span>;
            }
            return <span>{usersMap[report.memberId] ?? "Không rõ"}</span>;
          }
          case "NovelReport": {
            if (isNovelsLoading) return <span>Loading...</span>;
            if (novelsError || !report.novelId) return <span>Không rõ</span>;
            return <span>{novelsMap[report.novelId] ?? "Không rõ"}</span>;
          }
          case "ChapterReport": {
            if (isChapterLoading) return <span>Loading...</span>;
            if (chaptersError || !report.chapterId)
              return <span>Không rõ</span>;
            return <span>{chaptersMap[report.chapterId] ?? "Không rõ"}</span>;
          }
          case "CommentReport": {
            if (isCommentsLoading) return <span>Loading...</span>;
            if (commentsError || !report.commentId)
              return <span>Không rõ</span>;
            const content = commentsMap[report.commentId] ?? "Không tìm thấy";
            return (
              <span>
                {content.length > 30
                  ? content.substring(0, 30) + "..."
                  : content}
              </span>
            );
          }
          case "ForumPostReport": {
            if (isForumPostLoading) return <span>Loading...</span>;
            if (forumPostsError || !report.forumPostId)
              return <span>Không rõ</span>;
            const content =
              forumPostMap[report.forumPostId] ?? "Không tìm thấy";
            return (
              <span>
                {content.length > 30
                  ? content.substring(0, 30) + "..."
                  : content}
              </span>
            );
          }
          case "ForumCommentReport": {
            if (isForumPostCommentLoading) return <span>Loading...</span>;
            if (forumPostCommentsError || !report.forumCommentId)
              return <span>Không rõ</span>;
            const content =
              forumPostCommentMap[report.forumCommentId] ?? "Không tìm thấy";
            return (
              <span>
                {content.length > 30
                  ? content.substring(0, 30) + "..."
                  : content}
              </span>
            );
          }
          default:
            return "-";
        }
      },
    },
    {
      key: "type",
      header: "Loại báo cáo",
      render: (report: ReportEntity) => {
        switch (ReportTypeStatusLabels[report.type]) {
          case "UserReport":
            return "Người dùng";
          case "NovelReport":
            return "Tiểu thuyết";
          case "ChapterReport":
            return "Chương";
          case "CommentReport":
            return "Bình luận";
          case "ForumPostReport":
            return "Bài viết diễn đàn";
          case "ForumCommentReport":
            return "Bình luận diễn đàn";
          default:
            return `Loại ${report.type}`;
        }
      },
    },
    {
      key: "reason",
      header: "Lý do",
      render: (report: ReportEntity) => report.reason || "Không có lý do",
    },
    {
      key: "status",
      header: "Trạng thái",
      center: true,
      render: (report: ReportEntity) => (
        <span
          className={`px-2 py-1 rounded ${
            ReportStatusLabels[report.status] === "InProgress"
              ? "bg-yellow-200 text-yellow-800 dark:bg-yellow-600 dark:text-yellow-100"
              : ReportStatusLabels[report.status] === "Resolved"
              ? "bg-green-200 text-green-800 dark:bg-green-600 dark:text-green-100"
              : "bg-red-200 text-red-800 dark:bg-red-600 dark:text-red-100"
          }`}
        >
          {ReportStatusLabels[report.status] === "InProgress"
            ? "Đang xử lý"
            : ReportStatusLabels[report.status] === "Resolved"
            ? "Đã giải quyết"
            : "Bị từ chối"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Hành động",
      center: true,
      render: (report: ReportEntity) => (
        <div className="flex space-x-2 justify-center">
          <button
            onClick={() => handleOpenDetail(report.id)}
            className="text-[#ff4d4f] dark:text-[#ff6740] hover:underline"
          >
            Chi tiết
          </button>
          {ReportStatusLabels[report.status] === "InProgress" && (
            <>
              <button
                onClick={() => handleAction(report.id, "resolve")}
                className="text-green-600 dark:text-green-400 hover:underline"
              >
                Giải quyết
              </button>
              <button
                onClick={() => handleAction(report.id, "reject")}
                className="text-red-600 dark:text-red-400 hover:underline"
              >
                Từ chối
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  // Filters cho FilterButtons
  const filters = [
    { label: "Tất cả", value: "All" as const },
    { label: "Đang xử lý", value: ReportStatus.InProgress },
    { label: "Đã giải quyết", value: ReportStatus.Resolved },
    { label: "Bị từ chối", value: ReportStatus.Rejected },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="p-6 bg-gray-100 dark:bg-[#0f0f11] min-h-screen text-gray-900 dark:text-white"
    >
      <h1 className="text-2xl font-bold mb-6">Danh sách báo cáo</h1>

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-4 max-w-4xl">
        <div className="w-full sm:w-auto sm:flex-none max-w-xs">
          <ReportSearchBar onSearch={handleSearch} />
        </div>
        <div className="w-full sm:w-auto sm:flex-none max-w-xs">
          <ReportTypeFilter
            activeFilter={typeFilter}
            onFilter={handleTypeFilter}
          />
        </div>
        <div className="w-full sm:w-auto sm:flex-none max-w-fit">
          <FilterButtons
            filters={filters}
            activeFilter={statusFilter}
            onFilter={handleStatusFilter}
          />
        </div>
      </div>

      {isLoading ? (
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      ) : error ? (
        <p className="text-red-600 dark:text-red-400">Failed to load reports</p>
      ) : (
        <>
          <ReportDataTable data={paginatedReports} columns={columns} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      <ConfirmModal
        isOpen={dialog.open}
        onCancel={handleCancel}
        onConfirm={confirmAction}
        title={
          dialog.action === "resolve"
            ? "Xác nhận giải quyết"
            : "Xác nhận từ chối"
        }
        message="Bạn có chắc muốn thực hiện hành động này?"
      />

      <ReportDetailPopup
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
        reportId={selectedReportId}
      />
    </motion.div>
  );
};

export default ReportList;
