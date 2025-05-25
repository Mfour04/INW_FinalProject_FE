import bannerImage from '../assets/img/th.png';
import avatarImage from '../assets/img/hlban.jpg';

export const UserProfile = () => {


  return (
    <div className="bg-black text-white font-sans min-h-screen">

      <div className="relative">
        <img
          src={avatarImage}
          alt="Banner"
          className="w-full h-40 object-cover"
        />
        <div className="absolute left-8 bottom-[-50px]">
          <img
            src={bannerImage}
            alt="Avatar"
            className="w-28 h-28 rounded-full border-4 border-black"
          />
        </div>
      </div>

      <div className="mt-16 px-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">Hít Lê</h1>
            <p className="text-gray-400">@fromgermanwithlove</p>
            <p className="text-sm mt-1 text-gray-400">📅 Tham gia từ Tháng 3/2025</p>
          </div>
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-1 px-4 rounded">
            Theo dõi
          </button>
        </div>

        <div className="mt-4 text-sm text-gray-400">
          <span className="mr-4"><strong className="text-white">3</strong> Đang theo dõi</span>
          <span><strong className="text-white">2</strong> Người theo dõi</span>
        </div>

        <div className="mt-6 border-b border-gray-700 flex space-x-8 text-sm">
          <div className="border-b-2 border-orange-500 pb-2 cursor-pointer">Bài đăng</div>
          <div className="pb-2 cursor-pointer hover:text-gray-300">Người theo dõi</div>
          <div className="pb-2 cursor-pointer hover:text-gray-300">Đang theo dõi</div>
          <div className="pb-2 cursor-pointer hover:text-gray-300">Thành tựu</div>
        </div>

        <div className="mt-6 bg-gray-900 p-4 rounded-lg border border-gray-700">
          <div className="flex items-center space-x-4">
            <img
              src={bannerImage}
              alt="Avatar"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-semibold">Hít Lê</p>
              <p className="text-xs text-gray-400">@fromgermanwithlove • 39 giây trước</p>
            </div>
          </div>
          <p className="mt-4">Tình yêu nồng cháy không phải do em mà là dothai</p>
          <div className="mt-4 flex space-x-6 text-gray-400 text-sm">
            <span className="cursor-pointer">❤️ Yêu thích</span>
            <span className="cursor-pointer">💬 Bình luận</span>
          </div>
        </div>
      </div>
    </div>
  )
}
