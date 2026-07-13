import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router";
import {useGetNotificationsQuery, useMarkAllAsReadMutation} from "@/services/notificationService.ts";
import {useAcceptFollowRequestMutation, useDeclineFollowRequestMutation} from "@/services/followService.ts";
import {getNotificationUrl} from "@/utils/getNotificationUrl.ts";
import bellIcon from "@/assets/icons/bell_icon.svg";
import {formatTimeLabel} from "@/utils/formatTimeLabel.ts";
import {APP_ENV} from "@/constants/env";

const NotificationBell: React.FC = () => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const { data: notificationsData } = useGetNotificationsQuery({});
    const notifications = notificationsData?.items ?? [];
    const [markAllAsRead] = useMarkAllAsReadMutation();
    const [acceptRequest] = useAcceptFollowRequestMutation();
    const [declineRequest] = useDeclineFollowRequestMutation();

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
                    <div className="px-4 py-3 border-b border-[#A1A1A1] dark:border-[#535353] sticky top-0 z-10 bg-white dark:bg-[#1a1a1a]">
                        <p className="text-black dark:text-white text-sm font-medium">Сповіщення</p>
                    </div>

                    {notifications.length === 0 ? (
                        <p className="text-white/30 text-sm text-center py-10">Поки що порожньо</p>
                    ) : (
                        notifications.map((n) => {
                            const url = getNotificationUrl(n);
                            const isFollowRequest = n.type === 4;
                            const accentColor = n.type === 0 ? "#1DB954" : n.type === 1 ? "#e11d48" : n.type === 2 ? "#f59e0b" : n.type === 3 ? "#8b5cf6" : n.type === 4 ? "#3b82f6" : "#A1A1A1";

                            return (
                                <div
                                    key={n.id}
                                    onClick={() => !isFollowRequest && handleNotificationClick(n)}
                                    className={`w-full px-4 py-3 flex items-start gap-3 transition
                                        ${!isFollowRequest && url ? "cursor-pointer hover:bg-[#A1A1A1] dark:hover:bg-[#535353]" : "cursor-default"}
                                        ${!n.isRead ? "bg-white/[0.03]" : ""}
                                    `}
                                >
                                    <div
                                        className="relative shrink-0 cursor-pointer"
                                        onClick={(e) => { e.stopPropagation(); if (n.actorId) { navigate(`/user/${n.actorId}`); setOpen(false); } }}
                                    >
                                        <div className="w-8 h-8 rounded-full bg-[#2a2a2a] overflow-hidden">
                                            {n.actorImage && (
                                                <img src={`${APP_ENV.IMAGES_100_URL}${n.actorImage}`} className="w-full h-full object-cover" />
                                            )}
                                        </div>
                                        <div
                                            className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center"
                                            style={{ background: accentColor }}
                                        >
                                            {n.type === 0 && (
                                                <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3">
                                                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                                                    <circle cx="9" cy="7" r="4"/>
                                                    <line x1="19" y1="8" x2="19" y2="14"/>
                                                    <line x1="22" y1="11" x2="16" y2="11"/>
                                                </svg>
                                            )}
                                            {n.type === 1 && (
                                                <svg width="7" height="7" viewBox="0 0 24 24" fill="black" stroke="none">
                                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                                                </svg>
                                            )}
                                            {n.type === 2 && (
                                                <svg width="7" height="7" viewBox="0 0 24 24" fill="black" stroke="none">
                                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                                                </svg>
                                            )}
                                            {n.type === 3 && (
                                                <svg width="7" height="7" viewBox="0 0 24 24" fill="black" stroke="none">
                                                    <path d="M12 2L3 7v10l9 5 9-5V7l-9-5z"/>
                                                </svg>
                                            )}
                                            {n.type === 4 && (
                                                <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                                                    <rect x="3" y="11" width="18" height="11" rx="2"/>
                                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                                </svg>
                                            )}
                                        </div>
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
                                        {isFollowRequest && n.actorId && (
                                            <div className="flex gap-2 mt-2" onClick={(e) => e.stopPropagation()}>
                                                <button
                                                    onClick={() => { acceptRequest(n.actorId!); }}
                                                    className="px-3 py-1 rounded-lg bg-[#1DB954] hover:bg-[#1aa34a] text-black text-[11px] font-semibold transition-colors"
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => { declineRequest(n.actorId!); }}
                                                    className="px-3 py-1 rounded-lg bg-[#2a2a2a] hover:bg-[#333] text-white text-[11px] font-semibold transition-colors"
                                                >
                                                    Decline
                                                </button>
                                            </div>
                                        )}
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