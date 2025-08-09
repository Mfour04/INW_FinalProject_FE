export interface UserEntity {
  id: string;
  username: string;
  email: string;
}

export interface NovelEntity {
  id: string;
  title: string;
  author_id: string;
}

export interface CommentEntity {
  id: string;
  user_id: string;
  novel_id: string;
  chapter_id: string;
  content: string;
  like_count: number;
}

export interface ForumCommentEntity {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  like_count: number;
}

export interface ForumPostEntity {
  id: string;
  user_id: string;
  content: string;
  img_urls: string[];
  like_count: number;
}

export interface ChapterEntity {
  id: string;
  novel_id: string;
  title: string;
  chapter_number: number;
  isLocked: boolean;
  createdAt: number;
}

export const mockUsers: UserEntity[] = [
  { id: "user001", username: "User1", email: "user1@example.com" },
  { id: "user002", username: "User2", email: "user2@example.com" },
  { id: "user003", username: "User3", email: "user3@example.com" },
  { id: "user004", username: "User4", email: "user4@example.com" },
  { id: "user005", username: "User5", email: "user5@example.com" },
  { id: "user006", username: "User6", email: "user6@example.com" },
  { id: "user007", username: "User7", email: "user7@example.com" },
  { id: "user008", username: "User8", email: "user8@example.com" },
  { id: "user009", username: "User9", email: "user9@example.com" },
  { id: "user010", username: "User10", email: "user10@example.com" },
  { id: "user011", username: "User11", email: "user11@example.com" },
  { id: "user012", username: "User12", email: "user12@example.com" },
];

export const mockNovels: NovelEntity[] = [
  { id: "novel001", title: "Tiểu Thuyết 1", author_id: "user003" },
  { id: "novel002", title: "Tiểu Thuyết 2", author_id: "user004" },
  { id: "novel003", title: "Tiểu Thuyết 3", author_id: "user005" },
  { id: "novel004", title: "Tiểu Thuyết 4", author_id: "user010" },
  { id: "novel005", title: "Tiểu Thuyết 5", author_id: "user011" },
];

export const mockChapters: ChapterEntity[] = [
  {
    id: "chapter001",
    novel_id: "novel001",
    title: "Chương 1: Khởi Đầu",
    chapter_number: 1,
    isLocked: false,
    createdAt: 1693526400000,
  },
  {
    id: "chapter002",
    novel_id: "novel001",
    title: "Chương 2: Hành Trình",
    chapter_number: 2,
    isLocked: true,
    createdAt: 1693612800000,
  },
  {
    id: "chapter003",
    novel_id: "novel002",
    title: "Chương 1: Mở Đầu",
    chapter_number: 1,
    isLocked: false,
    createdAt: 1693699200000,
  },
  {
    id: "chapter004",
    novel_id: "novel002",
    title: "Chương 2: Bí Mật",
    chapter_number: 2,
    isLocked: false,
    createdAt: 1693785600000,
  },
  {
    id: "chapter005",
    novel_id: "novel003",
    title: "Chương 1: Cuộc Gặp Gỡ",
    chapter_number: 1,
    isLocked: true,
    createdAt: 1693872000000,
  },
  {
    id: "chapter006",
    novel_id: "novel004",
    title: "Chương 1: Định Mệnh",
    chapter_number: 1,
    isLocked: false,
    createdAt: 1693958400000,
  },
  {
    id: "chapter007",
    novel_id: "novel005",
    title: "Chương 1: Khám Phá",
    chapter_number: 1,
    isLocked: false,
    createdAt: 1694044800000,
  },
  {
    id: "chapter008",
    novel_id: "novel005",
    title: "Chương 2: Thử Thách",
    chapter_number: 2,
    isLocked: true,
    createdAt: 1694131200000,
  },
];

export const mockComments: CommentEntity[] = [
  {
    id: "comment001",
    user_id: "user005",
    novel_id: "novel003",
    chapter_id: "",
    content: "Bình luận không phù hợp",
    like_count: 5,
  },
  {
    id: "comment002",
    user_id: "user012",
    novel_id: "",
    chapter_id: "",
    content: "Ngôn ngữ thô tục trong bình luận dài dòng",
    like_count: 2,
  },
];

export const mockForumPosts: ForumPostEntity[] = [
  {
    id: "post001",
    user_id: "user006",
    content: "Bài viết có link độc hại cần kiểm tra ngay",
    img_urls: ["https://example.com/img1.jpg"],
    like_count: 10,
  },
  {
    id: "post002",
    user_id: "user007",
    content: "Bài viết xúc phạm người khác",
    img_urls: [],
    like_count: 3,
  },
];

export const mockForumComments: ForumCommentEntity[] = [
  {
    id: "fcomment001",
    post_id: "post002",
    user_id: "user007",
    content: "Bình luận diễn đàn xúc phạm nghiêm trọng",
    like_count: 1,
  },
];

export const truncateContent = (
  content: string,
  maxLength: number = 20
): string => {
  if (content.length <= maxLength) return content;
  return content.slice(0, maxLength) + "...";
};
