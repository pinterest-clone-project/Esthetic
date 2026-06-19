export interface INotification {
    id: string;
    type: "Follow" | "Like" | "Comment";
    message: string;
    isRead: boolean;
    createdAt: string;
    actorId: string | null;
    targetId: string | null;
    actorUsername: string | null;
    actorImage: string | null;
}