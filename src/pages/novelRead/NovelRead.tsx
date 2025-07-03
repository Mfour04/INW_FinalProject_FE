import '../../pages/novelRead/NovelRead.css';
import { novelData } from "../../pages/novelRead/Content";
import { useQuery } from '@tanstack/react-query';
import { GetChapters } from '../../api/Chapters/chapter.api';
import type { Chapter, Chapters } from '../../api/Chapters/chapter.type';
import { CommentUser } from "../../pages/commentUser/CommentUser";

export const NovelRead = () => {

    const novelId = "2571CB441A87286E3BEBE8FA";

    const { isLoading, data } = useQuery({
        queryKey: ['chapters', novelId],
        queryFn: async () => {
            const res = await GetChapters(novelId);
            return res.data.data;
        },
    });

    console.log(data);

    return (
        <div style={{ border: '1px', padding: '20px', borderRadius: '8px', marginTop: '-10px' }}>
            <div style={{ backgroundColor: '#1e1e1e', color: '#ffffff', padding: '50px', fontFamily: 'Arial, sans-serif', borderRadius: '10px' }}>
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

                <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginTop: '30px', marginBottom: '-20px' }}>
                    <button className='buttonStyle'>&lt; Chương trước</button>
                    <button className='buttonStyle'>Mục lục</button>
                    <button className='buttonStyle'>Chương sau &gt;</button>
                </div>
            </div>

            <CommentUser />
        </div>
    );
}