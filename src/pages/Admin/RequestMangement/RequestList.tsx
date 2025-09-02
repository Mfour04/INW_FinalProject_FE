import { useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useDarkMode } from "../../../context/ThemeContext/ThemeContext";
import { useToast } from "../../../context/ToastContext/toast-context";
import RequestFilterButtons from "./RequestFilterButton";
import Pagination from "../AdminModal/Pagination";
import ConfirmDialog from "../AdminModal/ConfirmDialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  GetPendingWithdrawRequests,
  UpdateWithdrawRequestStatus,
} from "../../../api/Admin/Request/request.api";
import { GetUserById } from "../../../api/Admin/User/user.api";
import {
  PaymentStatus,
  type WithdrawRequest,
} from "../../../api/Admin/Request/request.type";
import { Search, UserRound, Banknote } from "lucide-react";
import RequestDetailDrawer from "./RequestDetailDrawer";

const itemsPerPage = 100;

const coinPriceTable = [
  { amount: 65, price: 50000 },
  { amount: 130, price: 100000 },
  { amount: 260, price: 200000 },
  { amount: 650, price: 500000 },
  { amount: 1300, price: 1000000 },
  { amount: 2600, price: 2000000 },
];

const toVNDExact = (value: number): number | null => {
  for (const p of coinPriceTable) {
    if (value === p.amount || value === p.price) return p.price;
  }
  return null;
};

const formatDateTimeFromTicks = (ticks: number | string | bigint) => {
  try {
    const bn = BigInt(String(ticks));
    const TICKS_AT_UNIX_EPOCH = 621355968000000000n;
    const ms = Number((bn - TICKS_AT_UNIX_EPOCH) / 10000n);
    const d = new Date(ms);
    return d.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  } catch {
    const n = typeof ticks === "string" ? parseInt(ticks, 10) : Number(ticks);
    const d = new Date(n);
    return d.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  }
};

type UserMini = { displayName: string; username?: string };

