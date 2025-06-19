import { cva, type VariantProps } from "class-variance-authority";
import cn from "../../utils/cn";
import type { TSize, TVariant } from "./type";
import type { ReactNode } from "react";

const typographyVariants = cva("", {
    variants: {
        variant: {
            h1: "text-4xl font-bold",
            h2: "text-3xl font-semibold",
            h3: "text-2xl font-medium",
            h4: "text-xl font-normal",
            h5: "text-lg font-normal",
            h6: "text-base font-normal",
            span: "text-sm",
            p: "text-base"
        },
        size: {
            large: "text-[26px]",
            medium: "text-[1.5em]",
            small: "text-[15px]"
        }
    },
    defaultVariants: {
        variant: "p",
        size: "medium"
    }
});

interface TypographyProps extends VariantProps<typeof typographyVariants> {
    variant?: TVariant;
    className?: string;
    children: ReactNode;
    size?: TSize;
}

const Typography = ({ children, className, variant = "p", size }: TypographyProps) => {
    const Element = variant;
    return <Element className={cn(typographyVariants({ variant, size, className }))}>{children}</Element>;
};

export default Typography;
