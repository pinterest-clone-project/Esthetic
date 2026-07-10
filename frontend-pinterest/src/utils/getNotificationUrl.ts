import type {INotification} from "@/types/notification/INotification.ts";

export const getNotificationUrl = (n: INotification): string | null => {
    switch (n.type) {
        case 0:
            return n.actorId ? `/user/${n.actorId}` : null;
        case 1:
        case 2:
            return n.targetId ? `/aura/preview/${n.targetId}` : null;
        default:
            return null;
    }
};