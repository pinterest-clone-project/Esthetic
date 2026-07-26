interface SortOption {
    value: string;
    label: string;
}

interface SortSelectProps {
    value: string;
    options: SortOption[];
    onChange: (value: string) => void;
}

const SortSelect = ({ value, options, onChange }: SortSelectProps) => (
    <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-gray-100 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/8 rounded-2xl px-4 py-2.5 text-sm text-gray-800 dark:text-white/80 outline-none focus:border-btn-primary/50 transition-colors"
    >
        {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
    </select>
);

export default SortSelect;