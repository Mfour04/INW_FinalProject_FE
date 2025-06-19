import { useState } from 'react';
import bannerImage from "../../assets/img/th.png";
import avatarImage from "../../assets/img/hlban.jpg";
import '../../pages/userProfile/UserProfile.css';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

export const UserProfile = () => {
  const [activeTab, setActiveTab] = useState<'posts' | 'followers' | 'following' | 'achievements'>('posts');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'posts':
        return (
          <div className="mt-6 bg-gray-900 p-4 rounded-lg border border-gray-700">
            <div className="flex items-center space-x-4">
              <img src={bannerImage} alt="Avatar" className="w-10 h-10 rounded-full" />
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
        );

      case 'followers':
        return (
          <div className="mt-6 grid grid-cols-5 gap-4">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="bg-gray-900 p-4 rounded-lg border border-gray-700 flex flex-col items-center">
                <img src={bannerImage} alt="Follower" className="w-16 h-16 rounded-full mb-2" />
                <p className="font-semibold text-white text-sm text-center">August {i + 1}</p>
                <p className="text-xs text-gray-400 text-center">@nguoitheodoi{i + 1}</p>
                <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 mt-2 rounded">Theo dõi</button>
              </div>
            ))}
          </div>
        );

      case 'following':
        return (
          <div className="mt-6 grid grid-cols-5 gap-4">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="bg-gray-900 p-4 rounded-lg border border-gray-700 flex flex-col items-center">
                <img src={avatarImage} alt="Follower" className="w-16 h-16 rounded-full mb-2" />
                <p className="font-semibold text-white text-sm text-center">August {i + 1}</p>
                <p className="text-xs text-gray-400 text-center">@nguoitheodoi{i + 1}</p>
                <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 mt-2 rounded">Theo dõi</button>
              </div>
            ))}
          </div>
        );

      default:
        return <p className="mt-6 text-gray-400">Chưa có dữ liệu trong tab này.</p>;
    }
  };

  return (
    <div className="bg-black text-white font-sans h-screen flex flex-col">

      <div className="img_banner relative">
        <img src={avatarImage} alt="Banner" className="w-full h-80 object-cover rounded" />
        <div className="absolute left-8 bottom-[-110px]">
          <img src={bannerImage} alt="Avatar" className="w-60 h-60 rounded-full border-5 border-white" />
        </div>
      </div>

      <div className="mt-3 px-80">
        <div className="flex justify-between">
          <div>
            <h1 className="text-5xl font-bold">Hít Lê</h1>
            <p className="text-gray-400">@fromgermanwithlove</p>
            <span className="mr-4"><strong className="text-white">3</strong> Đang theo dõi</span>
            <span><strong className="text-white">2</strong> Người theo dõi</span>
          </div>
          <div>
            <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-5 rounded">Theo dõi</button>
            <MoreHorizIcon className="ml-4" style={{ color: 'gray', cursor: 'pointer' }} />
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-400">📅 Tham gia từ Tháng 3/2025</p>
      </div>

      <div className="mt-6 border-b border-gray-700 flex space-x-9 text-sm px-10">
        <div onClick={() => setActiveTab('posts')} className={`ursor-pointer ${activeTab === 'posts' ? 'border-b-2 border-orange-500' : 'hover:text-gray-300'}`}>Bài đăng</div>
        <div onClick={() => setActiveTab('followers')} className={`cursor-pointer ${activeTab === 'followers' ? 'border-b-2 border-orange-500' : 'hover:text-gray-300'}`}>Người theo dõi</div>
        <div onClick={() => setActiveTab('following')} className={`cursor-pointer ${activeTab === 'following' ? 'border-b-2 border-orange-500' : 'hover:text-gray-300'}`}>Đang theo dõi</div>
        <div onClick={() => setActiveTab('achievements')} className={`cursor-pointer ${activeTab === 'achievements' ? 'border-b-2 border-orange-500' : 'hover:text-gray-300'}`}>Thành tựu</div>
      </div>


      {/* <div className="overflow-y-auto px-10">
        {renderTabContent()}
      </div> */}
    </div>
  );
};
