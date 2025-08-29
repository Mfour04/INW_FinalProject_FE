import React from "react";

type BaseProps = {
  title: string;
  image?: string;
  onClick: () => void;
  primary: React.ReactNode;
  secondary?: React.ReactNode;
};

export type ListRowProps = BaseProps & React.HTMLAttributes<HTMLDivElement>;

const thumbBase =
  "rounded-md object-cover bg-white/10 border border-white/10";

export const ListRow = ({
  title,
  image,
  onClick,
  primary,
  secondary,
  className,
  ...rest
}: ListRowProps) => {
  return (
    <div
      onClick={onClick}
      className={[
        "flex items-center gap-3 sm:gap-4 rounded-xl p-2.5 sm:p-3 cursor-pointer min-w-0",
        "bg-zinc-900/60 hover:bg-zinc-800/70 transition-colors",
        className ?? "",
      ].join(" ")}
      {...rest}
    >
      {image ? (
        <img
          src={image}
          alt="cover"
          className={`h-14 w-11 sm:h-16 sm:w-12 ${thumbBase}`}
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div className={`h-14 w-11 sm:h-16 sm:w-12 ${thumbBase}`} />
      )}

      <div className="min-w-0 flex-1">
        <h4 className="truncate text-[13.5px] sm:text-[14.5px] font-semibold">
          {title}
        </h4>

        <div className="mt-1 flex items-center gap-2">
          {primary}
          {secondary ? <span className="text-white/20">•</span> : null}
          {secondary}
        </div>
      </div>
    </div>
  );
};

export default ListRow;
