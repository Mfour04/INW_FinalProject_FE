import React from "react";

type BaseProps = {
  title: string;
  image?: string;
  onClick: () => void;
  primary: React.ReactNode;
  secondary?: React.ReactNode;
};

export type ListRowProps = BaseProps & React.HTMLAttributes<HTMLDivElement>;

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
        "flex items-center gap-4 p-3 rounded-xl cursor-pointer",
        "bg-zinc-900/60 hover:bg-zinc-800/70 transition-colors",
        className ?? "",
      ].join(" ")}
      {...rest}
    >
      {image ? (
        <img
          src={image}
          alt="cover"
          className="h-16 w-12 object-cover rounded-md"
        />
      ) : (
        <div className="h-16 w-12 rounded-md bg-white/10" />
      )}

      <div className="flex-1 min-w-0">
        <h4 className="font-semibold truncate">{title}</h4>

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
