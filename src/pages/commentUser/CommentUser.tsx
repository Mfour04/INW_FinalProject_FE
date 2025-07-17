import { useState, useEffect, useRef } from "react";
import type { Comment } from "../commentUser/Comment";
import {
    GetCommentsByChapter,
    CreateComment,
    ReplyComment,
} from "../../api/Comment/comment.api";
import { useAuth } from "../../api/Comment/useAuth.ts";
import { GetUserById } from "../../api/Comment/user.api.ts";

import ImageAdd02Icon from "../../assets/svg/CommentUser/image-add-02-stroke-rounded.svg";
import SmileIcon from "../../assets/svg/CommentUser/smile-stroke-rounded.svg";
import SentIcon from "../../assets/svg/CommentUser/sent-stroke-rounded.svg";
import favorite from "../../assets/svg/CommentUser/favorite.svg";
import CommentAdd01Icon from "../../assets/svg/CommentUser/comment-add-01-stroke-rounded.svg";
import defaultAvatar from "../../assets/img/th.png";

import { MoreButton } from "../../pages/commentUser/MoreButton";
import { MoreUser } from "../../pages/commentUser/MoreUser";
import { Reply } from "../../pages/commentUser/Reply";
import { NestedReply } from "../../pages/commentUser/NestedReply";

interface CommentUserProps {
    novelId: string;
    chapterId: string;
}

