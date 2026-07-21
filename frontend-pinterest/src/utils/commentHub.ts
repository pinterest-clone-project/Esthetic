import * as signalR from "@microsoft/signalr";
import {APP_ENV} from "@/constants/env";

let connection: signalR.HubConnection | null = null;
let startPromise: Promise<signalR.HubConnection> | null = null;
const subscribedPins = new Map<string, number>();

export const getCommentConnection = () => {
    if (!connection) {
        connection = new signalR.HubConnectionBuilder()
            .withUrl(`${APP_ENV.API_BASE_URL}/hubs/comments`, {
                withCredentials: true,
            })
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Warning)
            .build();

        connection.onreconnected(async () => {
            await Promise.all(
                [...subscribedPins.keys()].map((pinId) =>
                    connection!.invoke("JoinPinGroup", pinId)
                )
            );
        });
    }
    return connection;
};

export const startCommentConnection = async () => {
    const conn = getCommentConnection();
    if (conn.state === signalR.HubConnectionState.Connected) {
        return conn;
    }

    if (!startPromise && conn.state === signalR.HubConnectionState.Disconnected) {
        startPromise = conn.start()
            .then(() => conn)
            .finally(() => {
                startPromise = null;
            });
    }

    if (startPromise) {
        return startPromise;
    }

    return conn;
};

export const stopCommentConnection = async () => {
    if (connection) {
        await connection.stop();
        connection = null;
        startPromise = null;
        subscribedPins.clear();
    }
};

export const subscribeToPin = async (pinId: string) => {
    subscribedPins.set(pinId, (subscribedPins.get(pinId) ?? 0) + 1);

    const conn = await startCommentConnection();
    if (conn.state === signalR.HubConnectionState.Connected) {
        await conn.invoke("JoinPinGroup", pinId);
    }
};

export const unsubscribeFromPin = async (pinId: string) => {
    const subscriptionCount = subscribedPins.get(pinId) ?? 0;
    if (subscriptionCount > 1) {
        subscribedPins.set(pinId, subscriptionCount - 1);
        return;
    }

    subscribedPins.delete(pinId);
    const conn = getCommentConnection();
    if (conn.state === signalR.HubConnectionState.Connected) {
        await conn.invoke("LeavePinGroup", pinId);
    }
};
