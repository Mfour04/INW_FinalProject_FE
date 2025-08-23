import React from "react";
import ReactDOM from "react-dom";
import { ArrowLeft, Calendar, Coins, Users, ListFilter, Search, Clock, Eye, RotateCcw, ChevronDown, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Shell, Container, Card, SoftInput, KpiPill, AreaChart, ChartToolbar } from "./AnalyticsUI";
import {
  fetchSeries, fetchTopNovels, fetchPurchases,
  type SeriesPoint, type Purchase, type PurchasePage, type TopItem
} from "../analyticsMock";
import type { Mode } from "../AuthorAnalytics";

type Granularity = "day" | "month" | "year";
const keyByGranularity = (dateStr: string, g: Granularity) => {
  const d = new Date(dateStr); const y = d.getFullYear(); const m = `${d.getMonth()+1}`.padStart(2,"0"); const day = `${d.getDate()}`.padStart(2,"0");
  if (g === "day") return `${y}-${m}-${day}`; if (g === "month") return `${y}-${m}`; return `${y}`;
};
const aggregateSeries = <T extends Record<string, any>>(arr:T[], xKey:string, yKeys:string[], g:Granularity) => {
  const map = new Map<string, Record<string, number>>();
  for (const it of arr) {
    const k = keyByGranularity(it[xKey], g);
    if (!map.has(k)) map.set(k, Object.fromEntries(yKeys.map(k=>[k,0])));
    const acc = map.get(k)!; for (const y of yKeys) acc[y]+=Number(it[y]??0);
  }
  return Array.from(map.entries()).sort((a,b)=>a[0]>b[0]?1:-1).map(([ts, vals])=>({ ts, ...vals }));
};
const maskId = (id: string) => id.length <= 4 ? id : id.slice(0,2) + "***" + id.slice(-2);
const fmt = (ts: string) => new Date(ts).toLocaleString("vi-VN", { hour12: false });
const renderRange = (from?: string, to?: string) => !from && !to ? "Tất cả thời gian" : from && to ? `${from} → ${to}` : from ? `${from} → hiện tại` : `đến ${to}`;

function ModeToggle({ mode, onChange }: { mode: Mode; onChange: (m: Mode) => void }) {
  const btn = "px-3 h-9 rounded-xl text-sm inline-flex items-center gap-2 transition";
  return (
    <div className="inline-flex rounded-2xl bg-white/5 ring-1 ring-white/10 p-1 gap-1">
      <button
        onClick={() => onChange("revenue")}
        className={`${btn} ${mode === "revenue" ? "bg-white/20" : "hover:bg-white/10"}`}
        title="Xem Doanh thu"
      >
        <Coins className="h-4 w-4" />
        Doanh thu
      </button>
      <button
        onClick={() => onChange("views")}
        className={`${btn} ${mode === "views" ? "bg-white/20" : "hover:bg-white/10"}`}
        title="Xem Lượt xem"
      >
        <Eye className="h-4 w-4" />
        Lượt xem
      </button>
    </div>
  );
}

