import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import {
  ArrowLeft,
  Calendar,
  Coins,
  Users,
  ListFilter,
  Clock,
  RotateCcw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Shell,
  Container,
  Card,
  SoftInput,
  KpiPill,
  AreaChart,
  ChartToolbar,
} from "../components/AnalyticsUI";
import type { Mode, Purchase, SeriesPoint } from "../AuthorAnalytics";
import { InlineSelect } from "../components/InlineSelect";
import { ModeToggle } from "../components/ModeToggle";
import {
  aggregateSeries,
  fmt,
  maskId,
  renderRange,
  type Granularity,
} from "../util";
import { useQuery } from "@tanstack/react-query";
import {
  GetIncomeChart,
  GetIncomeSummary,
  GetTopNovels,
} from "../../../api/AuthorIncome/income.api";
import type {
  IncomeChartParams,
  IncomeSummaryParams,
  TopNovelsParams,
} from "../../../api/AuthorIncome/income.type";
import { ticksToVNISOString } from "../../../utils/date_format";

type AuthorRevenueProps = {
  mode: Mode;
  onChangeMode: (m: Mode) => void;
};

type EarnType = "all" | "chapter" | "novel";

export const AuthorRevenue = ({ mode, onChangeMode }: AuthorRevenueProps) => {
  const navigate = useNavigate();

  const [rFrom, setRFrom] = useState<string | undefined>(undefined);
  const [rTo, setRTo] = useState<string | undefined>(undefined);
  const [novelId, setNovelId] = useState<string | undefined>(undefined);
  const [type, setType] = useState<EarnType>("all");
  const [rGran, setRGran] = useState<Granularity>("day");

  const [summaryParams, setSummaryParams] = useState<IncomeSummaryParams>({
    startDate: "01/01/2000",
    endDate: "12/31/2050",
    filter: "all",
  });

  const [chartParams, setChartParams] = useState<IncomeChartParams>({
    startDate: "01/01/2000",
    endDate: "12/31/2050",
    filter: "all",
  });

  const topNovelParams: TopNovelsParams = { limit: 5 };

  const { data: incomeSummary } = useQuery({
    queryKey: ["income-sum", summaryParams],
    queryFn: () => GetIncomeSummary(summaryParams).then((res) => res.data),
  });

  const summaryData = incomeSummary?.data;

  const purchases: Purchase[] = (summaryData?.logs ?? []).map((x) => ({
    id: x.earningId,
    ts: ticksToVNISOString(x.createdAt),
    buyerName: x.buyerDisplayName,
    buyerId: x.buyerUsername,
    novelId: x.novelId,
    novelTitle: x.novelTitle ?? "",
    chapterId: x.chapterId ?? "",
    chapterTitle: x.chapterTitle ?? "",
    priceCoins: x.amount,
    type: x.type as "BuyChapter" | "BuyNovel",
    orderId: x.earningId,
  }));

  const grouped = useMemo(() => {
    const m = new Map<string, Purchase[]>();
    for (const p of purchases) {
      const key = p.ts.slice(0, 10);
      if (!m.has(key)) m.set(key, []);
      m.get(key)!.push(p);
    }
    return Array.from(m.entries())
      .sort((a, b) => (a[0] < b[0] ? 1 : -1))
      .map(([day, items]) => ({
        day,
        items: items.sort((a, b) => (a.ts < b.ts ? 1 : -1)),
      }));
  }, [purchases]);

  const { data: incomeChart } = useQuery({
    queryKey: ["income-chart", chartParams],
    queryFn: () => GetIncomeChart(chartParams).then((res) => res.data.data),
  });

  const series: SeriesPoint[] = (incomeChart ?? []).map((item) => ({
    ts: item.label,
    coins: item.coins,
    orders: 0,
  }));

  const { data: TopNovels } = useQuery({
    queryKey: ["top-novels", topNovelParams],
    queryFn: () => GetTopNovels(topNovelParams).then((res) => res.data),
  });

  const options = [
    { value: "", label: "Tất cả truyện" },
    ...(TopNovels?.data ?? []).map((n) => ({
      value: n.novelId,
      label: n.title,
    })),
  ];

  const seriesCoins = useMemo(
    () => aggregateSeries(series as any[], "ts", ["coins", "orders"], rGran),
    [series, rGran]
  );

  const handleChangeFromDate = (e: ChangeEvent<HTMLInputElement>) => {
    setRFrom(e.target.value || undefined);
    setSummaryParams((prev) => ({
      ...prev,
      startDate: e.target.value,
    }));
    setChartParams((prev) => ({
      ...prev,
      startDate: e.target.value, // fixed: trước đây gán nhầm endDate
    }));
  };

  const handleChangeToDate = (e: ChangeEvent<HTMLInputElement>) => {
    setRTo(e.target.value || undefined);
    setSummaryParams((prev) => ({
      ...prev,
      endDate: e.target.value,
    }));
    setChartParams((prev) => ({
      ...prev,
      endDate: e.target.value,
    }));
  };

  const handleChangeType = (v?: EarnType) => {
    setType((v as EarnType) ?? "all");
    setSummaryParams((prev) => ({
      ...prev,
      filter: v,
    }));
    setChartParams((prev) => ({
      ...prev,
      filter: v,
    }));
  };

  const handleChangeNovel = (n?: string) => {
    setSummaryParams((prev) => ({
      ...prev,
      novelId: n,
    }));
    setChartParams((prev) => ({
      ...prev,
      novelId: n,
    }));
    setNovelId(n);
  };

  const resetFilters = () => {
    setRFrom(undefined);
    setRTo(undefined);
    setNovelId(undefined);
    setType("all");
  };

  useEffect(() => {
    setChartParams((prev) => ({
      ...prev,
      groupBy: rGran,
    }));
  }, [rGran]);

  return (
    <Shell>
      <Container className="pt-6 pb-3">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-10">
            <button
              onClick={() => navigate(-1)}
              className="h-9 w-9 grid place-items-center rounded-lg
                         bg-zinc-100 ring-1 ring-zinc-200 hover:bg-zinc-200
                         dark:bg-white/[0.06] dark:ring-white/10 dark:hover:bg-white/[0.12]
                         transition"
              title="Quay lại"
              aria-label="Quay lại"
            >
              <ArrowLeft className="h-4 w-4 text-zinc-800 dark:text-white" />
            </button>
            <div className="text-[18px] md:text-[20px] font-semibold leading-tight text-zinc-900 dark:text-white">
              Thống kê doanh thu
            </div>
          </div>

          <ModeToggle mode={mode} onChange={onChangeMode} />
        </div>
      </Container>

      <div
        className="sticky top-0 z-20 backdrop-blur
                   supports-[backdrop-filter]:bg-white/70
                   dark:supports-[backdrop-filter]:bg-[#0a0f16]/70 mt-5
                   border-b border-zinc-200 dark:border-white/10"
      >
        <Container className="pb-4">
          <Card className="px-3 py-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="inline-flex items-center gap-2 text-zinc-600 dark:text-white/70 text-sm px-2">
                  <ListFilter className="h-4 w-4" /> Bộ lọc
                </div>

                <div className="flex items-center gap-1">
                  <div className="flex items-center gap-2 px-3 h-9 rounded-xl">
                    <SoftInput
                      type="date"
                      value={rFrom ?? ""}
                      onChange={(e) => handleChangeFromDate(e)}
                    />
                  </div>
                  <span className="text-zinc-400 dark:text-white/40 text-sm">
                    -
                  </span>
                  <div className="flex items-center gap-2 px-3 h-9 rounded-xl">
                    <SoftInput
                      type="date"
                      value={rTo ?? ""}
                      onChange={(e) => handleChangeToDate(e)}
                    />
                  </div>
                </div>

                <InlineSelect
                  value={type}
                  onChange={(v) => handleChangeType(v as EarnType)}
                  options={[
                    { value: "all", label: "Tất cả" },
                    { value: "chapter", label: "Mua chương" },
                    { value: "novel", label: "Trọn gói" },
                  ]}
                  placeholder="Loại đơn"
                  title="Loại đơn"
                  width={150}
                />
                <InlineSelect
                  value={novelId ?? ""}
                  onChange={(n) => handleChangeNovel(n)}
                  options={options}
                  placeholder="Chọn truyện"
                  title="Truyện"
                  width={250}
                />
              </div>

              <div className="ml-auto">
                <button
                  onClick={resetFilters}
                  className="h-9 px-3 rounded-xl bg-zinc-100 ring-1 ring-zinc-200 text-sm hover:bg-zinc-200
                             dark:bg-white/5 dark:ring-white/10 dark:text-white dark:hover:bg-white/10
                             inline-flex items-center gap-2"
                  title="Reset"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
            </div>
          </Card>
        </Container>
      </div>

      <Container className="pb-12 space-y-6">
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <KpiPill
            label="Tổng coin"
            value={summaryData?.totalEarningsCoins.toLocaleString()!}
            icon={<Coins className="h-4 w-4" />}
          />
          <KpiPill
            label="Tổng đơn"
            value={summaryData?.totalOrders.toLocaleString()!}
            icon={<Users className="h-4 w-4" />}
          />
          <KpiPill
            label="Khoảng thời gian"
            value={renderRange(rFrom, rTo)}
            icon={<Calendar className="h-4 w-4" />}
          />
        </section>

        <section className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <Card className="p-4">
              <div className="mb-1 text-sm text-zinc-600 dark:text-white/70">
                Biểu đồ doanh thu
              </div>
              <ChartToolbar granularity={rGran} onGranularity={setRGran} />
              <AreaChart series={seriesCoins} yKey="coins" />
            </Card>

            <Card className="p-0">
              <div className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-white/70">
                  <span
                    className="h-6 w-6 grid place-items-center rounded-md
                                   bg-zinc-100 ring-1 ring-zinc-200
                                   dark:bg-white/5 dark:ring-white/10"
                  >
                    <Clock className="h-3.5 w-3.5" />
                  </span>
                  Nhật ký mua chương / trọn gói
                </div>
                <div className="text-xs text-zinc-500 dark:text-white/50 px-2">
                  Mới nhất ở trên
                </div>
              </div>
              <div className="divide-y divide-zinc-200 dark:divide-white/10">
                {summaryData?.logs.length === 0 ? (
                  <div className="px-4 py-10 text-center text-zinc-600 dark:text-white/60">
                    Không có giao dịch.
                  </div>
                ) : (
                  grouped.map(({ day, items }) => (
                    <div key={day} className="px-4 py-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-sm font-medium text-zinc-900 dark:text-white">
                          {day}
                        </div>
                        <div className="text-xs text-zinc-500 dark:text-white/50">
                          · {items.length} lượt mua
                        </div>
                      </div>
                      <ul className="space-y-2">
                        {items.map((p) => (
                          <li
                            key={p.id}
                            className="rounded-xl px-3 py-2 transition hover:bg-zinc-50 dark:hover:bg-white/[0.04]"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-3 min-w-0">
                                <div
                                  className="h-9 w-9 rounded-full
                                                bg-zinc-100 ring-1 ring-zinc-200
                                                dark:bg-white/10 dark:ring-white/15
                                                grid place-items-center shrink-0"
                                >
                                  <span className="text-sm font-semibold text-zinc-800 dark:text-white">
                                    {p.buyerName.split(" ").pop()?.[0] ?? "U"}
                                  </span>
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-medium text-zinc-900 dark:text-white">
                                      {p.buyerName}
                                    </span>
                                    <span className="text-zinc-500 dark:text-white/50 text-xs">
                                      ({maskId(p.buyerId)})
                                    </span>
                                    <span
                                      className={`px-2 py-0.5 text-[11px] rounded-full ring-1
                                        ${
                                          p.type === "BuyChapter"
                                            ? "bg-blue-600/10 text-blue-700 ring-blue-600/30 dark:bg-blue-500/10 dark:text-blue-300 dark:ring-blue-500/30"
                                            : "bg-amber-600/10 text-amber-700 ring-amber-600/30 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/30"
                                        }`}
                                    >
                                      {p.type === "BuyChapter"
                                        ? "Mua chương"
                                        : "Trọn gói"}
                                    </span>
                                  </div>
                                  <div className="text-sm truncate">
                                    <span className="font-medium text-zinc-900 dark:text-white">
                                      {p.novelTitle}
                                    </span>
                                    <span className="text-zinc-600 dark:text-white/60">
                                      {" "}
                                      ·{" "}
                                      {p.chapterTitle ? (
                                        p.chapterTitle
                                      ) : (
                                        <em className="text-zinc-600 not-italic dark:text-white/60">
                                          Trọn gói
                                        </em>
                                      )}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                <div className="text-base font-semibold tabular-nums text-zinc-900 dark:text-white">
                                  {p.priceCoins.toLocaleString()} coin
                                </div>
                                <div className="text-xs text-zinc-600 dark:text-white/60">
                                  {fmt(p.ts)}
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))
                )}
              </div>
              {summaryData?.hasMore && (
                <div className="px-4 py-3 border-t border-zinc-200 dark:border-white/10 flex items-center justify-between">
                  <div className="text-xs text-zinc-500 dark:text-white/60"></div>
                  <button
                    className="h-9 px-3 rounded-xl bg-zinc-100 ring-1 ring-zinc-200 text-sm hover:bg-zinc-200
                               dark:bg-white/5 dark:ring-white/10 dark:text-white dark:hover:bg-white/10"
                  >
                    Xem thêm
                  </button>
                </div>
              )}
            </Card>
          </div>

          <div className="col-span-12 lg:col-span-4 space-y-6">
            <Card className="p-0 overflow-hidden">
              <div className="px-3 py-3 text-sm text-zinc-600 dark:text-white/70 flex items-center gap-2">
                <span className="h-5 w-5 rounded-md bg-zinc-100 ring-1 ring-zinc-200 dark:bg-white/5 dark:ring-white/10 grid place-items-center">
                  🏆
                </span>
                Top 5 truyện được mua nhiều nhất
              </div>
              <table className="w-full text-sm table-fixed">
                <colgroup>
                  <col className="w-[55%]" />
                  <col className="w-[20%]" />
                  <col className="w-[25%]" />
                </colgroup>
                <thead className="text-left text-zinc-600 dark:text-white/60">
                  <tr className="border-t border-zinc-200 dark:border-white/10">
                    <th className="px-3 py-2">Truyện</th>
                    <th className="px-3 py-2">Coin</th>
                    <th className="px-3 py-2 text-center">Lượt mua</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-white/10">
                  {TopNovels?.data.map((n) => (
                    <tr
                      key={n.novelId}
                      className="hover:bg-zinc-50 dark:hover:bg-white/[0.04]"
                    >
                      <td className="px-3 py-2 truncate text-zinc-900 dark:text-white">
                        {n.title}
                      </td>
                      <td className="px-3 py-2 tabular-nums text-zinc-900 dark:text-white">
                        {n.totalCoins.toLocaleString()}
                      </td>
                      <td className="px-3 py-2 tabular-nums text-center text-zinc-900 dark:text-white">
                        {n.totalOrders.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        </section>
      </Container>
    </Shell>
  );
};
