export const formatTimeLabel = (iso: string): string => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (mins < 1) return "щойно";
    if (mins < 60) return `${mins} хв тому`;
    if (hours < 24) return `${hours} год тому`;
    if (days === 1) return "вчора";
    return new Date(iso).toLocaleDateString("uk-UA", { day: "2-digit", month: "short" });
};