// IncomeChart.tsx
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import type { IncomeChartRes } from "../../../api/AuthorIncome/income.type";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export type ChartType = "line" | "bar";

type Props = {
  data: IncomeChartRes[];
  type?: ChartType;
};

export default function IncomeChart({ data, type = "line" }: Props) {
  if (data.length === 0) return;
  const chartData = {
    labels: data.map((item) => item.label),
    datasets: [
      {
        label: "Thu nhập (xu)",
        data: data.map((item) => item.coins),
        borderColor: "rgba(59,130,246,1)", // Tailwind blue-500
        backgroundColor: "rgba(59,130,246,0.5)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Biểu đồ thu nhập",
      },
    },
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white p-4 rounded-2xl shadow">
      {type === "line" ? (
        <Line options={options} data={chartData} />
      ) : (
        <Bar options={options} data={chartData} />
      )}
    </div>
  );
}
