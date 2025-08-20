import { useState, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useDarkMode } from "../../../context/ThemeContext/ThemeContext";
import { useToast } from "../../../context/ToastContext/toast-context";
import ActionButtons from "../AdminModal/ActionButtons";
import ConfirmDialog from "../AdminModal/ConfirmDialog";
import RequestFilterButtons from "./RequestFilterButton";
import QrCodeIcon from "../../../assets/img/AdminSidebar/qr-code-stroke-rounded.svg";
import { formatTicksToDateString } from "../../../utils/date_format";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  GenerateQRCode,
  GetPendingWithdrawRequests,
  UpdateWithdrawRequestStatus,
} from "../../../api/Admin/Request/request.api";
import {
  PaymentStatus,
  type WithdrawRequest,
} from "../../../api/Admin/Request/request.type";
import { GetUserById } from "../../../api/Admin/User/user.api";
import Pagination from "../AdminModal/Pagination";
import Spinner from "../AdminModal/Spinner";

// Định nghĩa variants cho card
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  hover: { scale: 1.02, transition: { duration: 0.2 } },
};

// Định nghĩa variants cho button (chỉ dùng cho QR và Close)
const buttonVariants: Variants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

// Định nghĩa variants cho input
const inputVariants: Variants = {
  focus: { scale: 1.02, borderColor: "#ff4d4f", transition: { duration: 0.2 } },
  darkFocus: {
    scale: 1.02,
    borderColor: "#ff6740",
    transition: { duration: 0.2 },
  },
};

