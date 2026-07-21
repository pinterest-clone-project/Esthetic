import { useGetDeletedPinsQuery, useRestorePinMutation } from "@/services/pinService.ts";
import { useToast } from "@/components/ui/Toast/UseToast.ts";
import { APP_ENV } from "@/constants/env";
import { useTranslation } from "react-i18next";

const getDaysRemaining = (deletedAt: string) => {
    const deleted = new Date(deletedAt);
    const expiresAt = new Date(deleted.getTime() + 30 * 24 * 60 * 60 * 1000);
    const diff = expiresAt.getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

const DeletedAurasPage = () => {
    const { t } = useTranslation('pins');
    const { data: pins, isLoading } = useGetDeletedPinsQuery();
    const [restorePin] = useRestorePinMutation();
    const { showToast } = useToast();

    const handleRestore = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        try {
            await restorePin(id).unwrap();
            showToast(t('aura.restored'), "success");
        } catch {
            showToast(t('aura.restoreFailed'), "error");
        }
    };

    return (
        <div className="w-full min-h-full bg-white dark:bg-black px-6 py-8 max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-black dark:text-white text-2xl font-bold">{t('deleted.title')}</h1>
                <p className="text-gray-500 text-sm mt-1">
                    {t('deleted.subtitle')}
                </p>
            </div>

            {isLoading && (
                <div className="flex justify-center py-16">
                    <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-[#4ade80] animate-spin" />
                </div>
            )}

            {!isLoading && !pins?.length && (
                <div className="flex flex-col items-center gap-4 py-20 text-center">
                    <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                            <path d="M10 11v6M14 11v6"/>
                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                        </svg>
                    </div>
                    <p className="text-black dark:text-white font-medium">{t('deleted.empty')}</p>
                    <p className="text-gray-500 text-sm max-w-xs">{t('deleted.emptyDesc')}</p>
                </div>
            )}

            {!isLoading && !!pins?.length && (
                <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-3">
                    {pins.map((pin) => {
                        const daysLeft = pin.deletedAt ? getDaysRemaining(pin.deletedAt) : 30;
                        return (
                            <div key={pin.id} className="break-inside-avoid mb-3 group relative">
                                <div className="relative rounded-2xl overflow-hidden">
                                    <img
                                        src={`${APP_ENV.IMAGES_800_URL}${pin.image}`}
                                        alt={pin.title ?? ""}
                                        className="w-full object-cover"
                                    />
                                    {/* Overlay on hover */}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2 p-3">
                                        <button
                                            onClick={(e) => handleRestore(e, pin.id)}
                                            className="w-full px-3 py-2 bg-[#4ade80] hover:bg-[#22c55e] text-black text-xs font-semibold rounded-xl transition-colors"
                                        >
                                            {t('deleted.restore')}
                                        </button>
                                    </div>

                                    <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-semibold
                                        ${daysLeft <= 3
                                            ? "bg-red-500 text-white"
                                            : daysLeft <= 7
                                                ? "bg-orange-400 text-black"
                                                : "bg-black/60 text-white"
                                        }`}>
                                        {t('deleted.daysLeft', { count: daysLeft })}
                                    </div>
                                </div>
                                {pin.title && (
                                    <p className="text-black dark:text-white text-xs mt-1.5 px-1 truncate">{pin.title}</p>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default DeletedAurasPage;
