import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import bellIcon from "@/assets/icons/bell_icon.svg";

type NotificationType = "follow" | "like" | "comment" | "save";

interface AppNotification {
    id: string;
    text: string;
    isRead: boolean;
    timeLabel: string;
}


const MOCK_NOTIFICATIONS: AppNotification[] = [
    { id: "1", text: "Артур почав стежити за вами", isRead: false, timeLabel: "5 хв тому" },
    { id: "2", text: "Анастасії сподобався ваш пін", isRead: false, timeLabel: "1 год тому" },
    { id: "3", text: "Новий коментар до вашого піна", isRead: true, timeLabel: "3 год тому" },
    { id: "4", text: "Тарас зберіг ваш пін на дошку", isRead: true, timeLabel: "вчора" },
];

const NotificationBell: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState<AppNotification[]>(MOCK_NOTIFICATIONS);
    const ref = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

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
        // локально позначаємо все прочитаним при відкритті (поки без бекенду)
        if (next && unreadCount > 0) {
            setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        }
    };

    return (
        <div className="relative" ref={ref}>
            <button onClick={handleToggle} className="relative flex items-center justify-center w-11 h-11 text-[#A1A1A1] hover:text-white transition">
                <img src={bellIcon} className="w-[30px] h-[30px] opacity-70 hover:opacity-100" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 min-w-[18px] h-[18px] px-1 rounded-full bg-btn-primary text-[10px] font-bold text-black flex items-center justify-center">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 top-12 w-80 max-h-[420px] overflow-y-auto bg-[#1a1a1a] rounded-[10px] shadow-2xl z-50 border border-[#535353]">
                    <div className="px-4 py-3 border-b border-[#535353] sticky top-0 bg-[#1a1a1a]">
                        <p className="text-white text-sm font-medium">Сповіщення</p>
                    </div>

                    {notifications.length === 0 ? (
                        <p className="text-white/30 text-sm text-center py-10">Поки що порожньо</p>
                    ) : (
                        notifications.map((n) => (
                            <div
                                key={n.id}
                                className={`w-full px-4 py-3 flex items-start gap-3 hover:bg-[#535353] transition cursor-pointer ${
                                    !n.isRead ? "bg-white/[0.03]" : ""
                                }`}
                            >
                                <div className="w-8 h-8 rounded-full bg-[#2a2a2a] shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-white text-sm leading-snug">{n.text}</p>
                                    <p className="text-[#A1A1A1] text-xs mt-0.5">{n.timeLabel}</p>
                                </div>
                                {!n.isRead && <span className="w-2 h-2 rounded-full bg-btn-primary shrink-0 mt-1.5" />}
                            </div>
                        ))
                    )}

                    <button
                        onClick={() => {
                            setOpen(false);
                            navigate("/notifications");
                        }}
                        className="w-full px-4 py-3 text-center text-sm text-btn-primary hover:bg-[#535353] transition border-t border-[#535353] sticky bottom-0 bg-[#1a1a1a]"
                    >
                        See all
                    </button>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;