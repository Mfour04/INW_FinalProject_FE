import TopCard from "../AdminModal/TopCard";

interface NovelTopSectionProps<T> {
  novels: T[];
  threeDaysAgo: number;
}

const NovelTopSection = <T extends Record<string, unknown>>({
  novels,
  threeDaysAgo,
}: NovelTopSectionProps<T>) => {
  const mostViewedNovels = [...novels]
    .sort((a, b) => Number(b.TotalViews) - Number(a.TotalViews))
    .slice(0, 3);
  const topRatedNovels = [...novels]
    .sort((a, b) => Number(b.RatingAvg) - Number(a.RatingAvg))
    .slice(0, 3);
  const viewFollowerTrend = [...novels]
    .filter((novel) => Number(novel.UpdateAt) > threeDaysAgo)
    .sort((a, b) => Number(b.Followers) - Number(a.Followers))
    .slice(0, 3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <TopCard
        title="Truyện xem nhiều"
        items={mostViewedNovels}
        itemKey="Title"
        imageKey="NovelImage"
        valueKey="TotalViews"
        valueFormatter={(value) => `${value.toLocaleString()} views`}
      />
      <TopCard
        title="Truyện đánh giá cao"
        items={topRatedNovels}
        itemKey="Title"
        imageKey="NovelImage"
        valueKey="RatingAvg"
        valueFormatter={(value) => `${value.toFixed(1)}/5`}
      />
      <TopCard
        title="Xu hướng follow"
        items={viewFollowerTrend}
        itemKey="Title"
        imageKey="NovelImage"
        valueKey="Followers"
        valueFormatter={(value) => `${value.toLocaleString()} follows`}
      />
    </div>
  );
};

export default NovelTopSection;
