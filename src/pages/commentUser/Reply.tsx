import React from "react";
import ImageAdd02Icon from "../../assets/svg/CommentUser/image-add-02-stroke-rounded.svg";
import SmileIcon from "../../assets/svg/CommentUser/smile-stroke-rounded.svg";
import SentIcon from "../../assets/svg/CommentUser/sent-stroke-rounded.svg";
import avatarImage from "../../assets/img/th.png";

interface ReplyProps {
    currentUser: {
        name: string;
        user: string;
        avatarUrl?: string | null;
    };
    replyValue: string;
    onReplyChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onReplySubmit: () => void;
    inputRef?: (el: HTMLInputElement | null) => void;
}

export const Reply: React.FC<ReplyProps> = ({
    currentUser,
    replyValue,
    onReplyChange,
    onReplySubmit,
    inputRef,
}) => {
    const displayName = currentUser.name || "Người dùng";
    const displayUser = currentUser.user || "@anonymous";
    const avatarSrc = currentUser.avatarUrl || avatarImage;

    return (
        <div className="p-3 w-[1000px]">
            <div className="flex gap-3 items-center mb-2">
                <img
                    src={avatarSrc}
                    alt={displayName}
                    className="w-10 h-10 rounded-full"
                />
                <div>
                    <p className="font-semibold">{displayName}</p>
                    <p className="text-xs text-gray-400">{displayUser}</p>
                </div>
            </div>

            <div className="flex flex-col gap-3 mb-4 px-4">
                <input
                    ref={inputRef}
                    value={replyValue}
                    onChange={onReplyChange}
                    placeholder="Phản hồi bình luận..."
                    className="comment w-full"
                />

                <div className="flex justify-between items-center">
                    <div className="flex gap-5">
                        <img src={ImageAdd02Icon} className="w-6 h-6" alt="Thêm ảnh" />
                        <img src={SmileIcon} className="w-6 h-6" alt="Biểu cảm" />
                    </div>
                    <button
                        type="button"
                        onClick={onReplySubmit}
                        className="buttonPost"
                    >
                        <div className="flex gap-2 items-center">
                            Đăng
                            <img src={SentIcon} alt="Gửi" className="w-4 h-4" />
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};
