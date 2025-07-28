import { useState, useRef, useContext, useMemo, useEffect } from "react";
import { useQueryClient, useQueries } from "@tanstack/react-query";

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

import { UseComments } from "../../pages/commentUser/UseComments";
import { UseCreateComment } from "../../pages/commentUser/UseCreateComment";
import { UseUpdateComment } from "../../pages/commentUser/UseUpdateComment";
import { UseDeleteComment } from "../../pages/commentUser/UseDeleteComment";

import { LikeComment, UnlikeComment, GetRepliesByComment } from "../../api/Comment/comment.api";

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
    const [renderKey] = useState(0);
    const { data: rawComments } = UseComments(chapterId, novelId);

    const commentIds = rawComments?.map(c => c.id).filter(Boolean) || [];
    const repliesQueries = useQueries({
        queries: commentIds.map(commentId => ({
            queryKey: ["replies", commentId],
            queryFn: async () => {
                const res = await GetRepliesByComment(commentId, {
                    page: 0,
                    limit: 50,
                    sortBy: "created_at:desc",
                });
                return res.data.data;
            },
            enabled: !!commentId,
            staleTime: 1000 * 60,
        }))
    });

    const repliesData = repliesQueries.map(query => query.data).filter(Boolean);
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
        id: auth?.user?.userId || "",
        name: auth?.user?.displayName || auth?.user?.userName || "Ẩn danh",
        user: "@" + (auth?.user?.userName || "user"),
        avatarUrl: auth?.user?.avatarUrl || null,
    };

    useEffect(() => {
        setTempComments([]);
    }, []);

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

    const serverComments: Comment[] = useMemo(() => {
        const flatten: Comment[] = [];

        const collectComments = (comment: any) => {

            if (!comment.id) {
                console.warn("Comment without ID found:", comment);
                return;
            }

            const createdTicks = Number(comment.createdAt) || 0;
            const updatedTicks = Number(comment.updatedAt) || 0;
            const localTicks = Number(localStorage.getItem(`updatedAt_${comment.id}`)) || 0;

            if (createdTicks <= 0 && updatedTicks <= 0) {
                console.warn("Invalid timestamp for comment:", comment.id, "createdAt:", comment.createdAt, "updatedAt:", comment.updatedAt);
            }

            const latestTicks = Math.max(createdTicks, updatedTicks, localTicks);
            const timestamp = latestTicks > 0
                ? formatVietnamTimeFromTicks(latestTicks)
                : "Không rõ thời gian";

            const nameKey = `comment_authorName_${comment.id}`;
            const handleKey = `comment_authorHandle_${comment.id}`;

            const name = comment.author?.displayName || comment.author?.userName || comment.authorName || comment.userName || comment.displayName || localStorage.getItem(nameKey) || "Ẩn danh";
            const user = comment.author?.userName ? `@${comment.author.userName}` : comment.userName ? `@${comment.userName}` : localStorage.getItem(handleKey) || "@user";

            if (!localStorage.getItem(nameKey)) {
                localStorage.setItem(nameKey, name);
            }
            if (!localStorage.getItem(handleKey)) {
                localStorage.setItem(handleKey, user);
            }

            flatten.push({
                id: comment.id,
                content: comment.content,
                parentId: comment.parent_comment_id ?? comment.parentCommentId ?? null,
                likes: comment.likeCount ?? 0,
                replies: Array.isArray(comment.replies) ? comment.replies.length : 0,
                name,
                user,
                avatarUrl: defaultAvatar,
                timestamp,
            });

            if (Array.isArray(comment.replies)) {
                comment.replies.forEach(collectComments);
            }
        };

        if (rawComments && Array.isArray(rawComments)) {
            rawComments.forEach(collectComments);
        }

        if (repliesData && Array.isArray(repliesData)) {
            repliesData.forEach((repliesForComment: any, index: number) => {
                if (Array.isArray(repliesForComment)) {
                    repliesForComment.forEach(collectComments);
                }
            });
        }

        return flatten;
    }, [rawComments, repliesData]);

    const localComments: Comment[] = tempComments.map((c) => {
        const nameKey = `comment_authorName_${c.id}`;
        const handleKey = `comment_authorHandle_${c.id}`;

        if (localStorage.getItem(nameKey) === null) {
            localStorage.setItem(nameKey, currentUser.name);
        }
        if (localStorage.getItem(handleKey) === null) {
            localStorage.setItem(handleKey, currentUser.user);
        }

        return {
            ...c,
            name: currentUser.name,
            user: currentUser.user,
            avatarUrl: currentUser.avatarUrl,
        };
    });

    const enrichedComments: Comment[] = [
        ...localComments,
        ...serverComments,
    ];

    const topLevelComments = enrichedComments.filter((c) => !c.parentId && c.id);

    const handlePostComment = () => {
        if (!newComment.trim()) return;

        const tempComment: Comment = {
            id: `temp_${Date.now()}`,
            content: newComment,
            parentId: null,
            likes: 0,
            replies: 0,
            name: currentUser.name,
            user: currentUser.user,
            avatarUrl: currentUser.avatarUrl,
            timestamp: formatVietnamTimeFromTicks(Date.now()),
        };

        setTempComments((prev) => [tempComment, ...prev]);
        setNewComment("");

        const timeoutId = setTimeout(() => {
            setTempComments((prev) => prev.filter(c => c.id !== tempComment.id));
        }, 5000);

        postComment(
            { content: newComment, novelId, chapterId },
            {
                onSuccess: (response: any) => {
                    clearTimeout(timeoutId);

                    if (response?.data?.success === false) {
                        setTempComments((prev) => prev.filter(c => c.id !== tempComment.id));

                        if (response?.data?.message?.includes('Duplicate')) {
                            alert("Bạn đã comment nội dung này rồi. Vui lòng đợi 5 phút hoặc comment nội dung khác.");
                        }
                        return;
                    }

                    const rawComment = response?.data?.comment ||
                        response?.data?.data?.comment ||
                        response?.data;

                    if (!rawComment) {
                        console.error("No comment data in response");

                        setTempComments((prev) =>
                            prev.map(c =>
                                c.id === tempComment.id
                                    ? {
                                        ...c,
                                        timestamp: formatVietnamTimeFromTicks(Date.now()),
                                    }
                                    : c
                            )
                        );
                        return;
                    }

                    setTempComments((prev) => prev.filter(c => c.id !== tempComment.id));

                    queryClient.invalidateQueries({ queryKey: ["comments", chapterId, novelId] });
                },
                onError: (error: any) => {
                    console.error("Error posting comment:", error);
                    console.error("Error details:", {
                        message: error?.message,
                        response: error?.response?.data,
                        status: error?.response?.status,
                        statusText: error?.response?.statusText
                    });
                    clearTimeout(timeoutId);
                    setTempComments((prev) => prev.filter(c => c.id !== tempComment.id));
                }
            }
        );
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

        const tempReply: Comment = {
            id: `temp_reply_${Date.now()}`,
            content: content,
            parentId: parentId,
            likes: 0,
            replies: 0,
            name: currentUser.name,
            user: currentUser.user,
            avatarUrl: currentUser.avatarUrl,
            timestamp: formatVietnamTimeFromTicks(Date.now()),
        };

        setReplyInputs((prev) => ({ ...prev, [parentId]: false }));
        setReplyValues((prev) => ({ ...prev, [parentId]: "" }));

        postComment(
            { content: content, novelId, chapterId, parentCommentId: parentId },
            {
                onSuccess: (response: any) => {

                    if (response?.data?.success === false) {
                        setTempComments((prev) => prev.filter(c => c.id !== tempReply.id));

                        if (response?.data?.message?.includes('Duplicate')) {
                            alert("Bạn đã reply nội dung này rồi. Vui lòng đợi 5 phút hoặc reply nội dung khác.");
                        }
                        return;
                    }

                    const rawReply = response?.data?.comment ||
                        response?.data?.data?.comment ||
                        response?.data;

                    if (!rawReply) {
                        console.error("No reply data in response");

                        setTempComments((prev) =>
                            prev.map(c =>
                                c.id === tempReply.id
                                    ? {
                                        ...c,
                                        timestamp: formatVietnamTimeFromTicks(Date.now()),
                                    }
                                    : c
                            )
                        );
                        return;
                    }

                    queryClient.invalidateQueries({ queryKey: ["comments", chapterId, novelId] });

                    queryClient.invalidateQueries({ queryKey: ["replies", parentId] });
                },
                onError: (error: any) => {
                    console.error("Error posting reply:", error);
                    console.error("Error details:", {
                        message: error?.message,
                        response: error?.response?.data,
                        status: error?.response?.status,
                        statusText: error?.response?.statusText
                    });
                }
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
                                            {comment.user} • {
                                                comment.id && comment.id.startsWith('temp_')
                                                    ? "Đang gửi..."
                                                    : (editedComments[comment.id]?.timestamp || comment.timestamp)
                                            }
                                            {editedComments[comment.id] && (
                                                <span className="italic text-gray-500 ml-1"></span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                                {comment.user === currentUser.user || comment.name === currentUser.name ? <MoreUser
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
                                        {editedComments[comment.id]?.likes ?? (Number(localStorage.getItem(`likes_${comment.id}`)) || comment.likes)}
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
                                        <div key={`${reply.id}-${renderKey}`} className="ml-6 mt-2">
                                            <div className="p-3 mr-10 rounded-md">
                                                <div className="flex justify-between items-start space-x-4">
                                                    <div className="flex items-center space-x-4">
                                                        <img src={reply.avatarUrl || defaultAvatar} className="w-10 h-10 rounded-full" />
                                                        <div>
                                                            <p className="font-semibold">{reply.name}</p>
                                                            <p className="text-xs text-gray-400">
                                                                {reply.user} • {
                                                                    reply.id && reply.id.startsWith('temp_')
                                                                        ? "Đang gửi..."
                                                                        : (editedComments[reply.id]?.timestamp || reply.timestamp)
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {reply.user === currentUser.user || reply.name === currentUser.name ? <MoreUser
                                                        commentId={reply.id}
                                                        onDelete={deleteComment}
                                                        onEdit={() => {
                                                            setEditingCommentId(reply.id);
                                                            setEditValue(reply.content);
                                                        }}
                                                    />
                                                        : <MoreButton />}
                                                </div>

                                                <div className="ml-14">
                                                    {editingCommentId === reply.id ? (
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
                                                                            { commentId: reply.id, content: editValue },
                                                                            {
                                                                                onSuccess: () => {
                                                                                    const ticks = getCurrentTicks();
                                                                                    const formattedTime = formatVietnamTimeFromTicks(ticks);

                                                                                    setEditedComments((prev) => ({
                                                                                        ...prev,
                                                                                        [reply.id]: {
                                                                                            content: editValue,
                                                                                            timestamp: formattedTime,
                                                                                        },
                                                                                    }));
                                                                                    localStorage.setItem(`updatedAt_${reply.id}`, String(ticks));
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
                                                            {editedComments[reply.id]?.content || reply.content}
                                                        </p>
                                                    )}

                                                    <div className="mt-4 flex space-x-6">
                                                        <span
                                                            className={`flex items-center gap-2 cursor-pointer ${likedComments[reply.id] ? "text-red-500" : "text-white"
                                                                }`}
                                                            onClick={() => handleToggleLike(reply.id)}
                                                        >
                                                            <img src={likedComments[reply.id] ? red_favorite : favorite} className="w-5 h-5" />
                                                            {editedComments[reply.id]?.likes ?? (Number(localStorage.getItem(`likes_${reply.id}`)) || reply.likes)}
                                                        </span>


                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};
