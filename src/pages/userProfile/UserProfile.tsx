import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import avatarImage from '../../assets/img/th.png';
import bannerImage from '../../assets/img/hlban.jpg';
import '../../pages/userProfile/UserProfile.css';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import BlockIcon from '@mui/icons-material/Block';
import { CalendarUserIcon, Flag02Icon, CommentAdd01Icon } from './UserProfileIcon';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import favorite from '../../assets/svg/CommentUser/favorite.svg';
import commentIcon from '../../assets/svg/CommentUser/comment-add-01-stroke-rounded.svg';
import { useAuth } from '../../hooks/useAuth';
import { blogFormatVietnamTimeFromTicks } from '../../utils/date_format';
import { useUserBlogPosts } from '../Blogs/HooksBlog';
import { useGetCurrentUserInfo } from '../setting/useUserSettings';
import { GetUserProfile } from '../../api/User/user-search.api';
import { FollowButton } from '../../components/common/FollowButton';
import { GetFollowers, GetFollowing } from '../../api/UserFollow/user-follow.api';
import type { UserProfileResponse } from '../../api/User/user-search.type';

export const UserProfile = () => {
  const { username } = useParams<{ username: string }>();
  const [activeTab, setActiveTab] = useState<'posts' | 'followers' | 'following' | 'achievements'>('posts');
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const { auth } = useAuth();
  const isOwnProfile = !username || username === auth?.user?.userName;
  const targetUsername = username || auth?.user?.userName;
  const currentUserQuery = useGetCurrentUserInfo();

  const otherUserQuery = useQuery({
    queryKey: ['otherUserProfile', targetUsername],
    queryFn: () => GetUserProfile(targetUsername!),
    enabled: !isOwnProfile && !!targetUsername,
  });

  const userInfo = isOwnProfile ? currentUserQuery : otherUserQuery;
  const isLoadingUser = isOwnProfile ? currentUserQuery.isLoading : otherUserQuery.isLoading;
  const userError = isOwnProfile ? currentUserQuery.error : otherUserQuery.error;
  const userId = (userInfo as any)?.data?.id || (userInfo as any)?.data?.data?.id || auth?.user?.userId || "";
  const { data: userPosts = [], isLoading: postsLoading } = useUserBlogPosts(userId);

  // Get followers and following data
  const { data: followersData, isLoading: isLoadingFollowers } = useQuery({
    queryKey: ['followers', targetUsername || auth?.user?.userName],
    queryFn: () => GetFollowers(targetUsername || auth?.user?.userName!),
    enabled: !!(targetUsername || auth?.user?.userName),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const { data: followingData, isLoading: isLoadingFollowing } = useQuery({
    queryKey: ['following', targetUsername || auth?.user?.userName],
    queryFn: () => GetFollowing(targetUsername || auth?.user?.userName!),
    enabled: !!(targetUsername || auth?.user?.userName),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useEffect(() => {
    if (userInfo) {
      let availableFields: string | string[] = "No data";
      if ((userInfo as any)?.data?.data) {
        availableFields = Object.keys((userInfo as any).data.data);
      } else if ((userInfo as any)?.data) {
        availableFields = Object.keys((userInfo as any).data);
      }
    }
  }, [userInfo]);

  if (isLoadingUser) {
    return (
      <div className="profile bg-black text-white font-sans h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">Đang tải thông tin người dùng...</p>
        </div>
      </div>
    );
  }

  if (userError) {
    return (
      <div className="profile bg-black text-white font-sans h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">Có lỗi xảy ra khi tải thông tin người dùng</p>
          <p className="text-gray-400 text-sm mb-4">Username: {targetUsername}</p>
          <p className="text-gray-400 text-sm mb-4">Error: {userError.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!userInfo && !isLoadingUser) {
    return (
      <div className="profile bg-black text-white font-sans h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-yellow-400 text-lg mb-4">Không có dữ liệu người dùng</p>
          <p className="text-gray-400 text-sm mb-4">isOwnProfile: {isOwnProfile.toString()}</p>
          <p className="text-gray-400 text-sm mb-4">targetUsername: {targetUsername}</p>
          <p className="text-gray-400 text-sm mb-4">auth user: {auth?.user?.userName}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  let backendData = null;

  if ((userInfo as any)?.data) {
    if ((userInfo as any).data.id) {
      backendData = (userInfo as any).data;
    }
    else if ((userInfo as any)?.data?.data) {
      backendData = (userInfo as any).data.data;
    }
  }

  const normalizedData = {
    AvatarUrl: backendData?.AvatarUrl || backendData?.avatarUrl,
    CoverUrl: backendData?.CoverUrl || backendData?.coverUrl,
    Bio: backendData?.Bio || backendData?.bio,
    DisplayName: backendData?.DisplayName || backendData?.displayName,
    UserName: backendData?.UserName || backendData?.userName,
    FollowerCount: backendData?.FollowerCount || backendData?.followerCount || 0,
    FollowingCount: backendData?.FollowingCount || backendData?.followingCount || 0,
  };

  const getAvatarUrl = (url: string | null | undefined) => {
    if (!url) {
      return; // return "link img";
    }
    return url;
  };

  const getCoverUrl = (url: string | null | undefined) => {
    if (!url) {
      return;
    }
    return url;
  };

  const currentAvatar = getAvatarUrl(backendData?.avatarUrl);
  const currentCover = getCoverUrl(backendData?.coverUrl);
  const currentBio = normalizedData.Bio || auth?.user?.bio || "";
  const currentDisplayName = normalizedData.DisplayName || auth?.user?.displayName || 'Unknown User';
  const currentUserName = backendData?.username || username || auth?.user?.userName || 'unknown';
  const currentFollowerCount = Array.isArray(followersData?.data) ? followersData.data.length : 0;
  const currentFollowingCount = Array.isArray(followingData?.data) ? followingData.data.length : 0;
  const createdAt = backendData?.CreatedAt || backendData?.createdAt;
  const joinDate = createdAt ? blogFormatVietnamTimeFromTicks(createdAt) : "Tháng 3/2025";

  // Get targetUserId for FollowButton
  const targetUserId = backendData?.id || backendData?.Id || backendData?.UserId || backendData?.userId || '';

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
                        src={post.author?.avatar || "/images/default-avatar.png"}
                        alt="Avatar"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold text-white">
                          {post.author?.username || "Ẩn danh"}
                        </p>
                        <p className="text-xs text-gray-400">
                          {post.createdAt ? blogFormatVietnamTimeFromTicks(post.createdAt) : "Không rõ thời gian"}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm line-clamp-3">{post.content}</p>
                    {post.imgUrls && post.imgUrls.length > 0 && (
                      <div className="mt-3">
                        {post.imgUrls.length === 1 ? (
                          <img
                            src={post.imgUrls[0]}
                            alt="Post image"
                            className="max-h-96 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="grid grid-cols-2 gap-2">
                            {post.imgUrls.slice(0, 4).map((img, index) => (
                              <img
                                key={index}
                                src={img}
                                alt={`Post image ${index + 1}`}
                                className="h-32 rounded-lg object-cover"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    <div className="mt-3 flex items-center space-x-4 text-sm text-gray-400">
                      <span>❤️ {post.likeCount || 0}</span>
                      <span>💬 {post.commentCount || 0}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'followers':
        return (
          <div className="mt-6">
            {isLoadingFollowers ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                <p className="text-gray-400 mt-2">Đang tải danh sách người theo dõi...</p>
              </div>
            ) : !followersData?.data || !Array.isArray(followersData.data) || followersData.data.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400">Chưa có người theo dõi nào.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {followersData.data.map((follower: any) => (
                  <div key={follower.id} className="bg-gray-900 p-4 rounded-lg border border-gray-700 flex flex-col items-center">
                    <img
                      src={follower.avatar || avatarImage}
                      alt={follower.displayName}
                      className="w-16 h-16 rounded-full mb-2 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = avatarImage;
                      }}
                    />
                    <p className="font-semibold text-white text-sm text-center truncate w-full">{follower.displayName}</p>
                    <p className="text-xs text-gray-400 text-center">@{follower.userName}</p>
                    <button
                      className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 mt-2 rounded text-sm"
                      onClick={() => {
                        if (follower.userName) {
                          navigate(`/profile/${follower.userName}`);
                        } else {
                          console.error('Username is missing for follower user:', follower);
                        }
                      }}
                    >
                      Xem profile
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'following':
        return (
          <div className="mt-6">
            {isLoadingFollowing ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                <p className="text-gray-400 mt-2">Đang tải danh sách đang theo dõi...</p>
              </div>
            ) : !followingData?.data || !Array.isArray(followingData.data) || followingData.data.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400">Chưa theo dõi ai.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {followingData.data.map((following: any) => (
                  <div key={following.id} className="bg-gray-900 p-4 rounded-lg border border-gray-700 flex flex-col items-center">
                    <img
                      src={following.avatar || avatarImage}
                      alt={following.displayName}
                      className="w-16 h-16 rounded-full mb-2 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = avatarImage;
                      }}
                    />
                    <p className="font-semibold text-white text-sm text-center truncate w-full">{following.displayName}</p>
                    <p className="text-xs text-gray-400 text-center">@{following.userName}</p>
                    <button
                      className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 mt-2 rounded text-sm"
                      onClick={() => {
                        if (following.userName) {
                          navigate(`/profile/${following.userName}`);
                        } else {
                          console.error('Username is missing for following user:', following);
                        }
                      }}
                    >
                      Xem profile
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return <p className="mt-6 text-gray-400">Chưa có thành tựu.</p>;
    }
  };

  return (
    <div className="profile bg-black text-white font-sans h-screen flex flex-col">
      <div className="img_banner relative">
        <img
          src={currentCover}
          alt="Banner"
          className="w-full h-70 object-cover rounded"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "";
          }}
        />
        <div className="absolute left-8 bottom-[-105px]">
          <img
            src={currentAvatar}
            alt="Avatar"
            className="w-60 h-60 rounded-full border-5 border-white"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "";
            }}
          />
        </div>
      </div>

      {/* Luôn render FollowButton để tránh hooks order violation */}
      <div className="flex justify-end items-center px-12 mt-4 space-x-4">
        <FollowButton
          targetUserId={targetUserId}
          enabled={!isOwnProfile && !!targetUserId}
          size="medium"
          variant="contained"
        />

        {/* Chỉ hiển thị menu khi không phải profile của chính mình */}
        {!isOwnProfile && (
          <>
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
          </>
        )}
      </div>

      {/* Thêm margin-top để tránh bị che khuất bởi avatar */}
      <div className="mt-20 px-80">
        <div className="flex flex-col space-y-1">
          <div>
            <h1 className="text-4xl font-bold leading-tight">
              {currentDisplayName}
            </h1>
            <p className="text-gray-400">
              @{currentUserName}
            </p>
          </div>

          {/* Bio section */}
          {currentBio && (
            <p className="text-gray-300 text-lg mt-2 max-w-2xl break-words overflow-hidden">
              {currentBio}
            </p>
          )}

          <p className="text-gray-400">
            <strong className="text-gray-400">{currentFollowingCount}</strong> Đang theo dõi
            <span className="mx-2">•</span>
            <strong className="text-gray-400">{currentFollowerCount}</strong> Người theo dõi
            <span className="mx-2">•</span>
            <strong className="text-gray-400">{userPosts.length}</strong> Bài đăng
          </p>

          <p className="text-gray-400 flex items-center gap-1">
            <CalendarUserIcon className="w-5 h-5" />
            Tham gia từ {joinDate}
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
