import type { IReactionGroup } from './IReactionGroup';

export interface IMessage {
    id: string;
    chatId: string;
    senderId: string;
    content: string;
    sentAt: string;
    isRead: boolean;
    reactions: IReactionGroup[];
    myReaction: string | null;
}
