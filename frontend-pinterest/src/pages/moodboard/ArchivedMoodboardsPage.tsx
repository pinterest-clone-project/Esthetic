import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { useGetMyArchivedMoodboardsQuery, useUnarchiveMoodboardMutation } from "@/services/moodboardService.ts";
import { APP_ENV } from "@/constants/env";

const ArchivedMoodboardsPage = () => {
    const { t } = useTranslation('boards');
    const navigate = useNavigate();
    const { data: archivedMoodboards, isLoading } = useGetMyArchivedMoodboardsQuery();
    const [unarchiveMoodboard] = useUnarchiveMoodboardMutation();

    return (
        <div className="w-full min-h-full bg-white dark:bg-black px-6 py-8 max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold text-black dark:text-white mb-1">
                {t('moodboard.archiveSection')}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
                {t('moodboard.archivedDesc')}
            </p>

            {isLoading && (
                <div className="flex justify-center py-16">
                    <div className="w-8 h-8 rounded-full border-2 border-black/10 dark:border-white/10 border-t-[#1DB954] animate-spin" />
                </div>
            )}

            {!isLoading && !archivedMoodboards?.items?.length && (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-300 dark:text-gray-600">
                        <polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/>
                    </svg>
                    <p className="text-gray-400 dark:text-gray-500 text-sm">{t('moodboard.noArchivedBoards')}</p>
                </div>
            )}

            {!isLoading && !!archivedMoodboards?.items?.length && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {archivedMoodboards.items.map((mb) => (
                        <div key={mb.id} className="relative group opacity-80 hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => navigate(`/moodboard/preview/${mb.id}`)}
                                className="text-left w-full"
                            >
                                <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#D1D1D1] dark:bg-[#2a2a2a]">
                                    {mb.coverImageUrl ? (
                                        <img
                                            src={`${APP_ENV.IMAGES_1200_URL}${mb.coverImageUrl}`}
                                            alt={mb.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full" />
                                    )}
                                </div>
                                <p className="text-black dark:text-white text-sm mt-2 truncate">{mb.title}</p>
                            </button>

                            <button
                                onClick={() => unarchiveMoodboard(mb.id)}
                                className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-black/40 text-white text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60 flex items-center gap-1"
                            >
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/>
                                </svg>
                                {t('moodboard.unarchive')}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ArchivedMoodboardsPage;
