import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useAppSelector } from "@/store";
import {
    useGetChatsQuery,
    useGetMessagesQuery,
    useGetOrCreateChatMutation,
    useMarkChatAsReadMutation,
    useSendMessageMutation,
    useToggleReactionMutation,
} from "@/services/chatService";
import { useSearchUsersQuery } from "@/services/userService";
import { APP_ENV } from "@/constants/env";
import type { IChat } from "@/types/chat/IChat";
import { useTranslation } from "react-i18next";
import { ReactionPicker } from "@/components/chat/ReactionPicker.tsx";
import { MessageReactionBar } from "@/components/chat/MessageReactionBar.tsx";

const formatTime = (iso: string, lang: string) =>
    new Date(iso).toLocaleTimeString(lang, { hour: "2-digit", minute: "2-digit" });

const formatDateSeparator = (iso: string, lang: string, t: (key: string) => string) => {
    const date = new Date(iso);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return t('chat.today');
    if (date.toDateString() === yesterday.toDateString()) return t('chat.yesterday');
    return date.toLocaleDateString(lang, { day: "numeric", month: "long", year: "numeric" });
};

const isSameDay = (a: string, b: string) =>
    new Date(a).toDateString() === new Date(b).toDateString();

const formatLastMessageTime = (iso: string, lang: string) => {
    const date = new Date(iso);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString())
        return date.toLocaleTimeString(lang, { hour: "2-digit", minute: "2-digit" });
    if (date.toDateString() === yesterday.toDateString())
        return date.toLocaleDateString(lang, { weekday: "short" });
    return date.toLocaleDateString(lang, { day: "numeric", month: "short" });
};


