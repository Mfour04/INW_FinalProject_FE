import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DarkModeToggler } from "../../../components/DarkModeToggler";
import ActionButtons from "../AdminModal/ActionButtons";
import ConfirmDialog from "../AdminModal/ConfirmDialog";
import QrCodeIcon from "../../../assets/img/AdminSidebar/qr-code-stroke-rounded.svg";
import { formatTicksToDateString } from "../../../utils/date_format";

interface WithdrawalRequest {
  requestId: string;
  userName: string;
  amount: number;
  status: "pending" | "approved" | "rejected";
  createdAt: number;
  qrCodeDataUrl?: string; // Placeholder cho mã QR
}

// Mock data
const mockRequests: WithdrawalRequest[] = [
  {
    requestId: "REQ001",
    userName: "User One",
    amount: 1234,
    status: "pending",
    createdAt: 1627849200000,
    qrCodeDataUrl:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==", // Placeholder
  },
  {
    requestId: "REQ002",
    userName: "User Two",
    amount: 5678,
    status: "approved",
    createdAt: 1627849200000,
    qrCodeDataUrl:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==",
  },
  {
    requestId: "REQ003",
    userName: "User Three",
    amount: 9012,
    status: "rejected",
    createdAt: 1627849200000,
    qrCodeDataUrl:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==",
  },
];

const RequestList = () => {
  const [searchTerm, setSearchTerm] = useState("");
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

  const filteredRequests = mockRequests.filter(
    (request) =>
      request.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.requestId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApprove = (requestId: string) => {
    setDialog({
      isOpen: true,
      type: "approve",
      title: `Bạn muốn duyệt yêu cầu rút tiền ${requestId} của ${
        mockRequests.find((r) => r.requestId === requestId)?.userName
      }?`,
      requestId,
    });
  };

  const handleReject = (requestId: string) => {
    setDialog({
      isOpen: true,
      type: "reject",
      title: `Bạn muốn từ chối yêu cầu rút tiền ${requestId} của ${
        mockRequests.find((r) => r.requestId === requestId)?.userName
      }?`,
      requestId,
    });
  };

  const handleConfirmDialog = () => {
    if (dialog.requestId) {
      console.log(
        `${dialog.type === "approve" ? "Duyệt" : "Từ chối"} yêu cầu: ${
          dialog.requestId
        }`
      );
    }
    setDialog({ isOpen: false, type: null, title: "", requestId: null });
  };

  const handleOpenQrDialog = (requestId: string) => {
    const request = mockRequests.find((r) => r.requestId === requestId);
    setQrDialog({
      isOpen: true,
      requestId,
      qrCodeDataUrl: request?.qrCodeDataUrl || null,
    });
  };

  const handleCloseQrDialog = () => {
    setQrDialog({ isOpen: false, requestId: null, qrCodeDataUrl: null });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="p-6 bg-gray-100 dark:bg-[#0f0f11] min-h-screen text-gray-900 dark:text-white"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý yêu cầu rút tiền</h1>
        <DarkModeToggler />
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên người dùng hoặc ID yêu cầu..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2.5 border border-gray-200 dark:border-gray-700 rounded-[10px] bg-white dark:bg-[#2e2e2e] text-gray-900 dark:text-white focus:ring-[#ff4d4f] dark:focus:ring-[#ff6740] focus:border-[#ff4d4f] dark:focus:border-[#ff6740]"
        />
      </div>

      {filteredRequests.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400 text-center">
          Không có yêu cầu nào
        </p>
      ) : (
        <div className="flex flex-col gap-5">
          {filteredRequests.map((request) => (
            <motion.div
              key={request.requestId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="h-[120px] bg-white dark:bg-[#2e2e2e] rounded-[10px] p-4 flex items-center gap-4 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span
                      className={`h-2 w-2 rounded-full inline-block ${
                        request.status === "approved"
                          ? "bg-green-400"
                          : request.status === "rejected"
                          ? "bg-red-400"
                          : "bg-yellow-400"
                      }`}
                    />
                    <span className="text-[18px] text-gray-900 dark:text-white">
                      {request.requestId}: {request.userName}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <ActionButtons
                      canApprove={request.status === "pending"}
                      canReject={request.status === "pending"}
                      onApprove={() => handleApprove(request.requestId)}
                      onReject={() => handleReject(request.requestId)}
                      isLoading={false}
                    />
                    <button
                      onClick={() => handleOpenQrDialog(request.requestId)}
                      className="px-4 py-2 rounded-[5px] bg-[#ff4d4f] dark:bg-[#ff6740] text-white hover:bg-[#e64547] dark:hover:bg-[#e14b2e] flex items-center justify-center h-[35px]"
                      title="Xem mã QR"
                    >
                      <img src={QrCodeIcon} alt="QR Code" className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="flex gap-10 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex gap-4">
                    <span>Số tiền:</span>
                    <span>{request.amount.toLocaleString()} coin</span>
                  </div>
                  <div className="flex gap-4">
                    <span>Ngày tạo:</span>
                    <span>{formatTicksToDateString(request.createdAt)}</span>
                  </div>
                  <div className="flex gap-4">
                    <span>Trạng thái:</span>
                    <span>
                      {request.status === "approved"
                        ? "Đã duyệt"
                        : request.status === "rejected"
                        ? "Đã từ chối"
                        : "Đang chờ"}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
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
      />

      <AnimatePresence>
        {qrDialog.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white dark:bg-[#1a1a1c] rounded-[10px] shadow-lg p-6 max-w-sm w-full border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Mã QR cho yêu cầu {qrDialog.requestId}
              </h3>
              <div className="flex justify-center mb-4">
                <img
                  src={
                    qrDialog.qrCodeDataUrl ||
                    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg=="
                  }
                  alt="QR Code"
                  className="w-48 h-48"
                />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleCloseQrDialog}
                  className="px-4 py-2 rounded-[10px] bg-gray-200 dark:bg-[#2c2c2c] text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Đóng
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RequestList;
