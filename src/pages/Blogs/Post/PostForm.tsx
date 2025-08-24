import React from "react";
import { AuthContext } from "../../../context/AuthContext/AuthProvider";
import abc from "../../../assets/img/th.png";
import SmileIcon from "../../../assets/svg/CommentUser/smile-stroke-rounded.svg";
import SentHugeIcon from "../../../assets/img/Blogs/sent-stroke-rounded.svg";
import ImageAdd02Icon from "../../../assets/svg/CommentUser/image-add-02-stroke-rounded.svg";
import Button from "../../../components/ButtonComponent";
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
    <div className="bg-[#1e1e21] rounded-[10px] p-5 mb-5">
      <div className="flex items-center gap-5 mb-4">
        <ClickableUserInfo
          username={auth?.user?.userName}
          displayName={auth?.user?.displayName || auth?.user?.userName || "User"}
          avatarUrl={auth?.user?.avatarUrl || abc}
          size="large"
          showUsername={true}
          className="flex-shrink-0"
        />
      </div>

      <div className="mb-6">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Chia sẻ điều gì đó..."
          className="w-full resize-none border-none border-b border-[#656565] outline-none text-white placeholder-gray-400 bg-transparent pb-2 focus:border-[#ff6740] transition-colors"
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
                  className="w-full h-full object-cover rounded-lg border border-gray-600"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-sm font-bold"
                  title="Xóa ảnh"
                >
                  ×
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
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

      <div className="border-t border-[#656565] pt-4 flex items-center justify-between">
        <div className="flex items-center gap-4 relative">
          <button
            type="button"
            onClick={openFileDialog}
            className="p-2 hover:bg-gray-700 rounded-full transition-colors relative"
            title="Thêm ảnh"
          >
            <img src={ImageAdd02Icon} alt="Add image icon" className="w-6 h-6" />
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
            className="p-2 hover:bg-gray-700 rounded-full transition-colors"
          >
            <img src={SmileIcon} alt="Smile icon" className="w-6 h-6" />
          </button>
        </div>

        <Button
          isLoading={isPosting}
          onClick={handlePost}
          disabled={(!content.trim() && selectedImages.length === 0) || isPosting}
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
