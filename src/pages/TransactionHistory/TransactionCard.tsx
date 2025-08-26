import { type TransactionItem, getStatusLabel, getTypeLabel } from "../../api/Transaction/transaction.type";
import { formatVietnamTimeFromTicks } from "../../utils/date_format";
import { CalendarClock, Coins, Wallet, BookOpen, FileText } from "lucide-react";
import { useMemo } from "react";

type Props = { transaction?: TransactionItem };

const statusChip = (s: number) => {
  if (s === 1) return { wrap: "bg-emerald-100 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-400/20" };
  if (s === 0) return { wrap: "bg-amber-100 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-400/20" };
  if (s === 3 || s === 4) return { wrap: "bg-rose-100 text-rose-700 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-400/20" };
  return { wrap: "bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-500/10 dark:text-slate-300 dark:ring-slate-400/20" };
};

export const TransactionCard = ({ transaction }: Props) => {
  if (!transaction) return null;
  const { id, type, amount, status, createdAt } = transaction;

  const { Icon, grad } = useMemo(() => {
    switch (type) {
      case 0: return { Icon: Coins,  grad: "from-emerald-500 to-green-600" };
      case 1: return { Icon: Wallet, grad: "from-rose-500 to-red-600" };
      case 2: return { Icon: BookOpen, grad: "from-fuchsia-500 to-pink-500" };
      default: return { Icon: FileText, grad: "from-amber-500 to-yellow-500" };
    }
  }, [type]);

  const abs = (v: number | string) => (typeof v === "number" ? v.toLocaleString("vi-VN") : v);
  const isPlus = type === 0;
  const isMinus = type === 1 || type === 2 || type === 3;
  const amountColor = isPlus ? "text-emerald-600 dark:text-emerald-400" : isMinus ? "text-rose-600 dark:text-rose-400" : "text-slate-900 dark:text-white";
  const amountText = isPlus ? `+${abs(amount)}` : isMinus ? `-${abs(amount)}` : abs(amount);

  const sc = statusChip(status);
  const showId = !(type === 1 || type === 3);

  return (
    <div className={["w-full rounded-xl px-4 py-3 transition",
      "bg-white ring-1 ring-slate-200 hover:ring-slate-300",
      "dark:bg-white/5 dark:backdrop-blur dark:ring-white/10 dark:hover:bg-white/7.5 dark:hover:ring-white/20",
    ].join(" ")}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <div className={["h-10 w-10 shrink-0 rounded-lg grid place-items-center",
            "bg-gradient-to-br", grad, "ring-1 ring-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]"].join(" ")} aria-hidden>
            <Icon className="h-5 w-5 text-white" />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <div className="text-[14px] md:text-[15px] font-semibold text-slate-900 dark:text-white">{getTypeLabel(type)}</div>
              {showId && (
                <span className="truncate max-w-[240px] text-[12px] px-2 py-0.5 rounded-md ring-1 bg-slate-100 text-slate-700 ring-slate-200 dark:bg-white/5 dark:text-white/70 dark:ring-white/10">
                  #{id}
                </span>
              )}
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-[12px] text-slate-600 dark:text-white/70">
                <CalendarClock className="h-4 w-4 opacity-80" />
                {formatVietnamTimeFromTicks(createdAt)}
              </span>
              <span className={["inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded-md ring-1 text-[11px] leading-[14px]", sc.wrap].join(" ")}>
                {getStatusLabel(status)}
              </span>
            </div>
          </div>
        </div>

        <div className="shrink-0 text-right">
          <div className={`text-[18px] md:text-[20px] font-extrabold ${amountColor}`}>
            {amountText} <span className="text-slate-500 dark:text-white/65 text-[12px] font-medium">xu</span>
          </div>
        </div>
      </div>
    </div>
  );
};
