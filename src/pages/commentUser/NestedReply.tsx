import type { Comment } from "../commentUser/Comment";
import { AppearReply } from "./AppearReply";
import { Reply } from "./Reply";

interface NestedReplyProps {
    comment: Comment;
    currentUser: {
        name: string;
        user: string;
        avatarUrl?: string | null;
    };
    replies: Comment[];
    replyInputs: { [id: string]: boolean };
    replyValues: { [id: string]: string };
    onReplyClick: (id: string, name: string) => void;
    onReplyChange: (id: string, value: string) => void;
    onReplySubmit: (parentId: string) => void;
}

export const NestedReply: React.FC<NestedReplyProps> = ({
    comment,
    currentUser,
    replies,
    replyInputs,
    replyValues,
    onReplyClick,
    onReplyChange,
    onReplySubmit,
}) => {
    // Lấy danh sách reply con của comment hiện tại
    const children = replies.filter((r) => r.parentId === comment.id);

    return (
        <div>
            {/* Hiển thị một reply (có thể là reply cấp 1 hoặc nested) */}
            <AppearReply
                reply={comment}
                currentUser={currentUser}
                onReplyClick={onReplyClick}
            />

            {/* Nếu đang nhập phản hồi cho comment này */}
            {replyInputs[comment.id] && (
                <div className="ml-6 mt-2 max-w-2xl">
                    <Reply
                        currentUser={currentUser}
                        replyValue={replyValues[comment.id] || ""}
                        onReplyChange={(e) =>
                            onReplyChange(comment.id, e.target.value)
                        }
                        onReplySubmit={() => onReplySubmit(comment.id)}
                    />
                </div>
            )}

            {/* Hiển thị reply cấp con (nested) */}
            {children.map((child) => (
                <NestedReply
                    key={child.id}
                    comment={child}
                    currentUser={currentUser}
                    replies={replies}
                    replyInputs={replyInputs}
                    replyValues={replyValues}
                    onReplyClick={onReplyClick}
                    onReplyChange={onReplyChange}
                    onReplySubmit={onReplySubmit}
                />
            ))}
        </div>
    );
};
