import { useState, useRef, useContext, useMemo, useEffect } from "react";
import { useQueryClient, useQueries } from "@tanstack/react-query";
import "./BlogCommentUser.css";

import type { Comment } from "../../CommentUser/types";
import { AuthContext } from "../../../context/AuthContext/AuthProvider";
import {
    blogFormatVietnamTimeFromTicks,
    blogFormatVietnamTimeFromTicksForUpdate,
    blogGetCurrentTicks,
} from "../../../utils/date_format";

import SmileIcon from "../../../assets/svg/CommentUser/smile-stroke-rounded.svg";
import SentIcon from "../../../assets/svg/CommentUser/sent-stroke-rounded.svg";
import favorite from "../../../assets/svg/CommentUser/favorite.svg";
import red_favorite from "../../../assets/svg/CommentUser/red_favorite.svg";
import CommentAdd01Icon from "../../../assets/svg/CommentUser/comment-add-01-stroke-rounded.svg";
import defaultAvatar from "../../../assets/img/default_avt.png";
import { getAvatarUrl } from "../../../utils/avatar";

import { MoreButton } from "../../CommentUser/components/actions/MoreButton";
import { MoreUser } from "../../CommentUser/components/actions/MoreUser";
import { BlogReply } from "./BlogReply";
import { ClickableUserInfo } from "../../../components/common/ClickableUserInfo";

import { UseForumComments, UseCreateForumComment, UseUpdateForumComment, UseDeleteForumComment } from "../HooksBlog";

import {
    LikeForumComment,
    UnlikeForumComment,
    GetRepliesByForumComment,
} from "../../../api/ForumComment/forum-comment.api";

interface BlogCommentUserProps {
    postId: string;
    onCommentCountChange?: (count: number) => void;
}

