import type { User } from "../../../api/Admin/User/user.type";
import TopCard from "../AdminModal/TopCard";

interface UserTopSectionProps {
  users: User[];
}

const UserTopSection = ({ users }: UserTopSectionProps) => {
  const topFollowers = users.length
    ? [...users]
        .sort(
          (a, b) => Number(b.followerCount ?? 0) - Number(a.followerCount ?? 0)
        )
        .slice(0, 3)
    : [];
  const topCoinUsers = users.length
    ? [...users]
        .sort((a, b) => Number(b.coin ?? 0) - Number(a.coin ?? 0))
        .slice(0, 3)
    : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 justify-center">
      <TopCard
        title="Top follower"
        items={topFollowers}
        itemKey="displayName"
        imageKey="avatarUrl"
        valueKey="followerCount"
        valueFormatter={(value) => `${value.toLocaleString()} follower`}
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
