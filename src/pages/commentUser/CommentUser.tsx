import { useState, useRef, useContext } from "react";
import { useQueryClient } from "@tanstack/react-query";

import type { Comment } from "../commentUser/Comment";
import { AuthContext } from "../../context/AuthContext/AuthProvider";
import { formatVietnamTimeFromTicks, getCurrentTicks } from "../../utils/date_format.ts";

import ImageAdd02Icon from "../../assets/svg/CommentUser/image-add-02-stroke-rounded.svg";
import SmileIcon from "../../assets/svg/CommentUser/smile-stroke-rounded.svg";
import SentIcon from "../../assets/svg/CommentUser/sent-stroke-rounded.svg";
import favorite from "../../assets/svg/CommentUser/favorite.svg";
import red_favorite from "../../assets/svg/CommentUser/red_favorite.svg";
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

import { LikeComment, UnlikeComment } from "../../api/Comment/comment.api";

interface CommentUserProps {
    novelId: string;
    chapterId: string;
}

export const CommentUser = ({ novelId, chapterId }: CommentUserProps) => {
    const { auth } = useContext(AuthContext);
    const queryClient = useQueryClient();
    const [newComment, setNewComment] = useState("");
    const [replyInputs, setReplyInputs] = useState<{ [id: string]: boolean }>({});
    const [replyValues, setReplyValues] = useState<{ [id: string]: string }>({});
    const inputRefs = useRef<{ [id: string]: HTMLInputElement | null }>({});
    const [renderKey, setRenderKey] = useState(0);
    const { data: rawComments = [] } = UseComments(chapterId, novelId);
    const [tempComments, setTempComments] = useState<Comment[]>([]);
    const { mutate: postComment } = UseCreateComment(chapterId, novelId);
    const { mutate: deleteComment } = UseDeleteComment(chapterId, novelId);
    const { mutate: updateComment } = UseUpdateComment(chapterId, novelId);
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState<string>("");

    const [editedComments, setEditedComments] = useState<{
        [id: string]: { content: string; timestamp: string; likes?: number; replies?: number };
    }>({});

    const currentUser = {
        id: (auth?.user as any)?.id || "",
        name: (auth?.user as any)?.fullName || (auth?.user as any)?.username || "Ẩn danh",
        user: "@" + ((auth?.user as any)?.username || "user"),
        avatarUrl: (auth?.user as any)?.avatarUrl || null,
    };

    const closeReplyPopup = (id: string) => {
        setReplyInputs((prev) => ({ ...prev, [id]: false }));
    };

    const [likedComments, setLikedComments] = useState<{ [id: string]: boolean }>(() => {
        const map: { [id: string]: boolean } = {};

        for (const key in localStorage) {
            if (key.startsWith("liked_")) {
                const commentId = key.replace("liked_", "");
                map[commentId] = true;
            }
        }

        return map;
    });

    const enrichedComments = (() => {
        const flatten: Comment[] = [];

        const collectComments = (comment: any) => {
            flatten.push({
                id: comment.id,
                content: comment.content,
                parentId:
                    comment.parent_comment_id ??
                    comment.parentCommentId ??
                    null,
                likes: comment.likeCount ?? 0,
                replies: Array.isArray(comment.replies) ? comment.replies.length : 0,
                name: currentUser.name,
                user: currentUser.user,
                avatarUrl: currentUser.avatarUrl,
                timestamp:
                    localStorage.getItem(`updatedAt_${comment.id}`) !== null
                        ? formatVietnamTimeFromTicks(Number(localStorage.getItem(`updatedAt_${comment.id}`)))
                        : formatVietnamTimeFromTicks(Number(comment.createdAt)),
            });

            if (Array.isArray(comment.replies)) {
                comment.replies.forEach(collectComments);
            }
        };

        rawComments.forEach(collectComments);
        flatten.push(...tempComments);

        return flatten;
    })();

    const topLevelComments = enrichedComments.filter((c) => !c.parentId);

    const handlePostComment = () => {
        if (!newComment.trim()) return;

        postComment({ content: newComment });
        setNewComment("");
    };

    const handleReplyClick = (id: string, name: string) => {
        setReplyInputs((prev) => {
            const next = !prev[id];
            if (next) {
                setReplyValues((prevVal) => ({ ...prevVal, [id]: `${name} ` }));
                setTimeout(() => inputRefs.current[id]?.focus(), 0);
            }
            return { ...prev, [id]: next };
        });
    };

    const handleReplyChange = (id: string, value: string) => {
        setReplyValues((prev) => ({ ...prev, [id]: value }));
    };

    const handleReplySubmit = (parentId: string) => {
        const content = replyValues[parentId];
        closeReplyPopup(parentId);

        if (!content.trim()) return;

        postComment(
            { content, parentCommentId: parentId },
            {
                onSuccess: (response: any) => {
                    const rawReply = response?.data?.comment;
                    if (!rawReply) return;

                    const tempReply: Comment = {
                        id: rawReply.id,
                        content: rawReply.content,
                        parentId: parentId,
                        likes: rawReply.likeCount ?? 0,
                        replies: 0,
                        name: currentUser.name,
                        user: currentUser.user,
                        avatarUrl: currentUser.avatarUrl,
                        timestamp: formatVietnamTimeFromTicks(Number(rawReply.createdAt ?? Date.now())),
                    };

                    const parentRaw = rawComments
                        .flatMap((c: any) => [c, ...(c.replies ?? [])])
                        .find((r: any) => r.id === parentId);

                    const tempParent: Comment | null = parentRaw
                        ? {
                            id: parentRaw.id,
                            content: parentRaw.content,
                            parentId: parentRaw.parentCommentId ?? null,
                            likes: parentRaw.likeCount ?? 0,
                            replies: 1,
                            name: currentUser.name,
                            user: currentUser.user,
                            avatarUrl: currentUser.avatarUrl,
                            timestamp: formatVietnamTimeFromTicks(Number(parentRaw.createdAt)),
                        }
                        : null;

                    setTempComments((prev) => {
                        const hasParent = prev.some((c) => c.id === parentId);
                        const updated = [...prev, tempReply];
                        const result = !hasParent && tempParent ? [...updated, tempParent] : updated;
                        return result;
                    });

                    setReplyInputs((prev) => ({ ...prev, [parentId]: false }));
                    setReplyValues((prev) => ({ ...prev, [parentId]: "" }));

                    const parentChain = [parentRaw?.parentCommentId, parentId].filter(
                        (id): id is string => typeof id === "string"
                    );

                    parentChain.forEach((id) => {
                        setEditedComments((prev) => ({
                            ...prev,
                            [id]: {
                                ...(prev[id] || {}),
                                replies:
                                    ((prev[id]?.replies ??
                                        enrichedComments.find((c) => c.id === id)?.replies ?? 0) + 1),
                            },
                        }));
                    });

                    setRenderKey((prev) => prev + 1);

                    queryClient.invalidateQueries({ queryKey: ["comments", chapterId, novelId] });
                },
            }
        );
    };

    const handleToggleLike = async (commentId: string) => {
        const userId = currentUser.id;
        const hasLiked = likedComments[commentId];
        const type = 1;
        const originalComment = enrichedComments.find((c) => c.id === commentId);

        const currentLikes =
            editedComments[commentId]?.likes ??
            originalComment?.likes ??
            0;

        if (hasLiked) {
            const response = await UnlikeComment(commentId, userId);
            if (response.data.success) {
                const newLikes = Math.max(0, currentLikes - 1);

                setLikedComments((prev) => ({
                    ...prev,
                    [commentId]: false,
                }));

                localStorage.removeItem(`liked_${commentId}`);
                localStorage.setItem(`likes_${commentId}`, String(newLikes));

                setEditedComments((prev) => ({
                    ...prev,
                    [commentId]: {
                        ...(prev[commentId] || {}),
                        likes: newLikes,
                    },
                }));
            }
        } else {
            const response = await LikeComment(commentId, userId, type);

            if (response.data.success) {
                const newLikes = currentLikes + 1;

                setLikedComments((prev) => ({
                    ...prev,
                    [commentId]: true,
                }));

                localStorage.setItem(`liked_${commentId}`, "true");
                localStorage.setItem(`likes_${commentId}`, String(newLikes));

                setEditedComments((prev) => ({
                    ...prev,
                    [commentId]: {
                        ...(prev[commentId] || {}),
                        likes: newLikes,
                    },
                }));
            }
        }
    };

    return (
        <>
            {auth?.user && (
                <div className="mt-10 p-5 bg-[#1e1e1e] rounded-xl text-white">
                    <div style={{ backgroundColor: "#1e1e1e", color: "#ffffff", padding: "30px" }}>
                        <h3 className="font-semibold">
                            Bình luận ({enrichedComments.length})
                        </h3>

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
                                                                const ticks = getCurrentTicks();
                                                                const formattedTime = formatVietnamTimeFromTicks(ticks);

                                                                setEditedComments((prev) => ({
                                                                    ...prev,
                                                                    [comment.id]: {
                                                                        content: editValue,
                                                                        timestamp: formattedTime,
                                                                    },
                                                                }));
                                                                localStorage.setItem(`updatedAt_${comment.id}`, String(ticks));
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
                                        className={`flex items-center gap-2 cursor-pointer ${likedComments[comment.id] ? "text-red-500" : "text-white"
                                            }`}
                                        onClick={() => handleToggleLike(comment.id)}
                                    >
                                        <img src={likedComments[comment.id] ? red_favorite : favorite} className="w-5 h-5" />
                                        {editedComments[comment.id]?.likes ?? Number(localStorage.getItem(`likes_${comment.id}`)) ?? comment.likes}
                                    </span>

                                    <span
                                        className="flex items-center gap-2 cursor-pointer"
                                        onClick={() => handleReplyClick(comment.id, comment.name)}
                                    >
                                        <img src={CommentAdd01Icon} />
                                        {editedComments[comment.id]?.replies ?? comment.replies}
                                    </span>
                                </div>

                                {replyInputs[comment.id] && (
                                    <div
                                        className="mt-4 max-w-2xl"
                                    >
                                        <Reply
                                            currentUser={currentUser}
                                            replyValue={replyValues[comment.id] || ""}
                                            onReplyChange={(e) => handleReplyChange(comment.id, e.target.value)}
                                            onReplySubmit={() => handleReplySubmit(comment.id)}
                                            inputRef={(el) => (inputRefs.current[comment.id] = el)}
                                        />
                                    </div>
                                )}

                                {enrichedComments
                                    .filter((reply: Comment) => reply.parentId === comment.id)
                                    .map((reply: Comment) => (
                                        <NestedReply
                                            key={`${reply.id}-${renderKey}`}
                                            comment={reply}
                                            currentUser={currentUser}
                                            replies={enrichedComments}
                                            replyInputs={replyInputs}
                                            replyValues={replyValues}
                                            editedComments={editedComments}
                                            editingCommentId={editingCommentId}
                                            editValue={editValue}
                                            setEditValue={setEditValue}
                                            setEditedComments={setEditedComments}
                                            setEditingCommentId={setEditingCommentId}
                                            updateComment={updateComment}
                                            onReplyClick={handleReplyClick}
                                            onReplyChange={handleReplyChange}
                                            onReplySubmit={handleReplySubmit}
                                            likedComments={likedComments}
                                            deleteComment={deleteComment}
                                            handleToggleLike={handleToggleLike}
                                            renderKey={renderKey}
                                        />
                                    ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};
