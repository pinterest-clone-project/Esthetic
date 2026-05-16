type ButtonVariant = 'primary' | 'secondary' | 'dark';

interface ButtonProps {
    label: string;
    variant?: ButtonVariant;
    onClick?: () => void;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    fullWidth?: boolean;
}

const Button = ({
                    label,
                    variant = 'primary',
                    onClick,
                    disabled = false,
                    type = 'button',
                    fullWidth = false,
                }: ButtonProps) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`
        h-[44px] rounded-[8px] font-sans font-medium text-sm transition-opacity
        ${fullWidth ? 'w-full' : 'w-[200px]'}
        ${variant === 'primary' ? 'bg-btn-primary text-white hover:opacity-90' : ''}
        ${variant === 'secondary' ? 'bg-btn-secondary text-[#111111] hover:opacity-90' : ''}
        ${variant === 'dark' ? 'bg-btn-dark text-white hover:opacity-90' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
        >
            {label}
        </button>
    );
};

export default Button;