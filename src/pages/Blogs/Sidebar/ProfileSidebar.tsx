import { useAuth } from "../../../hooks/useAuth";
import abc from "../../../assets/img/th.png";

const ProfileSidebar = () => {
  const { auth } = useAuth();
  const displayName = auth?.user?.displayName || auth?.user?.userName || "User";
  const handle = auth?.user?.userName || "user";
  const avatar = auth?.user?.avatarUrl || abc;

  return (
    <aside className="w-full mt-6 xl:mt-0">
      {/* Gradient hairline border */}
      <div className="rounded-2xl p-[1px] bg-[linear-gradient(135deg,rgba(255,103,64,0.35),rgba(255,255,255,0.08)_28%,rgba(255,255,255,0)_100%)]">
        {/* Card */}
        <div className="rounded-2xl overflow-hidden bg-[#1a1a1d]">
          {/* Cover */}
          <div className="relative h-[84px]">
            <div className="absolute inset-0 bg-[radial-gradient(120%_100%_at_0%_0%,rgba(255,103,64,0.35)_0%,rgba(255,103,64,0.08)_38%,rgba(255,255,255,0)_70%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0)_60%)]" />
          </div>

          {/* Avatar */}
          <div className="px-5">
            <div className="-mt-9 inline-flex rounded-full p-[2px] bg-[conic-gradient(from_210deg,#ff512f_0%,#ff6740_40%,#ff9966_75%,#ff512f_100%)] shadow-[0_8px_30px_rgba(255,103,64,0.25)]">
              <img
                src={avatar}
                alt={displayName}
                className="w-[72px] h-[72px] rounded-full object-cover bg-zinc-900 ring-4 ring-[#1a1a1d]"
              />
            </div>
          </div>

          {/* Info */}
          <div className="px-5 pt-3 pb-5">
            <div className="mb-3">
              <h2 className="text-[15px] sm:text-base font-bold text-white leading-tight">
                {displayName}
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400">@{handle}</p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-full px-3 py-1.5 bg-zinc-900/60 ring-1 ring-zinc-800">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="text-[13px] text-zinc-300">
                  <b className="text-white">3</b> Đang theo dõi
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-full px-3 py-1.5 bg-zinc-900/60 ring-1 ring-zinc-800">
                <span className="h-2 w-2 rounded-full bg-sky-400" />
                <span className="text-[13px] text-zinc-300">
                  <b className="text-white">2</b> Người theo dõi
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default ProfileSidebar;
