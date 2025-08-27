// ReportList.tsx
import { useState, useMemo } from "react";
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
import { useToast } from "../../../context/ToastContext/toast-context";

const kAvatar = (name?: string) =>
  (name ?? "??").trim().slice(0, 2).toUpperCase();

const STATUS_STYLE = (s: number) => {
  switch (s) {
    case 0:
      return "bg-yellow-200/80 text-yellow-900 ring-1 ring-yellow-700/10 dark:bg-yellow-700/40 dark:text-yellow-100 dark:ring-yellow-300/20";
    case 1:
      return "bg-blue-200/80 text-blue-900 ring-1 ring-blue-700/10 dark:bg-blue-700/40 dark:text-blue-100 dark:ring-blue-300/20";
    case 2:
      return "bg-red-200/80 text-red-900 ring-1 ring-red-700/10 dark:bg-red-700/40 dark:text-red-100 dark:ring-red-300/20";
    case 3:
      return "bg-zinc-200/70 text-zinc-800 ring-1 ring-zinc-500/10 dark:bg-slate-700/50 dark:text-slate-100 dark:ring-slate-400/20";
    default:
      return "bg-zinc-200/70 text-zinc-900 ring-1 ring-black/5 dark:bg-zinc-800/60 dark:text-zinc-100 dark:ring-white/10";
  }
};

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

  const toast = useToast();

  const {
    data: reportsData,
    isLoading,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["Reports", currentPage],
    queryFn: () =>
      GetReports({ limit: 10, page: 0 }).then((res) => res.data.data),
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({
      reportId,
      request,
    }: {
      reportId: string;
      request: UpdateActionRequest;
    }) => UpdateReportStatus(reportId, request).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Reports"] });
      setDialog({ open: false, reportId: null, action: null });
    },
    onError: () => {
      toast?.onOpen("Cập nhật trạng thái thất bại! Vui lòng thử lại.");
      setDialog({ open: false, reportId: null, action: null });
    },
  });

  const filteredReports = useMemo(() => {
    const source = reportsData?.reports || [];
    const term = searchTerm.trim().toLowerCase();
    return source.filter((report: Report) => {
      const matchesSearch =
        term.length === 0 ||
        report.chapterTitle?.toLowerCase().includes(term) ||
        report.reporter.displayName?.toLowerCase().includes(term) ||
        report.commentAuthor?.displayName?.toLowerCase().includes(term) ||
        report.novelTitle?.toLowerCase().includes(term) ||
        report.forumPostAuthor?.displayName?.toLowerCase().includes(term) ||
        report.targetUserId?.toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === "All" || report.status === Number(statusFilter);
      const matchesType =
        typeFilter === "All" || report.scope === Number(typeFilter);

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [reportsData, searchTerm, statusFilter, typeFilter]);

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const paginatedReports = useMemo(
    () =>
      filteredReports.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      ),
    [filteredReports, currentPage]
  );

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };
  const handleStatusFilter = (value: ReportStatus | "All") => {
    setStatusFilter(value);
    setCurrentPage(1);
  };
  const handleTypeFilter = (value: ReportTypeStatus | "All") => {
    setTypeFilter(value);
    setCurrentPage(1);
  };

  const handleSubmitAction = (reportId: string, data: UpdateActionRequest) => {
    updateStatusMutation.mutate({ reportId, request: data });
  };

  const confirmAction = () => {
    if (dialog.reportId && dialog.action) {
    }
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

  const columns = [
    {
      key: "userId",
      header: "Người báo cáo",
      width: "17.5%",
      render: (report: Report) => (
        <div className="flex items-center gap-2 min-w-0">
          <div className="size-8 rounded-full bg-gradient-to-br from-orange-400/70 to-pink-500/70 text-white grid place-items-center text-xs font-bold">
            {kAvatar(report.reporter.username)}
          </div>
          <div className="min-w-0">
            <div className="font-medium truncate">
              {report.reporter.username}
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
              {report.reporter.displayName}
            </div>
          </div>
        </div>
      ),
      nowrap: true,
    },
    {
      key: "target",
      header: "Đối tượng",
      width: "25%",
      render: (report: Report) => {
        switch (report.scope) {
          case 0:
            return (
              <span className="line-clamp-1">
                {report.novelTitle ?? "Không rõ"}
              </span>
            );
          case 1:
            return (
              <span className="line-clamp-1">
                {report.chapterTitle ?? "Không rõ"}
              </span>
            );
          case 2: {
            const authorName = report.commentAuthor?.displayName;
            return (
              <span className="line-clamp-1">
                Bình luận của {authorName ?? "Không rõ"}
              </span>
            );
          }
          case 3:
            return (
              <span className="line-clamp-1">
                {report.forumPostAuthor?.displayName ?? "Bài viết diễn đàn"}
              </span>
            );
          case 4:
            return (
              <span className="line-clamp-1">
                {report.forumPostAuthor?.displayName ?? "Bình luận diễn đàn"}
              </span>
            );
          default:
            return "-";
        }
      },
    },
    {
      key: "type",
      header: "Loại",
      width: "12.5%",
      center: true,
      nowrap: true,
      render: (report: Report) => (
        <span
          className="flex items-center justify-center w-[90px] h-8 px-2.5 truncate text-xs font-semibold rounded-xl bg-white/80 text-zinc-800 ring-1 ring-zinc-200 dark:bg-white/10 dark:text-zinc-100 dark:ring-white/10 mx-auto"
          title={
            report.scope === 0
              ? "Tiểu thuyết"
              : report.scope === 1
              ? "Chương"
              : report.scope === 2
              ? "Bình luận"
              : report.scope === 3
              ? "Bài viết"
              : report.scope === 4
              ? "BL diễn đàn"
              : "Không xác định"
          }
        >
          {report.scope === 0
            ? "Tiểu thuyết"
            : report.scope === 1
            ? "Chương"
            : report.scope === 2
            ? "Bình luận"
            : report.scope === 3
            ? "Bài viết"
            : report.scope === 4
            ? "BL diễn đàn"
            : "Không xác định"}
        </span>
      ),
    },
    {
      key: "reason",
      header: "Lý do",
      width: "15%",
      render: (report: Report) => (
        <span
          title={ReportReasonLabel[report.reason] || "Không có lý do"}
          className="line-clamp-1"
        >
          {ReportReasonLabel[report.reason] || "Không có lý do"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Trạng thái",
      width: "12.5%",
      center: true,
      render: (report: Report) => (
        <span
          className={[
            "flex items-center justify-center w-[90px] h-8 px-2.5 truncate mx-auto rounded-xl text-xs font-semibold",
            STATUS_STYLE(report.status),
          ].join(" ")}
        >
          {report.status === 0
            ? "Đang xử lý"
            : report.status === 1
            ? "Đã giải quyết"
            : report.status === 2
            ? "Bị từ chối"
            : "Bỏ qua"}
        </span>
      ),
      nowrap: true,
    },
    {
      key: "action",
      header: "Hành động",
      width: "17.5%",
      center: true,
      nowrap: true,
      render: (report: Report) => (
        <div className="grid grid-cols-2 gap-5 items-center">
          <div className="min-w-[60px]">
            {report.status === 0 ? (
              <button
                onClick={() => handleOpenAction(report.id)}
                className="w-full h-8 px-3 rounded-lg text-xs font-bold bg-emerald-600/90 hover:bg-emerald-600 text-white transition"
              >
                Xử lý
              </button>
            ) : null}
          </div>
          <div className="min-w-[60px]">
            <button
              onClick={() => handleOpenDetail(report.id)}
              className="w-full h-8 px-3 rounded-lg text-xs font-bold bg-white/80 text-zinc-800 ring-1 ring-zinc-200 hover:bg-white dark:bg-white/10 dark:text-zinc-100 dark:ring-white/10 dark:hover:bg-white/15 transition"
            >
              Chi tiết
            </button>
          </div>
        </div>
      ),
    },
  ];

  const filters = [
    { label: "Tất cả", value: "All" as const },
    { label: "Đang xử lý", value: ReportStatus.Pending },
    { label: "Đã giải quyết", value: ReportStatus.Resolved },
    { label: "Bị từ chối", value: ReportStatus.Rejected },
    { label: "Bỏ qua", value: ReportStatus.Ignored },
  ];

  return (
    <div className="flex flex-col flex-1 px-4 md:px-6 pt-4 pb-2 bg-white text-gray-900 dark:bg-[#0b0d11] dark:text-white">
      <div className="max-w-[95rem] mx-auto w-full px-4">
        <div className="flex top-0 z-20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="min-h-screen text-zinc-900 dark:text-white"
          >
            <div
              className="fixed inset-0 -z-10 opacity-60 pointer-events-none"
              style={{
                background:
                  "radial-gradient(60rem 28rem at 110% -10%, rgba(255,103,64,0.06), transparent 60%), radial-gradient(56rem 24rem at -20% 40%, rgba(80,120,220,0.08), transparent 60%)",
              }}
            />
            <div className="max-w-screen-2xl mx-auto">
              <div className="mb-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="min-w-0">
                  <h1 className="text-2xl font-bold">Danh sách báo cáo</h1>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Quản trị & xử lý vi phạm trong hệ thống.
                  </p>
                </div>
              </div>

              <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
                <div className="flex-1">
                  <ReportSearchBar onSearch={handleSearch} />
                </div>
                <div>
                  <ReportTypeFilter
                    activeFilter={typeFilter}
                    onFilter={handleTypeFilter}
                  />
                </div>
                <div>
                  <FilterButtons
                    filters={filters}
                    activeFilter={statusFilter}
                    onFilter={handleStatusFilter}
                  />
                </div>
              </div>

              {isLoading ? (
                <div className="rounded-2xl ring-1 ring-zinc-200 bg-white/80 p-8 text-zinc-600 dark:ring-white/10 dark:bg-white/10 dark:text-zinc-300">
                  Loading...
                </div>
              ) : error ? (
                <div className="rounded-2xl ring-1 ring-red-200 bg-red-50 p-8 text-red-600 dark:ring-white/10 dark:bg-red-500/10 dark:text-red-300">
                  Failed to load reports
                </div>
              ) : (
                <>
                  <ReportDataTable
                    data={paginatedReports}
                    columns={columns as any}
                    pageSize={itemsPerPage}
                    dense
                    isBusy={isLoading || isFetching}
                  />

                  <div className="mt-5 flex items-center justify-center gap-3">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                </>
              )}

              <ConfirmModal
                isOpen={dialog.open}
                onCancel={() =>
                  setDialog({ open: false, reportId: null, action: null })
                }
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
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ReportList;
