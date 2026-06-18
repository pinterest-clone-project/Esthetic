export interface IMessage {
    id: string;
    chatId: string;
    senderId: string;
    content: string;
    sentAt: string;
    isRead: boolean;
}