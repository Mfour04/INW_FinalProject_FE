import { useAuth } from "../../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { GetFollowers, GetFollowing } from "../../../api/UserFollow/user-follow.api";
import abc from "../../../assets/img/default_avt.png";

const Stat = ({
  label,
  value,
  loading,
}: {
  label: string;
  value: number;
  loading?: boolean;
}) => (
  <div className="flex flex-col items-center gap-0.5">
    {loading ? (
      <>
        <div className="h-5 w-10 rounded bg-zinc-200 dark:bg-white/10 animate-pulse" />
        <div className="h-3 w-20 rounded bg-zinc-200 dark:bg-white/10 animate-pulse mt-1" />
      </>
    ) : (
      <>
        <span className="text-[15px] font-semibold tabular-nums text-zinc-900 dark:text-white">
          {value}
        </span>
        <span className="text-[11px] text-zinc-500 dark:text-zinc-400">{label}</span>
      </>
    )}
  </div>
);

const ProfileSidebar = () => {
  const { auth } = useAuth();
  const displayName = auth?.user?.displayName || auth?.user?.userName || "User";
  const handle = auth?.user?.userName || "user";
  const avatar = auth?.user?.avatarUrl || abc;

  const { data: followersData, isLoading: loadingFollowers } = useQuery({
    queryKey: ["followers", handle],
    queryFn: () => GetFollowers(handle),
    enabled: !!handle,
    staleTime: 1000 * 60 * 5,
  });

  const { data: followingData, isLoading: loadingFollowing } = useQuery({
    queryKey: ["following", handle],
    queryFn: () => GetFollowing(handle),
    enabled: !!handle,
    staleTime: 1000 * 60 * 5,
  });

  const followingCount = Array.isArray(followingData?.data) ? followingData.data.length : 0;
  const followersCount = Array.isArray(followersData?.data) ? followersData.data.length : 0;

  return (
    <aside className="w-full mt-6 xl:mt-0">
      <div className="rounded-2xl bg-white ring-1 ring-zinc-200 shadow-sm p-5 text-center dark:bg-[#111317] dark:ring-white/10">
        {/* Avatar */}
        <div className="mx-auto w-20 h-20 rounded-full ring-1 ring-zinc-200 overflow-hidden dark:ring-white/10">
          <img
            src={avatar}
            alt={displayName}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="mt-3">
          <h2 className="text-[15px] font-semibold text-zinc-900 truncate dark:text-white">
            {displayName}
          </h2>
          <p className="text-xs text-zinc-500 truncate dark:text-zinc-400">@{handle}</p>
        </div>

        {/* Divider mảnh */}
        <div className="mt-4 h-px w-full bg-zinc-200 dark:bg-white/10" />

        {/* Stats: grid 2 cột, cân giữa */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Stat label="Đang theo dõi" value={followingCount} loading={loadingFollowing} />
          <Stat label="Người theo dõi" value={followersCount} loading={loadingFollowers} />
        </div>
      </div>
    </aside>
  );
};

export default ProfileSidebar;
