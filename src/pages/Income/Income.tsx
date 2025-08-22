import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type {
  IncomeChartParams,
  IncomeSummaryParams,
  TopNovelsParams,
} from "../../api/AuthorIncome/income.type";
import { useAuth } from "../../hooks/useAuth";
import {
  GetIncomeChart,
  GetIncomeSummary,
  GetTopNovels,
} from "../../api/AuthorIncome/income.api";
import { IncomeSummary } from "./IncomeSummary/IncomeSummary";
import IncomeChart, { type ChartType } from "./IncomeChart/IncomeChart";
import { TopNovelsList } from "./TopNovels/TopNovelsList";

export const Income = () => {
  const { auth } = useAuth();
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [incomeSumParams, setIncomeSumParams] = useState<IncomeSummaryParams>({
    userId: auth?.user.userId!,
    startDate: "08/01/2025",
    endDate: "08/31/2025",
  });
  const [incomeChartParams, setIncomeChartParams] = useState<IncomeChartParams>(
    {
      userId: auth?.user.userId!,
      startDate: "08/01/2025",
      endDate: "08/31/2025",
    }
  );
  const [topNovelsParams, setTopNovels] = useState<TopNovelsParams>({
    userId: auth?.user.userId!,
    startDate: "08/01/2025",
    endDate: "08/31/2025",
  });
  const [chartType, setChartType] = useState<ChartType>("line");

  const { data: incomeSum, isLoading: incomSumLoading } = useQuery({
    queryKey: ["income-sum", incomeSumParams],
    queryFn: () =>
      GetIncomeSummary(incomeSumParams).then((res) => res.data.data),
    enabled: !!incomeSumParams.userId,
  });

  const { data: incomeChart, isLoading: incomChartLoading } = useQuery({
    queryKey: ["income-chart", incomeChartParams],
    queryFn: () =>
      GetIncomeChart(incomeChartParams).then((res) => res.data.data),
    enabled: !!incomeChartParams.userId,
  });

  const { data: topNovels, isLoading: topNovelsLoading } = useQuery({
    queryKey: ["top-novels", topNovelsParams],
    queryFn: () => GetTopNovels(topNovelsParams).then((res) => res.data.data),
    enabled: !!topNovelsParams.userId,
  });

  const setAllParams = (range: { startDate: string; endDate: string }) => {
    setIncomeSumParams((prev) => ({ ...prev, ...range }));
    setIncomeChartParams((prev) => ({ ...prev, ...range }));
    setTopNovels((prev) => ({ ...prev, ...range }));
  };

  const getMonthRange = (year: number, month: number) => {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);
    return {
      startDate: start.toLocaleDateString("en-US"),
      endDate: end.toLocaleDateString("en-US"),
    };
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const year = Number(e.target.value);
    setSelectedYear(year);
    const range = getMonthRange(year, 1);
    setAllParams(range);
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const month = Number(e.target.value);
    const range = getMonthRange(selectedYear, month);
    setAllParams(range);
  };

  const yearOptions = Array.from({ length: 3 }, (_, i) => currentYear - i);

  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    return {
      value: month,
      label: `Tháng ${month}/${selectedYear}`,
    };
  });

  return (
    <div className="mx-auto mt-[40px] max-w-5xl">
      {/* Bộ lọc thời gian */}
      <div className="flex justify-center gap-6 flex-wrap mb-10">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-600">Năm:</label>
          <select
            value={selectedYear}
            onChange={handleYearChange}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {yearOptions.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-600">Tháng:</label>
          <select
            onChange={handleMonthChange}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {monthOptions.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tổng kết thu nhập */}
      <div className="flex justify-center mb-10">
        <IncomeSummary
          summary={incomeSum!}
          title={`Thu nhập tháng 8/${selectedYear}`}
        />
      </div>

      {/* Biểu đồ thu nhập */}
      <div className="flex flex-col items-center gap-6 mb-10">
        {/* Chọn loại biểu đồ */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-600">
            Loại biểu đồ:
          </label>
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value as "line" | "bar")}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="line">Line Chart</option>
            <option value="bar">Bar Chart</option>
          </select>
        </div>

        <IncomeChart data={incomeChart || []} type={chartType} />
      </div>

      {/* Top tiểu thuyết */}
      <div className="flex justify-center">
        <TopNovelsList data={topNovels!} />
      </div>
    </div>
  );
};
