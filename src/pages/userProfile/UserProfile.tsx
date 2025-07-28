import { useState } from 'react';
import avatarImage from '../../assets/img/th.png';
import bannerImage from '../../assets/img/hlban.jpg';
import '../../pages/userProfile/UserProfile.css';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import BlockIcon from '@mui/icons-material/Block';
import { CalendarUserIcon, Flag02Icon, CommentAdd01Icon } from './UserProfileIcon';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

export const UserProfile = () => {

  const [activeTab, setActiveTab] = useState<'posts' | 'followers' | 'following' | 'achievements'>('posts');
  const [isFollowing, setIsFollowing] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleFollowClick = () => {
    setIsFollowing(!isFollowing);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'posts':
        return (
          <div>
            {[...Array(20)].map((_, i) => (
              <div key={i} className="mt-4 bg-gray-900 p-4 rounded-lg border border-gray-700 w-full">
                <div className="flex items-center space-x-4">
                  <img src={bannerImage} alt="Avatar" className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="font-semibold">Hít Lê</p>
                    <p className="text-xs text-gray-400">@fromgermanwithlove • 39 giây trước</p>
                  </div>
                </div>
                <p className="mt-4">Tình yêu nồng cháy không phải do em mà là dothai.</p>
                <hr className="my-4 border-t border-gray-700" />
                <div className="mt-4 flex space-x-6 text-white">
                  <span className="flex items-center gap-2">
                    <FavoriteBorderIcon />
                    Yêu thích
                  </span>
                  <span className="flex items-center gap-2">
                    <CommentAdd01Icon />
                    Bình luận
                  </span>
                </div>

              </div>
            ))}
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
    <div className="profile bg-black text-white font-sans h-screen flex flex-col">
      <div className="img_banner relative">
        <img src={bannerImage} alt="Banner" className="w-full h-70 object-cover rounded" />
        <div className="absolute left-8 bottom-[-105px]">
          <img src={avatarImage} alt="Avatar" className="w-60 h-60 rounded-full border-5 border-white" />
        </div>
      </div>

      <div className="flex justify-end items-center px-12 mt-4 space-x-4">
        <Button
          onClick={handleFollowClick}
          variant="contained"
          sx={{
            width: '140px',
            backgroundColor: isFollowing ? '#3a3a3a' : '#ff4500',
            color: '#fff',
            textTransform: 'none',
            borderRadius: '6px',
            padding: '6px 20px',
            fontWeight: 600,
            fontSize: '17px',
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: isFollowing ? '#555' : '#e03e00',
            },
          }}
        >
          {isFollowing ? 'Bỏ theo dõi' : 'Theo dõi'}
        </Button>

        <div
          onClick={handleMenuOpen}
          className="cursor-pointer z-50 relative px-2 py-3 hover:bg-gray-700 rounded"
        >
          <MoreHorizIcon style={{ color: '#aaa' }} />
        </div>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}

          slotProps={{
            paper: {
              sx: {
                bgcolor: '#1f1f1f',
                color: '#fff',
                borderRadius: 2,
                minWidth: 200,
                boxShadow: 4,
              },
            },
          }}
        >
          <MenuItem
            onClick={() => alert('Báo cáo người dùng')}
            sx={{ fontSize: 14, display: 'flex', alignItems: 'center', gap: 1, '&:hover': { bgcolor: '#333' } }}
          >
            <Flag02Icon />
            Báo cáo
          </MenuItem>

          <MenuItem
            onClick={() => alert('Đã chặn người dùng')}
            sx={{ fontSize: 14, display: 'flex', alignItems: 'center', gap: 1, '&:hover': { bgcolor: '#333' } }}
          >
            <BlockIcon />
            Chặn người dùng
          </MenuItem>
        </Menu>
      </div>

      <div className="-mt-10 px-80">
        <div className="flex flex-col space-y-1">
          <div>
            <h1 className="text-4xl font-bold leading-tight">Hít Lê</h1>
            <p className="text-gray-400">@fromgermanwithlove</p>
          </div>

          <p className="text-gray-400">
            <strong className="text-gray-400">3</strong> Đang theo dõi
            <span className="mx-2">•</span>
            <strong className="text-gray-400">2</strong> Người theo dõi
          </p>

          <p className="text-gray-400 flex items-center gap-1">
            <CalendarUserIcon className="w-5 h-5" />
            Tham gia từ Tháng 3/2025
          </p>
        </div>
      </div>

      <div className="mt-4 border-b border-gray-700 flex space-x-9 text-sm px-10">
        <div onClick={() => setActiveTab('posts')} className={`cursor-pointer ${activeTab === 'posts' ? 'border-b-2 border-orange-500' : 'hover:text-gray-300'}`}>Bài đăng</div>
        <div onClick={() => setActiveTab('followers')} className={`cursor-pointer ${activeTab === 'followers' ? 'border-b-2 border-orange-500' : 'hover:text-gray-300'}`}>Người theo dõi</div>
        <div onClick={() => setActiveTab('following')} className={`cursor-pointer ${activeTab === 'following' ? 'border-b-2 border-orange-500' : 'hover:text-gray-300'}`}>Đang theo dõi</div>
        <div onClick={() => setActiveTab('achievements')} className={`cursor-pointer ${activeTab === 'achievements' ? 'border-b-2 border-orange-500' : 'hover:text-gray-300'}`}>Thành tựu</div>
      </div>

      <div className="follow overflow-y-auto px-10">
        {renderTabContent()}
      </div>
    </div >
  )
};
