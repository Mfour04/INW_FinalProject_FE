import { cva, type VariantProps } from "class-variance-authority";
import cn from "../../utils/cn";
import type { ButtonHTMLAttributes, ReactNode } from "react";

const buttonVariants = cva("rounded-md", {
  variants: {
    variant: {
      primary: "border-2 border-black text-black bg-white hover:bg-neutral-200",
      secondary:
        "border-2 border-white text-white bg-black hover:bg-neutral-800",
      danger: "border-none text-white bg-red-500 hover:bg-red-800",
    },
    size: {
      sm: "text-sm px-1 py-0.5",
      md: "text-base px-2 py-1",
      lg: "text-xl px-4 py-2",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: ReactNode;
  isLoading?: boolean;
}

const Button = ({
  children,
  className,
  variant,
  size,
  isLoading = false,
  ...props
}: ButtonProps) => {
  return (
    <button
      {...props}
      disabled={isLoading || props.disabled}
      className={cn(
        "relative flex justify-center items-center",
        buttonVariants({ variant, size }),
        className
      )}
    >
      {isLoading && (
        <div className="absolute inset-0 flex justify-center items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white" />
        </div>
      )}
      <span className={cn({ "opacity-0": isLoading })}>{children}</span>
    </button>
  );
};

export default Button;
