import { useState, useRef, useEffect } from "react";

interface ComboboxOption {
    value: string;
    label: string;
}

interface ComboboxInputProps {
    value: string;
    onChange: (value: string) => void;
    options: string[] | ComboboxOption[];
    placeholder?: string;
    className?: string;
    searchable?: boolean; // default true
}

const ComboboxInput = ({ value, onChange, options, placeholder, className, searchable = true }: ComboboxInputProps) => {
    const normalized: ComboboxOption[] = options.map((o) =>
        typeof o === "string" ? { value: o, label: o } : o
    );

    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState(value);
    const [openUpward, setOpenUpward] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedLabel = normalized.find((o) => o.value === value)?.label ?? value;

    const filtered = searchable && query.trim()
        ? normalized.filter((o) => o.label.toLowerCase().includes(query.toLowerCase())).slice(0, 8)
        : normalized;

    useEffect(() => {
        setQuery(selectedLabel);
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
                setQuery(selectedLabel);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [value, selectedLabel]);

    const checkDirection = () => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setOpenUpward(window.innerHeight - rect.bottom < 220);
        }
    };

    const handleSelect = (option: ComboboxOption) => {
        onChange(option.value);
        setQuery(option.label);
        setOpen(false);
    };

    return (
        <div ref={containerRef} className="relative w-full">
            {searchable ? (
                <input
                    type="text"
                    placeholder={placeholder}
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        onChange(e.target.value);
                        checkDirection();
                        setOpen(true);
                    }}
                    onFocus={() => { if (query.trim()) { checkDirection(); setOpen(true); } }}
                    className={`w-full h-10 px-4 rounded-[5px] text-sm outline-none border border-[var(--color-btn-primary)] transition ${className ?? ""}`}
                />
            ) : (
                <button
                    type="button"
                    onClick={() => { checkDirection(); setOpen((o) => !o); }}
                    className={`w-full h-10 px-4 rounded-[5px] text-sm outline-none border border-[var(--color-btn-primary)] transition flex items-center justify-between ${className ?? ""}`}
                >
                    <span className={value ? "" : "opacity-40"}>{value ? selectedLabel : placeholder}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        className={`opacity-60 transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
                        <path d="M6 9l6 6 6-6"/>
                    </svg>
                </button>
            )}

            {open && filtered.length > 0 && (
                <ul className={`absolute z-50 w-full rounded-[8px] border border-[var(--color-btn-primary)] shadow-xl overflow-auto max-h-48 bg-[#1a1a1a] dark:bg-white ${openUpward ? "bottom-full mb-1" : "top-full mt-1"}`}>
                    {filtered.map((option) => (
                        <li
                            key={option.value}
                            onMouseDown={() => handleSelect(option)}
                            className={`px-4 py-2 text-sm cursor-pointer hover:bg-[var(--color-btn-primary)] hover:text-black transition
                                ${option.value === value ? "bg-[var(--color-btn-primary)]/20 text-[var(--color-btn-primary)]" : "text-white dark:text-black"}`}
                        >
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ComboboxInput;
