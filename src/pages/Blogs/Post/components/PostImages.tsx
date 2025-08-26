import React from 'react';

interface PostImagesProps {
    imgUrls: string[];
    className?: string;
}

export const PostImages: React.FC<PostImagesProps> = ({ imgUrls, className = "" }) => {
    if (!imgUrls || imgUrls.length === 0) return null;

    return (
        <div className={`mt-4 ${className}`}>
            {imgUrls.length === 1 ? (
                <div className="w-full max-w-md">
                    <img
                        src={imgUrls[0]}
                        alt="post-image"
                        className="w-full aspect-square object-cover rounded-lg"
                    />
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-2 max-w-md">
                    {imgUrls.slice(0, 4).map((imgUrl, index) => (
                        <div key={index} className="relative aspect-square">
                            <img
                                src={imgUrl}
                                alt={`post-image-${index}`}
                                className="w-full h-full object-cover rounded-lg"
                            />
                            {index === 3 && imgUrls.length > 4 && (
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                                    <span className="text-white font-semibold">+{imgUrls.length - 4}</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
