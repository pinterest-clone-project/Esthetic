import {api} from "@/services/api.ts";
import type { IChat } from "@/types/chat/IChat";
import type {IMessage} from "@/types/chat/IMessage.ts";
import type { IReactionGroup } from "@/types/chat/IReactionGroup.ts";
import type {RootState} from "@/store";

export const chatService = api.injectEndpoints({
    endpoints: (builder) => ({
        getChats: builder.query<IChat[], void>({
            query: () => "Chat",
            providesTags: ["Chat"],
        }),

        getOrCreateChat: builder.mutation<IChat, string>({
            query: (otherUserId) => ({ url: `Chat/with/${otherUserId}`, method: "POST" }),
            async onQueryStarted(_otherUserId, { dispatch, queryFulfilled }) {
                const { data: newChat } = await queryFulfilled;
                dispatch(
                    chatService.util.updateQueryData("getChats", undefined, (draft) => {
                        if (!draft.some((c) => c.id === newChat.id)) {
                            draft.unshift(newChat);
                        }
                    })
                );
            },
        }),

        getMessages: builder.query<IMessage[], string>({
            query: (chatId) => `Chat/${chatId}/messages`,
            providesTags: (_result, _error, chatId) => [{ type: "Message", id: chatId }],
        }),

        sendMessage: builder.mutation<IMessage, { chatId: string; content: string }>({
            query: ({ chatId, content }) => ({
                url: `Chat/${chatId}/messages`,
                method: "POST",
                body: { content },
            }),
            async onQueryStarted({ chatId, content }, { dispatch, queryFulfilled, getState }) {
                const currentUserId = (getState() as RootState).auth.user?.id;
                const tempId = `temp-${Date.now()}`;

                const patch = dispatch(
                    chatService.util.updateQueryData("getMessages", chatId, (draft) => {
                        draft.push({
                            id: tempId,
                            chatId,
                            senderId: currentUserId ?? "",
                            content,
                            sentAt: new Date().toISOString(),
                            isRead: false,
                            reactions: [],
                            myReaction: null,
                        });
                    })
                );

                try {
                    const { data: saved } = await queryFulfilled;
                    dispatch(
                        chatService.util.updateQueryData("getMessages", chatId, (draft) => {
                            const idx = draft.findIndex((m) => m.id === tempId);
                            if (idx !== -1) draft[idx] = saved;
                        })
                    );
                } catch {
                    patch.undo();
                }
            },
            invalidatesTags: ["Chat"],
        }),

        markChatAsRead: builder.mutation<void, string>({
            query: (chatId) => ({ url: `Chat/${chatId}/read`, method: "POST" }),
            invalidatesTags: ["Chat"],
        }),

        toggleReaction: builder.mutation<IReactionGroup[], { messageId: string; emoji: string }>({
            query: ({ messageId, emoji }) => ({
                url: `Chat/messages/${messageId}/reactions`,
                method: "POST",
                body: { emoji },
            }),
            async onQueryStarted({ messageId }, { dispatch, queryFulfilled, getState }) {
                try {
                    const { data: reactions } = await queryFulfilled;
                    const state = getState() as RootState;
                    const chatsData = chatService.endpoints.getChats.select()(state).data ?? [];
                    for (const chat of chatsData) {
                        dispatch(
                            chatService.util.updateQueryData("getMessages", chat.id, (draft) => {
                                const msg = draft.find((m) => m.id === messageId);
                                if (msg) msg.reactions = reactions;
                            })
                        );
                    }
                } catch {
                    // server is source of truth
                }
            },
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetChatsQuery,
    useGetOrCreateChatMutation,
    useGetMessagesQuery,
    useSendMessageMutation,
    useMarkChatAsReadMutation,
    useToggleReactionMutation,
} = chatService;
