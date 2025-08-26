import React from "react";
import { AuthContext } from "../../../context/AuthContext/AuthProvider";
import { getAvatarUrl } from "../../../utils/avatar";
import { ImagePlus, Smile, SendHorizontal, X, Loader2 } from "lucide-react";
import EmojiPicker from "./EmojiPicker";
import { ClickableUserInfo } from "../../../components/common/ClickableUserInfo";

interface PostFormProps {
  content: string;
  setContent: (value: string) => void;
  isPosting: boolean;
  handlePost: () => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  selectedImages?: File[];
  setSelectedImages?: (images: File[]) => void;
  resetFileInput?: React.MutableRefObject<(() => void) | null>;
}

const PostForm = ({
  content,
  setContent,
  isPosting,
  handlePost,
  handleKeyPress,
  selectedImages = [],
  setSelectedImages,
  resetFileInput,
}: PostFormProps) => {
  const { auth } = React.useContext(AuthContext);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = React.useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    const maxSize = 5 * 1024 * 1024;

    const validSizeFiles = imageFiles.filter(file => {
      if (file.size > maxSize) {
        alert(`File ${file.name} quá lớn. Kích thước tối đa là 5MB.`);
        return false;
      }
      return true;
    });

    const maxImages = 10;
    if (selectedImages.length + validSizeFiles.length > maxImages) {
      alert(`Bạn chỉ có thể chọn tối đa ${maxImages} ảnh.`);

      return;
    }

    if (setSelectedImages) {
      setSelectedImages([...selectedImages, ...validSizeFiles]);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

  };

  const removeImage = (index: number) => {
    if (setSelectedImages) {
      setSelectedImages(selectedImages.filter((_, i) => i !== index));
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  React.useEffect(() => {
    if (resetFileInput) {
      resetFileInput.current = () => {
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      };
    }
  }, [resetFileInput]);

  return (
    <div className="bg-white/[0.02] rounded-lg border border-white/10 p-4">
      <div className="flex items-center gap-3 mb-4">
        <ClickableUserInfo
          username={auth?.user?.userName}
          displayName={auth?.user?.displayName || auth?.user?.userName || "User"}
          avatarUrl={getAvatarUrl(auth?.user?.avatarUrl)}
          size="large"
          showUsername={true}
          className="flex-shrink-0"
        />
      </div>

      <div className="mb-4">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Chia sẻ điều gì đó..."
          className="w-full resize-none border-none outline-none text-white placeholder-gray-400 bg-transparent text-sm leading-relaxed"
          rows={3}
        />
      </div>

      {/* Image Preview */}
      {selectedImages.length > 0 && (
        <div className="mb-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {selectedImages.map((image, index) => (
              <div key={index} className="relative group aspect-square">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg border border-white/10"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Xóa ảnh"
                >
                  <X className="w-3 h-3" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  {image.name.length > 15 ? image.name.substring(0, 15) + '...' : image.name}
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Đã chọn {selectedImages.length} ảnh
          </p>
        </div>
      )}

      <div className="border-t border-white/10 pt-4 flex items-center justify-between">
        <div className="flex items-center gap-3 relative">
          <button
            type="button"
            onClick={openFileDialog}
            className="p-2 hover:bg-white/10 rounded-full transition-colors relative"
            title="Thêm ảnh"
          >
            <ImagePlus className="w-5 h-5 text-white" />
            {selectedImages.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {selectedImages.length}
              </span>
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => setIsEmojiPickerOpen((prev) => !prev)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <Smile className="w-5 h-5 text-white" />
          </button>
        </div>

        <button
          onClick={handlePost}
          disabled={(!content.trim() && selectedImages.length === 0) || isPosting}
          className="flex items-center gap-2 bg-gradient-to-r from-[#ff6740] to-[#ff9966] hover:from-[#e55a36] hover:to-[#e57a4d] disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-all duration-200"
        >
          {isPosting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <SendHorizontal className="w-4 h-4" />
          )}
          <span>Đăng</span>
        </button>
      </div>

      <EmojiPicker
        isOpen={isEmojiPickerOpen}
        setIsOpen={setIsEmojiPickerOpen}
        textareaRef={textareaRef}
        content={content}
        setContent={setContent}
      />
    </div>
  );
};

export default PostForm;
