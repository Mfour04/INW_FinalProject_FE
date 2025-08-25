import { useState } from "react";
import { motion } from "framer-motion";
import ReportSearchBar from "./ReportSearchBar";
import FilterButtons from "../AdminModal/FilterButtons";
import Pagination from "../AdminModal/Pagination";
import ReportDetailPopup from "./ReportDetailPopup";
import ReportTypeFilter from "./ReportTypeFilter";
import { ConfirmModal } from "../../../components/ConfirmModal/ConfirmModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ReportTypeStatus,
  ReportStatus,
  type Report,
  ReportReasonLabel,
  type UpdateActionRequest,
} from "../../../api/Admin/Report/report.type";
import {
  GetReports,
  UpdateReportStatus,
} from "../../../api/Admin/Report/report.api";
import { ReportDataTable } from "./ReportDataTable";
import { ReportActionModal } from "./ReportActionModal";

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
  const [reportActionOpen, setReportActionOpen] = useState<boolean>(false);
  const itemsPerPage = 10;

  const {
    data: reportsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["Reports", currentPage],
    queryFn: () =>
      GetReports({
        limit: 10,
        page: 0,
      }).then((res) => res.data.data),
  });

  // Mutation để cập nhật trạng thái báo cáo
  const updateStatusMutation = useMutation({
    mutationFn: async ({
      reportId,
      request,
    }: {
      reportId: string;
      request: UpdateActionRequest;
    }) => {
      return UpdateReportStatus(reportId, request).then((res) => res.data);
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

  // Gọi API GetNovelById cho tất cả novelId
  // useEffect(() => {
  //   if (!reportsData?.data || isLoading) return;

  //   const fetchNovels = async () => {
  //     setIsNovelsLoading(true);
  //     setNovelsError(null);

  //     try {
  //       const novelIds = Array.from(
  //         new Set(
  //           reportsData.data
  //             .filter(
  //               (report: ReportEntity) =>
  //                 report.novelId && report.novelId !== ""
  //             )
  //             .map((report: ReportEntity) => report.novelId)
  //         )
  //       ) as string[];

  //       const novelsData: { [key: string]: string } = {};
  //       for (const novelId of novelIds) {
  //         try {
  //           const response = await GetNovelById(novelId).then(
  //             (res) => res.data
  //           );
  //           novelsData[novelId] =
  //             response.data?.novelInfo?.title ?? "Không tìm thấy";
  //         } catch (err) {
  //           console.error(`Error fetching novel ${novelId}:`, err);
  //           novelsData[novelId] = "Failed to load novel";
  //         }
  //       }
  //       setNovelsMap(novelsData);
  //     } catch (err) {
  //       console.error("Error fetching novels:", err);
  //       setNovelsError(err instanceof Error ? err : new Error("Unknown error"));
  //     } finally {
  //       setIsNovelsLoading(false);
  //     }
  //   };

  //   fetchNovels();
  // }, [reportsData, isLoading]);

  // // Gọi API GetCommentById cho tất cả commentId
  // useEffect(() => {
  //   if (!reportsData?.data || isLoading) return;

  //   const fetchComments = async () => {
  //     setIsCommentsLoading(true);
  //     setCommentsError(null);

  //     try {
  //       const commentIds = Array.from(
  //         new Set(
  //           reportsData.data
  //             .filter(
  //               (report: ReportEntity) =>
  //                 report.commentId && report.commentId !== ""
  //             )
  //             .map((report: ReportEntity) => report.commentId)
  //         )
  //       ) as string[];

  //       const commentsData: { [key: string]: string } = {};
  //       for (const commentId of commentIds) {
  //         try {
  //           const response = await GetCommentById(commentId).then(
  //             (res) => res.data
  //           );
  //           commentsData[commentId] =
  //             response.data?.content ?? "Không tìm thấy";
  //         } catch (err) {
  //           console.error(`Error fetching comment ${commentId}:`, err);
  //           commentsData[commentId] = "Failed to load comment";
  //         }
  //       }
  //       setCommentsMap(commentsData);
  //     } catch (err) {
  //       console.error("Error fetching comments:", err);
  //       setCommentsError(
  //         err instanceof Error ? err : new Error("Unknown error")
  //       );
  //     } finally {
  //       setIsCommentsLoading(false);
  //     }
  //   };

  //   fetchComments();
  // }, [reportsData, isLoading]);

  // // Gọi API GetChapter cho tất cả chapterId
  // useEffect(() => {
  //   if (!reportsData?.data || isLoading) return;

  //   const fetchChapters = async () => {
  //     setIsChaptersLoading(true);
  //     setChaptersError(null);

  //     try {
  //       const chapterIds = Array.from(
  //         new Set(
  //           reportsData.data
  //             .filter(
  //               (report: ReportEntity) =>
  //                 report.chapterId && report.chapterId !== ""
  //             )
  //             .map((report: ReportEntity) => report.chapterId)
  //         )
  //       ) as string[];

  //       const chaptersData: { [key: string]: string } = {};
  //       for (const chapterId of chapterIds) {
  //         try {
  //           const response = await GetChapter(chapterId).then(
  //             (res) => res.data
  //           );
  //           chaptersData[chapterId] =
  //             response.data?.chapter.title ?? "Không tìm thấy";
  //         } catch (err) {
  //           console.error(`Error fetching chapter ${chapterId}:`, err);
  //           chaptersData[chapterId] = "Failed to load chapter";
  //         }
  //       }
  //       setChaptersMap(chaptersData);
  //     } catch (err) {
  //       console.error("Error fetching chapters:", err);
  //       setChaptersError(
  //         err instanceof Error ? err : new Error("Unknown error")
  //       );
  //     } finally {
  //       setIsChaptersLoading(false);
  //     }
  //   };

  //   fetchChapters();
  // }, [reportsData, isLoading]);

  // // Gọi API GetForumPostById cho tất cả forumPostId
  // useEffect(() => {
  //   if (!reportsData?.data || isLoading) return;

  //   const fetchPosts = async () => {
  //     setIsForumPostsLoading(true);
  //     setForumPostsError(null);

  //     try {
  //       const postIds = Array.from(
  //         new Set(
  //           reportsData.data
  //             .filter(
  //               (report: ReportEntity) =>
  //                 report.forumPostId && report.forumPostId !== ""
  //             )
  //             .map((report: ReportEntity) => report.forumPostId)
  //         )
  //       ) as string[];

  //       const postsData: { [key: string]: string } = {};
  //       for (const postId of postIds) {
  //         try {
  //           const response = await GetForumPostById(postId).then(
  //             (res) => res.data
  //           );
  //           postsData[postId] = response.data?.title ?? "Không tìm thấy";
  //         } catch (err) {
  //           console.error(`Error fetching post ${postId}:`, err);
  //           postsData[postId] = "Failed to load post";
  //         }
  //       }
  //       setForumPostMap(postsData);
  //     } catch (err) {
  //       console.error("Error fetching posts:", err);
  //       setForumPostsError(
  //         err instanceof Error ? err : new Error("Unknown error")
  //       );
  //     } finally {
  //       setIsForumPostsLoading(false);
  //     }
  //   };

  //   fetchPosts();
  // }, [reportsData, isLoading]);

  // // Gọi API GetForumCommentById cho tất cả forumCommentId
  // useEffect(() => {
  //   if (!reportsData?.data || isLoading) return;

  //   const fetchForumComments = async () => {
  //     setIsForumPostCommentsLoading(true);
  //     setForumPostCommentsError(null);

  //     try {
  //       const forumCommentIds = Array.from(
  //         new Set(
  //           reportsData.data
  //             .filter(
  //               (report: ReportEntity) =>
  //                 report.forumCommentId && report.forumCommentId !== ""
  //             )
  //             .map((report: ReportEntity) => report.forumCommentId)
  //         )
  //       ) as string[];

  //       const forumCommentsData: { [key: string]: string } = {};
  //       for (const forumCommentId of forumCommentIds) {
  //         try {
  //           const response = await GetForumCommentById(forumCommentId).then(
  //             (res) => res.data
  //           );
  //           forumCommentsData[forumCommentId] =
  //             response.data?.content ?? "Không tìm thấy";
  //         } catch (err) {
  //           console.error(`Error fetching comment ${forumCommentId}:`, err);
  //           forumCommentsData[forumCommentId] = "Failed to load comment";
  //         }
  //       }
  //       setForumPostCommentMap(forumCommentsData);
  //     } catch (err) {
  //       console.error("Error fetching comments:", err);
  //       setForumPostCommentsError(
  //         err instanceof Error ? err : new Error("Unknown error")
  //       );
  //     } finally {
  //       setIsForumPostCommentsLoading(false);
  //     }
  //   };

  //   fetchForumComments();
  // }, [reportsData, isLoading]);

  const filteredReports = (reportsData?.reports || []).filter(
    (report: Report) => {
      const matchesSearch =
        report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.message.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || report.status === Number(statusFilter);

      const matchesType =
        typeFilter === "All" || report.scope === Number(typeFilter);

      return matchesSearch && matchesStatus && matchesType;
    }
  );

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

  const handleSubmitAction = (reportId: string, data: UpdateActionRequest) => {
    updateStatusMutation.mutate({
      reportId: reportId,
      request: data,
    });
  };

  const confirmAction = () => {
    if (dialog.reportId && dialog.action) {
    } else {
      setDialog({ open: false, reportId: null, action: null });
    }
  };

  const handleCancel = () => {
    setDialog({ open: false, reportId: null, action: null });
  };

  const handleOpenDetail = (reportId: string) => {
    setSelectedReportId(reportId);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedReportId(null);
  };

  const handleOpenAction = (reportId: string) => {
    setReportActionOpen(true);
    setSelectedReportId(reportId);
  };

  const handleCloseAction = () => {
    setReportActionOpen(false);
    setSelectedReportId(null);
  };

  // Cột của ReportDataTable
  // const columns = [
  //   {
  //     key: "userId",
  //     header: "Người báo cáo",
  //     render: (report: ReportEntity) => {
  //       if (isUsersLoading) return <span>Loading...</span>;
  //       if (usersError || !report.userId || !usersMap[report.userId]) {
  //         return <span>Không rõ</span>;
  //       }
  //       return <span>{usersMap[report.userId] ?? "Không rõ"}</span>;
  //     },
  //   },
  //   {
  //     key: "target",
  //     header: "Đối tượng báo cáo",
  //     render: (report: ReportEntity) => {
  //       switch (ReportTypeStatusLabels[report.type]) {
  //         case "UserReport": {
  //           if (isUsersLoading) return <span>Loading...</span>;
  //           if (usersError || !report.memberId || !usersMap[report.memberId]) {
  //             return <span>Không rõ</span>;
  //           }
  //           return <span>{usersMap[report.memberId] ?? "Không rõ"}</span>;
  //         }
  //         case "NovelReport": {
  //           if (isNovelsLoading) return <span>Loading...</span>;
  //           if (novelsError || !report.novelId) return <span>Không rõ</span>;
  //           return <span>{novelsMap[report.novelId] ?? "Không rõ"}</span>;
  //         }
  //         case "ChapterReport": {
  //           if (isChapterLoading) return <span>Loading...</span>;
  //           if (chaptersError || !report.chapterId)
  //             return <span>Không rõ</span>;
  //           return <span>{chaptersMap[report.chapterId] ?? "Không rõ"}</span>;
  //         }
  //         case "CommentReport": {
  //           if (isCommentsLoading) return <span>Loading...</span>;
  //           if (commentsError || !report.commentId)
  //             return <span>Không rõ</span>;
  //           const content = commentsMap[report.commentId] ?? "Không tìm thấy";
  //           return (
  //             <span>
  //               {content.length > 30
  //                 ? content.substring(0, 30) + "..."
  //                 : content}
  //             </span>
  //           );
  //         }
  //         case "ForumPostReport": {
  //           if (isForumPostLoading) return <span>Loading...</span>;
  //           if (forumPostsError || !report.forumPostId)
  //             return <span>Không rõ</span>;
  //           const content =
  //             forumPostMap[report.forumPostId] ?? "Không tìm thấy";
  //           return (
  //             <span>
  //               {content.length > 30
  //                 ? content.substring(0, 30) + "..."
  //                 : content}
  //             </span>
  //           );
  //         }
  //         case "ForumCommentReport": {
  //           if (isForumPostCommentLoading) return <span>Loading...</span>;
  //           if (forumPostCommentsError || !report.forumCommentId)
  //             return <span>Không rõ</span>;
  //           const content =
  //             forumPostCommentMap[report.forumCommentId] ?? "Không tìm thấy";
  //           return (
  //             <span>
  //               {content.length > 30
  //                 ? content.substring(0, 30) + "..."
  //                 : content}
  //             </span>
  //           );
  //         }
  //         default:
  //           return "-";
  //       }
  //     },
  //   },
  //   {
  //     key: "type",
  //     header: "Loại báo cáo",
  //     render: (report: ReportEntity) => {
  //       switch (ReportTypeStatusLabels[report.type]) {
  //         case "UserReport":
  //           return "Người dùng";
  //         case "NovelReport":
  //           return "Tiểu thuyết";
  //         case "ChapterReport":
  //           return "Chương";
  //         case "CommentReport":
  //           return "Bình luận";
  //         case "ForumPostReport":
  //           return "Bài viết diễn đàn";
  //         case "ForumCommentReport":
  //           return "Bình luận diễn đàn";
  //         default:
  //           return `Loại ${report.type}`;
  //       }
  //     },
  //   },
  //   {
  //     key: "reason",
  //     header: "Lý do",
  //     render: (report: ReportEntity) => report.reason || "Không có lý do",
  //   },
  //   {
  //     key: "status",
  //     header: "Trạng thái",
  //     center: true,
  //     render: (report: ReportEntity) => (
  //       <span
  //         className={`px-2 py-1 rounded ${
  //           ReportStatusLabels[report.status] === "Pending"
  //             ? "bg-yellow-200 text-yellow-800 dark:bg-yellow-600 dark:text-yellow-100"
  //             : ReportStatusLabels[report.status] === "Resolved"
  //             ? "bg-green-200 text-green-800 dark:bg-green-600 dark:text-green-100"
  //             : "bg-red-200 text-red-800 dark:bg-red-600 dark:text-red-100"
  //         }`}
  //       >
  //         {ReportStatusLabels[report.status] === "Pending"
  //           ? "Đang xử lý"
  //           : ReportStatusLabels[report.status] === "Resolved"
  //           ? "Đã giải quyết"
  //           : "Bị từ chối"}
  //       </span>
  //     ),
  //   },
  //   {
  //     key: "actions",
  //     header: "Hành động",
  //     center: true,
  //     render: (report: ReportEntity) => (
  //       <div className="flex space-x-2 justify-center">
  //         <button
  //           onClick={() => handleOpenDetail(report.id)}
  //           className="text-[#ff4d4f] dark:text-[#ff6740] hover:underline"
  //         >
  //           Chi tiết
  //         </button>
  //         {ReportStatusLabels[report.status] === "Pending" && (
  //           <>
  //             <button
  //               // onClick={() => handleAction(report.id, "resolve")}
  //               className="text-green-600 dark:text-green-400 hover:underline"
  //             >
  //               Giải quyết
  //             </button>
  //             <button
  //               // onClick={() => handleAction(report.id, "reject")}
  //               className="text-red-600 dark:text-red-400 hover:underline"
  //             >
  //               Từ chối
  //             </button>
  //           </>
  //         )}
  //       </div>
  //     ),
  //   },
  // ];

  const columns = [
    {
      key: "userId",
      header: "Người báo cáo",
      render: (report: Report) => {
        return <span>{report.reporter.username}</span>;
      },
    },
    {
      key: "target",
      header: "Đối tượng báo cáo",
      render: (report: Report) => {
        return <span>{report.reporter.displayName}</span>;
        // switch (report.scope) {
        //   // case 0: {
        //   //   return <span>{report.moderator.username ?? "Không rõ"}</span>;
        //   // }
        //   case 0: {
        //     if (isNovelsLoading) return <span>Loading...</span>;
        //     if (novelsError || !report.novelId) return <span>Không rõ</span>;
        //     return <span>{novelsMap[report.novelId] ?? "Không rõ"}</span>;
        //   }
        //   case "ChapterReport": {
        //     if (isChapterLoading) return <span>Loading...</span>;
        //     if (chaptersError || !report.chapterId)
        //       return <span>Không rõ</span>;
        //     return <span>{chaptersMap[report.chapterId] ?? "Không rõ"}</span>;
        //   }
        //   case "CommentReport": {
        //     if (isCommentsLoading) return <span>Loading...</span>;
        //     if (commentsError || !report.commentId)
        //       return <span>Không rõ</span>;
        //     const content = commentsMap[report.commentId] ?? "Không tìm thấy";
        //     return (
        //       <span>
        //         {content.length > 30
        //           ? content.substring(0, 30) + "..."
        //           : content}
        //       </span>
        //     );
        //   }
        //   case "ForumPostReport": {
        //     if (isForumPostLoading) return <span>Loading...</span>;
        //     if (forumPostsError || !report.forumPostId)
        //       return <span>Không rõ</span>;
        //     const content =
        //       forumPostMap[report.forumPostId] ?? "Không tìm thấy";
        //     return (
        //       <span>
        //         {content.length > 30
        //           ? content.substring(0, 30) + "..."
        //           : content}
        //       </span>
        //     );
        //   }
        //   case "ForumCommentReport": {
        //     if (isForumPostCommentLoading) return <span>Loading...</span>;
        //     if (forumPostCommentsError || !report.forumCommentId)
        //       return <span>Không rõ</span>;
        //     const content =
        //       forumPostCommentMap[report.forumCommentId] ?? "Không tìm thấy";
        //     return (
        //       <span>
        //         {content.length > 30
        //           ? content.substring(0, 30) + "..."
        //           : content}
        //       </span>
        //     );
        //   }
        //   default:
        //     return "-";
        // }
      },
      center: true,
    },
    {
      key: "type",
      header: "Loại báo cáo",
      render: (report: Report) => {
        switch (report.scope) {
          case 0:
            return "Tiểu thuyết";
          case 1:
            return "Chương truyện";
          case 2:
            return "Bình luận";
          case 3:
            return "Bài viết diễn đàn";
          case 4:
            return "Bình luận diễn đàn";
          default:
            return `Không xác định`;
        }
      },
    },
    {
      key: "reason",
      header: "Lý do",
      render: (report: Report) =>
        ReportReasonLabel[report.reason] || "Không có lý do",
    },
    {
      key: "status",
      header: "Trạng thái",
      render: (report: Report) => (
        <span
          className={`px-2 py-1 rounded ${
            report.status === 0
              ? "bg-yellow-200 text-yellow-800 dark:bg-yellow-600 dark:text-yellow-100"
              : report.status === 1
              ? "bg-green-200 text-green-800 dark:bg-green-600 dark:text-green-100"
              : "bg-red-200 text-red-800 dark:bg-red-600 dark:text-red-100"
          }`}
        >
          {report.status === 0
            ? "Đang xử lý"
            : report.status === 1
            ? "Đã giải quyết"
            : "Bị từ chối"}
        </span>
      ),
    },
    {
      key: "action",
      header: "Hành động",
      render: (report: Report) => (
        <div className="flex space-x-2 justify-center">
          <button
            onClick={() => handleOpenDetail(report.id)}
            className="text-[#ff4d4f] dark:text-[#ff6740] hover:underline"
          >
            Chi tiết
          </button>
          {report.status === 0 && (
            <button
              onClick={() => handleOpenAction(report.id)}
              className="text-green-600 dark:text-green-400 hover:underline"
            >
              Xử lý
            </button>
          )}
        </div>
      ),
    },
  ];

  // Filters cho FilterButtons
  const filters = [
    { label: "Tất cả", value: "All" as const },
    { label: "Đang xử lý", value: ReportStatus.Pending },
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

      <ReportActionModal
        reportId={selectedReportId!}
        isOpen={reportActionOpen}
        onClose={handleCloseAction}
        onSubmit={handleSubmitAction}
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
