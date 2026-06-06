import { useNavigate, useLocation } from "react-router";
import homeIcon from "../../../src/assets/icons/home_icon.svg";
import collectionIcon from "../../../src/assets/icons/collection_icon.svg";
import addIcon from "../../../src/assets/icons/add_icon.svg";
import settingsIcon from "../../../src/assets/icons/settings_icon.svg";
import profileIcon from "../../../src/assets/icons/profile_icon.svg";

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    const navItems = [
        { path: "/", icon: homeIcon },
        { path: "/boards", icon: collectionIcon },
        { path: "/create", icon: addIcon },
        { path: "/profile", icon: profileIcon },
    ];

    return (
        <aside className="sticky  left-0 top-0 h-screen w-16 bg-black flex flex-col items-center py-6 z-40">
            <nav className="flex flex-col items-center gap-8 flex-1">
                {navItems.map(({ path, icon }) => (
                    <button key={path} onClick={() => navigate(path)}>
                        <img
                            src={icon}
                            className={`w-[30px] h-[30px] transition-all ${
                                isActive(path) ? "icon-active" : "icon-default"
                            }`}
                        />
                    </button>
                ))}
            </nav>

            <button onClick={() => navigate("/settings")}>
                <img
                    src={settingsIcon}
                    className={`w-[30px] h-[30px] transition-all ${
                        isActive("/settings") ? "icon-active" : "icon-default"
                    }`}
                />
            </button>
        </aside>
    );
};

export default Sidebar;