import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import {getChatConnection, startChatConnection} from "@/utils/chatHub.ts";
import type {IMessage} from "@/types/chat/IMessage.ts";
import {chatService} from "@/services/chatService.ts";
import {selectIsAuth} from "@/store/selectors/authSelectors.ts";

export const useChatRealtime = () => {
    const dispatch = useAppDispatch();
    const isAuth    = useAppSelector(selectIsAuth);

    useEffect(() => {
        if (!isAuth) return;

        let active = true;

        const setup = async () => {
            await startChatConnection();
            if (!active) return;

            const connection = getChatConnection();

            connection.on("ReceiveMessage", (message: IMessage) => {
                dispatch(
                    chatService.util.updateQueryData("getMessages", message.chatId, (draft) => {
                        if (!draft.some((m) => m.id === message.id)) {
                            draft.push(message);
                        }
                    })
                );

                dispatch(
                    chatService.util.updateQueryData("getChats", undefined, (draft) => {
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