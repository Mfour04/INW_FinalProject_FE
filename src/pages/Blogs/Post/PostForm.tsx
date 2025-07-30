import React from "react";
import { AuthContext } from "../../../context/AuthContext/AuthProvider";
import abc from "../../../assets/img/th.png";
import SmileIcon from "../../../assets/svg/CommentUser/smile-stroke-rounded.svg";
import SentHugeIcon from "../../../assets/img/Blogs/sent-stroke-rounded.svg";
import ImageAdd02Icon from "../../../assets/svg/CommentUser/image-add-02-stroke-rounded.svg";
import Button from "../../../components/ButtonComponent";
import EmojiPicker from "./EmojiPicker";

interface PostFormProps {
  content: string;
  setContent: (value: string) => void;
  isPosting: boolean;
  handlePost: () => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
}

const PostForm = ({
  content,
  setContent,
  isPosting,
  handlePost,
  handleKeyPress,
}: PostFormProps) => {
  const { auth } = React.useContext(AuthContext);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = React.useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  return (
    <div className="bg-[#1e1e21] rounded-[10px] p-5 mb-5">
      <div className="flex items-center gap-5 mb-4">
        <img
          src={auth?.user?.avatarUrl || abc}
          alt="avatar"
          className="w-[50px] h-[50px] rounded-full object-cover"
        />
        <div className="flex flex-col">
          <h3 className="text-lg font-bold text-white">
            {auth?.user?.displayName || auth?.user?.userName || "User"}
          </h3>
          <span className="text-base text-[#cecece]">
            @{auth?.user?.userName || "user"}
          </span>
        </div>
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

      <div className="border-t border-[#656565] pt-4 flex items-center justify-between">
        <div className="flex items-center gap-4 relative">
          <button type="button" className="p-2 hover:bg-gray-700 rounded-full transition-colors">
            <img src={ImageAdd02Icon} alt="Add image icon" className="w-6 h-6" />
          </button>
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
          disabled={!content.trim() || isPosting}
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
