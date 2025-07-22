import React, { useMemo } from "react";
import type { Comment } from "../commentUser/Comment";
import { AppearReply } from "./AppearReply";
import { Reply } from "./Reply";

interface NestedReplyProps {
    comment: Comment;
    currentUser: { name: string; user: string; avatarUrl?: string | null };
    replies: Comment[];
    replyInputs: { [id: string]: boolean };
    replyValues: { [id: string]: string };
    editedComments: { [id: string]: { content: string; timestamp: string; likes?: number } };
    editingCommentId: string | null;
    editValue: string;
    likedComments: { [id: string]: boolean };
    deleteComment: (id: string) => void;
    handleToggleLike: (id: string) => void;
    setEditValue: React.Dispatch<React.SetStateAction<string>>;
    setEditedComments: React.Dispatch<React.SetStateAction<any>>;
    setEditingCommentId: React.Dispatch<React.SetStateAction<string | null>>;
    updateComment: (
        data: { commentId: string; content: string },
        config: { onSuccess: () => void }
    ) => void;
    onReplyClick: (id: string, name: string) => void;
    onReplyChange: (id: string, value: string) => void;
    onReplySubmit: (parentId: string) => void;
    renderKey: number;
}

export function NestedReply(props: NestedReplyProps) {
    const {
        comment,
        currentUser,
        replies,
        replyInputs,
        replyValues,
        editedComments,
        editingCommentId,
        editValue,
        likedComments,
        renderKey,
        deleteComment,
        handleToggleLike,
        setEditValue,
        setEditedComments,
        setEditingCommentId,
        updateComment,
        onReplyClick,
        onReplyChange,
        onReplySubmit,
    } = props;

    const children = useMemo(
        () => replies.filter((r) => r.parentId === comment.id),
        [replies, renderKey]
    );

    return (
        <div className="ml-6 mt-2">
            <AppearReply
                reply={comment}
                currentUser={currentUser}
                editedComments={editedComments}
                likedComments={likedComments}
                editingCommentId={editingCommentId}
                editValue={editValue}
                setEditValue={setEditValue}
                setEditedComments={setEditedComments}
                setEditingCommentId={setEditingCommentId}
                updateComment={updateComment}
                onReplyClick={onReplyClick}
                onEdit={(id, content) => {
                    setEditingCommentId(id);
                    setEditValue(content);
                }}
                onDelete={(id) => deleteComment(id)}
                onToggleLike={handleToggleLike}
            />

            {replyInputs[comment.id] === true && (
                <div className="ml-6 mt-2 max-w-2xl">
                    <Reply
                        currentUser={currentUser}
                        replyValue={replyValues[comment.id] || ""}
                        onReplyChange={(e) => onReplyChange(comment.id, e.target.value)}
                        onReplySubmit={() => onReplySubmit(comment.id)}
                        inputRef={(el) => {
                            if (el) el.focus();
                        }}
                    />
                </div>
            )}

            {children.map((child) => (
                <NestedReply
                    key={`${child.id}-${renderKey}`}
                    renderKey={renderKey}
                    comment={child}
                    currentUser={currentUser}
                    replies={replies}
                    replyInputs={replyInputs}
                    replyValues={replyValues}
                    editedComments={editedComments}
                    editingCommentId={editingCommentId}
                    editValue={editValue}
                    setEditValue={setEditValue}
                    setEditedComments={setEditedComments}
                    setEditingCommentId={setEditingCommentId}
                    updateComment={updateComment}
                    onReplyClick={onReplyClick}
                    onReplyChange={onReplyChange}
                    onReplySubmit={onReplySubmit}
                    likedComments={likedComments}
                    deleteComment={deleteComment}
                    handleToggleLike={handleToggleLike}
                />
            ))}
        </div>
    );
}
