import * as signalR from "@microsoft/signalr";
import {APP_ENV} from "@/constants/env";

let connection: signalR.HubConnection | null = null;

export const getCommentConnection = () => {
    if (!connection) {
        connection = new signalR.HubConnectionBuilder()
            .withUrl(`${APP_ENV.API_BASE_URL}/hubs/comments`, {
                withCredentials: true,
            })
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Warning)
            .build();
    }
    return connection;
};

export const startCommentConnection = async () => {
    const conn = getCommentConnection();
    if (conn.state === signalR.HubConnectionState.Disconnected) {
        await conn.start();
    }
    return conn;
};

export const stopCommentConnection = async () => {
    if (connection) {
        await connection.stop();
        connection = null;
    }
};

export const joinPinGroup = async (pinId: string) => {
    const conn = getCommentConnection();
    if (conn.state === signalR.HubConnectionState.Connected) {
        await conn.invoke("JoinPinGroup", pinId);
    }
};

export const leavePinGroup = async (pinId: string) => {
    const conn = getCommentConnection();
    if (conn.state === signalR.HubConnectionState.Connected) {
        await conn.invoke("LeavePinGroup", pinId);
    }
};
