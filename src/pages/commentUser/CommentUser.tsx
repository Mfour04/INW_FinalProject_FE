import { useState } from 'react';
import type { Comment } from "../commentUser/Comment";
import ImageAdd02Icon from "../../assets/svg/CommentUser/image-add-02-stroke-rounded.svg";
import SmileIcon from "../../assets/svg/CommentUser/smile-stroke-rounded.svg";
import SentIcon from "../../assets/svg/CommentUser/sent-stroke-rounded.svg";
import more_horiz from "../../assets/svg/CommentUser/more_horiz.svg";
import favorite from "../../assets/svg/CommentUser/favorite.svg";
import CommentAdd01Icon from "../../assets/svg/CommentUser/comment-add-01-stroke-rounded.svg";
import avatarImage from '../../assets/img/th.png';

const initialComments: Comment[] = [
    {
        id: 1,
        avatar: avatarImage,
        name: 'finn712',
        user: '@iamfinn7',
        content: 'Truyện hay quá thật cảm xúc!!',
        timestamp: '39 giây trước',
        likes: 0,
        replies: 0,
    },
    {
        id: 2,
        avatar: avatarImage,
        name: 'August B',
        user: '@thaibinhnguyen',
        content: 'Câu văn dài dòng quá',
        timestamp: '1 ngày trước',
        likes: 0,
        replies: 0,
    },
    {
        id: 3,
        avatar: avatarImage,
        name: 'Nguyen Dinh',
        user: '@dinhvanbaonguyen',
        content: 'Ừm cũng tạm',
        timestamp: '6 tháng trước',
        likes: 1,
        replies: 0,
    },
    {
        id: 4,
        avatar: avatarImage,
        name: 'Lộc',
        user: '@locnguyen',
        timestamp: '2 năm trước',
        content: 'Khi nào ra chapter mới vậy?',
        likes: 1,
        replies: 0,
    },
];

export const CommentUser = () => {
    const [comments, setComments] = useState<Comment[]>(initialComments);
    const [newComment, setNewComment] = useState('');

    const handlePostComment = () => {
        if (newComment.trim()) {
            const newCommentData: Comment = {
                id: comments.length + 1,
                avatar: avatarImage,
                name: 'Lộc',
                user: '@locnguyen',
                timestamp: 'Vừa xong',
                content: newComment,
                likes: 0,
                replies: 0,
            };
            setComments([newCommentData, ...comments]);
            setNewComment('');
        }
    };

    return (
        <div className="mt-10 p-5 bg-[#1e1e1e] rounded-xl text-white">
            <div style={{ backgroundColor: '#1e1e1e', color: '#ffffff', padding: '30px' }}>
                <h3 className="font-semibold">Bình luận ({comments.length})</h3>
                <hr style={{ marginLeft: '-50px', marginRight: '-50px', marginTop: '20px', width: 'calc(100% + 100px)', borderTop: '1px solid #4B5563' }} />
            </div>

            <div className="flex gap-3 items-center mb-2">
                <img src={avatarImage} className="w-10 h-10 rounded-full" />
                <input
                    className="comment flex-grow"
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Viết bình luận..."
                />
            </div>

            <div className="flex justify-between items-center mb-4">
                <div className="flex gap-5">
                    <img src={ImageAdd02Icon} className="w-6 h-6" />
                    <img src={SmileIcon} className="w-6 h-6" />
                </div>
                <button onClick={handlePostComment} className="buttonPost">
                    <div className="flex gap-2 items-center">
                        Đăng
                        <img src={SentIcon} alt="Gửi" className="w-4 h-4" />
                    </div>
                </button>
            </div>

            {comments.map((comment) => (
                <div
                    key={comment.id}
                    className="mb-3 p-3 rounded-md"
                >
                    <div className="flex items-center space-x-4">
                        <img src={avatarImage} alt="Avatar" className="w-10 h-10 rounded-full" />
                        <div>
                            <p className="font-semibold">{comment.name}</p>
                            <p className="text-xs text-gray-400">{comment.user} • {comment.timestamp}</p>
                        </div>
                    </div>

                    <div className="ml-14">
                        <p className="mb-1">{comment.content}</p>
                        <div className="mt-4 flex space-x-6">
                            <span className="flex items-center gap-2">
                                <img src={favorite} />
                                {comment.likes}
                            </span>
                            <span className="flex items-center gap-2">
                                <img src={CommentAdd01Icon} />
                                {comment.replies}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
