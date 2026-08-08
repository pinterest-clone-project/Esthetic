import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useAppSelector } from "@/store";
import { useGetChatsQuery } from "@/services/chatService";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";
import homeIcon from "@/assets/icons/home_icon.svg";
import collectionIcon from "@/assets/icons/collection_icon.svg";
import addIcon from "@/assets/icons/add_icon.svg";
import profileIcon from "../../../src/assets/icons/profile_icon.svg";
import auraIcon from "../../../src/assets/icons/aura_icon.svg";
import settingsIcon from "@/assets/icons/settings_icon.svg";

const greenFilter =
    "brightness(0) saturate(100%) invert(58%) sepia(61%) saturate(450%) hue-rotate(95deg) brightness(95%)";
const defaultFilterLight = "brightness(0) opacity(0.4)";
const defaultFilterDark = "brightness(0) invert(1) opacity(0.4)";

interface NavItem {
    labelKey: string;
    icon: string;
    path: string;
    isCreate?: boolean;
}

const navItems: NavItem[] = [
    { labelKey: "sidebar.main", icon: homeIcon, path: "/" },
    { labelKey: "sidebar.messages", icon: profileIcon, path: "/chat" },
    { labelKey: "sidebar.create", icon: addIcon, path: "/aura/create", isCreate: true },
    { labelKey: "sidebar.collections", icon: collectionIcon, path: "/collections/aura" },
    { labelKey: "sidebar.settings", icon: settingsIcon, path: "/settings" },
];

const BottomNav = () => {
    const { t } = useTranslation('common');
    const location = useLocation();
    const navigate = useNavigate();
    const user = useAppSelector((state) => state.auth.user);
    const { theme } = useTheme();
    const defaultFilter = theme === "dark" ? defaultFilterDark : defaultFilterLight;
    const [createOpen, setCreateOpen] = useState(false);
    const createRef = useRef<HTMLDivElement>(null);
    const { data: chats = [] } = useGetChatsQuery(undefined, { skip: !user });
    const totalUnread = chats.reduce((sum, c) => sum + c.unreadCount, 0);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (createRef.current && !createRef.current.contains(e.target as Node)) {
                setCreateOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    if (!user) return null;

    const handleClick = (item: NavItem) => {
        navigate(item.path);
    };

    const isActive = (item: NavItem) => {
        return location.pathname === item.path;
    };

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden items-center justify-around bg-white dark:bg-black border-t border-[#A2A2A2] dark:border-[#535353] h-16 px-2">
            {navItems.map((item) =>
                item.isCreate ? (
                    <div key={item.path} className="relative" ref={createRef}>
                        {createOpen && (
                            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-white dark:bg-[#1a1a1a] border border-[#A2A2A2] dark:border-[#535353] rounded-2xl shadow-2xl overflow-hidden w-44">
                                <button
                                    onClick={() => { setCreateOpen(false); navigate("/aura/create"); }}
                                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-black dark:text-white hover:bg-[#f0f0f0] dark:hover:bg-[#2a2a2a] transition-colors"
                                >
                                    <img src={auraIcon} className="w-5 h-5 object-contain" style={{ filter: defaultFilter }} alt="" />
                                    {t('sidebar.aura')}
                                </button>
                                <div className="h-px bg-[#A2A2A2] dark:bg-[#535353]" />
                                <button
                                    onClick={() => { setCreateOpen(false); navigate("/collections/moodboard"); }}
                                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-black dark:text-white hover:bg-[#f0f0f0] dark:hover:bg-[#2a2a2a] transition-colors"
                                >
                                    <img src={collectionIcon} className="w-5 h-5 object-contain" style={{ filter: defaultFilter }} alt="" />
                                    {t('sidebar.moodboard')}
                                </button>
                            </div>
                        )}
                        <button
                            onClick={() => setCreateOpen(p => !p)}
                            className={`flex items-center justify-center w-12 h-12 rounded-full bg-[#1DB954] shadow-md active:scale-95 transition-all ${createOpen ? "rotate-45" : ""}`}
                        >
                            <img src={item.icon} className="w-6 h-6" style={{ filter: "brightness(0)" }} alt={item.labelKey} />
                        </button>
                    </div>
                ) : (
                    <button
                        key={item.path}
                        onClick={() => handleClick(item)}
                        className="flex flex-col items-center gap-0.5 px-2 py-1"
                    >
                        <div className="relative">
                            <img
                                src={item.icon}
                                className="w-6 h-6 object-contain"
                                style={{ filter: isActive(item) ? greenFilter : defaultFilter }}
                                alt={t(item.labelKey)}
                            />
                            {item.labelKey === "sidebar.messages" && totalUnread > 0 && (
                                <span className="absolute -top-2 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-[#1DB954] text-black text-[9px] font-bold flex items-center justify-center leading-none">
                                    {totalUnread > 9 ? "9+" : totalUnread}
                                </span>
                            )}
                        </div>
                        <span className={`text-[10px] ${isActive(item) ? "text-[#1DB954]" : "text-[#A2A2A2]"}`}>
                            {t(item.labelKey)}
                        </span>
                    </button>
                )
            )}
        </nav>
    );
};

export default BottomNav;