type Option = { value: string; label: string };
function InlineSelect({
  value,
  onChange,
  options,
  placeholder,
  className,
  title,
  width = 220,
}: {
  value: string | undefined;
  onChange: (v: string | undefined) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
  title?: string;
  width?: number;
}) {
  const [open, setOpen] = React.useState(false);
  const wrapperRef = React.useRef<HTMLDivElement | null>(null);
  const btnRef = React.useRef<HTMLButtonElement | null>(null);
  const menuRef = React.useRef<HTMLDivElement | null>(null);
  const [coords, setCoords] = React.useState<{ top: number; left: number; width: number; up?: boolean } | null>(null);
  const selected = options.find(o => o.value === (value ?? ""))?.label;

  const measure = React.useCallback(() => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const vh = window.innerHeight;
    const spaceBelow = vh - rect.bottom;
    const menuH = 280;
    const up = spaceBelow < menuH && rect.top > menuH;
    setCoords({
      top: (up ? rect.top - Math.min(menuH, rect.top) : rect.bottom) + window.scrollY,
      left: rect.left + window.scrollX,
      width: rect.width,
      up,
    });
  }, []);

  React.useEffect(() => {
    if (!open) return;
    measure();
    const onDoc = (e: MouseEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      // Nếu click bên trong button/wrapper hoặc bên trong menu (portal) thì KHÔNG đóng
      if (wrapperRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    const onWin = () => measure();
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    window.addEventListener("scroll", onWin, true);
    window.addEventListener("resize", onWin);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
      window.removeEventListener("scroll", onWin, true);
      window.removeEventListener("resize", onWin);
    };
  }, [open, measure]);

  return (
    <div ref={wrapperRef} className={className} style={{ width }}>
      <button
        ref={btnRef}
        type="button"
        title={title}
        onClick={() => setOpen(s => !s)}
        className="w-full h-9 px-3 rounded-xl bg-white/[0.04] ring-1 ring-white/10 hover:bg-white/[0.08] transition inline-flex items-center justify-between"
      >
        <span className="min-w-0 text-left text-sm text-white truncate">{selected ?? placeholder ?? "Chọn"}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open && coords && ReactDOM.createPortal(
        <div
          ref={menuRef}
          className="absolute z-50 rounded-xl bg-[#0c121a] ring-1 ring-white/10 shadow-xl overflow-hidden"
          style={{
            position: "absolute",
            top: coords.top,
            left: coords.left,
            width: coords.width,
            transformOrigin: coords.up ? "bottom left" : "top left"
          }}
        >
          <ul className="max-h-72 overflow-auto py-1">
            {options.map(o => {
              const active = (value ?? "") === o.value;
              return (
                <li key={o.value}>
                  <button
                    type="button"
                    onClick={() => { onChange(o.value || undefined); setOpen(false); }}
                    className={`w-full px-3 py-2.5 text-sm flex items-center justify-between hover:bg-white/[0.06] ${active ? "bg-white/[0.10]" : ""}`}
                    title={o.label}
                  >
                    <span className={`max-w-[calc(100%-18px)] truncate ${active ? "text-white" : "text-white/85"}`}>
                      {o.label}
                    </span>
                    {active && <Check className="h-4 w-4 opacity-90" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>,
        document.body
      )}
    </div>
  );
}

export default function AuthorRevenue({
  mode,
  onChangeMode,
}: {
  mode: Mode;
  onChangeMode: (m: Mode) => void;
}) {
  const navigate = useNavigate();

  const [rFrom, setRFrom] = React.useState<string | undefined>(undefined);
  const [rTo, setRTo] = React.useState<string | undefined>(undefined);
  const [novelId, setNovelId] = React.useState<string | undefined>(undefined);
  const [type, setType] = React.useState<"all" | "BuyChapter" | "BuyNovel">("all");
  const [q, setQ] = React.useState("");
  const [rGran, setRGran] = React.useState<Granularity>("day");

  const [series, setSeries] = React.useState<SeriesPoint[]>([]);
  const [topCoin, setTopCoin] = React.useState<TopItem[]>([]);
  const [purchasePage, setPurchasePage] = React.useState<PurchasePage>({ items: [], total: 0, page: 1, pageSize: 10 });

  React.useEffect(() => { fetchSeries({}).then(setSeries); fetchTopNovels({}).then(setTopCoin); }, []);

  const top5ByOrders = React.useMemo(
    () => [...topCoin].sort((a,b)=>b.orders - a.orders).slice(0,5),
    [topCoin]
  );

  const loadPurchases = React.useCallback(async (page: number, append = false) => {
    const params = { from: rFrom, to: rTo, q, novelId, type, page, pageSize: 10 } as const;
    const res = await fetchPurchases(params);
    setPurchasePage(prev => append ? { ...res, items: [...prev.items, ...res.items] } : res);
  }, [rFrom, rTo, q, novelId, type]);

  React.useEffect(() => { loadPurchases(1, false); }, [loadPurchases]);

  const seriesCoins = React.useMemo(() => aggregateSeries(series as any[], "ts", ["coins","orders"], rGran), [series, rGran]);
  const totalCoins = seriesCoins.reduce((s:any,x:any)=>s+x.coins,0);
  const totalOrders = seriesCoins.reduce((s:any,x:any)=>s+x.orders,0);

  const grouped = React.useMemo(() => {
    const m = new Map<string, Purchase[]>();
    for (const p of purchasePage.items) {
      const key = p.ts.slice(0, 10);
      if (!m.has(key)) m.set(key, []);
      m.get(key)!.push(p);
    }
    return Array.from(m.entries())
      .sort((a, b) => a[0] < b[0] ? 1 : -1)
      .map(([day, items]) => ({ day, items: items.sort((a,b)=>a.ts<b.ts?1:-1) }));
  }, [purchasePage.items]);

  const hasMore = purchasePage.items.length < purchasePage.total;

  const resetFilters = () => {
    setRFrom(undefined);
    setRTo(undefined);
    setNovelId(undefined);
    setType("all");
    setQ("");
    loadPurchases(1, false);
  };

  return (
    <Shell>
      <Container className="pt-6 pb-3">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-10">
            <button
              onClick={() => navigate(-1)}
              className="h-9 w-9 grid place-items-center rounded-lg bg-white/[0.06] ring-1 ring-white/10 hover:bg-white/[0.12] transition"
              title="Quay lại"
              aria-label="Quay lại"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="text-[18px] md:text-[20px] font-semibold leading-tight">
              Thống kê doanh thu
            </div>
          </div>

          <ModeToggle mode={mode} onChange={onChangeMode} />
        </div>
      </Container>

      <div className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-[#0a0f16]/70 mt-5">
        <Container className="pb-4">
          <Card className="px-3 py-2.5">
            <div className="flex flex-wrap items-center gap-2 date-white">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="inline-flex items-center gap-2 text-white/70 text-sm px-2">
                  <ListFilter className="h-4 w-4" /> Bộ lọc
                </div>

                <div className="flex items-center gap-1">
                  <div className="flex items-center gap-2 px-3 h-9 rounded-xl">
                    <SoftInput type="date" value={rFrom ?? ""} onChange={(e) => setRFrom(e.target.value || undefined)} />
                  </div>
                  <span className="text-white/40 text-sm">-</span>
                  <div className="flex items-center gap-2 px-3 h-9 rounded-xl">
                    <SoftInput type="date" value={rTo ?? ""} onChange={(e) => setRTo(e.target.value || undefined)} />
                  </div>
                </div>

                <InlineSelect
                  value={type}
                  onChange={(v) => setType((v as any) ?? "all")}
                  options={[
                    { value: "all", label: "Tất cả" },
                    { value: "BuyChapter", label: "Mua chương" },
                    { value: "BuyNovel", label: "Trọn gói" },
                  ]}
                  placeholder="Loại đơn"
                  title="Loại đơn"
                  width={150}
                />
                <InlineSelect
                  value={novelId ?? ""}
                  onChange={(v) => setNovelId(v || undefined)}
                  options={[
                    { value: "", label: "Tất cả truyện" },
                    { value: "n1", label: "Hào Quang Trở Lại" },
                    { value: "n2", label: "Đêm Dài Không Ngủ" },
                    { value: "n3", label: "Phong Ấn Trận — Tập 1: Khởi Nguyên Của Phong Ấn Rất Dài Để Test Ellipsis" },
                    { value: "n4", label: "Thiên Tài Viết Chữ" },
                    { value: "n5", label: "Bảy Năm Về Trước Và Những Câu Chuyện Chưa Kể Hết" },
                  ]}
                  placeholder="Chọn truyện"
                  title="Truyện"
                  width={250}
                />
              </div>

              <div className="ml-auto">
                <button
                  onClick={resetFilters}
                  className="h-9 px-3 rounded-xl bg-white/5 ring-1 ring-white/10 text-sm hover:bg-white/10 inline-flex items-center gap-2"
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
          <KpiPill label="Tổng coin" value={totalCoins.toLocaleString()} icon={<Coins className="h-4 w-4" />} />
          <KpiPill label="Tổng đơn" value={totalOrders.toLocaleString()} icon={<Users className="h-4 w-4" />} />
          <KpiPill label="Khoảng thời gian" value={renderRange(rFrom, rTo)} icon={<Calendar className="h-4 w-4" />} />
        </section>

        <section className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <Card className="p-4">
              <div className="mb-1 text-sm text-white/70">Biểu đồ doanh thu</div>
              <ChartToolbar granularity={rGran} onGranularity={setRGran} />
              <AreaChart series={seriesCoins} yKey="coins" />
            </Card>

            <Card className="p-0">
              <div className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <span className="h-6 w-6 grid place-items-center rounded-md bg-white/5 ring-1 ring-white/10">
                    <Clock className="h-3.5 w-3.5" />
                  </span>
                  Nhật ký mua chương / trọn gói
                </div>
                <div className="text-xs text-white/50 px-2">Mới nhất ở trên</div>
              </div>
              <div className="divide-y divide-white/10">
                {grouped.length === 0 ? (
                  <div className="px-4 py-10 text-center text-white/60">Không có giao dịch.</div>
                ) : (
                  grouped.map(({ day, items }) => (
                    <div key={day} className="px-4 py-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-sm font-medium">{day}</div>
                        <div className="text-xs text-white/50">· {items.length} lượt mua</div>
                      </div>
                      <ul className="space-y-2">
                        {items.map((p) => (
                          <li key={p.id} className="rounded-xl px-3 py-2 transition">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-3 min-w-0">
                                <div className="h-9 w-9 rounded-full bg-white/10 ring-1 ring-white/15 grid place-items-center shrink-0">
                                  <span className="text-sm font-semibold">{p.buyerName.split(" ").pop()?.[0] ?? "U"}</span>
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-medium">{p.buyerName}</span>
                                    <span className="text-white/50 text-xs">({maskId(p.buyerId)})</span>
                                    <span className={`px-2 py-0.5 text-[11px] rounded-full ring-1 ${p.type === "BuyChapter" ? "bg-blue-500/10 text-blue-300 ring-blue-500/30" : "bg-amber-500/10 text-amber-300 ring-amber-500/30"}`}>
                                      {p.type === "BuyChapter" ? "Mua chương" : "Trọn gói"}
                                    </span>
                                  </div>
                                  <div className="text-sm truncate">
                                    <span className="font-medium">{p.novelTitle}</span>
                                    <span className="text-white/60"> · {p.chapterTitle ? p.chapterTitle : <em>Trọn gói</em>}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                <div className="text-base font-semibold tabular-nums">{p.priceCoins.toLocaleString()} coin</div>
                                <div className="text-xs text-white/60">{fmt(p.ts)}</div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))
                )}
              </div>
              {hasMore && (
                <div className="px-4 py-3 border-t border-white/10 flex items-center justify-between">
                  <div className="text-xs text-white/60">Đang hiển thị {purchasePage.items.length}/{purchasePage.total}</div>
                  <button
                    className="h-9 px-3 rounded-xl bg-white/5 ring-1 ring-white/10 text-sm hover:bg-white/10"
                    onClick={() => loadPurchases(purchasePage.page + 1, true)}
                  >
                    Xem thêm
                  </button>
                </div>
              )}
            </Card>
          </div>

          <div className="col-span-12 lg:col-span-4 space-y-6">
            <Card className="p-0 overflow-hidden">
              <div className="px-3 py-3 text-sm text-white/70 flex items-center gap-2">
                <span className="h-5 w-5 rounded-md bg-white/5 ring-1 ring-white/10 grid place-items-center">🏆</span>
                Top 5 truyện được mua nhiều nhất
              </div>
              <table className="w-full text-sm table-fixed">
                <colgroup>
                  <col className="w-[55%]" />
                  <col className="w-[20%]" />
                  <col className="w-[25%]" />
                </colgroup>
                <thead className="text-left text-white/60">
                  <tr className="border-t border-white/10">
                    <th className="px-3 py-2">Truyện</th>
                    <th className="px-3 py-2">Coin</th>
                    <th className="px-3 py-2 text-center">Lượt mua</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {top5ByOrders.map((n) => (
                    <tr key={n.novelId} className="hover:bg-white/[0.04]">
                      <td className="px-3 py-2 truncate">{n.title}</td>
                      <td className="px-3 py-2 tabular-nums">{n.coins.toLocaleString()}</td>
                      <td className="px-3 py-2 tabular-nums text-center">{n.orders.toLocaleString()}</td>
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
}
