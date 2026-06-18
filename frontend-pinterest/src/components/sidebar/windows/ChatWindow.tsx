import type {IChat} from "@/types/chat/IChat.ts";
import {useAppSelector} from "@/store";
import {useGetMessagesQuery, useMarkChatAsReadMutation, useSendMessageMutation} from "@/services/chatService.ts";
import {useEffect, useRef, useState} from "react";
import Modal from "@/components/UI/Modal.tsx";

interface ChatWindowProps {
    chat: IChat;
    onClose: () => void;
}

const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" });

const ChatWindow = ({ chat, onClose }: ChatWindowProps) => {
    const currentUserId = useAppSelector((s) => s.auth.user?.id);
    const { data: messages = [] } = useGetMessagesQuery(chat.id);
    const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
    const [markAsRead] = useMarkChatAsReadMutation();
    const [text, setText] = useState("");
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages.length]);

    useEffect(() => {
        if (chat.unreadCount > 0) markAsRead(chat.id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chat.id]);

    const handleSend = () => {
        const content = text.trim();
        if (!content || isSending) return;
        sendMessage({ chatId: chat.id, content });
        setText("");
    };

    return (
        <Modal isOpen onClose={onClose} variant="sidebar" title={chat.otherUser.username} width={300}>
            <div className="flex flex-col h-[500px]">
                <div className="flex-1 overflow-y-auto px-3 py-2 flex flex-col gap-2">
                    {messages.map((m) => {
                        const isOwn = m.senderId === currentUserId;
                        return (
                            <div key={m.id} className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}>
                                <div
                                    className={`max-w-[80%] px-3 py-2 rounded-xl text-sm whitespace-pre-wrap break-words ${
                                        isOwn ? "bg-[#1DB954] text-black" : "bg-[#2a2a2a] text-white"
                                    }`}
                                >
                                    {m.content}
                                </div>
                                <span className="text-[10px] text-[#A1A1A1] mt-0.5">{formatTime(m.sentAt)}</span>
                            </div>
                        );
                    })}
                    <div ref={bottomRef} />
                </div>

                <div className="flex items-center gap-2 p-3 border-t border-white/10">
                    <input
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        placeholder="Повідомлення"
                        className="flex-1 bg-[#2a2a2a] rounded-full px-4 py-2 text-sm text-white outline-none placeholder:text-[#A1A1A1]"
                    />
                </div>
            </div>
        </Modal>
    );
};

export default ChatWindow;