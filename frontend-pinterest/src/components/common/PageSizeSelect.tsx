import { useTranslation } from "react-i18next";
import { PAGE_SIZE_OPTIONS } from "@/constants/common";

interface PageSizeSelectProps {
    value: number;
    onChange: (value: number) => void;
}

const PageSizeSelect = ({ value, onChange }: PageSizeSelectProps) => {
    const { t } = useTranslation('admin');

    return (
        <select
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="bg-gray-100 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/8 rounded-2xl px-4 py-2.5 text-sm text-gray-800 dark:text-white/80 outline-none focus:border-btn-primary/50 transition-colors"
        >
            {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>{t('pageSize', { size })}</option>
            ))}
        </select>
    );
};

export default PageSizeSelect;
