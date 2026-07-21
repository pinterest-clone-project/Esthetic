import { useState, useRef, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { useTranslation } from "react-i18next";

interface BirthDatePickerProps {
    value: string; // YYYY-MM-DD
    onChange: (value: string) => void;
    className?: string;
}

const BirthDatePicker = ({ value, onChange, className }: BirthDatePickerProps) => {
    const { t, i18n } = useTranslation('common');
    const [open, setOpen] = useState(false);
    const [openUpward, setOpenUpward] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selected = value ? new Date(value + "T00:00:00") : undefined;

    const formatDisplay = (date: Date) =>
        date.toLocaleDateString(i18n.language, { day: "numeric", month: "long", year: "numeric" });

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (date: Date | undefined) => {
        if (!date) return;
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");
        onChange(`${yyyy}-${mm}-${dd}`);
        setOpen(false);
    };

    return (
        <div ref={containerRef} className="relative w-full">
            <style>{`
                .rdp-root {
                    --rdp-accent-color: var(--color-btn-primary);
                    --rdp-accent-background-color: color-mix(in srgb, var(--color-btn-primary) 20%, transparent);
                    --rdp-day-width: 22px;
                    --rdp-day-height: 22px;
                    --rdp-font-size: 11px;
                    color: inherit;
                }
                .rdp-root .rdp-month_caption {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: space-between;
                    gap: 4px;
                    padding-bottom: 6px;
                }
                .rdp-root .rdp-nav {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    margin-left: auto;
                    flex-shrink: 0;
                }
                .rdp-root .rdp-caption_label {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    flex-shrink: 1;
                    min-width: 0;
                }
                .rdp-root select {
                    background: transparent;
                    border: 1px solid var(--color-btn-primary);
                    border-radius: 4px;
                    padding: 2px 4px;
                    font-size: 10px;
                    height: 20px;
                    line-height: 1;
                    color: inherit;
                    cursor: pointer;
                    outline: none;
                }
                .rdp-root select:focus {
                    border-color: var(--color-btn-primary);
                }
                .rdp-root .rdp-weekday {
                    font-size: 9px;
                    opacity: 0.5;
                    font-weight: 600;
                    text-transform: uppercase;
                }
                .rdp-root .rdp-day_button {
                    border-radius: 4px;
                    width: var(--rdp-day-width);
                    height: var(--rdp-day-height);
                    transition: background 0.15s;
                }
                .rdp-root .rdp-day_button:hover:not([disabled]) {
                    background: color-mix(in srgb, var(--color-btn-primary) 25%, transparent);
                }
                .rdp-root .rdp-selected .rdp-day_button {
                    background: var(--color-btn-primary) !important;
                    color: black !important;
                    font-weight: 700;
                }
                .rdp-root .rdp-today:not(.rdp-selected) .rdp-day_button {
                    border: 1.5px solid var(--color-btn-primary);
                    color: var(--color-btn-primary);
                    border-radius: 4px;
                }
                .rdp-root .rdp-nav button {
                    border-radius: 4px;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background 0.15s;
                    align-self: center;
                }
                .rdp-root .rdp-nav button:hover {
                    background: color-mix(in srgb, var(--color-btn-primary) 20%, transparent);
                }
                .rdp-root,
                .rdp-root .rdp-month,
                .rdp-root .rdp-months,
                .rdp-root .rdp-month_grid {
                    width: 100%;
                }
                .rdp-root .rdp-month_grid {
                    border-collapse: collapse;
                    table-layout: fixed;
                }
                .rdp-root .rdp-week td,
                .rdp-root .rdp-weekdays th {
                    width: calc(100% / 7);
                    text-align: center;
                }
                .rdp-root .rdp-day_button {
                    width: 100%;
                    height: var(--rdp-day-height);
                    border-radius: 4px;
                    transition: background 0.15s;
                }
            `}</style>


            <button
                type="button"
                onClick={() => {
                    if (!open && containerRef.current) {
                        const rect = containerRef.current.getBoundingClientRect();
                        setOpenUpward(window.innerHeight - rect.bottom < 320);
                    }
                    setOpen((prev) => !prev);
                }}
                className={`w-full h-10 px-4 rounded-[5px] text-sm text-left outline-none border border-[var(--color-btn-primary)] transition flex items-center justify-between ${className ?? "text-white dark:text-black"}`}
            >
                <span className={selected ? "" : "opacity-40"}>
                    {selected ? formatDisplay(selected) : t('profile.selectBirthDate')}
                </span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-60">
                    <rect x="3" y="4" width="18" height="18" rx="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
            </button>

            {/* Calendar popover */}
            {open && (
                <div className={`absolute z-50 left-0 rounded-xl border border-[var(--color-btn-primary)] shadow-2xl p-2 w-full
                    bg-[#1a1a1a] dark:bg-white text-white dark:text-black
                    ${openUpward ? "bottom-full mb-2" : "top-full mt-2"}`}>
                    <DayPicker
                        mode="single"
                        selected={selected}
                        onSelect={handleSelect}
                        captionLayout="dropdown"
                        startMonth={new Date(1940, 0)}
                        endMonth={new Date()}
                        defaultMonth={selected ?? new Date(2000, 0)}
                        disabled={{ after: new Date() }}
                    />
                </div>
            )}
        </div>
    );
};

export default BirthDatePicker;
