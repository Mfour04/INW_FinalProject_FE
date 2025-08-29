type TextFieldProps = {
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  autoComplete?: string;
  rightIcon?: React.ReactNode;
};

export const TextField = ({
  icon,
  placeholder,
  value,
  onChange,
  type = "text",
  autoComplete,
  rightIcon,
}: TextFieldProps) => {
  const hasValue = value && value.length > 0;

  return (
    <div className="flex items-center gap-2 px-3 sm:px-3.5">
      <div className="text-zinc-500 dark:text-zinc-300">{icon}</div>
      <div className="relative flex-1">
        <input
          className={[
            "peer w-full bg-transparent outline-none text-[14px] sm:text-[15px] py-2.5 sm:py-3",
            rightIcon ? "pr-8 sm:pr-9" : "pr-2",
            "text-zinc-900 placeholder:text-transparent dark:text-white",
          ].join(" ")}
          placeholder=" "
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
        />
        <label
          className={[
            "pointer-events-none absolute left-0 transition-all duration-200",
            hasValue
              ? "top-0 -translate-y-1/2 text-[11px] sm:text-[12px]"
              : "top-1/2 -translate-y-1/2 text-[13px] sm:text-[14px]",
            "text-zinc-500 peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-[11px] sm:peer-focus:text-[12px]",
            "peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:-translate-y-1/2 peer-[:not(:placeholder-shown)]:text-[11px] sm:peer-[:not(:placeholder-shown)]:text-[12px]",
            "dark:text-zinc-400 dark:peer-focus:text-white",
          ].join(" ")}
        >
          {placeholder}
        </label>
        {rightIcon && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            {rightIcon}
          </div>
        )}
      </div>
    </div>
  );
};