export const CommentUser: React.FC<CommentUserProps> = ({ novelId, chapterId }) => {
    const { auth } = useAuth();

    const currentUser = {
        id: (auth?.user as any)?.id || "",
        name: (auth?.user as any)?.fullName || (auth?.user as any)?.username || "Ẩn danh",
        user: "@" + ((auth?.user as any)?.username || "user"),
        avatarUrl: (auth?.user as any)?.avatarUrl || null,
    };

    const [comments, setComments] = useState<Comment[]>([]);
    const [replyComments, setReplyComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [replyInputs, setReplyInputs] = useState<{ [id: string]: boolean }>({});
    const [replyValues, setReplyValues] = useState<{ [id: string]: string }>({});
    const inputRefs = useRef<{ [id: string]: HTMLInputElement | null }>({});

    const formatVietnamTimeFromTicks = (ticks: number): string => {
        const epochTicks = 621355968000000000;
        const ticksPerMs = 10000;
        const jsUtcMs = (ticks - epochTicks) / ticksPerMs;
        const utcDate = new Date(jsUtcMs);
        const vietnamMs = utcDate.getTime() - 7 * 60 * 60 * 1000;
        const vietnamDate = new Date(vietnamMs);

        return vietnamDate.toLocaleString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const enrichComment = async (raw: any): Promise<Comment> => {
        const ticks = Number(raw.created_at || raw.createdAt);
        const timestamp =
            !isNaN(ticks) && ticks > 621355968000000000
                ? formatVietnamTimeFromTicks(ticks)
                : "Không xác định";

        const user = auth?.user as any;

        return {
            id: raw.id,
            content: raw.content,
            parentId: raw.parent_comment_id || null,
            likes: raw.likes || 0,
            replies: raw.replies?.length || 0,
            name: user.fullName || user.username || "Ẩn danh",
            user: "@" + (user.username || "unknown"),
            avatarUrl: user.avatarUrl || null,
            timestamp,
        };
    };

    const fetchComments = async () => {
        try {
            const res = await GetCommentsByChapter(chapterId, novelId, {
                page: 0,
                limit: 50,
                includeReplies: true,
            });

            const rawComments = res.data.data;
            const enriched = await Promise.all(rawComments.map(enrichComment));

            setComments(enriched.filter((c) => !c.parentId));
            setReplyComments(enriched.filter((c) => c.parentId));
        } catch (error) {
            console.error("Lỗi khi lấy bình luận:", error);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [chapterId, novelId]);

    const handlePostComment = async () => {
        if (!newComment.trim()) return;

        try {
            const res = await CreateComment({
                content: newComment,
                novelId,
                chapterId,
            });

            const raw = res.data?.data?.comment;
            if (!raw) throw new Error("Không nhận được bình luận vừa tạo");

            const enriched = await enrichComment(raw);

            setComments((prev) => [enriched, ...prev]);
            setNewComment("");
        } catch (error) {
            console.error("Gửi bình luận thất bại:", error);
        }
    };

    const handleReplyClick = (id: string, name: string) => {
        setReplyInputs((prev) => ({ ...prev, [id]: true }));
        setReplyValues((prev) => ({ ...prev, [id]: `${name} ` }));
        setTimeout(() => inputRefs.current[id]?.focus(), 0);
    };

    const handleReplyChange = (id: string, value: string) => {
        setReplyValues((prev) => ({ ...prev, [id]: value }));
    };

    const handleReplySubmit = async (parentId: string) => {
        const content = replyValues[parentId];
        if (!content.trim()) return;

        try {
            const response = await ReplyComment(parentId, { content });
            const rawReply = response.data?.data?.comment;
            if (!rawReply) throw new Error("Không nhận được phản hồi vừa tạo");

            const enriched = await enrichComment(rawReply);

            setReplyComments((prev) => [...prev, enriched]);
            setReplyInputs((prev) => ({ ...prev, [parentId]: false }));
            setReplyValues((prev) => ({ ...prev, [parentId]: "" }));
        } catch (error) {
            console.error("Phản hồi thất bại:", error);
        }
    };

    return (
        <div className="mt-10 p-5 bg-[#1e1e1e] rounded-xl text-white">
            <div style={{ backgroundColor: "#1e1e1e", color: "#ffffff", padding: "30px" }}>
                <h3 className="font-semibold">Bình luận ({comments.length})</h3>
                <hr style={{
                    marginLeft: "-50px",
                    marginRight: "-50px",
                    marginTop: "20px",
                    width: "calc(100% + 100px)",
                    borderTop: "1px solid #4B5563",
                }} />
            </div>


            <div className="p-3">
                <div className="flex items-center space-x-4">
                    <img src={currentUser.avatarUrl || defaultAvatar} className="w-10 h-10 rounded-full" />
                    <div>
                        <p className="font-semibold">{currentUser.name}</p>
                        <p className="text-xs text-gray-400">{currentUser.user}</p>
                    </div>
                </div>

                <div className="flex flex-col gap-3 mb-4 px-13">
                    <input
                        className="comment w-full"
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Viết bình luận..."
                    />

                    <div className="flex justify-between items-center">
                        <div className="flex gap-5">
                            <img src={ImageAdd02Icon} className="w-6 h-6" />
                            <img src={SmileIcon} className="w-6 h-6" />
                        </div>
                        <button type="button" onClick={handlePostComment} className="buttonPost">
                            <div className="flex gap-2 items-center">
                                Đăng
                                <img src={SentIcon} alt="Gửi" className="w-4 h-4" />
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {comments.map((comment) => (
                <div key={comment.id} className="mb-3 p-3 rounded-md">
                    <div className="flex justify-between items-start space-x-4">
                        <div className="flex items-center space-x-4">
                            <img src={comment.avatarUrl || defaultAvatar} className="w-10 h-10 rounded-full" />
                            <div>
                                <p className="font-semibold">{comment.name}</p>
                                <p className="text-xs text-gray-400">
                                    {comment.user} • {comment.timestamp}
                                </p>
                            </div>
                        </div>
                        {comment.user === currentUser.user ? <MoreUser /> : <MoreButton />}
                    </div>

                    <div className="ml-14">
                        <p className="mb-1">{comment.content}</p>

                        <div className="mt-4 flex space-x-6">
                            <span className="flex items-center gap-2 cursor-pointer" onClick={() => handleReplyClick(comment.id, comment.name)}>
                                <img src={favorite} />
                                {comment.likes}
                            </span>
                            <span className="flex items-center gap-2 cursor-pointer" onClick={() => handleReplyClick(comment.id, comment.name)}>
                                <img src={CommentAdd01Icon} />
                                {comment.replies}
                            </span>
                        </div>

                        {replyInputs[comment.id] && (
                            <div className="mt-4 max-w-2xl">
                                <Reply
                                    currentUser={currentUser}
                                    replyValue={replyValues[comment.id] || ""}
                                    onReplyChange={(e) => handleReplyChange(comment.id, e.target.value)}
                                    onReplySubmit={() => handleReplySubmit(comment.id)}
                                    inputRef={(el) => (inputRefs.current[comment.id] = el)}
                                />
                            </div>
                        )}

                        {replyComments
                            .filter((reply) => reply.parentId === comment.id)
                            .map((reply) => (
                                <NestedReply
                                    key={reply.id}
                                    comment={reply}
                                    currentUser={currentUser}
                                    replies={replyComments}
                                    replyInputs={replyInputs}
                                    replyValues={replyValues}
                                    onReplyClick={handleReplyClick}
                                    onReplyChange={handleReplyChange}
                                    onReplySubmit={handleReplySubmit}
                                />
                            ))}
                    </div>
                </div>
            ))}
        </div>
    );
};
