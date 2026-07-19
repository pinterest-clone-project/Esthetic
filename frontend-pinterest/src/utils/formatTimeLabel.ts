export const formatTimeLabel = (iso: string): string => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (mins < 1) return "just now";
    if (mins < 60) return `${mins} min ago`;
    if (hours < 24) return `${hours} h ago`;
    if (days === 1) return "yesterday";
    return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
};