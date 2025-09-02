import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X, UserRound, Banknote, CalendarDays, CheckCircle2, XCircle, Clock3 } from "lucide-react";
import { GenerateQRCode } from "../../../api/Admin/Request/request.api";
import { formatTicksToDateString } from "../../../utils/date_format";
import { PaymentStatus, type WithdrawRequest } from "../../../api/Admin/Request/request.type";

interface Props {
  item: WithdrawRequest;
  requesterName?: string;         
  requesterUsername?: string;    
  onClose: () => void;
}

const coinPriceTable = [
  { amount: 65, price: 50000 },
  { amount: 130, price: 100000 },
  { amount: 260, price: 200000 },
  { amount: 650, price: 500000 },
  { amount: 1300, price: 1000000 },
  { amount: 2600, price: 2000000 },
];

const toVNDExact = (value: number): number | null => {
  for (const p of coinPriceTable) if (value === p.amount || value === p.price) return p.price;
  return null;
};

const StatusChip = ({ status }: { status: PaymentStatus }) => {
  const text =
    status === PaymentStatus.Pending ? "Đang chờ" :
    status === PaymentStatus.Completed ? "Đã duyệt" : "Đã từ chối";

  const cls =
    status === PaymentStatus.Completed ? "bg-emerald-100 text-emerald-700" :
    status === PaymentStatus.Rejected ? "bg-rose-100 text-rose-700" :
    "bg-amber-100 text-amber-700";

  const Icon =
    status === PaymentStatus.Completed ? CheckCircle2 :
    status === PaymentStatus.Rejected ? XCircle : Clock3;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
      <Icon className="w-3 h-3" />
      {text}
    </span>
  );
};

const RequestDetailDrawer = ({ item, requesterName, requesterUsername, onClose }: Props) => {
  const vnd = toVNDExact(item.amount);
  const shouldShowQR = item.status === PaymentStatus.Pending && !!item.bankInfo;

  const [qrLoading, setQrLoading] = useState(false);
  const [qrError, setQrError] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchQR = async () => {
      if (!shouldShowQR || !item.bankInfo) {
        setQrDataUrl(null);
        setQrError(null);
        setQrLoading(false);
        return;
      }
      try {
        setQrLoading(true);
        setQrError(null);
        const amountVND = vnd ?? Math.round(item.amount * 1000); 
        const res = await GenerateQRCode({
          accountNo: item.bankInfo.bankAccountNumber,
          accountName: item.bankInfo.bankAccountName,
          acqId: item.bankInfo.bankBin,
          amount: amountVND,
          addInfo: `Rut tien yeu cau ${item.id}`,
        });
        if (!cancelled) setQrDataUrl(res?.data?.data || null);
      } catch (err: any) {
        if (!cancelled) setQrError(err?.message || "Không thể tạo mã QR");
      } finally {
        if (!cancelled) setQrLoading(false);
      }
    };
    fetchQR();
    return () => { cancelled = true; };
  }, [item.id, item.status, item.bankInfo, vnd, shouldShowQR]);

  const bankName =
    (item.bankInfo as any)?.bankName ??
    (item.bankInfo as any)?.bank_name ??
    (item.bankInfo as any)?.bankShortName ??
    (item.bankInfo as any)?.bank_short_name ??
    "—";

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="fixed top-0 right-0 w-full sm:w-[460px] h-full bg-white dark:bg-zinc-900 shadow-xl z-50"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-white/10">
        <h3 className="font-semibold">Chi tiết yêu cầu</h3>
        <button onClick={onClose} className="p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-white/10">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 text-sm space-y-3">
        <div className="flex items-center gap-3">
          <span className="inline-grid place-items-center w-10 h-10 rounded-xl bg-white ring-1 ring-zinc-200 shadow-sm dark:bg-zinc-800 dark:ring-white/10">
            <UserRound className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
          </span>
          <div className="min-w-0">
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                ID: <span className="font-medium text-zinc-700 dark:text-zinc-200">{item.id}</span>
              </div>
            <div className="font-semibold truncate flex items-center gap-2">
              <span className="truncate">{requesterName ?? "—"}</span>
              <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400 truncate">
                {requesterUsername ? `@${requesterUsername}` : "—"}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-xl ring-1 ring-zinc-200 bg-white/80 dark:ring-white/10 dark:bg-zinc-900/60 px-4 py-3 space-y-2">
          <div className="flex items-center gap-2">
            <Banknote className="w-4 h-4" />
            <span className="text-xs text-zinc-500 dark:text-zinc-400">Số coin:</span>
            <span className="text-sm font-medium">
              {item.amount.toLocaleString("vi-VN")} coin{" "}
              {vnd !== null && (
                <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400">
                  (≈ {vnd.toLocaleString("vi-VN")} VND)
                </span>
              )}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />
              <span className="text-xs text-zinc-500 dark:text-zinc-400">Ngày tạo:</span>
              <span className="text-sm font-medium">{formatTicksToDateString(item.createdAt)}</span>
            </div>
            <StatusChip status={item.status} />
          </div>
        </div>

        {item.bankInfo && (
          <div className="rounded-xl ring-1 ring-zinc-200 bg-white/80 dark:ring-white/10 dark:bg-zinc-900/60 px-4 py-3 space-y-2">
            <div className="text-sm font-semibold">
              Ngân hàng: <span className="font-medium">{bankName}</span>
            </div>
            <div className="text-sm space-y-1">
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                Chủ TK: {item.bankInfo.bankAccountName ?? "—"}
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                Số TK: {item.bankInfo.bankAccountNumber ?? "—"}
              </div>
            </div>
          </div>
        )}

       {shouldShowQR && (
        <div className="rounded-xl ring-1 ring-zinc-200 bg-white/80 dark:ring-white/10 dark:bg-zinc-900/60 px-4 py-3">
          <div className="text-sm font-semibold mb-2">Quét QR để thanh toán</div>
          <div className="flex items-center justify-center min-h-[220px]">
            {qrLoading ? (
              <p className="text-zinc-500 dark:text-zinc-400">Đang tạo mã QR...</p>
            ) : qrError ? (
              <p className="text-rose-600 dark:text-rose-400">{qrError}</p>
            ) : qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="QR Code"
                className="w-[300px] h-[225px] object-contain" 
              />
            ) : (
              <p className="text-zinc-500 dark:text-zinc-400">Chưa có dữ liệu QR.</p>
            )}
          </div>
        </div>
      )}
      </div>
    </motion.div>
  );
};

export default RequestDetailDrawer;
