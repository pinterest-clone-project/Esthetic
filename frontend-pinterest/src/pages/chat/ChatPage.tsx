import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useAppSelector } from "@/store";
import {
    useGetChatsQuery,
    useGetMessagesQuery,
    useGetOrCreateChatMutation,
    useMarkChatAsReadMutation,
    useSendMessageMutation,
} from "@/services/chatService";
import { useSearchUsersQuery } from "@/services/userService";
import { APP_ENV } from "@/constants/env";
import type { IChat } from "@/types/chat/IChat";

const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" });

// ── Inline chat view ──────────────────────────────────────────────────────────

const ChatView = ({ chat, onBack }: { chat: IChat; onBack: () => void }) => {
    const currentUserId = useAppSelector((s) => s.auth.user?.id);
    const { data: messages = [] } = useGetMessagesQuery(chat.id);
    const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
    const [markAsRead] = useMarkChatAsReadMutation();
    const [text, setText] = useState("");
    const bottomRef = useRef<HTMLDivElement>(null);

    const { unreadCount } = useGetChatsQuery(undefined, {
        selectFromResult: ({ data }) => ({
            unreadCount: data?.find((c) => c.id === chat.id)?.unreadCount ?? 0,
        }),
    });

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages.length]);

    useEffect(() => {
        if (unreadCount > 0) markAsRead(chat.id);
    }, [unreadCount, chat.id]);

    const handleSend = () => {
        const content = text.trim();
        if (!content || isSending) return;
        sendMessage({ chatId: chat.id, content });
        setText("");
    };

    const avatarLetter = chat.otherUser.username?.[0]?.toUpperCase() ?? "?";

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[#A2A2A2] dark:border-[#535353] shrink-0">
                <button
                    onClick={onBack}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#D1D1D1] dark:hover:bg-[#2a2a2a] transition-colors"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-black dark:text-white">
                        <path d="M15 18l-6-6 6-6"/>
                    </svg>
                </button>
                <div className="w-9 h-9 rounded-full bg-[#2a2a2a] overflow-hidden shrink-0 flex items-center justify-center">
                    {chat.otherUser.image
                        ? <img src={`${APP_ENV.IMAGES_100_URL}${chat.otherUser.image}`} className="w-full h-full object-cover" alt={chat.otherUser.username} />
                        : <span className="text-white text-sm font-medium">{avatarLetter}</span>
                    }
                </div>
                <span className="text-black dark:text-white font-medium text-sm">{chat.otherUser.username}</span>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2" style={{ scrollbarWidth: "none" }}>
                {messages.map((m) => {
                    const isOwn = m.senderId === currentUserId;
                    return (
                        <div key={m.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[75%] px-3 pt-2 pb-1 text-sm whitespace-pre-wrap break-words flex flex-col ${
                                isOwn
                                    ? "bg-[#1DB954] text-black rounded-[18px] rounded-br-[4px]"
                                    : "bg-[#e5e5e5] dark:bg-[#2a2a2a] text-black dark:text-white rounded-[18px] rounded-bl-[4px]"
                            }`}>
                                <span>{m.content}</span>
                                <span className={`text-[10px] mt-0.5 self-end ${isOwn ? "text-black/50" : "text-black/40 dark:text-white/40"}`}>
                                    {formatTime(m.sentAt)}
                                </span>
                            </div>
                        </div>
                    );
                })}
                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-3 py-3 border-t border-[#A2A2A2] dark:border-[#535353] shrink-0">
                <div className="flex items-center gap-2 bg-[#D1D1D1] dark:bg-[#1e1e1e] rounded-full px-4 py-2">
                    <input
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                        placeholder="Message"
                        className="flex-1 bg-transparent text-sm text-black dark:text-white outline-none placeholder:text-[#888]"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!text.trim() || isSending}
                        className="w-7 h-7 rounded-full bg-[#1DB954] flex items-center justify-center disabled:opacity-30 shrink-0 transition-opacity"
                    >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                            <path d="M5 12h14M12 5l7 7-7 7" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

// ── Main ChatPage ─────────────────────────────────────────────────────────────

const ChatPage = () => {
    const navigate = useNavigate();
    const [activeChat, setActiveChat] = useState<IChat | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const { data: chats = [] } = useGetChatsQuery();
    const { data: searchResult } = useSearchUsersQuery(
        { search: debouncedSearch, pageSize: 10 },
        { skip: debouncedSearch.trim().length < 2 }
    );
    const [getOrCreateChat] = useGetOrCreateChatMutation();

    // Redirect to home on desktop
    useEffect(() => {
        const check = () => {
            if (window.innerWidth >= 768) navigate("/", { replace: true });
        };
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, [navigate]);

    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(searchTerm), 300);
        return () => clearTimeout(t);
    }, [searchTerm]);

    const handleSelectUser = async (userId: string) => {
        const chat = await getOrCreateChat(userId).unwrap();
        setActiveChat(chat);
        setSearchTerm("");
    };

    if (activeChat) {
        return (
            <div className="fixed inset-x-0 bottom-0 z-40 bg-white dark:bg-black flex flex-col" style={{ top: "74px", paddingBottom: "64px" }}>
                <ChatView chat={activeChat} onBack={() => setActiveChat(null)} />
            </div>
        );
    }

    return (
        <div className="flex flex-col pt-2">
            <h1 className="text-black dark:text-white font-semibold text-lg px-4 mb-3">Messages</h1>

            {/* Search */}
            <div className="flex items-center gap-2 bg-[#D1D1D1] dark:bg-[#2a2a2a] rounded-xl px-3 py-2 mx-4 mb-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-transparent text-sm text-black dark:text-white outline-none w-full placeholder:text-[#888]"
                    placeholder="Search by nickname"
                />
            </div>

            {/* List */}
            <div className="flex flex-col gap-1 px-2">
                {debouncedSearch.trim().length >= 2 ? (
                    <>
                        {searchResult?.items.map((user) => (
                            <button
                                key={user.id}
                                onClick={() => handleSelectUser(user.id)}
                                className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-[#D1D1D1] dark:hover:bg-[#1a1a1a] transition-colors"
                            >
                                <div className="w-11 h-11 rounded-full bg-[#D1D1D1] dark:bg-[#2a2a2a] overflow-hidden shrink-0">
                                    {user.image && <img src={`${APP_ENV.IMAGES_100_URL}${user.image}`} className="w-full h-full object-cover" alt={user.userName ?? ""} />}
                                </div>
                                <span className="text-black dark:text-white text-sm">{user.userName}</span>
                            </button>
                        ))}
                        {searchResult?.items.length === 0 && (
                            <p className="text-[#A1A1A1] text-sm px-3">No users found</p>
                        )}
                    </>
                ) : (
                    <>
                        {chats.map((chat) => (
                            <button
                                key={chat.id}
                                onClick={() => setActiveChat(chat)}
                                className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-[#D1D1D1] dark:hover:bg-[#1a1a1a] transition-colors"
                            >
                                <div className="w-11 h-11 rounded-full bg-[#D1D1D1] dark:bg-[#2a2a2a] overflow-hidden shrink-0 flex items-center justify-center">
                                    {chat.otherUser.image
                                        ? <img src={`${APP_ENV.IMAGES_100_URL}${chat.otherUser.image}`} className="w-full h-full object-cover" alt={chat.otherUser.username} />
                                        : <span className="text-black dark:text-white text-sm font-medium">{chat.otherUser.username?.[0]?.toUpperCase() ?? "?"}</span>
                                    }
                                </div>
                                <div className="flex-1 text-left overflow-hidden">
                                    <p className="text-black dark:text-white text-sm font-medium">{chat.otherUser.username}</p>
                                    {chat.lastMessage && (
                                        <p className="text-[#888] text-xs truncate">{chat.lastMessage.content}</p>
                                    )}
                                </div>
                                {chat.unreadCount > 0 && (
                                    <span className="bg-[#1DB954] text-black text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0">
                                        {chat.unreadCount}
                                    </span>
                                )}
                            </button>
                        ))}
                        {chats.length === 0 && (
                            <p className="text-[#A1A1A1] text-sm px-3">No chats yet. Search for a user to start.</p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ChatPage;
