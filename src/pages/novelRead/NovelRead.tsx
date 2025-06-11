import '../../pages/novelRead/NovelRead.css';
import type { Comment } from "../../pages/novelRead/Comment";
import { useState } from 'react';

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
        <div style={{ border: '1px', padding: '50px', borderRadius: '8px' }}>
            <div style={{ backgroundColor: '#1e1e1e', color: '#ffffff', padding: '50px', fontFamily: 'Arial, sans-serif', borderRadius: '10px' }}>
                <div>
                    <h1 style={{ color: '#ff4500' }}>Sự tái sinh thêm</h1>
                    <h2>Chương 1: Đấu giá linh hồn Isekai</h2>
                </div>

                <div style={{ lineHeight: '4' }}>
                    <hr style={{ height: '1px' }} />
                    <p>Đấu giá linh hồn Isekai</p>
                    <p>"Các vị thần có quá nhiều thời gian rảnh rồi! Xin chào, xin chào mừng đến với sự kiện ngày hôm nay!"</p>
                    <p>Màn sân khấu được kéo lên, sức nóng của khán giả tràn lên sân khấu.</p>
                    <p>Một người đàn ông có chân tay dài kỳ lạ, đội mũ lụa và mặc áo tuxedo, cầm micro, được chiếu đến và hét lớn.</p>
                    <p>Khuôn mặt anh ta được bao phủ bởi một lớp sương mù trắng, khiến cho việc nhìn rõ trở nên khó khăn.</p>
                    <p>Tiếng phản hồi của micro kêu chói tai, nhưng người đàn ông đội mũ lụa vẫn tiếp tục không hề nao núng, vẫy tay chào đáp lại tiếng hò reo của khán giả và tiếp tục bài phát biểu của mình.</p>
                    <p>...Ổn quá. Giờ tôi đã tỉnh hẳn rồi.</p>
                    <p>"Hôm nay, chúng ta có sự kiện mà tất cả các bạn đang mong đợi! Đấu giá linh hồn!"</p>
                    <p>...Chỉ với một câu đó, mọi thứ đã trở nên rõ ràng với tôi.</p>
                    <p>Một cuộc đấu giá linh hồn, phải không?</p>
                    <p>Nói cách khác, tôi là hàng hóa. Một linh hồn, để bán cho những cái gọi là "thần linh".</p>
                    <p>Không, tôi phải ăn trưa và ngủ trưa trong lớp học, đúng không?</p>
                    <p>Không hiểu sao, khi tôi tỉnh dậy, tôi thấy mình đang ở một nơi xa hoa lạ thường... hậu trường? Giống như một phiên bản sang trọng của cảnh sân khấu phòng tập thể dục trường học?</p>
                    <p>Và rồi, tôi bị mắc kẹt trong thứ gì đó giống như một chiếc hộp nhựa trong suốt, không thể cử động được?</p>
                    <p>Và, và, giờ tôi không có tay hay chân? Tôi trông giống như một linh hồn hơn con người có quá bóng mềm?</p>
                    <p>...Ừ, điều đó nghe có vẻ vô lý, nhưng với tư cách là một linh hồn, tôi thực sự không thể làm gì được nên tôi chỉ ngồi gật một cách vô tư.</p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                    <button style={{ backgroundColor: '#ff4500', color: '#ffffff', padding: '10px 20px', border: 'none', cursor: 'pointer' }}>Chương trước</button>
                    <button style={{ backgroundColor: '#ff4500', color: '#ffffff', padding: '10px 20px', border: 'none', cursor: 'pointer' }}>Mục lục</button>
                    <button style={{ backgroundColor: '#ff4500', color: '#ffffff', padding: '10px 20px', border: 'none', cursor: 'pointer' }}>Chương sau</button>
                </div>
            </div>

            <div style={{ padding: '20px', backgroundColor: '#1e1e1e', borderRadius: '10px', marginTop: '50px', color: '#ffffff' }}>
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
            </div>
        </div>

    );
}