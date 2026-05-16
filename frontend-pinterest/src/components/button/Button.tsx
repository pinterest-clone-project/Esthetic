import React from "react";

type ButtonVariant = 'primary' | 'secondary' | 'dark';

interface ButtonProps {
    label: string;
    variant?: ButtonVariant;
    onClick?: () => void;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    fullWidth?: boolean;
    icon?: React.ReactNode;
}

const Button = ({
                    label,
                    variant = 'primary',
                    onClick,
                    disabled = false,
                    type = 'button',
                    fullWidth = false,
                    icon,
                }: ButtonProps) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`
        h-[44px] rounded-[8px] font-sans font-medium text-sm transition-opacity
        flex items-center justify-center gap-3
        ${fullWidth ? 'w-full' : 'w-[200px]'}
        ${variant === 'primary' ? 'bg-btn-primary text-button-text-color hover:opacity-90' : ''}
        ${variant === 'secondary' ? 'bg-btn-secondary text-button-text-color hover:opacity-90' : ''}
        ${variant === 'dark' ? 'bg-btn-dark text-button-text-color hover:opacity-90' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
        >
            {icon ? icon : null}
            {label}
        </button>
    );
};

export default Button;