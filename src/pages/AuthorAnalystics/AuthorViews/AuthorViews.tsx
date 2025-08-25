import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  Eye,
  BarChart3,
  ListFilter,
  RotateCcw,
  Bookmark,
  BookMarked,
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
import {
  fetchViewsSeries,
  fetchTopViews,
  fetchTopChapterViews,
  fetchReferrers,
  type ViewPoint,
} from "../analyticsMock";
import type { Mode } from "../AuthorAnalytics";
import { aggregateSeries, renderRange, type Granularity } from "../util";
import { ModeToggle } from "../components/ModeToggle";
import { useQuery } from "@tanstack/react-query";
import type { TopNovelsParams } from "../../../api/AuthorIncome/income.type";
import {
  GetTopNovelsRating,
  GetTopNovelsViews,
} from "../../../api/AuthorIncome/income.api";

type Props = {
  mode: Mode;
  onChangeMode: (m: Mode) => void;
};

export const AuthorViews = ({ mode, onChangeMode }: Props) => {
  const navigate = useNavigate();

  const [vFrom, setVFrom] = useState<string | undefined>(undefined);
  const [vTo, setVTo] = useState<string | undefined>(undefined);
  const [vGran, setVGran] = useState<Granularity>("day");

  const [series, setSeries] = useState<ViewPoint[]>([]);
  const [topViews, setTopViews] = useState<
    { novelId: string; title: string; views: number }[]
  >([]);
  const [topChapters, setTopChapters] = useState<
    { id: string; title: string; novelTitle: string; views: number }[]
  >([]);
  const [referrers, setReferrers] = useState<
    { source: string; views: number }[]
  >([]);
  const [topNovelParams, setTopNovelParams] = useState<TopNovelsParams>({
    limit: 10,
  });

  const { data: topNovels } = useQuery({
    queryKey: ["top-novels-views", topNovelParams],
    queryFn: () => GetTopNovelsViews(topNovelParams).then((res) => res.data),
  });

  const { data: topRatings } = useQuery({
    queryKey: ["top-novels-rating", topNovelParams],
    queryFn: () => GetTopNovelsRating(topNovelParams).then((res) => res.data),
  });

  const seriesViews = useMemo(
    () => aggregateSeries(series as any[], "ts", ["views"], vGran),
    [series, vGran]
  );

  const totalViews = seriesViews.reduce((s: any, x: any) => s + x.views, 0);
  const avgViewsPerBucket = Math.round(
    totalViews / Math.max(1, seriesViews.length)
  );

  const resetFilters = () => {
    setVFrom(undefined);
    setVTo(undefined);
  };

  useEffect(() => {
    fetchViewsSeries({}).then(setSeries);
    fetchTopViews({}).then(setTopViews);
    fetchTopChapterViews({}).then(setTopChapters);
    fetchReferrers({}).then(setReferrers);
  }, []);

  return (
    <Shell>
      {/* Header — toggle nằm cùng hàng, sát bên phải */}
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
              Thống kê lượt xem
            </div>
          </div>

          <ModeToggle mode={mode} onChange={onChangeMode} />
        </div>
      </Container>

      {/* Filters */}
      {/* <div className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-[#0a0f16]/70 mt-5">
        <Container className="pb-4">
          <Card className="px-3 py-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 text-white/70 text-sm px-2">
                <ListFilter className="h-4 w-4" /> Bộ lọc
              </div>

              <div className="flex items-center gap-1">
                <div className="flex items-center gap-2 px-3 h-9 rounded-xl">
                  <SoftInput
                    type="date"
                    value={vFrom ?? ""}
                    onChange={(e) => setVFrom(e.target.value || undefined)}
                  />
                </div>
                <span className="text-white/40 text-sm">-</span>
                <div className="flex items-center gap-2 px-3 h-9 rounded-xl">
                  <SoftInput
                    type="date"
                    value={vTo ?? ""}
                    onChange={(e) => setVTo(e.target.value || undefined)}
                  />
                </div>
              </div>

              <div className="ml-auto flex items-center gap-4">
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
      </div> */}

      {/* Body */}
      <Container className="pb-12 space-y-6">
        {/* KPIs */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <KpiPill
            label="Tổng view"
            value={topNovels?.data.totalViews!}
            icon={<Eye className="h-4 w-4" />}
          />
          <KpiPill
            label={`Số lượt đánh giá`}
            value={topRatings?.data.totalRatings!}
            icon={<BookMarked className="h-4 w-4" />}
          />
        </section>

        {/* Main grid */}
        <section className="grid grid-cols-12 gap-6">
          {/* <div className="col-span-12 lg:col-span-8 space-y-6">
            <Card className="p-4">
              <div className="mb-1 text-sm text-white/70">Biểu đồ lượt xem</div>
              <ChartToolbar granularity={vGran} onGranularity={setVGran} />
              <AreaChart series={seriesViews} yKey="views" />
            </Card>
          </div> */}

          <div className="col-span-12 lg:col-span-8 grid grid-cols-2 gap-6">
            <Card className="p-0 overflow-hidden">
              <div className="px-3 py-3 text-sm text-white/70 flex items-center gap-2">
                <span className="h-5 w-5 rounded-md bg-white/5 ring-1 ring-white/10 grid place-items-center">
                  <Eye className="h-3 w-3" />
                </span>
                Top truyện có lượt xem cao nhất
              </div>
              <ul className="divide-y divide-white/10">
                {topNovels?.data.topViewNovels.map((t, i) => (
                  <li
                    key={t.novelId}
                    className="px-3 py-2 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-7 w-7 rounded-lg bg-white/5 ring-1 ring-white/10 grid place-items-center text-xs">
                        {i + 1}
                      </div>
                      <div className="text-xs text-white/90 truncate max-w-[160px]">
                        {t.title}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs tabular-nums text-white/80 flex items-center gap-2">
                        {t.totalViews.toLocaleString()}
                        <Eye className="h-3 w-3" />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-0 overflow-hidden">
              <div className="px-3 py-3 text-sm text-white/70 flex items-center gap-2">
                <span className="h-5 w-5 rounded-md bg-white/5 ring-1 ring-white/10 grid place-items-center">
                  <Eye className="h-3 w-3" />
                </span>
                Top truyện có lượt xem cao nhất
              </div>
              <ul className="divide-y divide-white/10">
                {topRatings?.data.topRatedNovels.map((t, i) => (
                  <li
                    key={t.novelId}
                    className="px-3 py-2 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-7 w-7 rounded-lg bg-white/5 ring-1 ring-white/10 grid place-items-center text-xs">
                        {i + 1}
                      </div>
                      <div className="text-xs text-white/90 truncate max-w-[160px]">
                        {t.title}
                      </div>
                    </div>
                    <div className="text-right shrink-0 flex gap-5">
                      <div className="text-xs tabular-nums text-white/80 flex items-center gap-2 justify-end">
                        {t.ratingAvg}
                        <BookMarked className="h-3 w-3" />
                      </div>
                      <div className="text-xs tabular-nums text-white/80 flex items-center gap-2 justify-end">
                        {t.ratingCount}
                        <Bookmark className="h-3 w-3" />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </section>
      </Container>
    </Shell>
  );
};