const ChatView = ({ chat, onBack }: { chat: IChat; onBack: () => void }) => {
    const { t, i18n } = useTranslation('common');
    const currentUserId = useAppSelector((s) => s.auth.user?.id);
    const { data: messages = [] } = useGetMessagesQuery(chat.id);
    const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
    const [markAsRead] = useMarkChatAsReadMutation();
    const [toggleReaction] = useToggleReactionMutation();
    const [pickerMessageId, setPickerMessageId] = useState<string | null>(null);
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

    const navigate = useNavigate();
    const avatarLetter = chat.otherUser.username?.[0]?.toUpperCase() ?? "?";

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[#A2A2A2] dark:border-[#535353] shrink-0">
                <button
                    onClick={onBack}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#D1D1D1] dark:hover:bg-[#2a2a2a] transition-colors"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-black dark:text-white">
                        <path d="M15 18l-6-6 6-6"/>
                    </svg>
                </button>
                <button
                    onClick={() => navigate(`/user/${chat.otherUser.id}`)}
                    className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                >
                    <div className="w-9 h-9 rounded-full bg-[#2a2a2a] overflow-hidden shrink-0 flex items-center justify-center">
                        {chat.otherUser.image
                            ? <img src={`${APP_ENV.IMAGES_100_URL}${chat.otherUser.image}`} className="w-full h-full object-cover" alt={chat.otherUser.username} />
                            : <span className="text-white text-sm font-medium">{avatarLetter}</span>
                        }
                    </div>
                    <span className="text-black dark:text-white font-medium text-sm">{chat.otherUser.username}</span>
                </button>
            </div>


            <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2" style={{ scrollbarWidth: "none" }}>
                {messages.map((m, i) => {
                    const isOwn = m.senderId === currentUserId;
                    const showDateSeparator = i === 0 || !isSameDay(messages[i - 1].sentAt, m.sentAt);
                    return (
                        <div key={m.id}>
                            {showDateSeparator && (
                                <div className="flex items-center gap-2 my-2">
                                    <div className="flex-1 h-px bg-[#A2A2A2]/30 dark:bg-[#535353]/50" />
                                    <span className="text-[11px] text-[#A1A1A1] shrink-0">
                                        {formatDateSeparator(m.sentAt, i18n.language, t)}
                                    </span>
                                    <div className="flex-1 h-px bg-[#A2A2A2]/30 dark:bg-[#535353]/50" />
                                </div>
                            )}
                            <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                                <div className="relative group max-w-[75%]">
                                    <button
                                        onClick={() => setPickerMessageId(pickerMessageId === m.id ? null : m.id)}
                                        className={`absolute top-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 w-6 h-6 flex items-center justify-center rounded-full bg-white dark:bg-[#1e1e1e] border border-[#e5e5e5] dark:border-[#333] text-sm ${isOwn ? "-left-7" : "-right-7"}`}
                                    >
                                        😊
                                    </button>

                                    {pickerMessageId === m.id && (
                                        <ReactionPicker
                                            isOwn={isOwn}
                                            onSelect={(emoji) => toggleReaction({ messageId: m.id, emoji })}
                                            onClose={() => setPickerMessageId(null)}
                                        />
                                    )}

                                    <div className={`px-3 pt-2 pb-1 text-sm whitespace-pre-wrap break-words flex flex-col ${
                                        isOwn
                                            ? "bg-[#1DB954] text-black rounded-[18px] rounded-br-[4px]"
                                            : "bg-[#e5e5e5] dark:bg-[#2a2a2a] text-black dark:text-white rounded-[18px] rounded-bl-[4px]"
                                    }`}>
                                        <span>{m.content}</span>
                                        <span className={`text-[10px] mt-0.5 self-end ${isOwn ? "text-black/50" : "text-black/40 dark:text-white/40"}`}>
                                            {formatTime(m.sentAt, i18n.language)}
                                        </span>
                                    </div>

                                    <MessageReactionBar
                                        reactions={m.reactions ?? []}
                                        currentUserEmoji={m.myReaction ?? null}
                                        onToggle={(emoji) => toggleReaction({ messageId: m.id, emoji })}
                                        isOwn={isOwn}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={bottomRef} />
            </div>

            <div className="px-3 py-3 border-t border-[#A2A2A2] dark:border-[#535353] shrink-0">
                <div className="flex items-center gap-2 bg-[#D1D1D1] dark:bg-[#1e1e1e] rounded-full px-4 py-2">
                    <input
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                        placeholder={t('chat.messagePlaceholder')}
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


const ChatPage = () => {
    const { t, i18n } = useTranslation('common');
    const navigate = useNavigate();
    const [activeChat, setActiveChat] = useState<IChat | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const currentUserId = useAppSelector((s) => s.auth.user?.id);
    const { data: chats = [] } = useGetChatsQuery();
    const { data: searchResult } = useSearchUsersQuery(
        { search: debouncedSearch, pageSize: 10 },
        { skip: debouncedSearch.trim().length < 2 }
    );
    const filteredSearchItems = searchResult?.items.filter((u) => u.id !== currentUserId) ?? [];
    const [getOrCreateChat] = useGetOrCreateChatMutation();

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
            <h1 className="text-black dark:text-white font-semibold text-lg px-4 mb-3">{t('chat.title')}</h1>

            <div className="flex items-center gap-2 bg-[#D1D1D1] dark:bg-[#2a2a2a] rounded-xl px-3 py-2 mx-4 mb-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-transparent text-sm text-black dark:text-white outline-none w-full placeholder:text-[#888]"
                    placeholder={t('chat.searchPlaceholder')}
                />
            </div>

            <div className="flex flex-col gap-1 px-2">
                {debouncedSearch.trim().length >= 2 ? (
                    <>
                        {filteredSearchItems.map((user) => (
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
                        {filteredSearchItems.length === 0 && (
                            <p className="text-[#A1A1A1] text-sm px-3">{t('chat.noUsersFound')}</p>
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
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="text-black dark:text-white text-sm font-medium">{chat.otherUser.username}</p>
                                        {chat.lastMessage && (
                                            <span className="text-[#888] text-[11px] shrink-0">
                                                {formatLastMessageTime(chat.lastMessage.sentAt, i18n.language)}
                                            </span>
                                        )}
                                    </div>
                                    {chat.lastMessage && (
                                        <p className="text-[#888] text-xs truncate">{chat.lastMessage.content}</p>
                                    )}
                                </div>
                                {chat.unreadCount > 0 && (
                                    <span className="bg-[#1DB954] text-black text-[10px] font-bold rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center shrink-0">
                                        {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
                                    </span>
                                )}
                            </button>
                        ))}
                        {chats.length === 0 && (
                            <p className="text-[#A1A1A1] text-sm px-3">{t('chat.noChats')}</p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ChatPage;
