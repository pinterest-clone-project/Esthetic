import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGUAGES } from "@/i18n";

const LABELS: Record<typeof SUPPORTED_LANGUAGES[number], string> = {
    uk: "UA",
    en: "EN",
};

const LanguageSwitcher: React.FC = () => {
    const { i18n } = useTranslation();
    const current = (i18n.language?.slice(0, 2) ?? "uk") as typeof SUPPORTED_LANGUAGES[number];

    const toggle = (lang: typeof SUPPORTED_LANGUAGES[number]) => {
        if (lang !== current) i18n.changeLanguage(lang);
    };

    return (
        <div className="flex items-center gap-0.5 bg-[#A2A2A2]/30 dark:bg-[#535353]/40 rounded-[8px] p-0.5">
            {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                    key={lang}
                    onClick={() => toggle(lang)}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-[6px] transition-all duration-200 cursor-pointer
                        ${current === lang
                            ? "bg-white dark:bg-[#1a1a1a] text-black dark:text-white shadow-sm"
                            : "text-black/50 dark:text-white/40 hover:text-black dark:hover:text-white"
                        }`}
                >
                    {LABELS[lang]}
                </button>
            ))}
        </div>
    );
};

export default LanguageSwitcher;
