import {useNavigate} from "react-router";

interface BackButtonProps {
    to?: string;
    label?: string;
    className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ to, label = "Back", className = "mb-8"  }) => {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => to ? navigate(to) : navigate(-1)}
            className={`flex items-center gap-2 text-gray-500 hover:text-black dark:hover:text-white text-xs transition-colors group cursor-pointer ${className}`}
        >
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {label}
        </button>
    );
};

export default BackButton;