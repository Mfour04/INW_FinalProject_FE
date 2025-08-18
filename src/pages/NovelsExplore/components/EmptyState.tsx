import React from "react";

type Props = {
  title: string;
  subtitle?: string;
  actionText?: string;
  onAction?: () => void;
};

export const EmptyState: React.FC<Props> = ({ title, subtitle, actionText, onAction }) => {
  return (
    <div className="mx-auto max-w-xl text-center py-16">
      <div className="mx-auto h-16 w-16 rounded-2xl bg-white/[0.04] ring-1 ring-white/10 grid place-items-center mb-4">
        <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-[#ff512f] via-[#ff6740] to-[#ff9966]" />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      {subtitle && <p className="mt-1 text-white/70 text-sm">{subtitle}</p>}
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-4 px-4 py-2 rounded-lg font-medium text-black bg-[linear-gradient(90deg,#ff512f,0%,#ff6740,55%,#ff9966)] shadow-[0_12px_30px_-20px_rgba(255,102,64,0.8)]"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
