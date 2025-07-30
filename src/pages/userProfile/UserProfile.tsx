import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
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
import favorite from '../../assets/svg/CommentUser/favorite.svg';
import commentIcon from '../../assets/svg/CommentUser/comment-add-01-stroke-rounded.svg';
import { useAuth } from '../../hooks/useAuth';
import { formatVietnamTimeFromTicks } from '../../utils/date_format';
import { useUserBlogPosts } from '../../hooks/useBlogs';

export const UserProfile = () => {

  const [activeTab, setActiveTab] = useState<'posts' | 'followers' | 'following' | 'achievements'>('posts');
  const [isFollowing, setIsFollowing] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { data: userPosts = [], isLoading: postsLoading } = useUserBlogPosts(auth?.user?.userId || "");

  const handleFollowClick = () => {
    setIsFollowing(!isFollowing);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNovelClick = (novelId: string) => {
    navigate(`/novels/${novelId}`);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'posts':
        return (
          <div className="mt-6">
            {postsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                <p className="text-gray-400 mt-2">Đang tải bài đăng...</p>
              </div>
            ) : userPosts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400">Chưa có bài đăng nào.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {userPosts.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => navigate(`/blogs?post=${post.id}`)}
                    className="bg-gray-900 p-4 rounded-lg border border-gray-700 cursor-pointer hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <img
                        src={post.author?.avatar || auth?.user?.avatarUrl || "/images/default-avatar.png"}
                        alt="Avatar"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold text-white">
                          {post.author?.username || auth?.user?.displayName || auth?.user?.userName || "User"}
                        </p>
                        <p className="text-xs text-gray-400">
                          @{post.author?.username || auth?.user?.userName || "user"} • {post.createdAt ? formatVietnamTimeFromTicks(post.createdAt) : "Không rõ thời gian"}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm line-clamp-3">
                      {post.content}
                    </p>
                    <div className="mt-3 flex items-center space-x-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <img src={favorite} className="w-4 h-4" alt="Like" />
                        {post.likeCount || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <img src={commentIcon} className="w-4 h-4" alt="Comment" />
                        {post.commentCount || 0}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
        return <p className="mt-6 text-gray-400">Chưa có thành tựu.</p>;
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
            <h1 className="text-4xl font-bold leading-tight">
              {auth?.user?.displayName || 'Hít Lê'}
            </h1>
            <p className="text-gray-400">
              @{auth?.user?.userName || 'fromgermanwithlove'}
            </p>
          </div>

          <p className="text-gray-400">
            <strong className="text-gray-400">3</strong> Đang theo dõi
            <span className="mx-2">•</span>
            <strong className="text-gray-400">2</strong> Người theo dõi
            <span className="mx-2">•</span>
            <strong className="text-gray-400">{userPosts.length}</strong> Bài đăng
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
