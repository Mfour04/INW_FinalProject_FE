import React from "react";
import type { Comment } from "../commentUser/Comment";
import avatarImage from "../../assets/img/th.png";
import { MoreUser } from "../../pages/commentUser/MoreUser";
import { MoreButton } from "../../pages/commentUser/MoreButton";
import favorite from "../../assets/svg/CommentUser/favorite.svg";
import CommentAdd01Icon from "../../assets/svg/CommentUser/comment-add-01-stroke-rounded.svg";

interface AppearReplyProps {
    reply: Comment;
    currentUser: {
        name: string;
        user: string;
    };
    onReplyClick: (id: number, name: string) => void;
}

export const AppearReply: React.FC<AppearReplyProps> = ({
    reply,
    currentUser,
    onReplyClick,
}) => {
    const isCurrentUser = reply.user === currentUser.user;

    return (
        <div key={reply.id} className="p-3 mr-10 rounded-md">
            <div className="flex justify-between items-start space-x-4">
                <div className="flex items-center space-x-4">
                    <img src={avatarImage} className="w-10 h-10 rounded-full" />
                    <div>
                        <p className="font-semibold">{reply.name}</p>
                        <p className="text-xs text-gray-400">{reply.user} • {reply.timestamp}</p>
                    </div>
                </div>
                {isCurrentUser ? <MoreUser /> : <MoreButton />}
            </div>

            <div className="ml-14">
                <p className="mb-1">{reply.content}</p>
                <div className="mt-4 flex space-x-6">
                    <span className="flex items-center gap-2 cursor-pointer" onClick={() => onReplyClick(reply.id, reply.name)}>
                        <img src={favorite} />
                        {reply.likes}
                    </span>

                    <span
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => onReplyClick(reply.id, reply.name)}
                    >
                        <img src={CommentAdd01Icon} />
                        {reply.replies}
                    </span>
                </div>
            </div>
        </div>
    );
};
