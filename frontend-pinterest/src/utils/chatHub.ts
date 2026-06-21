import * as signalR from "@microsoft/signalr";
import {APP_ENV} from "@/constants/env";

let connection: signalR.HubConnection | null = null;

export const getChatConnection = () => {
    if (!connection) {
        connection = new signalR.HubConnectionBuilder()
            .withUrl(`${APP_ENV.API_BASE_URL}/hubs/chat`, {
                withCredentials: true,
            })
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Warning)
            .build();
    }
    return connection;
};

export const startChatConnection = async () => {
    const conn = getChatConnection();
    if (conn.state === signalR.HubConnectionState.Disconnected) {
        await conn.start();
    }
    return conn;
};

export const stopChatConnection = async () => {
    if (connection) {
        await connection.stop();
        connection = null;
    }
};
