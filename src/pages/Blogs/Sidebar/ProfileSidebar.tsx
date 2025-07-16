import abc from "../../../assets/img/th.png";

const ProfileSidebar: React.FC = () => (
  <div className="w-full lg:w-[28%] mt-6 lg:mt-0 px-4 sm:px-6 lg:px-0">
    <div className="bg-[#2b2b2c] rounded-[10px] overflow-hidden">
      <div className="h-[74px] bg-[#d9d9d9] relative">
        <div className="absolute -bottom-8 left-5">
          <img
            src={abc}
            alt="Nguyen Dinh"
            className="w-[74px] h-[74px] rounded-full border-4 border-[#2b2b2c] object-cover"
          />
        </div>
      </div>
      <div className="pt-12 px-5 pb-5">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-white mb-1">Nguyen Dinh</h2>
          <p className="text-sm text-[#cecece]">@dinhvanbaonguyen</p>
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
        <button className="w-full bg-[#ff6740] hover:bg-[#e55a36] text-white font-bold py-2 px-8 rounded-[18px] transition-colors">
          Tạo bài viết
        </button>
      </div>
    </div>
  </div>
);

export default ProfileSidebar;
