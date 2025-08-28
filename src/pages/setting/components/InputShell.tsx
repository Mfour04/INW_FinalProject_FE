// InputShell.tsx
import React from "react";

type InputShellProps = {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
  /** id của input để liên kết label; nếu không truyền, bạn có thể tự gán id trên child */
  htmlFor?: string;
  /** suffix giúp tạo id mô tả duy nhất cho hint */
  idSuffix?: string;
  className?: string;
};

export const InputShell: React.FC<InputShellProps> = ({
  label,
  required,
  hint,
  children,
  htmlFor,
  idSuffix,
  className,
}) => {
  const hintId = hint ? `hint-${idSuffix ?? htmlFor ?? label.replace(/\s+/g, "-")}` : undefined;

  return (
    <div className={className}>
      <label
        className="block text-[13px] font-medium text-zinc-800 dark:text-zinc-200 mb-1.5"
        htmlFor={htmlFor}
      >
        {label}{" "}
        {required && (
          <span className="text-red-500" aria-hidden="true">
            *
          </span>
        )}
      </label>

      {/* Nếu bạn muốn aria-describedby, hãy gán nó vào input trong children.
          Ví dụ: <input aria-describedby={hintId} ... /> */}
      {children}

      {hint && (
        <p id={hintId} className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          {hint}
        </p>
      )}
    </div>
  );
};
