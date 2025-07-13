import { useMemo, useState, useRef, useEffect } from "react";
import { useToast } from "../../context/ToastContext/toast-context";
import abc from "../../assets/img/th.png";
import AddImage from "@mui/icons-material/AddPhotoAlternateOutlined";
import TagFacesOutlinedIcon from "@mui/icons-material/TagFacesOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import AddCommentOutlinedIcon from "@mui/icons-material/AddCommentOutlined";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import { motion, AnimatePresence } from "framer-motion";

export type Tabs = "all" | "following";

export const Blogs = () => {
  const [tab, setTab] = useState<Tabs>("all");
  const [content, setContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  // image upload
  const [images, setImages] = useState<File[]>([]);
  const inputFileRef = useRef<HTMLInputElement>(null);

  //menu options
  const [menuOpenPostId, setMenuOpenPostId] = useState<string | null>(null);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [confirmDeletePostId, setConfirmDeletePostId] = useState<string | null>(
    null
  );
  const [reportPostId, setReportPostId] = useState<string | null>(null);

  //comments
  const [openComments, setOpenComments] = useState<Set<string>>(new Set());
  const [isMobile, setIsMobile] = useState(false);
  const [openReplyId, setOpenReplyId] = useState<string | null>(null);
  const [menuOpenCommentId, setMenuOpenCommentId] = useState<string | null>(
    null
  );
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<string>("");
  const [confirmDeleteCommentId, setConfirmDeleteCommentId] = useState<
    string | null
  >(null);
  const [reportCommentId, setReportCommentId] = useState<string | null>(null);
  const handleToggleReply = (commentId: string) => {
    setOpenReplyId((prev) => (prev === commentId ? null : commentId));
  };

  const [visibleRootComments, setVisibleRootComments] = useState<{
    [postId: string]: number;
  }>({});

  // Check screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Mobile: ≤ 768px
    };
    handleResize(); // Khởi tạo ban đầu
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const filesArray = Array.from(e.target.files);

    setImages((prev) => [...prev, ...filesArray]);
    e.target.value = "";
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const posts = [
    {
      id: "1",
      user: {
        name: "Nguyen Dinh",
        username: "@dinhvanbaonguyen",
        avatar: "/images/img_9d99678c38b6592.png",
      },
      content: "my first blog",
      timestamp: "39 giây trước",
      likes: 0,
      comments: 0,
      isLiked: false,
    },
    {
      id: "2",
      user: {
        name: "finn712",
        username: "@iamfinn7",
        avatar: "/images/img_249b93771f680a8.png",
      },
      content: "hi everyone!",
      timestamp: "1 ngày trước",
      likes: 0,
      comments: 0,
      isLiked: false,
    },
  ];

  const users: {
    [key: string]: { name: string; username: string; avatar: string };
  } = {
    user_001: {
      name: "Nguyễn Văn A",
      username: "@anguyen",
      avatar: "/images/user1.png",
    },
    user_002: {
      name: "Trần Thị B",
      username: "@btran",
      avatar: "/images/user2.png",
    },
    user_003: {
      name: "Lê Văn C",
      username: "@cle",
      avatar: "/images/user3.png",
    },
    user_004: {
      name: "Phạm Thị D",
      username: "@dpham",
      avatar: "/images/user4.png",
    },
    user_005: {
      name: "Hoàng Văn E",
      username: "@ehoang",
      avatar: "/images/user5.png",
    },
  };

  const forumComments = [
    {
      id: "cmt_001",
      post_id: "1",
      user_id: "user_001",
      content: "Bài viết rất hay, mình học được nhiều điều!",
      parent_comment_id: null,
      like_count: 12,
      reply_count: 1,
      created_at: "2025-07-11T10:00:00Z",
      updated_at: "2025-07-11T10:00:00Z",
    },
    {
      id: "cmt_002",
      post_id: "1",
      user_id: "user_002",
      content: "Bạn trình bày rõ ràng và dễ hiểu lắm!",
      parent_comment_id: null,
      like_count: 7,
      reply_count: 1,
      created_at: "2025-07-11T10:05:00Z",
      updated_at: "2025-07-11T10:05:00Z",
    },
    {
      id: "cmt_003",
      post_id: "1",
      user_id: "user_003",
      content: "@Nguyễn Văn A cảm ơn bạn nhé 😄",
      parent_comment_id: "cmt_001",
      like_count: 2,
      reply_count: 0,
      created_at: "2025-07-11T10:07:00Z",
      updated_at: "2025-07-11T10:07:00Z",
    },
    {
      id: "cmt_004",
      post_id: "1",
      user_id: "user_004",
      content: "Chia sẻ thêm một vài nguồn tài liệu thì tuyệt hơn nữa!",
      parent_comment_id: null,
      like_count: 4,
      reply_count: 0,
      created_at: "2025-07-11T10:10:00Z",
      updated_at: "2025-07-11T10:10:00Z",
    },
    {
      id: "cmt_005",
      post_id: "1",
      user_id: "user_005",
      content: "@Trần Thị B đồng ý luôn 👍",
      parent_comment_id: "cmt_002",
      like_count: 1,
      reply_count: 0,
      created_at: "2025-07-11T10:12:00Z",
      updated_at: "2025-07-11T10:12:00Z",
    },

    // 👇 Comment gốc thứ 4
    {
      id: "cmt_006",
      post_id: "1",
      user_id: "user_006",
      content: "Mình nghĩ bạn có thể bổ sung thêm ví dụ thực tế.",
      parent_comment_id: null,
      like_count: 3,
      reply_count: 2,
      created_at: "2025-07-11T10:20:00Z",
      updated_at: "2025-07-11T10:20:00Z",
    },
    {
      id: "cmt_007",
      post_id: "1",
      user_id: "user_007",
      content: "@user_006 đồng ý, ví dụ sẽ giúp dễ hiểu hơn.",
      parent_comment_id: "cmt_006",
      like_count: 2,
      reply_count: 0,
      created_at: "2025-07-11T10:22:00Z",
      updated_at: "2025-07-11T10:22:00Z",
    },
    {
      id: "cmt_008",
      post_id: "1",
      user_id: "user_008",
      content: "Tớ thấy ví dụ ở phần 2 khá rõ rồi mà nhỉ?",
      parent_comment_id: "cmt_006",
      like_count: 1,
      reply_count: 0,
      created_at: "2025-07-11T10:25:00Z",
      updated_at: "2025-07-11T10:25:00Z",
    },

    // 👇 Comment gốc thứ 5
    {
      id: "cmt_009",
      post_id: "1",
      user_id: "user_009",
      content: "Bạn viết về AI rất hay, mình muốn tìm hiểu thêm!",
      parent_comment_id: null,
      like_count: 9,
      reply_count: 1,
      created_at: "2025-07-11T10:30:00Z",
      updated_at: "2025-07-11T10:30:00Z",
    },
    {
      id: "cmt_010",
      post_id: "1",
      user_id: "user_010",
      content: "@user_009 bạn có thể xem thêm ở trang cuối bài đó!",
      parent_comment_id: "cmt_009",
      like_count: 1,
      reply_count: 0,
      created_at: "2025-07-11T10:35:00Z",
      updated_at: "2025-07-11T10:35:00Z",
    },
  ];

  const postsFollowing = [
    {
      id: "1",
      user: {
        name: "Nguyen Dinh",
        username: "@dinhvanbaonguyen",
        avatar: "/images/img_9d99678c38b6592.png",
      },
      content: "my first blog",
      timestamp: "39 giây trước",
      likes: 0,
      comments: 0,
      isLiked: false,
    },
  ];

  const handlePost = async () => {
    const hasText = content.trim().length > 0;
    const hasImage = images.length > 0;

    if (!hasText && !hasImage) return;

    setIsPosting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log("Creating post:", {
        content,
        images,
      });
      setContent("");
      setImages([]);
    } finally {
      setIsPosting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handlePost();
    }
  };

  const handleLike = (postId: string) => {
    console.log("Liking post:", postId);
  };

  const handleComment = (postId: string) => {
    console.log("Commenting on post:", postId);
  };

  const handleTabChange = (newTab: Tabs) => {
    if (newTab === tab) return;
    setOpenComments(new Set());
    setTransitioning(true);
    setTimeout(() => {
      setTab(newTab);
      setTransitioning(false);
    }, 200); // thời gian hiệu ứng (ms)
  };

  const ImageAdd01Icon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={24}
      height={24}
      color={"#ff6740"}
      fill={"none"}
      {...props}
    >
      <path
        d="M11.5085 2.9903C7.02567 2.9903 4.78428 2.9903 3.39164 4.38238C1.99902 5.77447 1.99902 8.015 1.99902 12.4961C1.99902 16.9771 1.99902 19.2176 3.39164 20.6098C4.78428 22.0018 7.02567 22.0018 11.5085 22.0018C15.9912 22.0018 18.2326 22.0018 19.6253 20.6098C21.0179 19.2176 21.0179 16.9771 21.0179 12.4961V11.9958"
        stroke="#ff6740"
        strokeWidth="1.5"
        strokeLinecap="round"
      ></path>
      <path
        d="M4.99902 20.9898C9.209 16.2385 13.9402 9.93727 20.999 14.6632"
        stroke="#ff6740"
        strokeWidth="1.5"
      ></path>
      <path
        d="M17.9958 1.99829V10.0064M22.0014 5.97728L13.9902 5.99217"
        stroke="#ff6740"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  );

  const SmileIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={24}
      height={24}
      color={"#FF6740"}
      fill={"none"}
      {...props}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="#FF6740"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 15C8.91212 16.2144 10.3643 17 12 17C13.6357 17 15.0879 16.2144 16 15"
        stroke="#FF6740"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.00897 9L8 9M16 9L15.991 9"
        stroke="#FF6740"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const SentIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={24}
      height={24}
      color={"#FFFFFF"}
      fill={"none"}
      {...props}
    >
      <path
        d="M21.0477 3.05293C18.8697 0.707363 2.48648 6.4532 2.50001 8.551C2.51535 10.9299 8.89809 11.6617 10.6672 12.1581C11.7311 12.4565 12.016 12.7625 12.2613 13.8781C13.3723 18.9305 13.9301 21.4435 15.2014 21.4996C17.2278 21.5892 23.1733 5.342 21.0477 3.05293Z"
        stroke="#FFFFFF"
        strokeWidth="1.5"
      ></path>
      <path
        d="M11.5 12.5L15 9"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  );

  const CommentAdd01Icon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={24}
      height={24}
      color={"#ffffff"}
      fill={"none"}
      {...props}
    >
      <path
        d="M14 6H22M18 2L18 10"
        stroke="#ffffff"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M6.09881 19.5C4.7987 19.3721 3.82475 18.9816 3.17157 18.3284C2 17.1569 2 15.2712 2 11.5V11C2 7.22876 2 5.34315 3.17157 4.17157C4.34315 3 6.22876 3 10 3H11.5M6.5 18C6.29454 19.0019 5.37769 21.1665 6.31569 21.8651C6.806 22.2218 7.58729 21.8408 9.14987 21.0789C10.2465 20.5441 11.3562 19.9309 12.5546 19.655C12.9931 19.5551 13.4395 19.5125 14 19.5C17.7712 19.5 19.6569 19.5 20.8284 18.3284C21.947 17.2098 21.9976 15.4403 21.9999 12"
        stroke="#ffffff"
        strokeWidth="1.5"
        strokeLinecap="round"
      ></path>
      <path
        d="M8 14H14M8 9H11"
        stroke="#ffffff"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  );

  const toast = useToast();

  const renderTabContent = () => {
    const data = tab === "all" ? posts : postsFollowing;
    const rootComments = forumComments.filter(
      (c) => c.parent_comment_id === null
    );

    const getReplies = (parentId: string) =>
      forumComments.filter((c) => c.parent_comment_id === parentId);

    return (
      <div className="space-y-5">
        <div className="bg-[#1e1e21] rounded-[10px] p-5">
          <div className="flex items-center gap-5 mb-4">
            <img
              src={abc}
              alt="avatar"
              className="w-[50px] h-[50px] rounded-full object-cover"
            />
            <div className="flex flex-col">
              <h3 className="text-lg font-bold text-white">Nguyen Dinh</h3>
              <span className="text-base text-[#cecece]">
                @dinhvanbaonguyen
              </span>
            </div>
          </div>
          <div className="mb-6">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Chia sẻ điều gì đó..."
              className="w-full bg-transparent text-base sm:text-lg text-white placeholder-[#656565] resize-none border-none outline-none min-h-[80px] sm:min-h-[100px] md:min-h-[120px] font-ibm-plex"
            />
            {/* Preview ảnh */}
            {images.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-3">
                {images.map((img, idx) => {
                  const url = URL.createObjectURL(img);
                  return (
                    <div
                      key={idx}
                      className="relative w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] rounded overflow-hidden border border-[#ff6740]"
                    >
                      <img
                        src={url}
                        alt={`preview-${idx}`}
                        className="object-cover w-full h-full"
                        onLoad={() => URL.revokeObjectURL(url)}
                      />
                      <button
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1 right-1 bg-black bg-opacity-50 hover:bg-opacity-80 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                        type="button"
                        aria-label="Xóa ảnh"
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div className="border-t border-[#656565] pt-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Nút chọn ảnh */}
              <button
                type="button"
                onClick={() => inputFileRef.current?.click()}
                className="p-2 hover:bg-gray-700 rounded-full transition-colors"
              >
                <ImageAdd01Icon />
              </button>
              <input
                ref={inputFileRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
              <button className="p-2 hover:bg-gray-700 rounded-full transition-colors">
                <SmileIcon />
              </button>
            </div>
            <button
              onClick={handlePost}
              disabled={(!content.trim() && images.length === 0) || isPosting}
              className="flex items-center gap-2 bg-[#ff6740] hover:bg-[#e55a36] disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-[16px] font-medium transition-colors"
            >
              {isPosting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Đăng</span>
                  <SentIcon />
                </>
              )}
            </button>
          </div>
        </div>

        {data.map((post) => (
          <div key={post.id} className="bg-[#1e1e21] rounded-[10px] p-5">
            <div className="flex items-start justify-between sm:items-center mb-4 gap-3">
              <div className="flex items-start sm:items-center gap-4">
                <img
                  src={post.user.avatar}
                  alt={post.user.name}
                  className="w-[50px] h-[50px] rounded-full object-cover"
                />
                <div className="flex flex-col">
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {post.user.name}
                  </h3>
                  <div className="flex items-center gap-2 text-[#cecece] text-sm sm:text-base">
                    <span>{post.user.username}</span>
                    <div className="w-[6px] h-[6px] bg-[#cecece] rounded-full"></div>
                    <span>{post.timestamp}</span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <button
                  onClick={() =>
                    setMenuOpenPostId(
                      menuOpenPostId === post.id ? null : post.id
                    )
                  }
                  className="p-1 hover:bg-gray-700 rounded-full"
                >
                  <MoreHorizOutlinedIcon />
                </button>
                {menuOpenPostId === post.id && (
                  <div className="absolute right-0 mt-2 bg-[#2b2b2c] text-white rounded-md shadow-md overflow-hidden w-[120px] text-sm z-10">
                    <button
                      onClick={() => {
                        setEditingPostId(post.id);
                        setMenuOpenPostId(null);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#3a3a3a]"
                    >
                      Cập nhật
                    </button>
                    <button
                      onClick={() => {
                        setConfirmDeletePostId(post.id);
                        setMenuOpenPostId(null);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#3a3a3a]"
                    >
                      Xóa bài viết
                    </button>

                    <button
                      onClick={() => {
                        setReportPostId(post.id);
                        setMenuOpenPostId(null);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#3a3a3a]"
                    >
                      Báo cáo bài viết
                    </button>
                  </div>
                )}
              </div>
            </div>
            {editingPostId === post.id ? (
              // 👉 Chế độ edit
              <div className="mb-4">
                <textarea
                  defaultValue={post.content}
                  className="w-full bg-transparent text-base sm:text-lg text-white placeholder-[#656565] resize-none border-none outline-none min-h-[80px] sm:min-h-[100px] md:min-h-[120px] font-ibm-plex mb-2"
                />
                {/* ✅ Hiển thị ảnh đang có + xóa + thêm ảnh mới */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {/* Hiển thị ảnh hiện có – demo, bạn cần cập nhật đúng data */}
                  {/* {post.images?.map((img, index) => (
                    <div key={index} className="relative w-[100px] h-[100px]">
                      <img
                        src={img}
                        alt={`edit-img-${index}`}
                        className="w-full h-full object-cover rounded"
                      />
                      <button className="absolute top-0 right-0 bg-black/60 text-white text-xs px-1 rounded-full">
                        x
                      </button>
                    </div>
                  ))} */}
                </div>
                <input
                  type="file"
                  multiple
                  className="text-white text-sm mb-2"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingPostId(null)}
                    className="bg-gray-600 text-white px-3 py-1 rounded-lg"
                  >
                    Hủy
                  </button>
                  <button className="bg-[#ff6740] text-white px-3 py-1 rounded-lg">
                    Lưu
                  </button>
                </div>
              </div>
            ) : (
              // 👉 Chế độ xem bình thường
              <div className="mb-4">
                <p className="text-base sm:text-lg text-white leading-relaxed">
                  {post.content}
                </p>
              </div>
            )}

            <div className="border-t border-[#656565] pt-4">
              <div className="flex items-center gap-6">
                <button className="flex items-center gap-1 group hover:text-[#ff6740]">
                  <FavoriteBorderOutlinedIcon className="w-5 h-5 text-white group-hover:text-[#ff6740]" />
                  <span className="text-sm sm:text-base font-medium text-white group-hover:text-[#ff6740]">
                    Yêu thích
                  </span>
                </button>
                <button
                  onClick={() => {
                    setOpenComments((prev) => {
                      const newSet = new Set(prev);
                      if (newSet.has(post.id)) {
                        newSet.delete(post.id);
                      } else {
                        newSet.add(post.id);
                        setVisibleRootComments((prevVisible) => ({
                          ...prevVisible,
                          [post.id]: 3,
                        }));
                      }
                      return newSet;
                    });
                  }}
                  className="flex items-center gap-1 group hover:text-[#ff6740]"
                >
                  <AddCommentOutlinedIcon className="w-5 h-5 text-white group-hover:text-[#ff6740]" />
                  <span className="text-sm sm:text-base font-medium text-white group-hover:text-[#ff6740]">
                    Bình luận
                  </span>
                </button>
              </div>
            </div>
            <AnimatePresence initial={false}>
              {openComments.has(post.id) &&
                (isMobile ? (
                  // MOBILE - Modal comment UI with replies
                  <motion.div
                    key={`comment-mobile-${post.id}`}
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -50, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="fixed inset-0 z-50 bg-black bg-opacity-90 backdrop-blur-sm flex flex-col p-4"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-white text-lg font-bold">
                        Bình luận
                      </h2>
                      <button
                        onClick={() => {
                          setOpenComments((prev) => {
                            const newSet = new Set(prev);
                            newSet.delete(post.id);
                            return newSet;
                          });
                        }}
                        className="text-white text-2xl font-bold px-2"
                        aria-label="Đóng bình luận"
                      >
                        ×
                      </button>
                    </div>

                    <motion.div
                      className="flex-1 overflow-y-auto text-white"
                      initial={{ opacity: 0, y: -15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.25 }}
                    >
                      {(() => {
                        const postRootComments = rootComments.filter(
                          (c) => c.post_id === post.id
                        );
                        const visibleCount = visibleRootComments[post.id] || 3;
                        const commentsToShow = postRootComments.slice(
                          0,
                          visibleCount
                        );

                        if (postRootComments.length === 0) {
                          return (
                            <p className="text-sm text-[#aaa] italic">
                              Chưa có bình luận nào
                            </p>
                          );
                        }

                        return (
                          <>
                            {commentsToShow.map((comment) => (
                              <CommentItem
                                key={comment.id}
                                comment={comment}
                                replies={getReplies(comment.id)}
                                isOpenReply={openReplyId === comment.id}
                                onToggleReply={handleToggleReply}
                                menuOpenCommentId={menuOpenCommentId}
                                setMenuOpenCommentId={setMenuOpenCommentId}
                              />
                            ))}

                            {postRootComments.length > visibleCount && (
                              <button
                                onClick={() =>
                                  setVisibleRootComments((prev) => ({
                                    ...prev,
                                    [post.id]: visibleCount + 3,
                                  }))
                                }
                                className="text-sm text-[#ff6740] mt-3 hover:underline font-medium"
                              >
                                Xem thêm bình luận...
                              </button>
                            )}
                          </>
                        );
                      })()}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 30 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 flex items-center gap-2"
                    >
                      <input
                        type="text"
                        placeholder="Viết bình luận..."
                        className="flex-1 bg-[#2b2b2c] text-white px-4 py-2 rounded-full outline-none"
                      />
                      <button
                        className="bg-[#ff6740] text-white px-4 py-2 rounded-full"
                        aria-label="Gửi bình luận"
                      >
                        <SentIcon />
                      </button>
                    </motion.div>
                  </motion.div>
                ) : (
                  // DESKTOP - Inline comment UI with replies
                  <motion.div
                    key={`comment-desktop-${post.id}`}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden mt-4"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: -15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="bg-[#2b2b2c] rounded-lg p-4 text-white"
                    >
                      {(() => {
                        const postRootComments = rootComments.filter(
                          (c) => c.post_id === post.id
                        );
                        const visibleCount = visibleRootComments[post.id] || 3;
                        const commentsToShow = postRootComments.slice(
                          0,
                          visibleCount
                        );

                        return (
                          <>
                            {postRootComments.length === 0 && (
                              <p className="text-sm mb-2 text-[#aaa] italic">
                                Chưa có bình luận nào
                              </p>
                            )}

                            {commentsToShow.map((comment) => (
                              <CommentItem
                                key={comment.id}
                                comment={comment}
                                replies={getReplies(comment.id)}
                                isOpenReply={openReplyId === comment.id}
                                onToggleReply={handleToggleReply}
                                menuOpenCommentId={menuOpenCommentId}
                                setMenuOpenCommentId={setMenuOpenCommentId}
                              />
                            ))}

                            {postRootComments.length > visibleCount && (
                              <button
                                onClick={() =>
                                  setVisibleRootComments((prev) => ({
                                    ...prev,
                                    [post.id]: visibleCount + 3,
                                  }))
                                }
                                className="text-sm text-[#ff6740] mt-3 hover:underline font-medium"
                              >
                                Xem thêm bình luận...
                              </button>
                            )}
                          </>
                        );
                      })()}

                      <div className="mt-4 flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Viết bình luận..."
                          className="flex-1 bg-[#1e1e21] px-4 py-2 rounded-full outline-none"
                        />
                        <button
                          className="bg-[#ff6740] text-white px-4 py-2 rounded-full"
                          aria-label="Gửi bình luận"
                        >
                          <SentIcon />
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
        ))}
      </div>
    );
  };

  const CommentItem: React.FC<{
    comment: (typeof forumComments)[number];
    replies: (typeof forumComments)[number][];
    isOpenReply: boolean;
    onToggleReply: (commentId: string) => void;
    menuOpenCommentId: string | null;
    setMenuOpenCommentId: React.Dispatch<React.SetStateAction<string | null>>;
  }> = ({ comment, replies, isOpenReply, onToggleReply }) => {
    const user = users[comment.user_id] || {
      name: "Người dùng ẩn danh",
      username: "",
      avatar: "/images/default-avatar.png",
    };

    return (
      <div className="mt-4 relative">
        <div className="flex items-start gap-3 sm:gap-4">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
              <div className="truncate">
                <h4 className="font-semibold text-white text-sm sm:text-base truncate">
                  {user.name}
                </h4>
                {user.username && (
                  <small className="text-xs text-gray-400 truncate block">
                    {user.username}
                  </small>
                )}
              </div>
              <div className="flex items-center gap-3 text-sm text-[#999] mt-1 sm:mt-0">
                <button className="flex items-center gap-1 hover:text-[#ff6740]">
                  <FavoriteBorderOutlinedIcon className="w-4 h-4" />
                  <span>{comment.like_count}</span>
                </button>
                {comment.reply_count > 0 && (
                  <button
                    onClick={() => onToggleReply(comment.id)}
                    className="hover:text-[#ff6740] font-medium whitespace-nowrap"
                  >
                    {isOpenReply
                      ? "Ẩn trả lời"
                      : `Xem ${comment.reply_count} trả lời`}
                  </button>
                )}

                {/* Nút mở menu tuỳ chọn */}
                <div className="relative">
                  <button
                    onClick={() =>
                      setMenuOpenCommentId(
                        menuOpenCommentId === comment.id ? null : comment.id
                      )
                    }
                    className="text-[#aaa] hover:text-white px-2"
                  >
                    <MoreHorizOutlinedIcon fontSize="small" />
                  </button>

                  {menuOpenCommentId === comment.id && (
                    <div className="absolute right-0 mt-1 bg-[#2b2b2c] text-white rounded-md shadow-md overflow-hidden w-[120px] text-sm z-20">
                      <button
                        onClick={() => {
                          setEditingCommentId(comment.id);
                          setEditedContent(comment.content);
                          setMenuOpenCommentId(null);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-[#3a3a3a]"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => {
                          setConfirmDeleteCommentId(comment.id);
                          setMenuOpenCommentId(null);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-[#3a3a3a]"
                      >
                        Xoá
                      </button>
                      <button
                        onClick={() => {
                          setReportCommentId(comment.id);
                          setMenuOpenCommentId(null);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-[#3a3a3a]"
                      >
                        Báo cáo
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {editingCommentId === comment.id ? (
              <div className="mt-2">
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="w-full bg-[#1e1e21] text-white text-sm sm:text-base p-2 rounded resize-none"
                  rows={2}
                />
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => {
                      // TODO: gọi API lưu comment tại đây
                      console.log("Saving comment:", editedContent);
                      setEditingCommentId(null);
                    }}
                    className="bg-[#ff6740] text-white px-3 py-1 rounded"
                  >
                    Lưu
                  </button>
                  <button
                    onClick={() => setEditingCommentId(null)}
                    className="bg-gray-600 text-white px-3 py-1 rounded"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-[#ccc] mt-1 text-sm sm:text-base break-words">
                {comment.content}
              </p>
            )}
          </div>
        </div>

        {/* Replies */}
        <AnimatePresence>
          {isOpenReply && replies.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="ml-8 sm:ml-12 border-l border-[#444] pl-4 mt-3 space-y-4"
            >
              {replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  replies={[]}
                  isOpenReply={false}
                  onToggleReply={onToggleReply}
                  menuOpenCommentId={menuOpenCommentId}
                  setMenuOpenCommentId={setMenuOpenCommentId}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <>
      <div className="w-full max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="bg-[#1e1e21] rounded-[10px] p-4 mb-5">
              <div className="flex justify-between">
                {(["all", "following"] as Tabs[]).map((t) => (
                  <div
                    key={t}
                    onClick={() => handleTabChange(t)}
                    className={`relative w-1/2 text-center px-4 py-3 rounded-[10px] text-lg font-semibold cursor-pointer transition-all duration-300 ${
                      tab === t
                        ? "text-white"
                        : "text-[#cecece] hover:text-white"
                    }`}
                  >
                    <span
                      className={`transition-all duration-300 ${
                        tab === t ? "text-white text-xl font-bold" : "text-base"
                      }`}
                    >
                      {t === "all" ? "Tất cả" : "Đang theo dõi"}
                    </span>
                    {tab === t && (
                      <motion.div
                        layoutId="underline"
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-[3px] bg-[#ff6740] rounded-full"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Posts Feed */}
            <div className="flex-1 overflow-y-auto min-h-screen">
              <div
                className={`transition-all duration-300 ${
                  transitioning
                    ? "opacity-0 translate-y-2 pointer-events-none"
                    : "opacity-100 translate-y-0"
                }`}
              >
                {renderTabContent()}
              </div>
            </div>
          </div>
          {/* Confirm Delete Popup */}
          {confirmDeleteCommentId && (
            <div className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.1)] backdrop-blur-sm flex items-center justify-center">
              <div className="bg-[#1e1e21] text-white rounded-lg p-6 w-[90%] max-w-md">
                <h3 className="text-lg font-bold mb-4">
                  Xác nhận xoá bình luận?
                </h3>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setConfirmDeleteCommentId(null)}
                    className="px-4 py-2 bg-gray-600 rounded"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={() => {
                      console.log("Deleting comment:", confirmDeleteCommentId);
                      setConfirmDeleteCommentId(null);
                    }}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
                  >
                    Xoá
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Report Comment Popup */}
          {reportCommentId && (
            <div className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.1)] backdrop-blur-sm flex items-center justify-center">
              <div className="bg-[#1e1e21] text-white rounded-lg p-6 w-[90%] max-w-md">
                <h3 className="text-lg font-bold mb-4">Báo cáo bình luận</h3>
                <p className="text-sm text-[#ccc] mb-4">
                  Tính năng đang phát triển.
                </p>
                <div className="flex justify-end">
                  <button
                    onClick={() => setReportCommentId(null)}
                    className="px-4 py-2 bg-[#ff6740] hover:bg-[#e55a36] rounded"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Confirm Delete Post Popup */}
          {confirmDeletePostId && (
            <div className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.3)] backdrop-blur-sm flex items-center justify-center">
              <div className="bg-[#1e1e21] text-white rounded-lg p-6 w-[90%] max-w-md">
                <h3 className="text-lg font-bold mb-4">
                  Xác nhận xoá bài viết?
                </h3>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setConfirmDeletePostId(null)}
                    className="px-4 py-2 bg-gray-600 rounded"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={() => {
                      console.log("Deleting post:", confirmDeletePostId);
                      setConfirmDeletePostId(null);
                    }}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
                  >
                    Xoá
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Report Post Popup */}
          {reportPostId && (
            <div className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.3)] backdrop-blur-sm flex items-center justify-center">
              <div className="bg-[#1e1e21] text-white rounded-lg p-6 w-[90%] max-w-md">
                <h3 className="text-lg font-bold mb-4">Báo cáo bài viết</h3>
                <p className="text-sm text-[#ccc] mb-4">
                  Tính năng đang phát triển.
                </p>
                <div className="flex justify-end">
                  <button
                    onClick={() => setReportPostId(null)}
                    className="px-4 py-2 bg-[#ff6740] hover:bg-[#e55a36] rounded"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Sidebar (Profile Info) */}
          <div className="w-full lg:w-[28%] mt-6 lg:mt-0 px-4 sm:px-6 lg:px-0">
            <div className="bg-[#2b2b2c] rounded-[10px] overflow-hidden">
              {/* Cover Image */}
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
                  <h2 className="text-lg font-bold text-white mb-1">
                    Nguyen Dinh
                  </h2>
                  <p className="text-sm text-[#cecece]">@dinhvanbaonguyen</p>
                </div>

                {/* Stats */}
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

                {/* Create Post Button */}
                <button className="w-full bg-[#ff6740] hover:bg-[#e55a36] text-white font-bold py-2 px-8 rounded-[18px] transition-colors">
                  Tạo bài viết
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
