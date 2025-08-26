import React from 'react';
import { motion } from 'framer-motion';
import { X, Save } from 'lucide-react';

interface PostInlineEditorProps {
    content: string;
    onContentChange: (content: string) => void;
    onSave: () => void;
    onCancel: () => void;
    isSaving?: boolean;
}

export const PostInlineEditor: React.FC<PostInlineEditorProps> = ({
    content,
    onContentChange,
    onSave,
    onCancel,
    isSaving = false,
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="mb-4 overflow-hidden"
        >
            <motion.textarea
                value={content}
                onChange={(e) => onContentChange(e.target.value)}
                className="w-full bg-transparent text-base sm:text-lg text-white placeholder-gray-400 resize-none border border-white/20 focus:border-[#ff6740] outline-none min-h-[80px] sm:min-h-[100px] md:min-h-[120px] font-ibm-plex mb-2 p-2 rounded transition-colors duration-200"
                initial={{ scale: 0.98 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.15 }}
                autoFocus
                placeholder="Chỉnh sửa nội dung bài viết..."
            />
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.15 }}
                className="flex gap-2"
            >
                <motion.button
                    onClick={onCancel}
                    className="flex items-center gap-2 bg-gray-600 text-white px-3 py-1 rounded-lg transition-colors duration-200 hover:bg-gray-500"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <X className="w-4 h-4" />
                    Hủy
                </motion.button>
                <motion.button
                    onClick={onSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-[#ff6740] text-white px-3 py-1 rounded-lg transition-colors duration-200 hover:bg-[#ff5722] disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Save className="w-4 h-4" />
                    {isSaving ? 'Đang lưu...' : 'Lưu'}
                </motion.button>
            </motion.div>
        </motion.div>
    );
};
