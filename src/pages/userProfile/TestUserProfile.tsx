import { useQuery } from '@tanstack/react-query';
import { GetAuthorNovels } from '../../api/Novels/novel.api';

export const TestUserProfile = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['test-author-novels'],
        queryFn: async () => {
            const res = await GetAuthorNovels();
            console.log('API Response:', res);
            return res.data.data;
        },
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="p-4">
            <h1>Test Author Novels</h1>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
}; 