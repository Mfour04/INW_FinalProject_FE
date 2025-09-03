import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { EmojiPickerBox } from "../../../../components/ui/EmojiPickerBox";
import { Smile, Pencil, Loader2, ImagePlus, X } from "lucide-react";
import Button from "../../../../components/ButtonComponent";

type Props = {
    value: string;
    onChange: (v: string) => void;
    onCancel: () => void;
    onSave: (content: string, newImages: File[], removedImageUrls: string[]) => void;
    saving?: boolean;
    existingImages?: string[];
    onRemoveExistingImage?: (imageUrl: string) => void;
    removedImages?: string[];
};

const MAX_FILES = 10;
const MAX_SIZE_MB = 5;

const PostEditForm: React.FC<Props> = ({
    value,
    onChange,
    onCancel,
    onSave,
    saving = false,
    existingImages = [],
    removedImages = [],
    onRemoveExistingImage,
}) => {
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [emojiOpen, setEmojiOpen] = useState(false);
    const [fileError, setFileError] = useState<string | null>(null);

    const taRef = useRef<HTMLTextAreaElement>(null);
    const emojiBtnRef = useRef<HTMLButtonElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const disabled = saving || value.trim().length === 0;
    const remainingSlots = Math.max(0, MAX_FILES - selectedImages.length - (existingImages.length - removedImages.length));

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Escape") {
            onCancel();
        } else if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
            if (!disabled) handleSave();
        }
    };

    const pickEmoji = (emoji: string) => {
        const ta = taRef.current;
        if (!ta) return;

        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const newValue = value.substring(0, start) + emoji + value.substring(end);
        onChange(newValue);

        // Set cursor position after emoji
        setTimeout(() => {
            ta.focus();
            ta.setSelectionRange(start + emoji.length, start + emoji.length);
        }, 0);
    };

    const acceptFiles = (files: FileList | null): File[] => {
        if (!files) return [];

        const validFiles: File[] = [];
        const errors: string[] = [];

        Array.from(files).forEach(file => {
            if (!file.type.startsWith('image/')) {
                errors.push(`${file.name} không phải là file ảnh`);
                return;
            }

            if (file.size > MAX_SIZE_MB * 1024 * 1024) {
                errors.push(`${file.name} vượt quá ${MAX_SIZE_MB}MB`);
                return;
            }

            validFiles.push(file);
        });

        if (errors.length > 0) {
            setFileError(errors.join(', '));
            setTimeout(() => setFileError(null), 5000);
        }

        return validFiles;
    };

    const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const validFiles = acceptFiles(files);
        if (validFiles.length > 0) {
            setSelectedImages(prev => [...prev, ...validFiles]);
        }

        // Reset input
        e.target.value = '';
    };

    const removeImage = (index: number) => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
    };

    const removeExistingImage = (imageUrl: string) => {
        if (onRemoveExistingImage) {
            onRemoveExistingImage(imageUrl);
        } else {
        }
    };

    const openFileDialog = () => {
        fileInputRef.current?.click();
    };

    const handleSave = () => {
        if (disabled) return;
        onSave(value, selectedImages, removedImages);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white dark:bg-zinc-900 rounded-2xl ring-1 ring-zinc-200 dark:ring-white/10 overflow-hidden"
        >
            {/* Text Input */}
            <div className="px-3.5 pt-3 pb-2">
                <textarea
                    ref={taRef}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={onKeyDown}
                    placeholder="Chia sẻ điều gì đó..."
                    className="w-full min-h-[120px] resize-none border-0 bg-transparent text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-white/50 text-sm leading-relaxed focus:outline-none focus:ring-0"
                />
            </div>

            {/* File Error */}
            {fileError && (
                <div className="px-3.5 -mt-1 pb-1">
                    <p className="text-[12px] text-red-600 dark:text-red-300">{fileError}</p>
                </div>
            )}

            {/* Existing Images */}
            {existingImages.length > 0 && (
                <div className="px-3 pb-3">
                    <div className="text-xs text-zinc-500 dark:text-white/50 mb-2">Ảnh hiện có:</div>
                    <div className="grid [grid-template-columns:repeat(auto-fill,minmax(110px,1fr))] gap-2">
                        {existingImages.map((imageUrl, index) => {
                            const isRemoved = removedImages.includes(imageUrl);
                            if (isRemoved) return null;

                            return (
                                <div key={`existing-${index}`} className="relative group rounded-xl overflow-hidden ring-1 ring-zinc-200 dark:ring-white/10">
                                    <div className="w-full aspect-[4/3]">
                                        <img src={imageUrl} alt={`Existing image ${index + 1}`} className="h-full w-full object-cover" />
                                    </div>
                                    <button
                                        onClick={() => removeExistingImage(imageUrl)}
                                        className="absolute top-1 right-1 inline-flex items-center justify-center h-6 w-6 rounded-full bg-black/60 ring-1 ring-white/20 opacity-90 hover:opacity-100 transition"
                                        title="Xoá ảnh"
                                        type="button"
                                    >
                                        <X className="h-3.5 w-3.5 text-white" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* New Selected Images */}
            {selectedImages.length > 0 && (
                <div className="px-3 pb-3">
                    <div className="text-xs text-zinc-500 dark:text-white/50 mb-2">Ảnh mới:</div>
                    <div className="grid [grid-template-columns:repeat(auto-fill,minmax(110px,1fr))] gap-2">
                        {selectedImages.map((image, index) => {
                            const url = URL.createObjectURL(image);
                            return (
                                <div key={`new-${index}`} className="relative group rounded-xl overflow-hidden ring-1 ring-zinc-200 dark:ring-white/10">
                                    <div className="w-full aspect-[4/3]">
                                        <img src={url} alt={image.name} className="h-full w-full object-cover" onLoad={() => URL.revokeObjectURL(url)} />
                                    </div>
                                    <button
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 inline-flex items-center justify-center h-6 w-6 rounded-full bg-black/60 ring-1 ring-white/20 opacity-90 hover:opacity-100 transition"
                                        title="Xoá ảnh"
                                        type="button"
                                    >
                                        <X className="h-3.5 w-3.5 text-white" />
                                    </button>
                                    <div className="absolute bottom-0 left-0 right-0 bg-black/45 backdrop-blur-[1px] text-white text-[11px] px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity truncate">
                                        {image.name}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Divider */}
            <div className="px-3.5">
                <div className="h-px w-full bg-zinc-200 dark:bg-white/[0.08]" />
            </div>

            {/* Actions */}
            <div className="px-3.5 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {/* Image Button */}
                    <button
                        type="button"
                        onClick={openFileDialog}
                        title={remainingSlots ? `Thêm ảnh (${remainingSlots} còn lại)` : "Đã đạt giới hạn ảnh"}
                        className={[
                            "h-9 px-3 inline-flex items-center gap-2 rounded-xl ring-1",
                            "bg-zinc-50 hover:bg-zinc-100 ring-zinc-200 text-zinc-900",
                            "dark:bg-white/[0.03] dark:hover:bg-white/[0.06] dark:ring-white/10 dark:text-white",
                            remainingSlots ? "" : "opacity-50 cursor-not-allowed",
                        ].join(" ")}
                        disabled={!remainingSlots}
                    >
                        <ImagePlus className="h-4 w-4" />
                        <span className="text-xs">Ảnh</span>
                        {(selectedImages.length + (existingImages.length - removedImages.length)) > 0 && (
                            <span className="ml-1 inline-flex items-center justify-center h-4 min-w-4 px-1 rounded-full bg-[#ff6740] text-[10px] text-white">
                                {selectedImages.length + (existingImages.length - removedImages.length)}
                            </span>
                        )}
                    </button>

                    {/* File Input */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleSelect}
                        className="hidden"
                    />

                    {/* Emoji Button */}
                    <div className="relative">
                        <button
                            ref={emojiBtnRef}
                            type="button"
                            onClick={() => setEmojiOpen((v) => !v)}
                            className="h-9 w-9 inline-grid place-items-center rounded-xl ring-1 ring-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-900 transition
                         dark:ring-white/10 dark:bg-white/[0.03] dark:hover:bg-white/[0.06] dark:text-white"
                            title="Chèn emoji"
                        >
                            <Smile className="h-4 w-4" />
                        </button>

                        <EmojiPickerBox
                            open={emojiOpen}
                            onPick={pickEmoji}
                            anchorRef={emojiBtnRef}
                            align="left"
                            placement="top"
                            onRequestClose={() => setEmojiOpen(false)}
                            width={320}
                            height={260}
                        />
                    </div>
                </div>

                {/* Hủy / Lưu */}
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        className={[
                            "rounded-full px-3.5 py-1.5 text-[12px] font-semibold whitespace-nowrap transition",
                            "ring-1 ring-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-900",
                            "dark:ring-white/10 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] dark:text-white",
                        ].join(" ")}
                        title="Hủy (Esc)"
                    >
                        Hủy
                    </button>

                    <Button
                        isLoading={saving}
                        onClick={handleSave}
                        disabled={disabled}
                        className={[
                            "rounded-full px-3.5 py-1.5 text-[12px] font-semibold text-white whitespace-nowrap flex items-center gap-2 transition",
                            "bg-[linear-gradient(90deg,#ff512f_0%,#ff6740_40%,#ff9966_100%)]",
                            disabled ? "opacity-60 cursor-not-allowed" : "hover:brightness-110 active:brightness-95",
                        ].join(" ")}
                        title="Lưu (Ctrl/Cmd + Enter)"
                    >
                        <div className="flex items-center gap-1">
                            <Pencil className="h-4 w-4" />
                            <span>Lưu</span>
                        </div>
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};

export default PostEditForm;
