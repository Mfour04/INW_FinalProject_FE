import React, { useRef, useState } from "react";
import { useAutoGrow } from "./useAutoGrow";
import { InlineEmojiPicker } from "./InlineEmojiPicker";
import SmileIcon from "../../assets/svg/CommentUser/smile-stroke-rounded.svg";
import SentIcon from "../../assets/svg/CommentUser/sent-stroke-rounded.svg";
import defaultAvatar from "../../assets/img/th.png";

type UserLite = { name: string; user: string; avatarUrl?: string | null };

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSubmit: (content: string, files: File[]) => void;
  disabled?: boolean;
  currentUser: UserLite | null;
  loginCta?: () => void;
};

export const Composer: React.FC<Props> = ({
  value,
  onChange,
  onSubmit,
  disabled,
  currentUser,
  loginCta,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useAutoGrow(textareaRef, value);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selected, setSelected] = useState<File[]>([]);
  const [emojiOpen, setEmojiOpen] = useState(false);

  const pickEmoji = (emoji: string) => {
    onChange(value + emoji);
    setEmojiOpen(false);
  };

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length) setSelected((prev) => [...prev, ...files].slice(0, 10));
  };

  const canPost = !!value.trim() && !disabled;

  if (!currentUser) {
    return (
      <div className="text-center py-6">
        <button
          onClick={loginCta}
          className="inline-flex items-center justify-center px-6 py-2.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-[#5b86e5] to-[#36d1dc] hover:brightness-110 shadow-[0_12px_28px_rgba(0,0,0,0.35)]"
        >
          Đăng nhập để bình luận
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3">
      <img
        src={currentUser.avatarUrl || defaultAvatar}
        className="h-10 w-10 rounded-full object-cover ring-1 ring-white/10 shadow-[0_6px_16px_rgba(0,0,0,0.35)]"
      />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[15px]">{currentUser.name}</span>
          <span className="text-xs text-white/45">{currentUser.user}</span>
        </div>

        <textarea
          ref={textareaRef}
          className="mt-2 w-full rounded-2xl bg-[#0c0e13] px-4 py-3 placeholder:text-white/35 focus:outline-none focus:ring-1 focus:ring-[#49b8ff]/60"
          placeholder="Viết bình luận"
          rows={1}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />

        <div className="border-t border-zinc-800 pt-4 flex items-center justify-between relative">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="h-9 w-9 grid place-items-center rounded-full hover:bg-zinc-800/60 transition relative"
              title="Thêm ảnh"
            >
              <span className="text-lg">🖼️</span>
              {selected.length > 0 && (
                <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 rounded-full bg-red-500 text-white text-[10px] leading-4 text-center">
                  {selected.length}
                </span>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleSelect}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => setEmojiOpen((v) => !v)}
              className="h-9 w-9 grid place-items-center rounded-full hover:bg-zinc-800/60 transition"
              title="Chèn emoji"
            >
              <img src={SmileIcon} alt="" className="h-5 w-5 opacity-90" />
            </button>

            <InlineEmojiPicker open={emojiOpen} onPick={pickEmoji} />
          </div>

          <button
            onClick={() => onSubmit(value, selected)}
            disabled={!canPost}
            className={[
              "inline-flex items-center gap-2 rounded-full px-4 py-2 font-medium text-white border-none",
              "bg-[linear-gradient(90deg,#ff512f_0%,#ff6740_40%,#ff9966_100%)]",
              "shadow-[0_10px_30px_rgba(255,103,64,0.35)]",
              !canPost && "opacity-60 cursor-not-allowed",
            ].join(" ")}
          >
            <span className="inline-flex items-center gap-2">
              Đăng
              <img src={SentIcon} alt="" className="h-4 w-4" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
