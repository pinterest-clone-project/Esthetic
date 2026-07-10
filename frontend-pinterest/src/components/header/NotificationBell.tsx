import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router";
import {useGetNotificationsQuery, useMarkAllAsReadMutation} from "@/services/notificationService.ts";
import {getNotificationUrl} from "@/utils/getNotificationUrl.ts";
import bellIcon from "@/assets/icons/bell_icon.svg";
import {formatTimeLabel} from "@/utils/formatTimeLabel.ts";
import {APP_ENV} from "@/constants/env";

const NotificationBell: React.FC = () => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const { data: notifications = [] } = useGetNotificationsQuery();
    const [markAllAsRead] = useMarkAllAsReadMutation();

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleToggle = () => {
        const next = !open;
        setOpen(next);
        if (next && unreadCount > 0) markAllAsRead();
    };

    const handleNotificationClick = (notification: (typeof notifications)[0]) => {
        const url = getNotificationUrl(notification);
        if (url) {
            navigate(url);
            setOpen(false);
        }
    };

    return (
        <div className="relative" ref={ref}>

            <button onClick={handleToggle} className="relative flex items-center justify-center w-11 h-11 text-[#A1A1A1] hover:text-white cursor-pointer transition">
                <img src={bellIcon} className="w-[30px] h-[30px] opacity-70 hover:opacity-100" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 min-w-[18px] h-[18px] px-1 rounded-full bg-btn-primary text-[10px] font-bold text-black flex items-center justify-center">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 top-12 w-80 max-h-[420px] overflow-y-auto bg-white dark:bg-[#1a1a1a] rounded-[10px] shadow-2xl z-50 border border-[#A1A1A1] dark:border-[#535353]">
                    <div className="px-4 py-3 border-b border-[#A1A1A1] dark:border-[#535353] sticky top-0 bg-white dark:bg-[#1a1a1a]">
                        <p className="text-black dark:text-white text-sm font-medium">Сповіщення</p>
                    </div>

                    {notifications.length === 0 ? (
                        <p className="text-white/30 text-sm text-center py-10">Поки що порожньо</p>
                    ) : (
                        notifications.map((n) => {
                            const url = getNotificationUrl(n);
                            return (
                                <div
                                    key={n.id}
                                    onClick={() => handleNotificationClick(n)}
                                    className={`w-full px-4 py-3 flex items-start gap-3 transition
                                        ${url ? "cursor-pointer hover:bg-[#A1A1A1] dark:hover:bg-[#535353]" : "cursor-default"}
                                        ${!n.isRead ? "bg-white/[0.03]" : ""}
                                    `}
                                >
                                    <div
                                        className="w-8 h-8 rounded-full bg-[#2a2a2a] shrink-0 overflow-hidden cursor-pointer"
                                        onClick={(e) => { e.stopPropagation(); if (n.actorId) { navigate(`/user/${n.actorId}`); setOpen(false); } }}
                                    >
                                        {n.actorImage && (
                                            <img src={`${APP_ENV.IMAGES_100_URL}${n.actorImage}`} className="w-full h-full object-cover" />
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        {n.actorUsername && (
                                            <span
                                                className="text-black dark:text-white text-xs font-semibold cursor-pointer hover:underline"
                                                onClick={(e) => { e.stopPropagation(); if (n.actorId) { navigate(`/user/${n.actorId}`); setOpen(false); } }}
                                            >
                                                {n.actorUsername}{" "}
                                            </span>
                                        )}
                                        <p className="text-black dark:text-white text-sm leading-snug">{n.message}</p>
                                        <p className="text-black dark:text-[#A1A1A1] text-xs mt-0.5">
                                            {formatTimeLabel(n.createdAt)}
                                        </p>
                                    </div>
                                    {!n.isRead && (
                                        <span className="w-2 h-2 rounded-full bg-btn-primary shrink-0 mt-1.5" />
                                    )}
                                </div>
                            );
                        })

                    )}

                    <button
                        onClick={() => { setOpen(false); navigate("/notifications"); }}
                        className="w-full px-4 py-3 text-center text-sm text-green-700 dark:text-btn-primary cursor-pointer hover:bg-[#A1A1A1] dark:hover:bg-[#535353] transition border-t border-[#A1A1A1] dark:border-[#535353] sticky bottom-0 bg-white dark:bg-[#1a1a1a]"
                    >
                        See all
                    </button>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;