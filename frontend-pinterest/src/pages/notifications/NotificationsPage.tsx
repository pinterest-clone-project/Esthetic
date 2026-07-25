import { useNavigate } from "react-router";
import { useGetNotificationsQuery, useMarkAllAsReadMutation } from "@/services/notificationService.ts";
import { useGetFollowRequestsQuery, useAcceptFollowRequestMutation, useDeclineFollowRequestMutation } from "@/services/followService.ts";
import { getNotificationUrl } from "@/utils/getNotificationUrl.ts";
import { formatTimeLabel } from "@/utils/formatTimeLabel.ts";
import { APP_ENV } from "@/constants/env";
import { useEffect, useState } from "react";
import Pagination from "@/components/common/Pagination.tsx";
import userIcon from "@/assets/icons/user_icon.svg";
import { useTranslation } from "react-i18next";
import { HeartIcon, CommentIcon } from "@/components/ui/Icons.tsx";

type Filter = "all" | 0 | 1 | 2 | 3 | "requests";

const NotificationsPage = () => {
    const { t, i18n } = useTranslation('common');
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const { data: notificationsData, isLoading } = useGetNotificationsQuery({ page });
    const notifications = notificationsData?.items ?? [];
    const totalPages = notificationsData?.totalPages ?? 1;

    const { data: followRequests = [] } = useGetFollowRequestsQuery();
    const [acceptRequest] = useAcceptFollowRequestMutation();
    const [declineRequest] = useDeclineFollowRequestMutation();
    const [markAllAsRead] = useMarkAllAsReadMutation();
    const [activeFilter, setActiveFilter] = useState<Filter>("all");


    const FILTERS: { label: string; value: Filter; color: string }[] = [
        { label: t('notifications.filters.all'),      value: "all",      color: "#A1A1A1" },
        { label: t('notifications.filters.follows'),  value: 0,          color: "#1DB954" },
        { label: t('notifications.filters.likes'),    value: 1,          color: "#e11d48" },
        { label: t('notifications.filters.comments'), value: 2,          color: "#f59e0b" },
        { label: t('notifications.filters.pins'),     value: 3,          color: "#8b5cf6" },
        { label: t('notifications.filters.requests'), value: "requests", color: "#3b82f6" },
    ];

    const unread = notifications.filter((n) => !n.isRead);

    useEffect(() => {
        if (unread.length > 0) markAllAsRead();
    }, []);

    const filtered = activeFilter === "all" || activeFilter === "requests"
        ? notifications
        : notifications.filter((n) => n.type === activeFilter);

    const filteredUnread = filtered.filter((n) => !n.isRead);
    const filteredRead   = filtered.filter((n) => n.isRead);

    const handleClick = (notification: (typeof notifications)[0]) => {
        const url = getNotificationUrl(notification);
        if (url) navigate(url);
    };

    const goToActor = (e: React.MouseEvent, actorId?: string | null) => {
        e.stopPropagation();
        if (actorId) navigate(`/user/${actorId}`);
    };

    const getTypeAccent = (type: number) => {
        switch (type) {
            case 0: return "#1DB954";
            case 1: return "#e11d48";
            case 2: return "#f59e0b";
            case 3: return "#8b5cf6";
            default: return "#A1A1A1";
        }
    };

    const countOf = (type: Filter) => {
        if (type === "all") return notifications.length;
        if (type === "requests") return followRequests.length;
        return notifications.filter((n) => n.type === type).length;
    };

    const renderItem = (n: (typeof notifications)[0], index: number) => {
        const url = getNotificationUrl(n);
        const isFollowRequest = n.type === 4;
        const color = getTypeAccent(n.type);

        return (
            <div
                key={n.id}
                onClick={() => handleClick(n)}
                style={{ animationDelay: `${index * 40}ms` }}
                className={`group relative flex items-start gap-3 p-4 rounded-2xl border transition-all duration-200 animate-[fadeSlideIn_0.3s_ease_forwards] opacity-0
                    ${!n.isRead
                        ? "bg-white dark:bg-[#111] border-[#e8e8e8] dark:border-[#222] shadow-sm"
                        : "bg-transparent border-transparent hover:bg-[#f9f9f9] dark:hover:bg-[#111]"
                    }
                    ${url ? "cursor-pointer" : "cursor-default"}
                `}
            >
                {!n.isRead && (
                    <div className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full" style={{ background: color }} />
                )}

                <button type="button" className="relative shrink-0 mt-0.5 cursor-pointer" onClick={(e) => goToActor(e, n.actorId)}>
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-[#e8e8e8] dark:bg-[#2a2a2a] flex items-center justify-center ring-2 ring-transparent group-hover:ring-[#1DB954]/30 transition-all duration-200">
                        {n.actorImage ? (
                            <img src={`${APP_ENV.IMAGES_100_URL}${n.actorImage}`} className="w-full h-full object-cover" alt="" />
                        ) : (
                            <img src={userIcon} className="w-5 h-5 opacity-40" alt="" />
                        )}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: isFollowRequest ? "#3b82f6" : color }}>
                        {n.type === 0 && (
                            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                                <circle cx="9" cy="7" r="4"/>
                                <line x1="19" y1="8" x2="19" y2="14"/>
                                <line x1="22" y1="11" x2="16" y2="11"/>
                            </svg>
                        )}
                        {n.type === 1 && (
                            <HeartIcon size={8} filled strokeWidth={0} className="text-black" />
                        )}
                        {n.type === 2 && (
                            <CommentIcon size={8} filled className="text-black" />
                        )}
                        {n.type === 3 && (
                            <svg width="8" height="8" viewBox="0 0 24 24" fill="black" stroke="none">
                                <path d="M12 2L3 7v10l9 5 9-5V7l-9-5z"/>
                            </svg>
                        )}
                        {n.type === 4 && (
                            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                                <rect x="3" y="11" width="18" height="11" rx="2"/>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                            </svg>
                        )}
                    </div>
                </button>

                <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                        {n.actorUsername && (
                            <span
                                className="text-sm font-semibold text-black dark:text-white hover:underline cursor-pointer leading-snug"
                                onClick={(e) => goToActor(e, n.actorId)}
                            >
                                {n.actorUsername}
                            </span>
                        )}
                        <span className="text-sm text-black/70 dark:text-white/60 leading-snug">{n.message}</span>
                    </div>
                    <p className="text-xs text-[#A1A1A1] mt-1">{formatTimeLabel(n.createdAt, t, i18n.language)}</p>
                </div>

                {!n.isRead && (
                    <span className="w-2 h-2 rounded-full shrink-0 mt-2" style={{ background: color }} />
                )}
            </div>
        );
    };

    return (
        <>
            <style>{`
                @keyframes fadeSlideIn {
                    from { opacity: 0; transform: translateY(8px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            <div className="px-4 py-6 text-black dark:text-white max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-5">
                    <h1 className="text-2xl font-bold tracking-tight">{t('notifications.title')}</h1>
                    {unread.length > 0 && (
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full text-black" style={{ background: "#1DB954" }}>
                            {t('notifications.new_count', { count: unread.length })}
                        </span>
                    )}
                </div>

                <div className="mb-6">
                    <div className="grid grid-cols-3 sm:flex sm:flex-wrap gap-2">

                    {FILTERS.map((f) => {
                        const count = countOf(f.value);
                        const isActive = activeFilter === f.value;
                        return (
                            <button
                                key={String(f.value)}
                                onClick={() => { setActiveFilter(f.value); }}
                                className="relative flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-150 border"
                                style={{
                                    background: isActive ? f.color : "transparent",
                                    color: isActive ? (f.value === "all" ? "#fff" : "#000") : "#A1A1A1",
                                    borderColor: isActive ? f.color : "#e8e8e8",
                                }}
                            >
                                {f.label}
                                {count > 0 && (
                                    <span
                                        className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                                        style={{
                                            background: isActive ? "rgba(0,0,0,0.2)" : "#f0f0f0",
                                            color: isActive ? "#fff" : "#555",
                                        }}
                                    >
                                        {count}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                    </div>
                </div>

                {activeFilter === "requests" ? (
                    followRequests.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-[#f5f5f5] dark:bg-[#1a1a1a] flex items-center justify-center">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#A1A1A1" strokeWidth="1.5">
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                                    <circle cx="9" cy="7" r="4"/>
                                    <line x1="19" y1="8" x2="19" y2="14"/>
                                    <line x1="22" y1="11" x2="16" y2="11"/>
                                </svg>
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-medium">{t('notifications.noFollowRequests')}</p>
                                <p className="text-xs text-[#A1A1A1] mt-1">{t('notifications.noFollowRequestsDesc')}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {followRequests.map((req) => (
                                <div key={req.senderId} className="flex items-center gap-3 p-4 rounded-2xl border border-[#e8e8e8] dark:border-[#222] bg-white dark:bg-[#111]">
                                    <button onClick={() => navigate(`/user/${req.senderId}`)} className="shrink-0">
                                        <div className="w-10 h-10 rounded-full overflow-hidden bg-[#e8e8e8] dark:bg-[#2a2a2a] flex items-center justify-center">
                                            {req.senderImage
                                                ? <img src={`${APP_ENV.IMAGES_100_URL}${req.senderImage}`} className="w-full h-full object-cover" alt="" />
                                                : <img src={userIcon} className="w-5 h-5 opacity-40" alt="" />
                                            }
                                        </div>
                                    </button>
                                    <div className="flex-1 min-w-0">
                                        <button onClick={() => navigate(`/user/${req.senderId}`)} className="text-sm font-semibold text-black dark:text-white hover:underline text-left">
                                            {req.senderUsername}
                                        </button>
                                        <p className="text-xs text-[#A1A1A1]">{formatTimeLabel(req.createdAt, t, i18n.language)}</p>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <button
                                            onClick={() => acceptRequest(req.senderId)}
                                            className="px-3 py-1.5 rounded-lg bg-[#1DB954] hover:bg-[#1aa34a] text-black text-xs font-semibold transition-colors"
                                        >
                                            {t('notifications.accept')}
                                        </button>
                                        <button
                                            onClick={() => declineRequest(req.senderId)}
                                            className="px-3 py-1.5 rounded-lg bg-[#f5f5f5] dark:bg-[#2a2a2a] hover:bg-[#e8e8e8] dark:hover:bg-[#333] text-black dark:text-white text-xs font-semibold transition-colors"
                                        >
                                            {t('notifications.decline')}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                ) : isLoading ? (
                    <div className="flex items-center justify-center py-24">
                        <div className="w-7 h-7 rounded-full border-2 border-black/10 dark:border-white/10 border-t-[#1DB954] animate-spin" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-[#f5f5f5] dark:bg-[#1a1a1a] flex items-center justify-center">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#A1A1A1" strokeWidth="1.5">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                            </svg>
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-medium">{t('notifications.nothingHere')}</p>
                            <p className="text-xs text-[#A1A1A1] mt-1">{t('notifications.nothingHereDesc')}</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {filteredUnread.length > 0 && (
                            <section>
                                <p className="text-[11px] font-bold uppercase tracking-widest text-[#A1A1A1] mb-3 px-1">{t('notifications.new')}</p>
                                <div className="flex flex-col gap-2">
                                    {filteredUnread.map((n, i) => renderItem(n, i))}
                                </div>
                            </section>
                        )}
                        {filteredRead.length > 0 && (
                            <section>
                                {filteredUnread.length > 0 && (
                                    <p className="text-[11px] font-bold uppercase tracking-widest text-[#A1A1A1] mb-3 px-1">{t('notifications.earlier')}</p>
                                )}
                                <div className="flex flex-col gap-2">
                                    {filteredRead.map((n, i) => renderItem(n, filteredUnread.length + i))}
                                </div>
                            </section>
                        )}
                    </div>
                )}

                {notificationsData && activeFilter !== "requests" && (
                    <Pagination
                        page={notificationsData.page}
                        totalPages={totalPages}
                        totalCount={notificationsData.totalCount}
                        onPageChange={setPage}
                    />
                )}
            </div>
        </>
    );
};

export default NotificationsPage;
