import { useState, useRef, useEffect } from "react";

interface ComboboxInputProps {
    value: string;
    onChange: (value: string) => void;
    options: string[];
    placeholder?: string;
    className?: string;
}

const ComboboxInput = ({ value, onChange, options, placeholder, className }: ComboboxInputProps) => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState(value);
    const containerRef = useRef<HTMLDivElement>(null);

    const filtered = query.trim()
        ? options.filter((o) => o.toLowerCase().includes(query.toLowerCase())).slice(0, 8)
        : [];

    useEffect(() => {
        setQuery(value);
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
                setQuery(value);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [value]);

    const handleSelect = (option: string) => {
        onChange(option);
        setQuery(option);
        setOpen(false);
    };

    return (
        <div ref={containerRef} className="relative w-full">
            <input
                type="text"
                placeholder={placeholder}
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    onChange(e.target.value);
                    setOpen(true);
                }}
                onFocus={() => { if (query.trim()) setOpen(true); }}
                className={`w-full h-10 px-4 rounded-[5px] text-sm outline-none border border-[var(--color-btn-primary)] transition ${className ?? ""}`}
            />

            {open && filtered.length > 0 && (
                <ul className="absolute z-50 mt-1 w-full rounded-[8px] border border-[var(--color-btn-primary)] shadow-xl overflow-hidden
                    bg-[#1a1a1a] dark:bg-white">
                    {filtered.map((option) => (
                        <li
                            key={option}
                            onMouseDown={() => handleSelect(option)}
                            className="px-4 py-2 text-sm text-white dark:text-black cursor-pointer hover:bg-[var(--color-btn-primary)] hover:text-black transition"
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ComboboxInput;