const RequestList = () => {
  const queryClient = useQueryClient();
  const { darkMode } = useDarkMode();
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "All">(
    "All"
  );
  const itemsPerPage = 10;
  const [dialog, setDialog] = useState<{
    isOpen: boolean;
    type: "approve" | "reject" | null;
    title: string;
    requestId: string | null;
  }>({
    isOpen: false,
    type: null,
    title: "",
    requestId: null,
  });
  const [qrDialog, setQrDialog] = useState<{
    isOpen: boolean;
    requestId: string | null;
    qrCodeDataUrl: string | null;
  }>({
    isOpen: false,
    requestId: null,
    qrCodeDataUrl: null,
  });
  const [usersMap, setUsersMap] = useState<{ [key: string]: string }>({});
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState<Error | null>(null);

  // Lấy danh sách yêu cầu rút tiền với phân trang
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

  // Gọi API GetUserById cho tất cả requesterId
  useEffect(() => {
    if (!requestsData?.data || isLoading) return;

    const fetchUsers = async () => {
      setIsUsersLoading(true);
      setUsersError(null);

      try {
        const requesterIds = Array.from(
          new Set(
            requestsData.data
              .map((request: WithdrawRequest) => request.requesterId)
              .filter(
                (id): id is string => typeof id === "string" && id.trim() !== ""
              )
          )
        );

        const usersData: { [key: string]: string } = {};
        for (const requesterId of requesterIds) {
          try {
            const response = await GetUserById(requesterId).then(
              (res) => res.data
            );
            usersData[requesterId] = response.displayName ?? "Không tìm thấy";
          } catch (err) {
            usersData[requesterId] = "Không tìm thấy";
          }
        }
        setUsersMap(usersData);
      } catch (err) {
        setUsersError(
          err instanceof Error ? err : new Error("Lỗi không xác định")
        );
      } finally {
        setIsUsersLoading(false);
      }
    };

    fetchUsers();
  }, [requestsData, isLoading]);

  // Mutation để cập nhật trạng thái yêu cầu
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
        (res) => res.data
      ),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["PendingWithdrawRequests"] });
      toast?.onOpen(
        data.message ||
          (dialog.type === "approve"
            ? "Duyệt yêu cầu rút tiền thành công"
            : "Từ chối yêu cầu rút tiền thành công")
      );
      setDialog({ isOpen: false, type: null, title: "", requestId: null });
    },
    onError: (error: Error) => {
      toast?.onOpen(error.message || "Cập nhật trạng thái yêu cầu thất bại");
      setDialog({ isOpen: false, type: null, title: "", requestId: null });
    },
  });

  // Lấy QR code cho yêu cầu
  const {
    data: qrCodeData,
    isLoading: isQrLoading,
    error: qrError,
  } = useQuery({
    queryKey: ["QRCode", qrDialog.requestId],
    queryFn: () => {
      const request = requestsData?.data.find(
        (r: WithdrawRequest) => r.id === qrDialog.requestId
      );
      if (!request || !request.bankInfo)
        throw new Error("Bank info not available");
      return GenerateQRCode({
        accountNo: request.bankInfo.bankAccountNumber,
        accountName: request.bankInfo.bankAccountName,
        acqId: request.bankInfo.bankBin,
        amount: request.amount * 0.9 * 1000, // Apply 10% deduction and convert to VND
        addInfo: `Rút tiền yêu cầu ${request.id}`,
      }).then((res) => res.data.data);
    },
    enabled: !!qrDialog.isOpen && !!qrDialog.requestId,
  });

  // Lọc yêu cầu theo tìm kiếm và trạng thái
  const filteredRequests = (requestsData?.data || []).filter(
    (request: WithdrawRequest) =>
      ((request.bankInfo?.bankAccountName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ??
        false) ||
        ((request.requesterId &&
          usersMap[request.requesterId]
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())) ??
          false)) &&
      (statusFilter === "All" || request.status === statusFilter)
  );

  // Tính tổng số trang
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  // Lấy danh sách yêu cầu cho trang hiện tại
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleApprove = (requestId: string) => {
    const request = requestsData?.data.find(
      (r: WithdrawRequest) => r.id === requestId
    );
    const requesterName =
      request?.requesterId && usersMap[request.requesterId]
        ? usersMap[request.requesterId]
        : "Người dùng";
    setDialog({
      isOpen: true,
      type: "approve",
      title: `Bạn muốn duyệt yêu cầu rút tiền của ${requesterName}?`,
      requestId,
    });
  };

  const handleReject = (requestId: string) => {
    const request = requestsData?.data.find(
      (r: WithdrawRequest) => r.id === requestId
    );
    const requesterName =
      request?.requesterId && usersMap[request.requesterId]
        ? usersMap[request.requesterId]
        : "Người dùng";
    setDialog({
      isOpen: true,
      type: "reject",
      title: `Bạn muốn từ chối yêu cầu rút tiền của ${requesterName}?`,
      requestId,
    });
  };

  const handleConfirmDialog = () => {
    if (dialog.requestId && dialog.type) {
      const isApproved = dialog.type === "approve";
      const message = isApproved
        ? "Duyệt yêu cầu rút tiền"
        : "Từ chối yêu cầu rút tiền";
      updateStatusMutation.mutate({
        requestId: dialog.requestId,
        isApproved,
        message,
      });
    }
  };

  const handleOpenQrDialog = (requestId: string) => {
    const request = requestsData?.data.find(
      (r: WithdrawRequest) => r.id === requestId
    );
    if (!request?.bankInfo) {
      toast?.onOpen("Không có thông tin ngân hàng để tạo mã QR!");
      return;
    }
    setQrDialog({
      isOpen: true,
      requestId,
      qrCodeDataUrl: null,
    });
  };

  const handleCloseQrDialog = () => {
    setQrDialog({ isOpen: false, requestId: null, qrCodeDataUrl: null });
  };

  // Xử lý lọc trạng thái
  const handleStatusFilter = (value: PaymentStatus | "All") => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  // Định nghĩa các filter cho RequestFilterButtons
  const filters = [
    { label: "Tất cả", value: "All" as const },
    { label: "Đang chờ", value: PaymentStatus.Pending },
    { label: "Đã từ chối", value: PaymentStatus.Rejected },
    { label: "Đã duyệt", value: PaymentStatus.Completed },
  ];

  // Ánh xạ actionType sang trạng thái hiển thị
  const getStatusText = (request: WithdrawRequest) => {
    if (request.actionType === "approve") return "Đã duyệt";
    if (request.actionType === "reject") return "Đã từ chối";
    switch (request.status) {
      case PaymentStatus.Pending:
        return "Đang chờ";
      case PaymentStatus.Rejected:
        return "Đã từ chối";
      case PaymentStatus.Completed:
        return "Đã duyệt";
      default:
        return "Đang chờ";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`p-6 min-h-screen ${
        darkMode ? "bg-[#0f0f11] text-white" : "bg-gray-100 text-gray-900"
      } overflow-x-hidden`}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex justify-between items-center mb-6"
      >
        <h1 className="text-2xl font-bold">Quản lý yêu cầu rút tiền</h1>
        {/* <DarkModeToggler /> */}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-4 max-w-4xl"
      >
        <div className="w-full sm:w-auto sm:flex-none max-w-xs">
          <motion.input
            type="text"
            placeholder="Tìm kiếm theo tên người dùng hoặc tên tài khoản ngân hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full p-2.5 border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#ff4d4f] dark:focus:ring-[#ff6740] ${
              darkMode
                ? "bg-[#2e2e2e] text-white border-gray-700"
                : "bg-white text-gray-900 border-gray-200"
            }`}
            variants={inputVariants}
            whileFocus={darkMode ? "darkFocus" : "focus"}
          />
        </div>
        <div className="w-full sm:w-auto sm:flex-none max-w-fit">
          <RequestFilterButtons
            filters={filters}
            activeFilter={statusFilter}
            onFilter={handleStatusFilter}
          />
        </div>
      </motion.div>

      {isLoading || isUsersLoading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className={`text-center ${
            darkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          <Spinner />
          <p className="mt-2">Đang tải...</p>
        </motion.div>
      ) : error || usersError ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className={`text-center ${
            darkMode ? "text-red-400" : "text-red-600"
          }`}
        >
          Không thể tải danh sách yêu cầu
        </motion.p>
      ) : filteredRequests.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className={`text-center ${
            darkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Không có yêu cầu nào
        </motion.p>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          <div className="flex flex-col gap-5">
            <AnimatePresence>
              {paginatedRequests.map((request: WithdrawRequest) => (
                <motion.div
                  key={request.id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  whileHover="hover"
                  className={`h-[120px] rounded-[10px] p-4 flex items-center gap-4 border ${
                    darkMode
                      ? "bg-[#2e2e2e] border-gray-700"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.3 }}
                          className={`h-2 w-2 rounded-full inline-block ${
                            request.actionType === "approve"
                              ? "bg-green-400"
                              : request.actionType === "reject"
                              ? "bg-red-400"
                              : "bg-yellow-400"
                          }`}
                        />
                        <span className="text-[18px]">
                          {request.requesterId && usersMap[request.requesterId]
                            ? usersMap[request.requesterId]
                            : "Không tìm thấy"}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <ActionButtons
                          canApprove={request.status === PaymentStatus.Pending}
                          canReject={request.status === PaymentStatus.Pending}
                          onApprove={() => handleApprove(request.id)}
                          onReject={() => handleReject(request.id)}
                          isLoading={updateStatusMutation.isPending}
                        />
                        {request.bankInfo && (
                          <motion.button
                            onClick={() => handleOpenQrDialog(request.id)}
                            className={`px-4 py-2 rounded-[5px] text-white ${
                              darkMode
                                ? "bg-[#ff6740] hover:bg-[#e14b2e]"
                                : "bg-[#ff4d4f] hover:bg-[#e64547]"
                            } flex items-center justify-center h-[35px]`}
                            title="Xem mã QR"
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                          >
                            <img
                              src={QrCodeIcon}
                              alt="QR Code"
                              className="w-5 h-5"
                            />
                          </motion.button>
                        )}
                      </div>
                    </div>
                    <div
                      className={`flex gap-10 text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      <div className="flex gap-4">
                        <span>Số tiền:</span>
                        <span>
                          {request.amount.toLocaleString()} coin (
                          {(request.amount * 0.9 * 1000).toLocaleString()} VND)
                        </span>
                      </div>
                      <div className="flex gap-4">
                        <span>Ngày tạo:</span>
                        <span>
                          {formatTicksToDateString(request.createdAt)}
                        </span>
                      </div>
                      <div className="flex gap-4">
                        <span>Trạng thái:</span>
                        <span>{getStatusText(request)}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </motion.div>
        </motion.div>
      )}

      <ConfirmDialog
        isOpen={dialog.isOpen}
        onClose={() =>
          setDialog({ isOpen: false, type: null, title: "", requestId: null })
        }
        onConfirm={handleConfirmDialog}
        title={dialog.title}
        isLockAction={false}
        type="request"
        isLoading={updateStatusMutation.isPending}
      />

      <AnimatePresence>
        {qrDialog.isOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(4px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`rounded-[10px] shadow-lg p-6 max-w-lg w-full border ${
                darkMode
                  ? "bg-[#1a1a1c] text-white border-gray-700"
                  : "bg-white text-gray-900 border-gray-200"
              }`}
            >
              <h3 className="text-lg font-semibold mb-4">
                Mã QR cho yêu cầu của{" "}
                {(() => {
                  const request = requestsData?.data.find(
                    (r: WithdrawRequest) => r.id === qrDialog.requestId
                  );
                  return request?.requesterId && usersMap[request.requesterId]
                    ? usersMap[request.requesterId]
                    : "Không tìm thấy";
                })()}
              </h3>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="flex justify-center mb-4"
              >
                {isQrLoading ? (
                  <Spinner />
                ) : qrError ? (
                  <p
                    className={`${darkMode ? "text-red-400" : "text-red-600"}`}
                  >
                    Không thể tải mã QR
                  </p>
                ) : (
                  <motion.img
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    src={
                      qrCodeData ||
                      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg=="
                    }
                    alt="QR Code"
                    className="w-96 h-96 object-contain"
                  />
                )}
              </motion.div>
              <div className="flex justify-end">
                <motion.button
                  onClick={handleCloseQrDialog}
                  className={`px-4 py-2 rounded-[10px] ${
                    darkMode
                      ? "bg-[#2c2e2e] text-white hover:bg-gray-600"
                      : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                  } transition-transform duration-200`}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  Đóng
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RequestList;