const RequestList = () => {
  const { darkMode } = useDarkMode();
  const toast = useToast();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "All">(
    "All"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [usersMap, setUsersMap] = useState<Record<string, UserMini>>({});

  const [dialog, setDialog] = useState<{
    isOpen: boolean;
    type: "approve" | "reject" | null;
    title: string;
    requestId: string | null;
  }>({ isOpen: false, type: null, title: "", requestId: null });

  const [detailFor, setDetailFor] = useState<WithdrawRequest | null>(null);

  const {
    data: requestsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["PendingWithdrawRequests", currentPage],
    queryFn: () =>
      GetPendingWithdrawRequests({
        page: currentPage - 1,
        limit: itemsPerPage,
        sortBy: "created_at:desc",
      }).then((res) => res.data),
  });

  useEffect(() => {
    if (!requestsData?.data || isLoading) return;
    const load = async () => {
      const ids = Array.from(
        new Set(
          (requestsData?.data as WithdrawRequest[])
            .map((r) => r.requesterId)
            .filter(
              (id): id is string => typeof id === "string" && id.trim() !== ""
            )
        )
      );
      const map: Record<string, UserMini> = {};
      for (const id of ids) {
        try {
          const u = await GetUserById(id).then((r) => r.data);
          map[id] = {
            displayName: u.displayName ?? "Không tìm thấy",
            username: u.username ?? u.userName ?? u.handle ?? undefined,
          };
        } catch {
          map[id] = { displayName: "Không tìm thấy" };
        }
      }
      setUsersMap(map);
    };
    load();
  }, [requestsData, isLoading]);

  const updateStatusMutation = useMutation({
    mutationFn: ({
      requestId,
      isApproved,
      message,
    }: {
      requestId: string;
      isApproved: boolean;
      message: string;
    }) =>
      UpdateWithdrawRequestStatus(requestId, { isApproved, message }).then(
        (r) => r.data
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["PendingWithdrawRequests"] });
      setDialog({ isOpen: false, type: null, title: "", requestId: null });
      setDetailFor(null);
      toast?.onOpen({ message: "Cập nhật trạng thái thành công!", variant: "success" });
    },
    onError: (e: any) => {
      toast?.onOpen({ message: e?.message ?? "Cập nhật trạng thái thất bại!", variant: "error" });
    },
  });

  const filteredList: WithdrawRequest[] = useMemo(() => {
    const list: WithdrawRequest[] = requestsData?.data || [];
    const q = searchTerm.trim().toLowerCase();
    return list.filter((r) => {
      const nameMatch =
        r.bankInfo?.bankAccountName?.toLowerCase().includes(q) ||
        (r.requesterId
          ? usersMap[r.requesterId]?.displayName?.toLowerCase().includes(q)
          : false) ||
        (r.requesterId
          ? usersMap[r.requesterId]?.username?.toLowerCase().includes(q)
          : false);
      const statusOk = statusFilter === "All" || r.status === statusFilter;
      return (q.length === 0 || !!nameMatch) && statusOk;
    });
  }, [requestsData, searchTerm, statusFilter, usersMap]);

  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  const pageItems = filteredList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const filters = [
    { label: "Tất cả", value: "All" as const },
    { label: "Đang chờ", value: PaymentStatus.Pending },
    { label: "Đã duyệt", value: PaymentStatus.Completed },
    { label: "Đã từ chối", value: PaymentStatus.Rejected },
  ];

  const openApprove = (id: string) => {
    const r = requestsData?.data.find((x: WithdrawRequest) => x.id === id);
    const name =
      r?.requesterId && usersMap[r.requesterId]
        ? usersMap[r.requesterId].displayName
        : "Người dùng";
    setDialog({
      isOpen: true,
      type: "approve",
      title: `Duyệt yêu cầu của ${name}?`,
      requestId: id,
    });
  };
  const openReject = (id: string) => {
    const r = requestsData?.data.find((x: WithdrawRequest) => x.id === id);
    const name =
      r?.requesterId && usersMap[r.requesterId]
        ? usersMap[r.requesterId].displayName
        : "Người dùng";
    setDialog({
      isOpen: true,
      type: "reject",
      title: `Từ chối yêu cầu của ${name}?`,
      requestId: id,
    });
  };

  return (
    <div className="flex flex-col flex-1 px-4 md:px-6 pt-4 pb-2 bg-white text-gray-900 dark:bg-[#0b0d11] dark:text-white">
      <div className="max-w-[95rem] mx-auto w-full px-4 mb-2">
        <div className="mb-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <h1 className="text-2xl font-bold tracking-tight">
            Danh sách báo cáo
          </h1>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Tìm kiếm..."
                className="w-72 h-9 pl-9 pr-3 rounded-xl bg-white/80 ring-1 ring-zinc-200 dark:bg-zinc-900/60 dark:ring-white/10"
              />
            </div>
            <RequestFilterButtons
              filters={filters}
              activeFilter={statusFilter}
              onFilter={(v) => {
                setStatusFilter(v);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden bg-white/80 ring-1 ring-zinc-200 dark:bg-zinc-900/60 dark:ring-white/10">
          <div className="grid grid-cols-[25%_15%_17.5%_15%_27.5%] text-[11px] uppercase tracking-wider text-zinc-600 dark:text-zinc-300 border-b border-zinc-200 dark:border-white/10">
            <div className="pl-4 h-10 flex items-center">Người yêu cầu</div>
            <div className="pl-4 h-10 flex items-center">Số tiền</div>
            <div className="pl-4 h-10 flex items-center">Ngày tạo</div>
            <div className="pl-4 h-10 flex items-center">Trạng thái</div>
            <div className="pl-4 h-10 flex items-center"></div>
          </div>

          <div className="divide-y divide-zinc-200 dark:divide-white/10">
            {isLoading ? (
              <div className="py-10 text-center">Đang tải...</div>
            ) : error ? (
              <div className="py-10 text-center text-red-500">
                Lỗi tải dữ liệu
              </div>
            ) : pageItems.length === 0 ? (
              <div className="py-10 text-center">Không có yêu cầu</div>
            ) : (
              pageItems.map((r) => {
                const canAct = r.status === PaymentStatus.Pending;
                const vnd = toVNDExact(r.amount);
                return (
                  <div
                    key={r.id}
                    className="grid grid-cols-[25%_15%_17.5%_15%_27.5%] py-3 text-sm"
                  >
                    <div className="pl-4 flex items-center gap-2">
                      <UserRound className="w-5 h-5" />
                      <div className="truncate">
                        <div className="font-semibold">
                          {usersMap[r.requesterId]?.displayName || "—"}
                        </div>
                        <div className="text-xs text-zinc-500 truncate">
                          {usersMap[r.requesterId]?.username
                            ? `@${usersMap[r.requesterId]?.username}`
                            : "—"}
                        </div>
                      </div>
                    </div>

                    <div className="pl-4 flex items-center gap-2">
                      <Banknote className="w-4 h-4" />
                      <span className="font-medium">
                        {vnd !== null
                          ? `${vnd.toLocaleString("vi-VN")} VND`
                          : "—"}
                      </span>
                    </div>

                    <div className="pl-4 flex items-center">
                      {formatDateTimeFromTicks(r.createdAt)}
                    </div>

                    <div className="pl-4 flex items-center ">
                      {statusChip(r)}
                    </div>

                    <div className="pl-4 flex items-center justify-center">
                      <div className="inline-grid grid-cols-3 gap-4">
                        <button
                          onClick={() => openApprove(r.id)}
                          className={[
                            "px-3 py-1 rounded-md text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition",
                            canAct
                              ? ""
                              : "invisible pointer-events-none select-none",
                          ].join(" ")}
                          aria-hidden={!canAct}
                          tabIndex={canAct ? 0 : -1}
                        >
                          Duyệt
                        </button>
                        <button
                          onClick={() => openReject(r.id)}
                          className={[
                            "px-3 py-1 rounded-md text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 transition",
                            canAct
                              ? ""
                              : "invisible pointer-events-none select-none",
                          ].join(" ")}
                          aria-hidden={!canAct}
                          tabIndex={canAct ? 0 : -1}
                        >
                          Từ chối
                        </button>
                        <button
                          onClick={() => setDetailFor(r)}
                          className="px-3 py-1 rounded-md text-xs font-semibold text-white bg-[#ff6740] hover:bg-[#e85530] transition"
                        >
                          Chi tiết
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="px-4 py-3 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>

        <ConfirmDialog
          isOpen={dialog.isOpen}
          onClose={() =>
            setDialog({ isOpen: false, type: null, title: "", requestId: null })
          }
          onConfirm={(extra) =>
            updateStatusMutation.mutate({
              requestId: dialog.requestId!,
              isApproved: dialog.type === "approve",
              message:
                dialog.type === "approve"
                  ? extra?.note || "Duyệt yêu cầu"
                  : extra?.note || "Từ chối yêu cầu",
            })
          }
          title={dialog.title}
          subtitle="Hành động này sẽ cập nhật trạng thái yêu cầu rút tiền."
          variant={
            dialog.type === "approve"
              ? "success"
              : dialog.type === "reject"
              ? "danger"
              : "neutral"
          }
          showNote={dialog.type === "reject"}
          loading={updateStatusMutation.isPending}
          confirmLabel={
            dialog.type === "reject" ? "Xác nhận từ chối" : "Xác nhận duyệt"
          }
        />

        <AnimatePresence>
          {detailFor && (
            <RequestDetailDrawer
              item={detailFor}
              requesterName={usersMap[detailFor.requesterId]?.displayName}
              requesterUsername={usersMap[detailFor.requesterId]?.username}
              onClose={() => setDetailFor(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const statusChip = (r: WithdrawRequest) => {
  const text =
    r.status === PaymentStatus.Pending
      ? "Đang chờ"
      : r.status === PaymentStatus.Completed
      ? "Đã duyệt"
      : "Đã từ chối";
  const cls =
    r.status === PaymentStatus.Completed
      ? "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-500/20"
      : r.status === PaymentStatus.Rejected
      ? "bg-rose-100 text-rose-700 ring-1 ring-rose-500/20"
      : "bg-amber-100 text-amber-700 ring-1 ring-amber-500/20";

  return (
    <span
      className={`w-28 inline-flex items-center justify-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${cls}`}
    >
      {text}
    </span>
  );
};

export default RequestList;
