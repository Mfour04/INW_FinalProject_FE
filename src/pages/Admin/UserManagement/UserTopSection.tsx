import type { User } from "../../../api/Admin/User/user.type";
import TopCard from "../AdminModal/TopCard";

interface UserTopSectionProps {
  users: User[];
}

const UserTopSection = ({ users }: UserTopSectionProps) => {
  const topReaders = users.length
    ? [...users]
        .sort((a, b) => Number(b.readCount ?? 0) - Number(a.readCount ?? 0))
        .slice(0, 1)
    : [];
  const topFollowers = users.length
    ? [...users]
        .sort(
          (a, b) =>
            Number(b.novelFollowCount ?? 0) - Number(a.novelFollowCount ?? 0)
        )
        .slice(0, 1)
    : [];
  const topCoinUsers = users.length
    ? [...users]
        .sort((a, b) => Number(b.coin ?? 0) - Number(a.coin ?? 0))
        .slice(0, 1)
    : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <TopCard
        title="Top đọc truyện"
        items={topReaders}
        itemKey="displayName"
        imageKey="avatarUrl"
        valueKey="readCount"
        valueFormatter={(value) => `${value.toLocaleString()} chương`}
      />
      <TopCard
        title="Top follow"
        items={topFollowers}
        itemKey="displayName"
        imageKey="avatarUrl"
        valueKey="novelFollowCount"
        valueFormatter={(value) => `${value.toLocaleString()} follows`}
      />
      <TopCard
        title="Top nạp coin"
        items={topCoinUsers}
        itemKey="displayName"
        imageKey="avatarUrl"
        valueKey="coin"
        valueFormatter={(value) => `${value.toLocaleString()} coin`}
      />
    </div>
  );
};

export default UserTopSection;
