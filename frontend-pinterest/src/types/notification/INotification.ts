export interface INotification {
    id: string;
    type: 0 | 1 | 2 | 3 | 4; // 0=Follow, 1=Like, 2=Comment, 3=NewPin, 4=FollowRequest
    message: string;
    isRead: boolean;
    createdAt: string;
    actorId: string | null;
    targetId: string | null;
    actorUsername: string | null;
    actorImage: string | null;
}