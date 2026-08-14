import type { IReactionGroup } from "@/types/chat/IReactionGroup";

export interface IComment {
    id: string;
    userId: string;
    pinId: string;
    text: string;
    createdAt: string;
    username?: string;
    userImage?: string;
    parentCommentId?: string;
    replies?: IComment[];
    reactions: IReactionGroup[];
    myReaction: string | null;
}
