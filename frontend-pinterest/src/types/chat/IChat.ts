import type {IUserShort} from "@/types/user/IUserShort.ts";
import type {IMessage} from "@/types/chat/IMessage.ts";

export interface IChat {
    id: string;
    otherUser: IUserShort;
    lastMessage: IMessage | null;
    unreadCount: number;
    createdAt: string;
}