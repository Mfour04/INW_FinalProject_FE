import { cva, type VariantProps } from "class-variance-authority";
import cn from "../../utils/cn";
import type { InputHTMLAttributes } from "react";

const textFieldVariants = cva("rounded p-2 m-1 w-200 h-12 outline-none border shadow", {
    variants: {
        error: {
            true: "border-red-500 focus:ring-red-500 focus:border-red-500",
            false: "border-black focus:ring-gray-300 focus:border-gray-300"
        }
    },
    defaultVariants: {
        error: false
    }
});

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof textFieldVariants> {
    label?: string;
    required?: boolean;
    helperText?: string;
    error?: boolean;
}

const TextField = ({ label, required, helperText, error, className, ...props }: TextFieldProps) => {
    return (
        <div>
            {label && (
                <label className={cn("block text-sm font-medium", error ? "text-red-500" : "text-black")}>
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <input
                {...props}
                className={cn(textFieldVariants({ error, className }))}
            />
            {helperText && (
                <p className={cn("text-sm", error ? "text-red-500" : "text-black")}>{helperText}</p>
            )}
        </div>
    );
};

export default TextField;