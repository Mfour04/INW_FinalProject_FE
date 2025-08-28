type InputShellProps = {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
  htmlFor?: string;
  idSuffix?: string;
  className?: string;
};

export const InputShell = ({
  label,
  required,
  hint,
  children,
  htmlFor,
  idSuffix,
  className,
}: InputShellProps) => {
  const hintId = hint
    ? `hint-${idSuffix ?? htmlFor ?? label.replace(/\s+/g, "-")}`
    : undefined;

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

      {children}

      {hint && (
        <p
          id={hintId}
          className="text-xs text-zinc-500 dark:text-zinc-400 mt-1"
        >
          {hint}
        </p>
      )}
    </div>
  );
};
