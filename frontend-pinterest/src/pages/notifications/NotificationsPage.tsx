import { useNavigate } from "react-router";
import { useGetNotificationsQuery, useMarkAllAsReadMutation } from "@/services/notificationService.ts";
import { getNotificationUrl } from "@/utils/getNotificationUrl.ts";
import { formatTimeLabel } from "@/utils/formatTimeLabel.ts";
import { APP_ENV } from "@/constants/env";
import { useEffect } from "react";

const NotificationsPage = () => {
    const navigate = useNavigate();
    const { data: notifications = [] } = useGetNotificationsQuery();
    const [markAllAsRead] = useMarkAllAsReadMutation();

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    useEffect(() => {
        if (unreadCount > 0) markAllAsRead();
    }, []);

    const handleClick = (notification: (typeof notifications)[0]) => {
        const url = getNotificationUrl(notification);
        if (url) navigate(url);
    };

    return (
        <div className="flex flex-col px-4 py-6 gap-2 text-black dark:text-white max-w-lg mx-auto">
            <h1 className="text-xl font-bold mb-4">Notifications</h1>

            {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3 text-[#A1A1A1]">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                    </svg>
                    <p className="text-sm">Поки що порожньо</p>
                </div>
            ) : (
                <div className="flex flex-col gap-1">
                    {notifications.map((n) => {
                        const url = getNotificationUrl(n);
                        return (
                            <div
                                key={n.id}
                                onClick={() => handleClick(n)}
                                className={`flex items-start gap-3 px-4 py-3 rounded-2xl transition
                                    ${url ? "cursor-pointer hover:bg-[#f0f0f0] dark:hover:bg-[#1a1a1a]" : "cursor-default"}
                                    ${!n.isRead ? "bg-[#f5f5f5] dark:bg-[#1a1a1a]" : ""}
                                `}
                            >
                                <div className="w-10 h-10 rounded-full bg-[#d1d1d1] dark:bg-[#2a2a2a] shrink-0 overflow-hidden">
                                    {n.actorImage && (
                                        <img
                                            src={`${APP_ENV.IMAGES_100_URL}${n.actorImage}`}
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm leading-snug">{n.message}</p>
                                    <p className="text-[#A1A1A1] text-xs mt-0.5">{formatTimeLabel(n.createdAt)}</p>
                                </div>
                                {!n.isRead && (
                                    <span className="w-2 h-2 rounded-full bg-btn-primary shrink-0 mt-2" />
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default NotificationsPage;
