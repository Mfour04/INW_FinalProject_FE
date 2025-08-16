type Props = {
  open: boolean;
  onPick: (emoji: string) => void;
  className?: string;
};

export const InlineEmojiPicker = ({ open, onPick, className }: Props) => {
  if (!open) return null;
  const emojis = ["😀", "😂", "😍", "👍", "🔥", "🙏", "🥺", "🎉", "😎", "😢"];
  return (
    <div
      className={`absolute bottom-12 left-0 z-20 rounded-xl border border-white/10 bg-[#111217] p-2 shadow-xl ${
        className || ""
      }`}
    >
      <div className="grid grid-cols-5 gap-1">
        {emojis.map((e) => (
          <button
            key={e}
            onClick={() => onPick(e)}
            className="h-8 w-8 grid place-items-center rounded hover:bg-white/10"
          >
            {e}
          </button>
        ))}
      </div>
    </div>
  );
};
