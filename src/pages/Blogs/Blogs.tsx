import { useState, useRef, useEffect } from "react";
import { useToast } from "../../context/ToastContext/toast-context";
import BlogHeader from "../Blogs/Post/BlogHeader";
import PostForm from "../Blogs/Post/PostForm";
import PostItem from "../Blogs/Post/PostItem";
import DeleteConfirmPopup from "../Blogs/Modals/DeleteConfirmPopup";
import ReportPopup from "../Blogs/Modals/ReportPopup";
import ProfileSidebar from "../Blogs/Sidebar/ProfileSidebar";
import { type Post, type Tabs } from "./types";

const posts: Post[] = [
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
  {
    id: "3",
    user: {
      name: "Nguyễn Văn A",
      username: "@anguyen",
      avatar: "/images/user1.png",
    },
    content: "Tôi đang học ReactJS và đây là bài post đầu tiên của tôi.",
    timestamp: "5 phút trước",
    likes: 3,
    comments: 2,
    isLiked: true,
  },
  {
    id: "4",
    user: {
      name: "Trần Thị B",
      username: "@btran",
      avatar: "/images/user2.png",
    },
    content: "Chúc mọi người buổi sáng tốt lành! ☀️",
    timestamp: "3 giờ trước",
    likes: 5,
    comments: 1,
    isLiked: false,
  },
  {
    id: "5",
    user: { name: "Lê Văn C", username: "@cle", avatar: "/images/user3.png" },
    content: "Hôm nay trời đẹp thật!",
    timestamp: "6 giờ trước",
    likes: 2,
    comments: 0,
    isLiked: false,
  },
  {
    id: "6",
    user: {
      name: "Phạm Thị D",
      username: "@dpham",
      avatar: "/images/user4.png",
    },
    content: "Tôi vừa hoàn thành dự án cá nhân đầu tiên 👏",
    timestamp: "1 ngày trước",
    likes: 7,
    comments: 3,
    isLiked: true,
  },
  {
    id: "7",
    user: {
      name: "Hoàng Văn E",
      username: "@ehoang",
      avatar: "/images/user5.png",
    },
    content: "Ai có tài liệu về Redux RTK không? Cho mình xin với 🙏",
    timestamp: "2 ngày trước",
    likes: 1,
    comments: 0,
    isLiked: false,
  },
];

const postsFollowing: Post[] = [
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

export const Blogs = () => {
  const [tab, setTab] = useState<Tabs>("all");
  const [content, setContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const inputFileRef = useRef<HTMLInputElement | null>(null);
  const [menuOpenPostId, setMenuOpenPostId] = useState<string | null>(null);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [confirmDeletePostId, setConfirmDeletePostId] = useState<string | null>(
    null
  );
  const [reportPostId, setReportPostId] = useState<string | null>(null);
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
  const [visibleRootComments, setVisibleRootComments] = useState<{
    [postId: string]: number;
  }>({});
  const [replyingTo, setReplyingTo] = useState<{
    commentId: string;
    username: string;
  } | null>(null); // Added replyingTo state
  const [commentInput, setCommentInput] = useState<string>(""); // Added commentInput state

  const toast = useToast();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
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

  const handlePost = async () => {
    const hasText = content.trim().length > 0;
    const hasImage = images.length > 0;
    if (!hasText && !hasImage) return;
    setIsPosting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log("Creating post:", { content, images });
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

  const handleTabChange = (newTab: Tabs) => {
    if (newTab === tab) return;
    setOpenComments(new Set());
    setTransitioning(true);
    setTimeout(() => {
      setTab(newTab);
      setTransitioning(false);
    }, 200);
  };

  const renderTabContent = () => {
    const data = tab === "all" ? posts : postsFollowing;
    return (
      <div className="space-y-5">
        <PostForm
          content={content}
          setContent={setContent}
          images={images}
          setImages={setImages}
          isPosting={isPosting}
          handlePost={handlePost}
          handleKeyPress={handleKeyPress}
          inputFileRef={inputFileRef}
          handleImageChange={handleImageChange}
          handleRemoveImage={handleRemoveImage}
        />
        {data.map((post) => (
          <PostItem
            key={post.id}
            post={post}
            menuOpenPostId={menuOpenPostId}
            setMenuOpenPostId={setMenuOpenPostId}
            editingPostId={editingPostId}
            setEditingPostId={setEditingPostId}
            setConfirmDeletePostId={setConfirmDeletePostId}
            setReportPostId={setReportPostId}
            openComments={openComments}
            setOpenComments={setOpenComments}
            visibleRootComments={visibleRootComments}
            setVisibleRootComments={setVisibleRootComments}
            isMobile={isMobile}
            openReplyId={openReplyId}
            setOpenReplyId={setOpenReplyId}
            menuOpenCommentId={menuOpenCommentId}
            setMenuOpenCommentId={setMenuOpenCommentId}
            editingCommentId={editingCommentId}
            setEditingCommentId={setEditingCommentId}
            editedContent={editedContent}
            setEditedContent={setEditedContent}
            setConfirmDeleteCommentId={setConfirmDeleteCommentId}
            setReportCommentId={setReportCommentId}
            commentInput={commentInput}
            setCommentInput={setCommentInput}
            replyingTo={replyingTo}
            setReplyingTo={setReplyingTo}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <BlogHeader tab={tab} handleTabChange={handleTabChange} />
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
        {confirmDeleteCommentId && (
          <DeleteConfirmPopup
            type="comment"
            id={confirmDeleteCommentId}
            setConfirmDeleteId={setConfirmDeleteCommentId}
          />
        )}
        {reportCommentId && (
          <ReportPopup
            type="comment"
            id={reportCommentId}
            setReportId={setReportCommentId}
          />
        )}
        {confirmDeletePostId && (
          <DeleteConfirmPopup
            type="post"
            id={confirmDeletePostId}
            setConfirmDeleteId={setConfirmDeletePostId}
          />
        )}
        {reportPostId && (
          <ReportPopup
            type="post"
            id={reportPostId}
            setReportId={setReportPostId}
          />
        )}
        <ProfileSidebar />
      </div>
    </div>
  );
};
