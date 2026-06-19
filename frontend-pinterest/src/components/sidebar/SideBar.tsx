import { useNavigate, useLocation } from "react-router";
import homeIcon from "../../../src/assets/icons/home_icon.svg";
import collectionIcon from "../../../src/assets/icons/collection_icon.svg";
import addIcon from "../../../src/assets/icons/add_icon.svg";
import settingsIcon from "../../../src/assets/icons/settings_icon.svg";
import profileIcon from "../../../src/assets/icons/profile_icon.svg";
import auraIcon from "../../../src/assets/icons/aura_icon.svg";
import React, {useEffect, useState} from "react";
import Modal from "@/components/UI/Modal.tsx";
import {useLogoutMutation} from "@/services/accountService.ts";
import {clearUser} from "@/store/slices/authSlice.ts";
import {api} from "@/services/api.ts";
import {useAppDispatch} from "@/store";
import type { IChat } from "@/types/chat/IChat";
import {useGetChatsQuery, useGetOrCreateChatMutation} from "@/services/chatService.ts";
import {useSearchUsersQuery} from "@/services/userService.ts";
import ChatWindow from "@/components/sidebar/windows/ChatWindow.tsx";
import {stopChatConnection} from "@/utils/chatHub.ts";
import {APP_ENV} from "@/constants/env";

const navItems = [
    { path: "/", icon: homeIcon, label: "Головна" },
    { path: "/collections/aura", icon: collectionIcon, label: "Дошки" },
];

const greenFilter =
    "brightness(0) saturate(100%) invert(58%) sepia(61%) saturate(450%) hue-rotate(95deg) brightness(95%)";
const whiteFilter = "brightness(0) invert(1)";

type ModalType = 'friends' | 'settings' | 'create' | null;

