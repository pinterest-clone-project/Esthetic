import { useNavigate, useLocation } from "react-router";
import homeIcon from "../../../src/assets/icons/home_icon.svg";
import collectionIcon from "../../../src/assets/icons/collection_icon.svg";
import addIcon from "../../../src/assets/icons/add_icon.svg";
import settingsIcon from "../../../src/assets/icons/settings_icon.svg";
import profileIcon from "../../../src/assets/icons/profile_icon.svg";
import auraIcon from "../../../src/assets/icons/aura_icon.svg";
import React, {useState} from "react";
import Modal from "@/components/UI/Modal.tsx";

const navItems = [
    { path: "/", icon: homeIcon, label: "Головна" },
    { path: "/boards", icon: collectionIcon, label: "Дошки" },
];

const greenFilter =
    "brightness(0) saturate(100%) invert(58%) sepia(61%) saturate(450%) hue-rotate(95deg) brightness(95%)";
const whiteFilter = "brightness(0) invert(1)";

type ModalType = 'friends' | 'settings' | 'create' | null;

const modalItems = [
    { modal: 'friends' as ModalType, icon: profileIcon, label: "Add Friends" },
    { modal: 'create' as ModalType, icon: addIcon, label: "Create" },
];

interface SidebarButtonProps {
    icon: string;
    label: string;
    active: boolean;
    onClick: () => void;
    extraImgClass?: string;
    children?: React.ReactNode;
}

const SidebarButton = ({ icon, label, active, onClick, extraImgClass = "", children }: SidebarButtonProps) => (
    <button
        onClick={onClick}
        className="relative group flex items-center justify-center w-[40px] h-[46px] rounded-lg transition-all duration-200 hover:bg-[#1a1a1a]"
    >
        <img
            src={icon}
            style={{ filter: active ? greenFilter : whiteFilter }}
            className={`w-[30px] h-[36px] transition-all duration-200 group-hover:scale-110 ${active ? "opacity-100" : "opacity-50 group-hover:opacity-80"} ${extraImgClass}`}
        />
        <span className="absolute left-12 px-2 py-1 rounded-md bg-[#1a1a1a] text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all duration-150 pointer-events-none border border-white/10">
            {label}
        </span>
        {children}
    </button>
);



const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeModal, setActiveModal] = useState<ModalType>(null);

    const isActive = (path: string) => location.pathname === path;
    const closeModal = () => setActiveModal(null);

    return (
        <>
            <aside className="sticky top-[74px] w-16 bg-black flex flex-col items-center py-6 z-40 h-[calc(100vh-74px)] shrink-0">
                <nav className="flex flex-col items-center gap-2 flex-1">
                    {navItems.map(({ path, icon, label }) => (
                        <SidebarButton
                            key={path}
                            icon={icon}
                            label={label}
                            active={isActive(path) && activeModal === null}
                            onClick={() => { navigate(path); closeModal(); }}
                        />
                    ))}

                    {modalItems.map(({ modal, icon, label }) => (
                        <SidebarButton
                            key={modal}
                            icon={icon}
                            label={label}
                            active={activeModal === modal}
                            onClick={() => setActiveModal(modal)}
                        />
                    ))}
                </nav>

                <SidebarButton
                    icon={settingsIcon}
                    label="Налаштування"
                    active={activeModal === 'settings'}
                    onClick={() => setActiveModal('settings')}
                    extraImgClass="group-hover:rotate-45"
                />
            </aside>

            <Modal isOpen={activeModal === 'friends'} onClose={closeModal} variant="sidebar" title="Add friends" width={300}>
                <div className="flex items-center gap-2 bg-[#2a2a2a] rounded-lg px-3 py-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A1A1A1" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                    </svg>
                    <input
                        className="bg-transparent text-sm text-white outline-none w-full placeholder:text-[#A1A1A1]"
                        placeholder="Search by nickname"
                    />
                </div>
            </Modal>

            <Modal isOpen={activeModal === 'settings'} onClose={closeModal} variant="sidebar" title="Settings" width={300}>
                <button
                    onClick={() => { navigate('/profile'); closeModal(); }}
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-[#2a2a2a] transition-colors duration-150"
                >
                    <img src={profileIcon} style={{ filter: whiteFilter }} className="w-6 h-6 opacity-60" />
                    <span className="text-lg text-white/70">Profile</span>
                </button>
            </Modal>

            <Modal isOpen={activeModal === 'create'} onClose={closeModal} variant="sidebar" title="Create" width={300}>
                <button
                    onClick={() => { navigate('/boards'); closeModal(); }}
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-[#2a2a2a] transition-colors duration-150"
                >
                    <img src={collectionIcon} style={{ filter: whiteFilter }} className="w-6 h-6 opacity-60" />
                    <span className="text-lg text-white/70">Moodboard</span>
                </button>

                <button
                    onClick={() => { navigate('/aura'); closeModal(); }}
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-[#2a2a2a] transition-colors duration-150"
                >
                    <img src={auraIcon} style={{ filter: whiteFilter }} className="w-6 h-6 opacity-60" />
                    <span className="text-lg text-white/70">Aura</span>
                </button>
            </Modal>
        </>
    );

};

export default Sidebar;