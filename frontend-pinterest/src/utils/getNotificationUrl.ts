import type {INotification} from "@/types/notification/INotification.ts";

export const getNotificationUrl = (n: INotification): string | null => {
    switch (n.type) {
        case "Follow":
            return n.actorId ? `/user/${n.actorId}` : null;
        case "Like":
        case "Comment":
            return n.targetId ? `/pin/${n.targetId}` : null;
        default:
            return null;
    }
};