const modalItems = [
    { modal: 'create' as ModalType, icon: addIcon, label: "Create" },
    { modal: 'friends' as ModalType, icon: profileIcon, label: "Add Friends" },
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
            className={`w-[30px] h-[33px] transition-all duration-200 group-hover:scale-110 ${active ? "opacity-100" : "opacity-50 group-hover:opacity-80"} ${extraImgClass}`}
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
    const [logout] = useLogoutMutation();
    const dispatch = useAppDispatch();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Помилка під час logout:", error);
        } finally {
            await stopChatConnection();
            dispatch(clearUser());
            dispatch(api.util.resetApiState());
            navigate("/");
        }
    };

    const isActive = (path: string) => location.pathname === path;
    const closeModal = () => setActiveModal(null);


    const [activeChat, setActiveChat] = useState<IChat | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const { data: chats = [] } = useGetChatsQuery();
    const totalUnread = chats.reduce((sum, c) => sum + c.unreadCount, 0);
    const { data: searchResult } = useSearchUsersQuery(
        { search: debouncedSearch, pageSize: 10 },
        { skip: debouncedSearch.trim().length < 2 }
    );
    const [getOrCreateChat] = useGetOrCreateChatMutation();

    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(searchTerm), 300);
        return () => clearTimeout(t);
    }, [searchTerm]);

    const handleSelectUser = async (userId: string) => {
        const chat = await getOrCreateChat(userId).unwrap();
        setActiveChat(chat);
        setActiveModal(null);
        setSearchTerm("");
    };

    const handleOpenChat = (chat: IChat) => {
        setActiveChat(chat);
        setActiveModal(null);
    };

    return (
        <>
            <aside className="sticky top-[74px] w-16 bg-black flex flex-col items-center py-6 z-40 h-[calc(100vh-74px)] shrink-0">
                <nav className="flex flex-col items-center gap-5 flex-1">
                    {navItems.map(({ path, icon, label }) => (
                        <SidebarButton
                            key={path}
                            icon={icon}
                            label={label}
                            active={isActive(path) && activeModal === null}
                            onClick={() => { navigate(path); closeModal(); }}
                        />
                    ))}

                    {modalItems.map(({ modal, icon, label }) =>
                            modal === 'friends' ? (
                                <SidebarButton
                                    key={modal}
                                    icon={icon}
                                    label={label}
                                    active={activeModal === modal}
                                    onClick={() => setActiveModal(modal)}
                                >
                                    {totalUnread > 0 && (
                                        <span className="absolute top-0.5 right-0.5 min-w-[16px] h-[16px] px-0.5 rounded-full bg-[#1DB954] text-black text-[9px] font-bold flex items-center justify-center leading-none">
                    {totalUnread > 9 ? "9+" : totalUnread}
                </span>
                                    )}
                                </SidebarButton>
                            ) : (
                                <SidebarButton
                                    key={modal}
                                    icon={icon}
                                    label={label}
                                    active={activeModal === modal}
                                    onClick={() => setActiveModal(modal)}
                                />
                            )
                    )}
                </nav>

                <SidebarButton
                    icon={settingsIcon}
                    label="Налаштування"
                    active={activeModal === 'settings'}
                    onClick={() => setActiveModal('settings')}
                    extraImgClass="group-hover:rotate-45"
                />
            </aside>

            <Modal isOpen={activeModal === 'friends'} onClose={closeModal} variant="sidebar" title="Messages" width={300}>
                <div className="flex items-center gap-2 bg-[#2a2a2a] rounded-lg px-3 py-2 mx-3">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A1A1A1" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                    </svg>
                    <input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-transparent text-sm text-white outline-none w-full placeholder:text-[#A1A1A1]"
                        placeholder="Search by nickname"
                    />
                </div>

                <div className="mt-3 px-3 flex flex-col gap-1 max-h-[400px] overflow-y-auto">
                    {debouncedSearch.trim().length >= 1 ? (
                        <>
                            {searchResult?.items.map((user) => (
                                <button
                                    key={user.id}
                                    onClick={() => handleSelectUser(user.id)}
                                    className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[#2a2a2a] transition-colors"
                                >
                                    <div className="w-9 h-9 rounded-full bg-[#2a2a2a] overflow-hidden shrink-0">
                                        {user.image && <img src={`${APP_ENV.IMAGES_100_URL}${user.image}`} className="w-full h-full object-cover" />}
                                    </div>
                                    <span className="text-white text-sm">{user.userName}</span>
                                </button>
                            ))}
                            {searchResult?.items.length === 0 && (
                                <p className="text-[#A1A1A1] text-xs px-2">Користувачів не знайдено</p>
                            )}
                        </>
                    ) : (
                        <>
                            <p className="text-[#A1A1A1] text-xs px-2 mb-1">Ваші чати</p>
                            {chats.map((chat) => (
                                <button
                                    key={chat.id}
                                    onClick={() => handleOpenChat(chat)}
                                    className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[#2a2a2a] transition-colors"
                                >
                                    <div className="w-9 h-9 rounded-full bg-[#2a2a2a] overflow-hidden shrink-0">
                                        {chat.otherUser.image && <img src={`${APP_ENV.IMAGES_100_URL}${chat.otherUser.image}`} className="w-full h-full object-cover" />}
                                    </div>
                                    <div className="text-left flex-1 overflow-hidden">
                                        <p className="text-white text-sm">{chat.otherUser.username}</p>
                                        {chat.lastMessage && (
                                            <p className="text-[#A1A1A1] text-xs truncate">{chat.lastMessage.content}</p>
                                        )}
                                    </div>
                                    {chat.unreadCount > 0 && (
                                        <span className="bg-[#1DB954] text-black text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0">
                                {chat.unreadCount}
                            </span>
                                    )}
                                </button>
                            ))}
                        </>
                    )}
                </div>
            </Modal>

            <Modal isOpen={activeModal === 'settings'} onClose={closeModal} variant="sidebar" title="Settings" width={300}>
                <button
                    onClick={() => { navigate('/profile'); closeModal(); }}
                    className="flex items-center gap-3 w-full px-3 py-3 rounded-xl hover:bg-[#2a2a2a] transition-colors duration-150 group"
                >
                    <div className="w-10 h-10 rounded-xl bg-[#2a2a2a] group-hover:bg-[#333] flex items-center justify-center transition-colors shrink-0">
                        <img src={profileIcon} style={{ filter: whiteFilter }} className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                        <p className="text-white text-sm font-medium">Profile</p>
                        <p className="text-[#A1A1A1] text-xs">View and edit your profile</p>
                    </div>
                </button>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-3 py-3 rounded-xl hover:bg-red-500/10 transition-colors duration-150 group mt-auto mb-1"
                >
                    <div className="w-10 h-10 rounded-xl bg-[#2a2a2a] group-hover:bg-red-500/20 flex items-center justify-center transition-colors shrink-0">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                            <polyline points="16 17 21 12 16 7"/>
                            <line x1="21" y1="12" x2="9" y2="12"/>
                        </svg>
                    </div>
                    <div className="text-left">
                        <p className="text-red-400 text-sm font-medium">Logout</p>
                        <p className="text-[#A1A1A1] text-xs">Sign out of your account</p>
                    </div>
                </button>
            </Modal>

            <Modal isOpen={activeModal === 'create'} onClose={closeModal} variant="sidebar" title="Create" width={300}>
                <button
                    onClick={() => { navigate('/collections/moodboard'); closeModal(); }}
                    className="flex items-center gap-3 w-full px-3 py-3 rounded-xl hover:bg-[#2a2a2a] transition-colors duration-150 group"
                >
                    <div className="w-10 h-10 rounded-xl bg-[#2a2a2a] group-hover:bg-[#333] flex items-center justify-center transition-colors shrink-0">
                        <img src={collectionIcon} style={{ filter: whiteFilter }} className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                        <p className="text-white text-sm font-medium">Moodboard</p>
                        <p className="text-[#A1A1A1] text-xs">Organize your ideas</p>
                    </div>
                </button>

                <button
                    onClick={() => { navigate('/aura/create'); closeModal(); }}
                    className="flex items-center gap-3 w-full px-3 py-3 rounded-xl hover:bg-[#2a2a2a] transition-colors duration-150 group"
                >
                    <div className="w-10 h-10 rounded-xl bg-[#2a2a2a] group-hover:bg-[#333] flex items-center justify-center transition-colors shrink-0">
                        <img src={auraIcon} style={{ filter: whiteFilter }} className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                        <p className="text-white text-sm font-medium">Aura</p>
                        <p className="text-[#A1A1A1] text-xs">Share your aesthetic</p>
                    </div>
                </button>
            </Modal>
            {activeChat && <ChatWindow chat={activeChat} onClose={() => setActiveChat(null)} />}
        </>
    );

};

export default Sidebar;