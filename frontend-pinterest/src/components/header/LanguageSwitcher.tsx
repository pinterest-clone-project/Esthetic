import React from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher: React.FC = () => {
    const { i18n } = useTranslation();
    const isEn = i18n.language?.startsWith("en");

    const toggle = () => i18n.changeLanguage(isEn ? "uk" : "en");

    return (
        <button
            onClick={toggle}
            className="flex items-center w-[68px] h-[32px] rounded-full bg-[#A2A2A2]/30 dark:bg-[#535353]/40 p-[3px] cursor-pointer shrink-0"
        >
            <span className={`flex-1 h-full rounded-full flex items-center justify-center text-[11px] font-bold transition-all duration-300 ${!isEn ? "bg-[#1DB954] text-black" : "text-black/40 dark:text-white/40"}`}>
                UA
            </span>
            <span className={`flex-1 h-full rounded-full flex items-center justify-center text-[11px] font-bold transition-all duration-300 ${isEn ? "bg-[#1DB954] text-black" : "text-black/40 dark:text-white/40"}`}>
                EN
            </span>
        </button>
    );
};

export default LanguageSwitcher;
