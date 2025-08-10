import { useAuth } from "../../../hooks/useAuth";
import abc from "../../../assets/img/th.png";

const ProfileSidebar = () => {
  const { auth } = useAuth();

  return (
    <div className="w-full mt-6 xl:mt-0">
      <div className="bg-[#2b2b2c] rounded-[10px] overflow-hidden">
        <div className="h-[74px] bg-[#d9d9d9] relative">
          <div className="absolute -bottom-8 left-5">
            <img
              src={auth?.user?.avatarUrl || abc}
              alt={auth?.user?.displayName || "User"}
              className="w-[74px] h-[74px] rounded-full border-4 border-[#2b2b2c] object-cover"
            />
          </div>
        </div>
        <div className="pt-12 px-5 pb-5">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-white mb-1">
              {auth?.user?.displayName || auth?.user?.userName || "User"}
            </h2>
            <p className="text-sm text-[#cecece]">
              @{auth?.user?.userName || "user"}
            </p>
          </div>
          <div className="flex items-center gap-4 mb-5">
            <div className="flex items-center gap-1">
              <span className="text-sm font-semibold text-white">3</span>
              <span className="text-sm text-white">Đang theo dõi</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm font-semibold text-white">2</span>
              <span className="text-sm text-white">Người theo dõi</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;
