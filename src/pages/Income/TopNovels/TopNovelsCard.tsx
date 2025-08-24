import type { TopNovelRes } from "../../../api/AuthorIncome/income.type";

type Props = {
  data: TopNovelRes;
};

export const TopNovelsCard = ({ data }: Props) => {
  return (
    <div className="max-w-2xl w-full bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-200">
      <div className="flex items-center gap-4 p-4 border-b">
        <img
          src={data.image}
          alt={data.title}
          className="w-20 h-28 object-cover rounded-lg"
        />
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-gray-800">{data.title}</h2>
          <p className="text-sm text-gray-500">ID: {data.novelId}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 p-4 text-sm">
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-gray-500">Tổng xu</p>
          <p className="text-lg font-semibold text-green-600">
            {(data.totalCoins ?? 0).toLocaleString()} xu
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-gray-500">Bán chương</p>
          <p className="text-lg font-semibold text-blue-600">
            {data.chapterSalesCount} ({data.chapterCoins} xu)
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-gray-500">Bán truyện</p>
          <p className="text-lg font-semibold text-purple-600">
            {data.novelSalesCount} ({data.novelCoins} xu)
          </p>
        </div>
      </div>

      <div className="p-4 border-t">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">
          Chi tiết chương
        </h3>
        <ul className="divide-y text-sm">
          {(data.chapterDetails ?? []).map((c) => (
            <li key={c.chapterId} className="py-2 flex justify-between">
              <span className="text-gray-700">Chương {c.chapterId}</span>
              <span className="text-gray-600">
                {c.salesCount} lượt - {c.coins} xu
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
