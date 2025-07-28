import { useQuery } from '@tanstack/react-query';
import { GetAuthorNovels } from '../../api/Novels/novel.api';
import type { NovelByAuthorResponse } from '../../api/Novels/novel.type';

export const UseAuthorNovels = () => {
    return useQuery<NovelByAuthorResponse[]>({
        queryKey: ['author-novels'],
        queryFn: async () => {
            const res = await GetAuthorNovels();
            return res.data.data;
        },
        staleTime: 1000 * 60 * 5, // 5 phút
    });
}; 