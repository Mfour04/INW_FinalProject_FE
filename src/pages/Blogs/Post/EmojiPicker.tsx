import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface EmojiPickerProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  content: string;
  setContent: (value: string) => void;
}

const EmojiPicker = ({
  isOpen,
  setIsOpen,
  textareaRef,
  content,
  setContent,
}: EmojiPickerProps) => {
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const emojis = [
    "😊",
    "😂",
    "😢",
    "😍",
    "😎",
    "😜",
    "😡",
    "😇", // Cảm xúc
    "👍",
    "👎",
    "🙌",
    "👏",
    "✋",
    "👊", // Cử chỉ
    "❤️",
    "💔",
    "💕",
    "💖",
    "🔥",
    "🌟", // Biểu tượng
    "🐱",
    "🐶",
    "🐻",
    "🐼",
    "🐰",
    "🦁", // Động vật
    "📱",
    "💻",
    "🎸",
    "⚽",
    "🏀",
    "🎨", // Đồ vật
    "🍎",
    "🍕",
    "🍔",
    "🍦",
    "🍒",
    "🍰", // Thức ăn
    "🌈",
    "☀️",
    "🌙",
    "⭐",
    "☁️",
    "⚡", // Thời tiết
    "🚀",
    "✈️",
    "🚗",
    "⛵",
    "🏍️", // Phương tiện
  ];

  // Đóng picker khi bấm ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  // Xử lý chọn emoji
  const handleEmojiSelect = (emoji: string) => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart || 0;
      const end = textarea.selectionEnd || 0;
      const newContent = content.slice(0, start) + emoji + content.slice(end);
      setContent(newContent);

      // Đặt lại con trỏ sau emoji
      setTimeout(() => {
        textarea.focus();
        textarea.selectionStart = start + emoji.length;
        textarea.selectionEnd = start + emoji.length;
      }, 0);
    }
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={emojiPickerRef}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="absolute left-20 bottom-12 bg-[#2b2b2c] rounded-lg shadow-md p-3 z-10 min-w-[240px] max-h-[200px] overflow-y-auto grid grid-cols-6 gap-2"
        >
          {emojis.map((emoji) => (
            <button
              key={emoji}
              onClick={() => handleEmojiSelect(emoji)}
              className="text-lg hover:bg-[#3a3a3a] rounded p-1"
              type="button"
              aria-label={`Chọn ${emoji}`}
            >
              {emoji}
            </button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EmojiPicker;
