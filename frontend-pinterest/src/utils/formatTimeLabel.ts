import type { TFunction } from "i18next";

export const formatTimeLabel = (iso: string, t: TFunction, lang: string): string => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (mins < 1) return t('notifications.time.justNow');
    if (mins < 60) return t('notifications.time.minAgo', { count: mins });
    if (hours < 24) return t('notifications.time.hAgo', { count: hours });
    if (days === 1) return t('notifications.time.yesterday');
    return new Date(iso).toLocaleDateString(lang, { day: "2-digit", month: "short" });
};
