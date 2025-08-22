import type { TopNovelRes } from "../../../api/AuthorIncome/income.type";
import { TopNovelsCard } from "./TopNovelsCard";

type Props = {
  data: TopNovelRes[];
};

export const TopNovelsList = ({ data }: Props) => {
  if (!data || data.length === 0) {
    return <p className="text-gray-500">Không có dữ liệu thu nhập.</p>;
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {data.map((novel, index) => (
        <TopNovelsCard key={`${novel.novelId}-${index}`} data={novel} />
      ))}
    </div>
  );
};
