import { useState, useRef, useMemo } from "react";
import type { Comment } from "../commentUser/Comment";
import { ReplyComment } from "../../api/Comment/comment.api";
import { useAuth } from "../../api/Comment/useAuth.ts";

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

import { UseComments } from "../../pages/commentUser/UseComments";
import { UseCreateComment } from "../../pages/commentUser/UseCreateComment";
import { UseUpdateComment } from "../../pages/commentUser/UseUpdateComment";
import { UseDeleteComment } from "../../pages/commentUser/UseDeleteComment";

interface CommentUserProps {
    novelId: string;
    chapterId: string;
}

export const CommentUser: React.FC<CommentUserProps> = ({ novelId, chapterId }) => {
    const { auth } = useAuth();

    const [editedComments, setEditedComments] = useState<{
        [id: string]: { content: string; timestamp: string };
    }>({});

    const getCurrentTicks = (): number => {
        const utcMs = Date.now() + 7 * 60 * 60 * 1000;
        return utcMs * 10000 + 621355968000000000;
    };

    const currentUser = {
        id: (auth?.user as any)?.id || "",
        name: (auth?.user as any)?.fullName || (auth?.user as any)?.username || "Ẩn danh",
        user: "@" + ((auth?.user as any)?.username || "user"),
        avatarUrl: (auth?.user as any)?.avatarUrl || null,
    };

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

    const { data: rawComments = [], isLoading } = UseComments(chapterId, novelId);
    const { mutate: postComment } = UseCreateComment(chapterId, novelId);
    const { mutate: deleteComment } = UseDeleteComment(chapterId, novelId);
    const { mutate: updateComment } = UseUpdateComment(chapterId, novelId);

    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState<string>("");
    const [originalTimestamp, setOriginalTimestamp] = useState<{ [id: string]: string }>({});

    const enrichedComments = useMemo(() => {
        return rawComments.map((c: any) => {
            const rawTicks = c.created_at ?? c.createdAt;
            const ticks = typeof rawTicks === "string" ? Number(rawTicks) : rawTicks;

            const timestamp =
                ticks && !isNaN(ticks) && ticks > 621355968000000000
                    ? formatVietnamTimeFromTicks(ticks)
                    : "Vừa xong";

            return {
                id: c.id,
                content: c.content,
                parentId: c.parent_comment_id || null,
                likes: c.likes || 0,
                replies: c.replies?.length || 0,
                name: currentUser.name,
                user: currentUser.user,
                avatarUrl: currentUser.avatarUrl,
                timestamp,
            };
        });
    }, [rawComments]);

    const topLevelComments = enrichedComments.filter((c) => !c.parentId);
    const nestedReplies = enrichedComments.filter((c) => c.parentId);

    const handlePostComment = () => {
        if (!newComment.trim()) return;
        postComment(newComment);
        setNewComment("");
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

            const reply = {
                id: rawReply.id,
                content: rawReply.content,
                parentId: rawReply.parent_comment_id || null,
                likes: rawReply.likes || 0,
                replies: rawReply.replies?.length || 0,
                name: currentUser.name,
                user: currentUser.user,
                avatarUrl: currentUser.avatarUrl,
                timestamp: formatVietnamTimeFromTicks(Number(rawReply.created_at)),
            };

            nestedReplies.push(reply);
            setReplyInputs((prev) => ({ ...prev, [parentId]: false }));
            setReplyValues((prev) => ({ ...prev, [parentId]: "" }));
        } catch (error) {
            console.error("Phản hồi thất bại:", error);
        }
    };

    return (
        <div className="mt-10 p-5 bg-[#1e1e1e] rounded-xl text-white">
            <div style={{ backgroundColor: "#1e1e1e", color: "#ffffff", padding: "30px" }}>
                <h3 className="font-semibold">Bình luận ({topLevelComments.length})</h3>
                <hr
                    style={{
                        marginLeft: "-50px",
                        marginRight: "-50px",
                        marginTop: "20px",
                        width: "calc(100% + 100px)",
                        borderTop: "1px solid #4B5563",
                    }}
                />
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

            {topLevelComments.map((comment: Comment) => (
                <div key={comment.id} className="mb-3 p-3 rounded-md">
                    <div className="flex justify-between items-start space-x-4">
                        <div className="flex items-center space-x-4">
                            <img src={comment.avatarUrl || defaultAvatar} className="w-10 h-10 rounded-full" />
                            <div>
                                <p className="font-semibold">{comment.name}</p>
                                <p className="text-xs text-gray-400">
                                    {comment.user} • {editedComments[comment.id]?.timestamp || comment.timestamp}
                                    {editedComments[comment.id] && (
                                        <span className="italic text-gray-500 ml-1"></span>
                                    )}
                                </p>
                            </div>
                        </div>
                        {comment.user === currentUser.user ? <MoreUser
                            commentId={comment.id}
                            onDelete={deleteComment}
                            onEdit={() => {
                                setEditingCommentId(comment.id);
                                setEditValue(comment.content);
                                setOriginalTimestamp((prev) => ({ ...prev, [comment.id]: comment.timestamp }));
                            }}
                        />
                            : <MoreButton />}
                    </div>

                    <div className="ml-14">
                        {editingCommentId === comment.id ? (
                            <div className="flex flex-col gap-2 mt-2">
                                <input
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    className="comment w-[1570px]"
                                />
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => {
                                            updateComment(
                                                { commentId: comment.id, content: editValue },
                                                {
                                                    onSuccess: () => {
                                                        const currentTicks = getCurrentTicks();
                                                        const newFormattedTime = formatVietnamTimeFromTicks(currentTicks);

                                                        setEditedComments((prev) => ({
                                                            ...prev,
                                                            [comment.id]: {
                                                                content: editValue,
                                                                timestamp: newFormattedTime,
                                                            },
                                                        }));

                                                        setEditingCommentId(null);
                                                        setEditValue("");
                                                    },
                                                }
                                            );
                                        }}
                                        className="bg-[#ff4500] hover:bg-[#e53e3e] text-white px-4 py-2 rounded"
                                    >
                                        Lưu
                                    </button>

                                    <button
                                        onClick={() => {
                                            setEditingCommentId(null);
                                            setEditValue("");
                                        }}
                                        className="border border-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
                                    >
                                        Hủy
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <p className="mb-1">
                                {editedComments[comment.id]?.content || comment.content}
                            </p>
                        )}

                        <div className="mt-4 flex space-x-6">
                            <span
                                className="flex items-center gap-2 cursor-pointer"
                                onClick={() => handleReplyClick(comment.id, comment.name)}
                            >
                                <img src={favorite} />
                                {comment.likes}
                            </span>
                            <span
                                className="flex items-center gap-2 cursor-pointer"
                                onClick={() => handleReplyClick(comment.id, comment.name)}
                            >
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

                        {nestedReplies
                            .filter((reply: Comment) => reply.parentId === comment.id)
                            .map((reply: Comment) => (
                                <NestedReply
                                    key={reply.id}
                                    comment={reply}
                                    currentUser={currentUser}
                                    replies={nestedReplies}
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
