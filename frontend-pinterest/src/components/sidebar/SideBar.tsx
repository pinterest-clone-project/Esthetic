import { useNavigate, useLocation } from "react-router";
import homeIcon from "../../../src/assets/icons/home_icon.svg";
import collectionIcon from "../../../src/assets/icons/collection_icon.svg";
import addIcon from "../../../src/assets/icons/add_icon.svg";
import settingsIcon from "../../../src/assets/icons/settings_icon.svg";
import profileIcon from "../../../src/assets/icons/profile_icon.svg";

const navItems = [
    { path: "/", icon: homeIcon, label: "Головна" },
    { path: "/boards", icon: collectionIcon, label: "Дошки" },
    { path: "/create", icon: addIcon, label: "Створити" },
    { path: "/profile", icon: profileIcon, label: "Профіль" },
];

const greenFilter =
    "brightness(0) saturate(100%) invert(58%) sepia(61%) saturate(450%) hue-rotate(95deg) brightness(95%)";

const whiteFilter = "brightness(0) invert(1)";

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <aside className="sticky top-[74px] w-16 bg-black flex flex-col items-center py-6 z-40 h-[calc(100vh-74px)] shrink-0">
            <nav className="flex flex-col items-center gap-2 flex-1">
                {navItems.map(({ path, icon, label }) => {
                    const active = isActive(path);
                    return (
                        <button
                            key={path}
                            onClick={() => navigate(path)}
                            className="relative group flex items-center justify-center w-[40px] h-[46px] rounded-lg transition-all duration-200 hover:bg-[#1a1a1a]"
                        >
                            <img
                                src={icon}
                                style={{ filter: active ? greenFilter : whiteFilter }}
                                className={`
                                w-[30px] h-[36px] transition-all duration-200 group-hover:scale-110 
                                ${active ? "opacity-100" : "opacity-50 group-hover:opacity-80"}
                                `}
                            />

                            <span className="
                                absolute left-12 px-2 py-1 rounded-md
                                bg-[#1a1a1a] text-white text-xs font-medium whitespace-nowrap
                                opacity-0 group-hover:opacity-100
                                translate-x-1 group-hover:translate-x-0
                                transition-all duration-150 pointer-events-none
                                border border-white/10
                             ">
                                {label}
                             </span>
                        </button>
                    );
                })}
            </nav>


            {(() => {
                const active = isActive("/settings");
                return (
                    <button
                        onClick={() => navigate("/settings")}
                        className="relative group flex items-center justify-center w-[40px] h-[46px] rounded-lg transition-all duration-200 hover:bg-[#1a1a1a]"
                    >
                        <img
                            src={settingsIcon}
                            style={{ filter: active ? greenFilter : whiteFilter }}
                            className={`
                                w-[30px] h-[36px] transition-all duration-200
                                group-hover:scale-110 group-hover:rotate-45
                                ${active ? "opacity-100" : "opacity-50 group-hover:opacity-80"}
                            `}
                        />

                        <span className="
                              absolute left-12 px-2 py-1 rounded-md
                              bg-[#1a1a1a] text-white text-xs font-medium whitespace-nowrap
                              opacity-0 group-hover:opacity-100
                              translate-x-1 group-hover:translate-x-0
                              transition-all duration-150 pointer-events-none
                              border border-white/10
                            ">
                              Налаштування
                        </span>
                    </button>
                );
            })()}
        </aside>
    );
};

export default Sidebar;