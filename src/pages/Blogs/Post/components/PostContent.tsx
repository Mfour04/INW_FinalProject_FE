import React from 'react';

interface PostContentProps {
    content: string;
    className?: string;
}

export const PostContent: React.FC<PostContentProps> = ({ content, className = "" }) => {
    return (
        <div className={`text-base sm:text-lg text-white leading-relaxed ${className}`}>
            {content}
        </div>
    );
};
