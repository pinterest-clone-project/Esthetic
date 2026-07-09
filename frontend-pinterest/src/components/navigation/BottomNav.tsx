import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useAppSelector } from "@/store";
import { selectIsAdmin } from "@/store/selectors/authSelectors";
import { useTheme } from "@/context/ThemeContext";
import homeIcon from "@/assets/icons/home_icon.svg";
import collectionIcon from "@/assets/icons/collection_icon.svg";
import addIcon from "@/assets/icons/add_icon.svg";
import profileIcon from "../../../src/assets/icons/profile_icon.svg";
import { APP_ENV } from "@/constants/env";
import userIcon from "@/assets/icons/user_icon.svg";
import auraIcon from "../../../src/assets/icons/aura_icon.svg";

const greenFilter =
    "brightness(0) saturate(100%) invert(58%) sepia(61%) saturate(450%) hue-rotate(95deg) brightness(95%)";
const defaultFilterLight = "brightness(0) opacity(0.4)";
const defaultFilterDark = "brightness(0) invert(1) opacity(0.4)";

interface NavItem {
    label: string;
    icon: string;
    path: string;
    isCreate?: boolean;
}

const navItems: NavItem[] = [
    { label: "Home", icon: homeIcon, path: "/" },
    { label: "Chat", icon: profileIcon, path: "/chat" },
    { label: "Create", icon: addIcon, path: "/aura/create", isCreate: true },
    { label: "Collections", icon: collectionIcon, path: "/collections/aura" },
    { label: "Profile", icon: userIcon, path: "/profile" },
];

const BottomNav = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = useAppSelector((state) => state.auth.user);
    const isAdmin = useAppSelector(selectIsAdmin);
    const { theme } = useTheme();
    const defaultFilter = theme === "dark" ? defaultFilterDark : defaultFilterLight;
    const [createOpen, setCreateOpen] = useState(false);
    const createRef = useRef<HTMLDivElement>(null);

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
        if (item.path === "__search__") return false;
        if (item.path === "/profile") return location.pathname.startsWith("/profile");
        return location.pathname === item.path;
    };

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden items-center justify-around bg-white dark:bg-black border-t border-[#A2A2A2] dark:border-[#535353] h-16 px-2">
            {isAdmin && (
                <button
                    onClick={() => navigate("/admin")}
                    className="flex flex-col items-center gap-0.5 px-2 py-1"
                >
                    <svg
                        width="24" height="24" viewBox="0 0 24 24" fill="none"
                        stroke={location.pathname.startsWith("/admin") ? "#1DB954" : (theme === "dark" ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)")}
                        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                    >
                        <path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3z"/>
                    </svg>
                    <span className={`text-[10px] ${location.pathname.startsWith("/admin") ? "text-[#1DB954]" : "text-[#A2A2A2]"}`}>
                        Admin
                    </span>
                </button>
            )}
            {navItems.map((item) =>
                item.isCreate ? (
                    <div key={item.path} className="relative" ref={createRef}>
                        {createOpen && (
                            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-white dark:bg-[#1a1a1a] border border-[#A2A2A2] dark:border-[#535353] rounded-2xl shadow-2xl overflow-hidden w-44">
                                <button
                                    onClick={() => { setCreateOpen(false); navigate("/aura/create"); }}
                                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-black dark:text-white hover:bg-[#f0f0f0] dark:hover:bg-[#2a2a2a] transition-colors"
                                >
                                    <img src={auraIcon} className="w-5 h-5 object-contain" style={{ filter: defaultFilter }} />
                                    Aura
                                </button>
                                <div className="h-px bg-[#A2A2A2] dark:bg-[#535353]" />
                                <button
                                    onClick={() => { setCreateOpen(false); navigate("/collections/moodboard"); }}
                                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-black dark:text-white hover:bg-[#f0f0f0] dark:hover:bg-[#2a2a2a] transition-colors"
                                >
                                    <img src={collectionIcon} className="w-5 h-5 object-contain" style={{ filter: defaultFilter }} />
                                    Moodboard
                                </button>
                            </div>
                        )}
                        <button
                            onClick={() => setCreateOpen(p => !p)}
                            className={`flex items-center justify-center w-12 h-12 rounded-full bg-[#1DB954] shadow-md active:scale-95 transition-all ${createOpen ? "rotate-45" : ""}`}
                        >
                            <img src={item.icon} className="w-6 h-6" style={{ filter: "brightness(0)" }} alt={item.label} />
                        </button>
                    </div>
                ) : item.label === "Profile" ? (
                    <button
                        key={item.path}
                        onClick={() => handleClick(item)}
                        className="flex flex-col items-center gap-0.5 px-2 py-1"
                    >
                        <div className={`w-7 h-7 rounded-full overflow-hidden flex items-center justify-center
                            ${user.image ? "" : "bg-[var(--color-btn-primary)]"}
                            ${isActive(item) ? "ring-2 ring-[#1DB954]" : ""}`}>
                            {user.image ? (
                                <img
                                    src={`${APP_ENV.IMAGES_100_URL}${user.image}`}
                                    className="w-full h-full object-cover"
                                    alt="Profile"
                                />
                            ) : (
                                <img src={userIcon} className="w-4 h-4 object-contain" alt="Profile" />
                            )}
                        </div>
                        <span className={`text-[10px] ${isActive(item) ? "text-[#1DB954]" : "text-[#A2A2A2]"}`}>
                            {item.label}
                        </span>
                    </button>
                ) : item.path === "__chat__" ? (
                    <button
                        key={item.path}
                        onClick={() => handleClick(item)}
                        className="flex flex-col items-center gap-0.5 px-2 py-1"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                             stroke={theme === "dark" ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)"}
                             strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                        </svg>
                        <span className="text-[10px] text-[#A2A2A2]">{item.label}</span>
                    </button>
                ) : (
                    <button
                        key={item.path}
                        onClick={() => handleClick(item)}
                        className="flex flex-col items-center gap-0.5 px-2 py-1"
                    >
                        <img
                            src={item.icon}
                            className="w-6 h-6"
                            style={{ filter: isActive(item) ? greenFilter : defaultFilter }}
                            alt={item.label}
                        />
                        <span className={`text-[10px] ${isActive(item) ? "text-[#1DB954]" : "text-[#A2A2A2]"}`}>
                            {item.label}
                        </span>
                    </button>
                )
            )}
        </nav>
    );
};

export default BottomNav;
