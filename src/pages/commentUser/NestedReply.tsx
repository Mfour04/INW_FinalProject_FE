import type { Comment } from "../commentUser/Comment";
import { AppearReply } from "./AppearReply";
import { Reply } from "./Reply";

interface NestedReplyProps {
    parent: Comment;
    currentUser: { name: string; user: string };
    replies: Comment[];
    replyInputs: { [id: number]: boolean };
    replyValues: { [id: number]: string };
    onReplyClick: (id: number, name: string) => void;
    onReplyChange: (id: number, value: string) => void;
    onReplySubmit: (parentId: number) => void;
}

export const NestedReply: React.FC<NestedReplyProps> = ({
    parent,
    currentUser,
    replies,
    replyInputs,
    replyValues,
    onReplyClick,
    onReplyChange,
    onReplySubmit,
}) => {
    const children = replies.filter(r => r.parentId === parent.id);

    return (
        <div>
            <AppearReply
                reply={parent}
                currentUser={currentUser}
                onReplyClick={onReplyClick}
            />

            {replyInputs[parent.id] && (
                <div className="ml-6 mt-2 max-w-2xl">
                    <Reply
                        currentUser={currentUser}
                        replyValue={replyValues[parent.id] || ""}
                        onReplyChange={(e) => onReplyChange(parent.id, e.target.value)}
                        onReplySubmit={() => onReplySubmit(parent.id)}
                    />
                </div>
            )}

            {children.map(child => (
                <NestedReply
                    key={child.id}
                    parent={child}
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
