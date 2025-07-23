import { cva, type VariantProps } from "class-variance-authority";
import cn from "../../utils/cn";
import type { HTMLAttributes } from "react";

const switchVariants = cva(
  "relative inline-flex items-center transition-colors rounded-full cursor-pointer",
  {
    variants: {
      variant: {
        primary: "bg-gray-300 data-[checked=true]:bg-[#ff6740]",
        success: "bg-gray-300 data-[checked=true]:bg-green-500",
      },
      size: {
        sm: "w-8 h-4",
        md: "w-10 h-5",
        lg: "w-12 h-6",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

const thumbVariants = cva(
  "inline-block transform rounded-full bg-white shadow transition-transform",
  {
    variants: {
      size: {
        sm: "w-3 h-3 translate-x-1 data-[checked=true]:translate-x-4",
        md: "w-4 h-4 translate-x-0.5 data-[checked=true]:translate-x-5",
        lg: "w-5 h-5 translate-x-1 data-[checked=true]:translate-x-6",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

interface SwitchProps
  extends Omit<HTMLAttributes<HTMLButtonElement>, "onChange">,
    VariantProps<typeof switchVariants> {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const Switch = ({
  checked,
  onChange,
  variant,
  size,
  className,
  ...props
}: SwitchProps) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      data-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(switchVariants({ variant, size }), className)}
      {...props}
    >
      <span data-checked={checked} className={thumbVariants({ size })} />
    </button>
  );
};

export default Switch;
