import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

const languages = [
    { code: "uk", label: "Українська", flag: "https://flagcdn.com/w40/ua.png" },
    { code: "en", label: "English", flag: "https://flagcdn.com/w40/gb.png" },
];

const LanguageSwitcher: React.FC = () => {
    const { i18n } = useTranslation();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const current = languages.find(l => i18n.language?.startsWith(l.code)) ?? languages[0];

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div ref={ref} className="relative shrink-0">
            <button
                onClick={() => setOpen(o => !o)}
                className="flex items-center gap-1.5 h-9 px-3 rounded-xl bg-black/8 dark:bg-white/10 hover:bg-black/12 dark:hover:bg-white/15 transition-colors duration-150 cursor-pointer"
            >
                <img src={current.flag} alt={current.code} className="w-5 h-auto rounded-[2px]" />
                <span className="text-xs font-semibold text-black dark:text-white uppercase">{current.code}</span>
                <svg
                    width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                    className={`text-black/50 dark:text-white/50 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                >
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </button>

            {open && (
                <div className="absolute right-0 top-11 w-44 rounded-xl bg-white dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 shadow-xl overflow-hidden z-50 animate-[dropdownIn_0.15s_ease]">
                    {languages.map(lang => (
                        <button
                            key={lang.code}
                            onClick={() => { i18n.changeLanguage(lang.code); setOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors duration-150
                                ${lang.code === current.code
                                    ? "bg-[#1DB954]/10 text-[#1DB954] font-semibold"
                                    : "text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/8"
                                }`}
                        >
                            <img src={lang.flag} alt={lang.code} className="w-5 h-auto rounded-[2px]" />
                            <span>{lang.label}</span>
                            {lang.code === current.code && (
                                <svg className="ml-auto" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LanguageSwitcher;
