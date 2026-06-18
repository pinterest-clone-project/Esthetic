import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import {getChatConnection, startChatConnection} from "@/utils/chatHub.ts";
import type {IMessage} from "@/types/chat/IMessage.ts";

export const useChatRealtime = () => {
    const dispatch = useAppDispatch();
    const isAuth = useAppSelector((s) => s.auth.isAuth);

    useEffect(() => {
        if (!isAuth) return;

        let active = true;

        const setup = async () => {
            await startChatConnection();
            if (!active) return;

            const connection = getChatConnection();

            connection.on("ReceiveMessage", (message: IMessage) => {
                dispatch(
                    chatApi.util.updateQueryData("getMessages", message.chatId, (draft) => {
                        if (!draft.some((m) => m.id === message.id)) {
                            draft.push(message);
                        }
                    })
                );

                dispatch(
                    chatApi.util.updateQueryData("getChats", undefined, (draft) => {
                        const chat = draft.find((c) => c.id === message.chatId);
                        if (chat) {
                            chat.lastMessage = message;
                            chat.unreadCount += 1;
                        }
                    })
                );
            });
        };

        setup();

        return () => {
            active = false;
            getChatConnection().off("ReceiveMessage");
        };
    }, [isAuth, dispatch]);
};