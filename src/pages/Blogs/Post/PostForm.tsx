import { useState, useRef } from "react";
import abc from "../../../assets/img/th.png";
import SentHugeIcon from "../../../assets/img/Blogs/sent-stroke-rounded.svg";
import AddImageHugeIcon from "../../../assets/img/Blogs/image-add-01-stroke-rounded.svg";
import SmileHugeIcon from "../../../assets/img/Blogs/smile-stroke-rounded.svg";
import Button from "../../../components/ButtonComponent";
import EmojiPicker from "./EmojiPicker";

interface PostFormProps {
  content: string;
  setContent: (value: string) => void;
  images: File[];
  setImages: (value: File[]) => void;
  isPosting: boolean;
  handlePost: () => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  inputFileRef: React.RefObject<HTMLInputElement | null>;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: (index: number) => void;
}

const PostForm = ({
  content,
  setContent,
  images,
  setImages,
  isPosting,
  handlePost,
  handleKeyPress,
  inputFileRef,
  handleImageChange,
  handleRemoveImage,
}: PostFormProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

  return (
    <div className="bg-[#1e1e21] rounded-[10px] p-5 mb-5">
      <div className="flex items-center gap-5 mb-4">
        <img
          src={abc}
          alt="avatar"
          className="w-[50px] h-[50px] rounded-full object-cover"
        />
        <div className="flex flex-col">
          <h3 className="text-lg font-bold text-white">Nguyen Dinh</h3>
          <span className="text-base text-[#cecece]">@dinhvanbaonguyen</span>
        </div>
      </div>
      <div className="mb-6">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Chia sẻ điều gì đó..."
          className="w-full bg-transparent text-base sm:text-lg text-white placeholder-[#656565] resize-none border-none outline-none min-h-[80px] sm:min-h-[100px] md:min-h-[120px] font-ibm-plex"
        />
        {images.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-3">
            {images.map((img, idx) => {
              const url = URL.createObjectURL(img);
              return (
                <div
                  key={idx}
                  className="relative w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] rounded overflow-hidden border border-[#ff6740]"
                >
                  <img
                    src={url}
                    alt={`preview-${idx}`}
                    className="object-cover w-full h-full"
                    onLoad={() => URL.revokeObjectURL(url)}
                  />
                  <button
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 bg-black bg-opacity-50 hover:bg-opacity-80 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    type="button"
                    aria-label="Xóa ảnh"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="border-t border-[#656565] pt-4 flex items-center justify-between">
        <div className="flex items-center gap-4 relative">
          <button
            type="button"
            onClick={() => inputFileRef.current?.click()}
            className="p-2 hover:bg-gray-700 rounded-full transition-colors"
          >
            <img src={AddImageHugeIcon} alt="Add icon" />
          </button>
          <input
            ref={inputFileRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
          <button
            type="button"
            onClick={() => setIsEmojiPickerOpen((prev) => !prev)}
            className="p-2 hover:bg-gray-700 rounded-full transition-colors"
          >
            <img src={SmileHugeIcon} alt="Smile icon" />
          </button>
          <EmojiPicker
            isOpen={isEmojiPickerOpen}
            setIsOpen={setIsEmojiPickerOpen}
            textareaRef={textareaRef}
            content={content}
            setContent={setContent}
          />
        </div>
        <Button
          isLoading={isPosting}
          onClick={handlePost}
          disabled={(!content.trim() && images.length === 0) || isPosting}
          className="flex items-center gap-4 bg-[#ff6740] hover:bg-[#e55a36] disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-[16px] font-medium transition-colors"
        >
          <span className="inline-flex items-center">Đăng</span>
          <img
            src={SentHugeIcon}
            alt="Sent icon"
            className="inline-flex ml-1"
          />
        </Button>
      </div>
    </div>
  );
};

export default PostForm;
