import React from "react";

type ButtonVariant = "primary" | "secondary" | "dark" | "light";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;
    icon?: React.ReactNode;
    radius?: number;
    children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
    primary:   "bg-[var(--color-btn-primary)] hover:opacity-90 text-[var(--color-button-text-color)]",
    secondary: "bg-[var(--color-btn-secondary)] hover:opacity-90 text-[var(--color-button-text-color)]",
    dark:      "bg-[var(--color-btn-dark)] hover:opacity-90 text-[var(--color-button-text-color)]",
    light:     "bg-[var(--color-btn-light)] hover:opacity-90 text-[var(--color-text-light)]",
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: "h-8 px-4 text-[var(--font-size-sm)]",
    md: "h-10 px-5 text-[var(--font-size-sm)]",
    lg: "h-12 px-6 text-base",
};

const Button = ({
                    variant = "primary",
                    size = "md",
                    fullWidth = false,
                    icon,
                    radius = 5,
                    children,
                    className = "",
                    style,
                    ...props
                }: ButtonProps) => {
    return (
        <button
            style={{ borderRadius: `${radius}px`, ...style }}
            className={`
                btn-text
                transition-opacity duration-200
                flex items-center justify-center gap-2
                w-[200px]
                ${variantStyles[variant]}
                ${sizeStyles[size]}
                ${fullWidth ? "!w-full" : ""}
                disabled:opacity-50 disabled:cursor-not-allowed
                ${className}
                cursor-pointer
            `}
            {...props}
        >
            {icon && <span className="flex items-center">{icon}</span>}
            {children}
        </button>
    );
};

export default Button;