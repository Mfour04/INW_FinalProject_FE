import '../../pages/novelRead/NovelRead.css';
import type { Comment } from "../../pages/novelRead/Comment";
import { useState } from 'react';
import { novelData } from "../../pages/novelRead/Content";

const commentsData: Comment[] = [
    {
        id: 1,
        username: 'finn712',
        content: 'Truyện hay quá thật cảm xúc!!',
        timestamp: '39 giây trước',
        likes: 0,
        replies: 0,
    },
    {
        id: 2,
        username: 'August B',
        content: 'Câu văn dài dòng quá',
        timestamp: '1 ngày trước',
        likes: 0,
        replies: 0,
    },
    {
        id: 3,
        username: 'Nguyen Dinh',
        content: 'Ừm cũng tạm',
        timestamp: '6 tháng trước',
        likes: 1,
        replies: 0,
    },
    {
        id: 4,
        username: 'Lộc',
        content: 'Khi nào ra chapter mới vậy?',
        timestamp: '2 năm trước',
        likes: 1,
        replies: 0,
    },
];


export const NovelRead = () => {

    const [comments, setComments] = useState(commentsData);
    const [newComment, setNewComment] = useState('');

    const handlePostComment = () => {
        if (newComment.trim()) {
            const newCommentData: Comment = {
                id: comments.length + 1,
                username: 'Bạn',
                content: newComment,
                timestamp: 'Vừa xong',
                likes: 0,
                replies: 0,
            };
            setComments([newCommentData, ...comments]);
            setNewComment('');
        }
    };

    return (
        <div style={{ border: '1px', padding: '20px', borderRadius: '8px', marginTop: '-10px' }}>
            <div style={{ backgroundColor: '#1e1e1e', color: '#ffffff', padding: '50px', fontFamily: 'Arial, sans-serif', borderRadius: '10px', height: '950px' }}>
                <div>
                    <h1 style={{ color: '#ff4500', marginTop: '-30px' }}>{novelData.chapterName}</h1>
                    <h2>{novelData.chapterTitle}</h2>
                </div>

                <div style={{ lineHeight: '4' }}>
                    <hr style={{ marginLeft: '-50px', marginRight: '-50px', marginTop: '20px', width: 'calc(100% + 100px)', borderTop: '1px solid #4B5563' }} />
                    {novelData.contentLines.map((line, index) => (
                        <p key={index}>{line}</p>
                    ))}
                </div>
                <hr style={{ marginLeft: '-50px', marginRight: '-50px', marginTop: '10px', width: 'calc(100% + 100px)', borderTop: '1px solid #4B5563' }} />
                <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginTop: '20px' }}>
                    <button className='buttonStyle'>&lt; Chương trước</button>
                    <button className='buttonStyle'>Mục lục</button>
                    <button className='buttonStyle'>Chương sau &gt;</button>
                </div>

            </div>

            <div style={{ padding: '20px', backgroundColor: '#1e1e1e', borderRadius: '10px', marginTop: '40px', color: '#ffffff' }}>
                {comments.map((comment) => (
                    <div key={comment.id} style={{ padding: '10px', backgroundColor: '#1e1e1e', borderRadius: '5px', marginBottom: '5px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontWeight: 'bold' }}>@{comment.username}</span>
                            <span style={{ color: '#888' }}>{comment.timestamp}</span>
                        </div>
                        <p>{comment.content}</p>
                        <div style={{ display: 'flex', gap: '10px', fontSize: '14px' }}>
                            <span>❤️ {comment.likes}</span>
                            <span>💬 {comment.replies}</span>
                        </div>
                    </div>
                ))}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Viết bình luận..."
                        style={{ flexGrow: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                    />
                    <button
                        onClick={handlePostComment}
                        style={{ padding: '10px', borderRadius: '5px', backgroundColor: '#ff4500', color: 'white', border: 'none' }}
                    >
                        Đăng
                    </button>
                </div>
            </div>
        </div>

    );
}