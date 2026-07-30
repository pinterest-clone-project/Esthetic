import type {IChat} from "@/types/chat/IChat.ts";
import {useAppSelector} from "@/store";
import {useGetChatsQuery, useGetMessagesQuery, useMarkChatAsReadMutation, useSendMessageMutation, useToggleReactionMutation} from "@/services/chatService.ts";
import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router";
import Modal from "@/components/ui/Modal.tsx";
import {APP_ENV} from "@/constants/env";
import {useTranslation} from "react-i18next";
import { CloseIcon } from "@/components/ui/Icons.tsx";
import { ReactionPicker } from "@/components/chat/ReactionPicker.tsx";
import { MessageReactionBar } from "@/components/chat/MessageReactionBar.tsx";

interface ChatWindowProps {
    chat: IChat;
    onClose: () => void;
}

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

const getDateKey = (iso: string) => new Date(iso).toDateString();

const ChatWindow = ({ chat, onClose }: ChatWindowProps) => {
    const { t, i18n } = useTranslation('common');
    const currentUserId = useAppSelector((s) => s.auth.user?.id);
    const { data: messages = [] } = useGetMessagesQuery(chat.id);
    const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
    const [markAsRead] = useMarkChatAsReadMutation();
    const [toggleReaction] = useToggleReactionMutation();
    const [picker, setPicker] = useState<{ id: string; el: HTMLElement } | null>(null);
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
        if (unreadCount > 0) {
            markAsRead(chat.id);
        }
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
        <Modal isOpen onClose={onClose} variant="sidebar" width={300} disableInnerScroll>
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10 shrink-0">
                <button
                    onClick={() => navigate(`/user/${chat.otherUser.id}`)}
                    className="flex items-center gap-3 flex-1 hover:opacity-80 transition-opacity min-w-0"
                >
                    <div className="w-8 h-8 rounded-full bg-[#2a2a2a] overflow-hidden shrink-0 flex items-center justify-center">
                        {chat.otherUser.image
                            ? <img src={`${APP_ENV.IMAGES_100_URL}${chat.otherUser.image}`} className="w-full h-full object-cover" alt={chat.otherUser.username} />
                            : <span className="text-white text-xs font-medium">{avatarLetter}</span>
                        }
                    </div>
                    <span className="text-black dark:text-white text-sm font-medium truncate">{chat.otherUser.username}</span>
                </button>
                <button
                    onClick={onClose}
                    className="w-7 h-7 flex items-center justify-center rounded-full bg-[#D1D1D1] dark:bg-[#2a2a2a] hover:bg-[#3a3a3a] transition-colors"
                >
                    <CloseIcon className="text-white" />
                </button>
            </div>

            <div
                className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2 min-h-0"
                style={{ scrollbarWidth: "none" }}
            >
                {messages.map((m, i) => {
                    const isOwn = m.senderId === currentUserId;
                    const showDateSeparator = i === 0 || getDateKey(m.sentAt) !== getDateKey(messages[i - 1].sentAt);
                    return (
                        <div key={m.id}>
                            {showDateSeparator && (
                                <div className="flex items-center gap-2 my-2">
                                    <div className="flex-1 h-px bg-black/10 dark:bg-white/10" />
                                    <span className="text-[11px] text-black/40 dark:text-white/40 shrink-0">
                                        {formatDateSeparator(m.sentAt, i18n.language, t)}
                                    </span>
                                    <div className="flex-1 h-px bg-black/10 dark:bg-white/10" />
                                </div>
                            )}
                            <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                                <div className="relative group max-w-[75%]">
                                    <button
                                        onClick={(e) => setPicker(picker?.id === m.id ? null : { id: m.id, el: e.currentTarget })}
                                        className={`absolute top-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 w-6 h-6 flex items-center justify-center rounded-full bg-white dark:bg-[#1e1e1e] border border-[#e5e5e5] dark:border-[#333] text-sm ${isOwn ? "-left-7" : "-right-7"}`}
                                    >
                                        😊
                                    </button>

                                    {picker?.id === m.id && (
                                        <ReactionPicker
                                            anchorEl={picker.el}
                                            isOwn={isOwn}
                                            onSelect={(emoji) => toggleReaction({ messageId: m.id, emoji })}
                                            onClose={() => setPicker(null)}
                                        />
                                    )}

                                    <div
                                        className={`px-3 pt-2 pb-1 text-sm whitespace-pre-wrap break-words flex flex-col ${
                                            isOwn
                                                ? "bg-[#1DB954] text-black rounded-[18px] rounded-br-[4px]"
                                                : "bg-[#2a2a2a] text-white rounded-[18px] rounded-bl-[4px]"
                                        }`}
                                    >
                                        <span>{m.content}</span>
                                        <span className={`text-[10px] mt-0.5 self-end ${isOwn ? "text-black/50" : "text-white/40"}`}>
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

            <div className="px-3 py-3 border-t border-white/10 shrink-0">
                <div className="flex items-center gap-2 bg-[#D1D1D1] dark:bg-[#1e1e1e] rounded-full px-4 py-2 border border-white/10">
                    <input
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                        placeholder={t('chat.messagePlaceholder')}
                        className="flex-1 min-w-0 bg-transparent text-sm text-black dark:text-white outline-none placeholder:text-[#555] overflow-x-auto"
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
        </Modal>
    );
};

export default ChatWindow;