export const BlogCommentUser = ({ postId, onCommentCountChange }: BlogCommentUserProps) => {
    const { auth } = useContext(AuthContext);
    const queryClient = useQueryClient();
    const [newComment, setNewComment] = useState("");
    const [replyInputs, setReplyInputs] = useState<{ [id: string]: boolean }>({});
    const [replyValues, setReplyValues] = useState<{ [id: string]: string }>({});
    const inputRefs = useRef<{ [id: string]: HTMLInputElement | null }>({});
    const { data: rawComments } = UseForumComments(postId);

    const commentIds =
        rawComments && Array.isArray(rawComments)
            ? rawComments.map((c) => c.id).filter(Boolean)
            : [];

    const repliesQueries = useQueries({
        queries: commentIds.map((commentId) => ({
            queryKey: ["forum-replies", commentId],
            queryFn: async () => {
                const res = await GetRepliesByForumComment(commentId, {
                    page: 0,
                    limit: 50,
                    sortBy: "created_at:desc",
                });
                return res.data.data;
            },
            enabled: !!commentId,
            staleTime: 1000 * 60,
        })),
    });

    const repliesData = repliesQueries.map((query: any) => query.data).filter(Boolean);
    const [tempComments, setTempComments] = useState<Comment[]>([]);
    const { mutate: postComment } = UseCreateForumComment(postId);
    const { mutate: deleteComment } = UseDeleteForumComment(postId);
    const { mutate: updateComment } = UseUpdateForumComment(postId);
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState<string>("");

    const handleDeleteComment = (commentId: string) => {
        const commentToDelete = enrichedComments.find(c => c.id === commentId);
        const isReply = commentToDelete?.parentId;

        deleteComment(commentId, {
            onSuccess: (response: any) => {
                queryClient.invalidateQueries({ queryKey: ["forum-comments", postId] });
                if (isReply) {
                    queryClient.invalidateQueries({ queryKey: ["forum-replies", isReply] });
                    setEditedComments(prev => ({
                        ...prev,
                        [isReply]: {
                            ...prev[isReply],
                            replies: Math.max(0, (prev[isReply]?.replies || 0) - 1)
                        }
                    }));
                }

                setTempComments(prev => prev.filter(c => c.id !== commentId));

                setEditedComments(prev => {
                    const newEdited = { ...prev };
                    delete newEdited[commentId];
                    return newEdited;
                });

                setLikedComments(prev => {
                    const newLiked = { ...prev };
                    delete newLiked[commentId];
                    return newLiked;
                });
            },
            onError: (error: any) => {
            },
        });
    };

    const [editedComments, setEditedComments] = useState<{
        [id: string]: {
            content: string;
            timestamp: string;
            likes?: number;
            replies?: number;
        };
    }>({});

    const currentUser = {
        id: auth?.user?.userId || "",
        name: auth?.user?.displayName || auth?.user?.userName || "Ẩn danh",
        user: "@" + (auth?.user?.userName || "user"),
        avatarUrl: auth?.user?.avatarUrl || null,
    };

    useEffect(() => {
        setTempComments([]);
        setEditedComments({});
        setLikedComments({});

        queryClient.removeQueries({ queryKey: ["forum-comments", postId] });
        queryClient.removeQueries({ queryKey: ["forum-replies"] });
    }, [postId, queryClient]);

    const closeReplyPopup = (id: string) => {
        setReplyInputs((prev) => ({ ...prev, [id]: false }));
    };

    const [likedComments, setLikedComments] = useState<{ [id: string]: boolean }>(
        () => {
            const map: { [id: string]: boolean } = {};

            for (const key in localStorage) {
                if (key.startsWith("liked_")) {
                    const commentId = key.replace("liked_", "");
                    map[commentId] = true;
                }
            }

            return map;
        }
    );

    const serverComments: Comment[] = useMemo(() => {
        const flatten: Comment[] = [];

        const collectComments = (comment: any) => {
            if (!comment.id) {
                return;
            }

            const createdTicks = Number(comment.createdAt) || 0;
            const updatedTicks = Number(comment.updatedAt) || 0;
            const localTicks =
                Number(localStorage.getItem(`updatedAt_${comment.id}`)) || 0;

            if (createdTicks <= 0 && updatedTicks <= 0) {
                return;
            }

            const latestTicks = Math.max(createdTicks, updatedTicks, localTicks);
            const timestamp =
                latestTicks > 0
                    ? blogFormatVietnamTimeFromTicks(latestTicks)
                    : "Không rõ thời gian";

            const nameKey = `comment_authorName_${comment.id}`;
            const handleKey = `comment_authorHandle_${comment.id}`;

            const name =
                comment.author?.displayName ||
                comment.Author?.DisplayName ||
                comment.author?.username ||
                comment.Author?.Username ||
                comment.authorName ||
                comment.userName ||
                comment.displayName ||
                comment.user?.displayName ||
                comment.user?.userName ||
                comment.user?.username ||
                localStorage.getItem(nameKey) ||
                "Ẩn danh";

            const finalName = (name === comment.author?.username || name === comment.Author?.Username)
                ? (auth?.user?.displayName || auth?.user?.userName || name)
                : name;

            const user = comment.author?.username
                ? `@${comment.author.username}`
                : comment.Author?.Username
                    ? `@${comment.Author.Username}`
                    : comment.author?.userName
                        ? `@${comment.author.userName}`
                        : comment.userName
                            ? `@${comment.userName}`
                            : comment.user?.userName
                                ? `@${comment.user.userName}`
                                : comment.user?.username
                                    ? `@${comment.user.username}`
                                    : localStorage.getItem(handleKey) || "@user";

            const avatarUrl = getAvatarUrl(comment.author?.avatar || comment.Author?.Avatar || comment.avatarUrl);

            if (!localStorage.getItem(nameKey)) {
                localStorage.setItem(nameKey, name);
            }
            if (!localStorage.getItem(handleKey)) {
                localStorage.setItem(handleKey, user);
            }

            flatten.push({
                id: comment.id,
                content: comment.content,
                parentId: comment.parentId ?? comment.parentCommentId ?? comment.parent_id ?? null,
                likes: comment.likeCount ?? 0,
                replies: comment.replyCount ?? 0,
                name: finalName,
                user,
                avatarUrl,
                timestamp,
            });
        };

        if (rawComments && Array.isArray(rawComments)) {
            rawComments.forEach(collectComments);
        }

        if (repliesData && Array.isArray(repliesData)) {
            repliesData.forEach((repliesForComment: any, index: number) => {
                if (Array.isArray(repliesForComment)) {
                    repliesForComment.forEach((reply: any) => {
                        collectComments(reply);
                    });
                }
            });
        }

        return flatten;
    }, [rawComments, repliesData, auth]);

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

    const enrichedComments: Comment[] = [...tempComments, ...serverComments];

    const topLevelComments = enrichedComments.filter((c) => !c.parentId && c.id);

    useEffect(() => {
        if (onCommentCountChange) {
            const totalCount = enrichedComments.length;
            onCommentCountChange(totalCount);
        }
    }, [enrichedComments, onCommentCountChange]);

    useEffect(() => {
        if (topLevelComments.length > 0) {
        }
    }, [topLevelComments]);

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
            timestamp: blogFormatVietnamTimeFromTicks(Date.now()),
        };

        setTempComments((prev) => [tempComment, ...prev]);
        setNewComment("");

        const timeoutId = setTimeout(() => {
            setTempComments((prev) => prev.filter((c) => c.id !== tempComment.id));
        }, 5000);

        postComment(
            { content: newComment },
            {
                onSuccess: (response: any) => {
                    clearTimeout(timeoutId);

                    if (response?.data?.success === false) {
                        setTempComments((prev) =>
                            prev.filter((c) => c.id !== tempComment.id)
                        );

                        if (response?.data?.message?.includes("Duplicate")) {
                            alert(
                                "Bạn đã comment nội dung này rồi. Vui lòng đợi 5 phút hoặc comment nội dung khác."
                            );
                        }
                        return;
                    }

                    const rawComment =
                        response?.data?.comment ||
                        response?.data?.data?.comment ||
                        response?.data;

                    if (!rawComment) {
                        setTempComments((prev) =>
                            prev.map((c) =>
                                c.id === tempComment.id
                                    ? {
                                        ...c,
                                        timestamp: blogFormatVietnamTimeFromTicks(Date.now()),
                                    }
                                    : c
                            )
                        );
                        return;
                    }

                    setTempComments((prev) =>
                        prev.filter((c) => c.id !== tempComment.id)
                    );

                    queryClient.invalidateQueries({
                        queryKey: ["forum-comments", postId],
                    });
                },
                onError: (error: any) => {
                    clearTimeout(timeoutId);
                    setTempComments((prev) =>
                        prev.filter((c) => c.id !== tempComment.id)
                    );
                },
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
            timestamp: blogFormatVietnamTimeFromTicks(blogGetCurrentTicks()),
        };

        setTempComments((prev) => [...prev, tempReply]);

        setReplyInputs((prev) => ({ ...prev, [parentId]: false }));
        setReplyValues((prev) => ({ ...prev, [parentId]: "" }));

        postComment(
            { content: content, parentCommentId: parentId },
            {
                onSuccess: (response: any) => {

                    if (response?.data?.success === false) {
                        setTempComments((prev) =>
                            prev.filter((c) => c.id !== tempReply.id)
                        );

                        if (response?.data?.message?.includes("Duplicate")) {
                            alert(
                                "Bạn đã reply nội dung này rồi. Vui lòng đợi 5 phút hoặc reply nội dung khác."
                            );
                        }
                        return;
                    }

                    const rawReply =
                        response?.data?.comment ||
                        response?.data?.data?.comment ||
                        response?.data;

                    if (!rawReply) {
                        setTempComments((prev) =>
                            prev.map((c) =>
                                c.id === tempReply.id
                                    ? {
                                        ...c,
                                        timestamp: blogFormatVietnamTimeFromTicks(blogGetCurrentTicks()),
                                    }
                                    : c
                            )
                        );
                        return;
                    }

                    setTempComments((prev) =>
                        prev.filter((c) => c.id !== tempReply.id)
                    );

                    queryClient.invalidateQueries({
                        queryKey: ["forum-replies", parentId],
                    });

                    queryClient.invalidateQueries({
                        queryKey: ["forum-comments", postId],
                    });
                },
                onError: (error: any) => {
                    setTempComments((prev) =>
                        prev.filter((c) => c.id !== tempReply.id)
                    );
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
            editedComments[commentId]?.likes ?? originalComment?.likes ?? 0;

        if (hasLiked) {
            const response = await UnlikeForumComment(commentId, userId);
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
            const response = await LikeForumComment(commentId, userId, type);

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
            <div className="comment p-5 bg-[#1e1e1e] rounded-xl text-white">
                <div
                    style={{
                        backgroundColor: "#1e1e1e",
                        color: "#ffffff",
                        padding: "30px",
                    }}
                >
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

                {auth?.user && (
                    <div className="p-3">
                        <div className="flex items-center space-x-4">
                            <img
                                src={getAvatarUrl(currentUser.avatarUrl)}
                                className="w-10 h-10 rounded-full"
                            />
                            <div>
                                <p className="font-semibold">{currentUser.name}</p>
                                <p className="text-xs text-gray-400">{currentUser.user}</p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 mb-4 mt-10">
                            <input
                                className="comment w-full"
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Viết bình luận..."
                            />

                            <div className="flex justify-between items-center">
                                <div className="flex gap-5 items-center flex-shrink-0">
                                    <img src={SmileIcon} className="w-6 h-6" />
                                </div>

                                <button
                                    type="button"
                                    onClick={handlePostComment}
                                    className="buttonPost flex-shrink-0"
                                >
                                    <div className="flex gap-2 items-center">
                                        Đăng
                                        <img src={SentIcon} alt="Gửi" className="w-4 h-4" />
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {!auth?.user && (
                    <div className="p-3 text-center text-gray-400">
                        <p>Đăng nhập để bình luận</p>
                    </div>
                )}

                {topLevelComments.map((comment: Comment) => {

                    return (
                        <div key={comment.id} className="mb-3 p-3 rounded-md bg-[#2a2a2a]">
                            <div className="flex justify-between items-start">
                                <div className="flex items-start space-x-3 min-w-0 flex-1">
                                    <img
                                        src={comment.avatarUrl || ""}
                                        alt={comment.name || 'User'}
                                        className="w-8 h-8 rounded-full object-cover flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                                        onClick={() => {
                                            const username = comment.user && comment.user.startsWith('@') ? comment.user.substring(1) : comment.user;
                                            if (username) {
                                                window.location.href = `/profile/${username}`;
                                            }
                                        }}
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = "";
                                        }}
                                    />
                                    <div className="min-w-0 flex-1">
                                        <p
                                            className="text-sm font-semibold text-white truncate hover:text-orange-400 transition-colors cursor-pointer"
                                            onClick={() => {
                                                const username = comment.user && comment.user.startsWith('@') ? comment.user.substring(1) : comment.user;
                                                if (username) {
                                                    window.location.href = `/profile/${username}`;
                                                }
                                            }}
                                            title={`Xem profile của ${comment.name}`}
                                        >
                                            {comment.name}
                                        </p>
                                        <div className="flex items-center gap-2 text-xs text-gray-400">
                                            <span>{comment.user}</span>
                                            <div className="w-[3px] h-[3px] bg-gray-400 rounded-full"></div>
                                            <span>
                                                {comment.id && comment.id.startsWith("temp_")
                                                    ? "Đang gửi..."
                                                    : editedComments[comment.id]?.timestamp ||
                                                    comment.timestamp}
                                            </span>
                                            {editedComments[comment.id] && (
                                                <span className="italic text-gray-500 ml-1"></span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-shrink-0 ml-4 mt-0">
                                    {auth?.user && (comment.user === currentUser.user ||
                                        comment.name === currentUser.name) ? (
                                        <MoreUser
                                            commentId={comment.id}
                                            onDelete={handleDeleteComment}
                                            onEdit={() => {
                                                setEditingCommentId(comment.id);
                                                setEditValue(editedComments[comment.id]?.content || comment.content);
                                            }}
                                        />
                                    ) : auth?.user ? (
                                        <MoreButton />
                                    ) : null}
                                </div>
                            </div>

                            <div className="ml-14">
                                {editingCommentId === comment.id ? (
                                    <div className="flex flex-col gap-2 mt-4">
                                        <input
                                            value={editValue}
                                            onChange={(e) => setEditValue(e.target.value)}
                                            className="comment w-full"
                                        />
                                        <div className="flex gap-3 mt-2">
                                            <button
                                                onClick={() => {
                                                    updateComment(
                                                        { commentId: comment.id, content: editValue },
                                                        {
                                                            onSuccess: (response: any) => {
                                                                const ticks = blogGetCurrentTicks();
                                                                const formattedTime = blogFormatVietnamTimeFromTicksForUpdate(ticks);

                                                                setEditedComments((prev) => ({
                                                                    ...prev,
                                                                    [comment.id]: {
                                                                        content: editValue,
                                                                        timestamp: formattedTime,
                                                                    },
                                                                }));

                                                                localStorage.setItem(
                                                                    `updatedAt_${comment.id}`,
                                                                    String(ticks)
                                                                );

                                                                queryClient.invalidateQueries({ queryKey: ["forum-comments", postId] });

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
                                        className={`flex items-center gap-2 ${auth?.user ? "cursor-pointer" : "cursor-not-allowed opacity-50"}`}
                                        onClick={() => auth?.user && handleToggleLike(comment.id)}
                                    >
                                        <img
                                            src={likedComments[comment.id] ? red_favorite : favorite}
                                            className="w-5 h-5"
                                        />
                                        {editedComments[comment.id]?.likes ??
                                            (Number(localStorage.getItem(`likes_${comment.id}`)) ||
                                                comment.likes)}
                                    </span>

                                    <span
                                        className={`flex items-center gap-2 ${auth?.user ? "cursor-pointer" : "cursor-not-allowed opacity-50"}`}
                                        onClick={() => auth?.user && handleReplyClick(comment.id, comment.name)}
                                    >
                                        <img src={CommentAdd01Icon} />
                                        {enrichedComments.filter(reply => reply.parentId === comment.id).length}
                                    </span>
                                </div>

                                {replyInputs[comment.id] && auth?.user && (
                                    <div className="mt-4 w-full max-w-full">
                                        <BlogReply
                                            currentUser={currentUser}
                                            replyValue={replyValues[comment.id] || ""}
                                            onReplyChange={(e) =>
                                                handleReplyChange(comment.id, e.target.value)
                                            }
                                            onReplySubmit={() => handleReplySubmit(comment.id)}
                                            inputRef={(el) => (inputRefs.current[comment.id] = el)}
                                        />
                                    </div>
                                )}

                                {enrichedComments
                                    .filter((reply: Comment) => {
                                        const isReply = reply.parentId === comment.id;
                                        return isReply;
                                    })
                                    .map((reply: Comment) => (
                                        <div key={reply.id} className="reply mt-2">
                                            <div className="p-3 rounded-md w-full">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex items-center space-x-4 min-w-0 flex-1">
                                                        <ClickableUserInfo
                                                            username={reply.user && reply.user.startsWith('@') ? reply.user.substring(1) : (reply.user || undefined)}
                                                            displayName={reply.name || undefined}
                                                            avatarUrl={reply.avatarUrl || undefined}
                                                            size="small"
                                                            showUsername={true}
                                                        />
                                                    </div>
                                                    <div className="reply flex-shrink-0 ml-4 mt-0 px-3">
                                                        {auth?.user && (reply.user === currentUser.user ||
                                                            reply.name === currentUser.name) ? (
                                                            <MoreUser
                                                                commentId={reply.id}
                                                                onDelete={handleDeleteComment}
                                                                onEdit={() => {
                                                                    setEditingCommentId(reply.id);
                                                                    setEditValue(editedComments[reply.id]?.content || reply.content);
                                                                }}
                                                            />
                                                        ) : auth?.user ? (
                                                            <MoreButton />
                                                        ) : null}
                                                    </div>
                                                </div>

                                                <div className="ml-12">
                                                    {editingCommentId === reply.id ? (
                                                        <div className="flex flex-col gap-2 mt-2">
                                                            <input
                                                                value={editValue}
                                                                onChange={(e) => setEditValue(e.target.value)}
                                                                className="comment w-full text-sm"
                                                            />
                                                            <div className="flex gap-3">
                                                                <button
                                                                    onClick={() => {
                                                                        updateComment(
                                                                            {
                                                                                commentId: reply.id,
                                                                                content: editValue,
                                                                            },
                                                                            {
                                                                                onSuccess: (response: any) => {
                                                                                    const ticks = blogGetCurrentTicks();
                                                                                    const formattedTime = blogFormatVietnamTimeFromTicksForUpdate(ticks);

                                                                                    setEditedComments((prev) => ({
                                                                                        ...prev,
                                                                                        [reply.id]: {
                                                                                            content: editValue,
                                                                                            timestamp: formattedTime,
                                                                                        },
                                                                                    }));

                                                                                    localStorage.setItem(
                                                                                        `updatedAt_${reply.id}`,
                                                                                        String(ticks)
                                                                                    );

                                                                                    queryClient.invalidateQueries({ queryKey: ["forum-comments", postId] });

                                                                                    setEditingCommentId(null);
                                                                                    setEditValue("");
                                                                                },
                                                                            }
                                                                        );
                                                                    }}
                                                                    className="bg-[#ff4500] hover:bg-[#e53e3e] text-white px-3 py-1 rounded text-sm"
                                                                >
                                                                    Lưu
                                                                </button>

                                                                <button
                                                                    onClick={() => {
                                                                        setEditingCommentId(null);
                                                                        setEditValue("");
                                                                    }}
                                                                    className="border border-gray-500 text-white px-3 py-1 rounded hover:bg-gray-700 text-sm"
                                                                >
                                                                    Hủy
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <p className="mb-1 text-sm">
                                                            {editedComments[reply.id]?.content ||
                                                                reply.content}
                                                        </p>
                                                    )}

                                                    <div className="mt-3 flex space-x-4">
                                                        <span
                                                            className={`flex items-center gap-1 ${auth?.user ? "cursor-pointer" : "cursor-not-allowed opacity-50"}`}
                                                            onClick={() => auth?.user && handleToggleLike(reply.id)}
                                                        >
                                                            <img
                                                                src={
                                                                    likedComments[reply.id]
                                                                        ? red_favorite
                                                                        : favorite
                                                                }
                                                                className="w-4 h-4"
                                                            />
                                                            <span className="text-xs">
                                                                {editedComments[reply.id]?.likes ??
                                                                    (Number(
                                                                        localStorage.getItem(`likes_${reply.id}`)
                                                                    ) ||
                                                                        reply.likes)}
                                                            </span>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}; 