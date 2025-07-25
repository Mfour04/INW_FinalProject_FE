import React from "react";
import type { Comment } from "../commentUser/Comment";
import avatarImage from "../../assets/img/th.png";
import { MoreUser } from "../../pages/commentUser/MoreUser";
import { MoreButton } from "../../pages/commentUser/MoreButton";
import favorite from "../../assets/svg/CommentUser/favorite.svg";
import red_favorite from "../../assets/svg/CommentUser/red_favorite.svg";
import CommentAdd01Icon from "../../assets/svg/CommentUser/comment-add-01-stroke-rounded.svg";
import { formatVietnamTimeFromTicks, getCurrentTicks } from "../../utils/date_format.ts";

interface AppearReplyProps {
    reply: Comment;
    currentUser: {
        name: string;
        user: string;
        avatarUrl?: string | null;
    };
    likedComments: { [id: string]: boolean };
    editedComments: { [id: string]: { content: string; timestamp: string; likes?: number } };
    editingCommentId: string | null;
    editValue: string;
    onReplyClick: (id: string, name: string) => void;
    onEdit: (id: string, content: string) => void;
    onDelete: (id: string) => void;
    onToggleLike: (id: string) => void;
    setEditValue: React.Dispatch<React.SetStateAction<string>>;
    setEditingCommentId: React.Dispatch<React.SetStateAction<string | null>>;
    updateComment: (
        data: { commentId: string; content: string },
        config: { onSuccess: () => void }
    ) => void;
    setEditedComments: React.Dispatch<
        React.SetStateAction<{
            [id: string]: {
                content: string;
                timestamp: string;
                likes?: number;
                replies?: number;
            };
        }>
    >;
}

export function AppearReply(props: AppearReplyProps) {
    const {
        reply,
        currentUser,
        likedComments,
        editedComments,
        editingCommentId,
        editValue,
        setEditValue,
        updateComment,
        onReplyClick,
        onEdit,
        onDelete,
        onToggleLike,
    } = props;

    const isCurrentUser = reply.user === currentUser.user;
    const displayName = reply.name || "Người dùng";
    const displayUser = reply.user || "@anonymous";
    const displayTime = reply.timestamp || "Vừa xong";
    const avatar = reply.avatarUrl || avatarImage;

    return (
        <div key={reply.id} className="p-3 mr-10 rounded-md">
            <div className="flex justify-between items-start space-x-4">
                <div className="flex items-center space-x-4">
                    <img src={avatar} alt={displayName} className="w-10 h-10 rounded-full" />
                    <div>
                        <p className="font-semibold">{displayName}</p>
                        <p className="text-xs text-gray-400">
                            {displayUser} • {displayTime}
                        </p>
                    </div>
                </div>
                {isCurrentUser ? (
                    <MoreUser
                        commentId={reply.id}
                        onEdit={() => onEdit(reply.id, reply.content)}
                        onDelete={() => onDelete(reply.id)}
                    />
                ) : (
                    <MoreButton />
                )}
            </div>

            <div className="ml-14">
                {editingCommentId === reply.id ? (
                    <div className="flex flex-col gap-2 mt-2">
                        <input
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="comment w-full"
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    updateComment(
                                        { commentId: reply.id, content: editValue },
                                        {
                                            onSuccess: () => {
                                                const ticks = getCurrentTicks();
                                                const time = formatVietnamTimeFromTicks(ticks);
                                                localStorage.setItem(`updatedAt_${reply.id}`, String(ticks));

                                                props.setEditedComments((prev) => ({
                                                    ...prev,
                                                    [reply.id]: {
                                                        content: editValue,
                                                        timestamp: time,
                                                    },
                                                }));

                                                props.setEditingCommentId(null);
                                                props.setEditValue("");
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
                                    props.setEditingCommentId(null);
                                    props.setEditValue("");
                                }}
                                className="border border-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="mb-1">{editedComments[reply.id]?.content || reply.content}</p>
                )}

                <div className="mt-4 flex space-x-6">
                    <span
                        className={`flex items-center gap-2 cursor-pointer ${likedComments[reply.id] ? "text-red-500" : "text-white"}`}
                        onClick={() => onToggleLike(reply.id)}
                    >
                        <img
                            src={likedComments[reply.id] ? red_favorite : favorite}
                            className="w-5 h-5"
                        />
                        {editedComments[reply.id]?.likes ??
                            Number(localStorage.getItem(`likes_${reply.id}`)) ??
                            reply.likes}
                    </span>

                    <span
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => onReplyClick(reply.id, displayName)}
                    >
                        <img src={CommentAdd01Icon} />
                        {reply.replies}
                    </span>
                </div>
            </div>
        </div>
    );
};
