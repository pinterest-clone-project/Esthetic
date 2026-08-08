import { useState } from "react";
import { useTranslation } from "react-i18next";
import im1 from "@/assets/defaults/def-9.jpg";
import im2 from "@/assets/defaults/def-10.jpg";
import im3 from "@/assets/defaults/def-11.jpg";
import { useGetAllPinsQuery, useGetMyPinsQuery, useGetSavedPinsQuery } from "@/services/pinService.ts";
import { useLocation, useNavigate } from "react-router";
import {
    useGetMyMoodboardsQuery,
    useGetMyArchivedMoodboardsQuery,
    useArchiveMoodboardMutation,
    useUnarchiveMoodboardMutation,
} from "@/services/moodboardService.ts";
import CreateMoodboardForm from "@/components/moodboard/CreateMoodboardForm.tsx";
import { APP_ENV } from "@/constants/env";
import PinCard from "@/components/ui/PinCard.tsx";
import Modal from "@/components/ui/Modal.tsx";

type CollectionTab = "Aura" | "Moodboard";

const CollectionsPage = () => {
    const { t } = useTranslation('common');
    const { t: tb } = useTranslation('boards');
    const navigate = useNavigate();

    const tabs: CollectionTab[] = ["Aura", "Moodboard"];
    const tabLabels: Record<CollectionTab, string> = {
        "Aura": t('collections.tabAura'),
        "Moodboard": t('collections.tabMoodboard')
    };

    const [showCreateMoodboard, setShowCreateMoodboard] = useState(false);
    const [archiveSectionOpen, setArchiveSectionOpen] = useState(false);

    const { data: myPins } = useGetMyPinsQuery();
    const { data: Pins } = useGetAllPinsQuery();
    const { data: moodboards } = useGetMyMoodboardsQuery();
    const { data: savedPins } = useGetSavedPinsQuery();
    const { data: archivedMoodboards } = useGetMyArchivedMoodboardsQuery();

    const [archiveMoodboard] = useArchiveMoodboardMutation();
    const [unarchiveMoodboard] = useUnarchiveMoodboardMutation();

    const location = useLocation();
    const activeTab: CollectionTab = location.pathname.includes("moodboard")
        ? "Moodboard"
        : "Aura";

    const hasAuras = activeTab === "Aura" && ((myPins && myPins.length > 0) || (savedPins && savedPins.length > 0));

    const tabRoutes: Record<CollectionTab, string> = {
        "Aura": "/collections/aura",
        "Moodboard": "/collections/moodboard",
    };

    const handleArchive = async (id: string) => {
        await archiveMoodboard(id);
    };

    const handleUnarchive = async (id: string) => {
        await unarchiveMoodboard(id);
    };

    const MoodboardCard = ({ mb, isArchived = false }: { mb: { id: string; title: string; coverImageUrl: string | null }; isArchived?: boolean }) => (
        <div className={`relative group ${isArchived ? "opacity-60" : ""}`}>
            <button
                onClick={() => navigate(`/moodboard/preview/${mb.id}`)}
                className="text-left w-full"
            >
                <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#D1D1D1] dark:bg-[#2a2a2a] transition-transform duration-300 group-hover:scale-105 group-hover:shadow-2xl">
                    {mb.coverImageUrl ? (
                        <img
                            src={`${APP_ENV.IMAGES_1200_URL}${mb.coverImageUrl}`}
                            alt={mb.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                    ) : (
                        <div className="w-full h-full" />
                    )}
                </div>
                <p className="text-black dark:text-white text-sm mt-2 truncate group-hover:text-[#1DB954] transition-colors duration-200">
                    {mb.title}
                </p>
            </button>

            <button
                onClick={(e) => { e.stopPropagation(); if (isArchived) handleUnarchive(mb.id); else handleArchive(mb.id); }}
                title={isArchived ? tb('moodboard.unarchive') : tb('moodboard.archive')}
                className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/40 text-white text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
            >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/>
                </svg>
                {isArchived ? tb('moodboard.unarchive') : tb('moodboard.archive')}
            </button>
        </div>
    );

    return (
        <div className="min-h-screen mt-4 sm:mt-11 text-black dark:text-white px-4 sm:px-8 py-6 sm:py-10">
            <div className="flex flex-col items-center mb-6 gap-3">
                <div className="relative flex items-center justify-center w-full">
                    <h1 className="text-2xl sm:text-4xl">{t('collections.title')}</h1>
                    <button
                        onClick={() => {
                            if (activeTab === "Moodboard") setShowCreateMoodboard(true);
                            if (activeTab === "Aura") navigate("/aura/create");
                        }}
                        className="hidden md:block absolute right-0 px-5 py-2 rounded-lg bg-[#A2A2A2] dark:bg-[#535353] text-black dark:text-white text-sm hover:bg-[#D1D1D1] dark:hover:bg-[#A2A2A2] transition-colors duration-150"
                    >
                        {t('collections.create')}
                    </button>
                </div>
                <div className="flex items-center justify-center w-full">
                    <div className="flex items-center gap-4">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => navigate(tabRoutes[tab])}
                                className={`text-sm transition-colors duration-150 ${
                                    activeTab === tab
                                        ? "text-btn-primary border-b border-btn-primary pb-0.5"
                                        : "text-black dark:text-white/50 hover:text-[#A2A2A2] dark:hover:text-white/80"
                                }`}
                            >
                                {tabLabels[tab]}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {activeTab === "Aura" &&
                (hasAuras ? (
                    <div className="mt-8">
                        <h2 className="text-lg mb-3">{t('collections.yourCreatedAuras')}</h2>
                        <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-3 mt-4">
                            {myPins!.map((pin) => (
                                <div key={pin.id} className="break-inside-avoid mb-3">
                                    <PinCard pin={pin} />
                                </div>
                            ))}
                            <button
                                onClick={() => navigate("/aura/create")}
                                className="relative w-full aspect-[3/4] rounded-xl overflow-hidden hover:opacity-90 transition-opacity break-inside-avoid mb-3 bg-[#2a2a2a]"
                            >
                                <span className="absolute inset-0 flex items-center justify-center text-white text-lg font-medium">
                                    {t('collections.create')}
                                </span>
                            </button>
                        </div>

                        <h2 className="text-lg mt-8 mb-3">{t('collections.yourSavedAuras')}</h2>
                        {savedPins && savedPins.length > 0 ? (
                            <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-3 mt-4">
                                {savedPins.map((pin) => (
                                    <div key={pin.id} className="break-inside-avoid mb-3">
                                        <PinCard pin={pin} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-[#A1A1A1] dark:text-white/30 text-sm text-center py-8 border border-black/10 dark:border-white/10 rounded-xl">
                                {t('collections.noSavedAuras')}
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center mt-16 gap-6">
                        <div className="relative w-[280px] h-[200px] sm:w-[320px] sm:h-[240px]">
                            <img src={im1} className="absolute top-[35px] left-0 w-[120px] h-[130px] sm:w-[140px] sm:h-[150px] object-cover rounded-xl" alt="" />
                            <img src={im2} className="absolute top-0 left-[80px] w-[130px] h-[140px] sm:w-[150px] sm:h-[160px] object-cover rounded-xl" alt="" />
                            <img src={im3} className="absolute top-[60px] left-[160px] w-[120px] h-[140px] sm:w-[140px] sm:h-[160px] object-cover rounded-xl" alt="" />
                        </div>
                        <div className="text-center mt-4">
                            <h2 className="text-2xl font-medium mb-3">{t('collections.combineIdeas')}</h2>
                            <p className="text-[#A1A1A1] dark:text-white/40 text-sm max-w-[340px] leading-relaxed">
                                {t('collections.auraDesc')}
                            </p>
                        </div>
                        <button
                            onClick={() => navigate("/aura/create")}
                            className="px-6 py-2 rounded-lg border border-black/20 dark:border-white/20 text-black dark:text-white text-sm hover:bg-[#D1D1D1] dark:hover:bg-[#1a1a1a] transition-colors duration-150"
                        >
                            {t('collections.createAura')}
                        </button>
                    </div>
                ))}

            {activeTab === "Moodboard" && (
                <div className="mt-8">
                    <h2 className="text-lg mb-3">{t('collections.yourMoodboard')}</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-10">
                        {moodboards?.items?.map((mb) => (
                            <MoodboardCard key={mb.id} mb={mb} />
                        ))}

                        <button
                            onClick={() => setShowCreateMoodboard(true)}
                            className="relative w-full aspect-[4/3] rounded-xl overflow-hidden hover:opacity-90 transition-opacity"
                        >
                            <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
                                <div className="bg-[#A1A1A1] dark:bg-[#535353]" />
                                <div className="bg-[#D1D1D1] dark:bg-[#A1A1A1]" />
                                <div className="bg-[#A1A1A1] dark:bg-[#535353]" />
                                <div className="bg-[#A9A9A9] dark:bg-[#454444]" />
                            </div>
                            <span className="absolute inset-0 flex items-center justify-center text-black dark:text-white text-lg font-medium">
                                {t('collections.create')}
                            </span>
                        </button>
                    </div>

                    {!!archivedMoodboards?.items?.length && (
                        <div className="mb-10">
                            <button
                                onClick={(e) => { e.stopPropagation(); setArchiveSectionOpen(o => !o); }}
                                className="flex items-center gap-2 mb-4 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/>
                                </svg>
                                <span className="text-sm font-medium">
                                    {tb('moodboard.archiveSection')} ({archivedMoodboards.items.length})
                                </span>
                                <svg
                                    width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                                    className={`transition-transform duration-200 ${archiveSectionOpen ? "rotate-180" : ""}`}
                                >
                                    <polyline points="6 9 12 15 18 9"/>
                                </svg>
                            </button>

                            {archiveSectionOpen && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {archivedMoodboards.items.map((mb) => (
                                        <MoodboardCard key={mb.id} mb={mb} isArchived />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    <h2 className="text-lg">{t('collections.randomIdeas')}</h2>
                    <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-6 gap-3">
                        {Pins?.map((pin) => (
                            <div key={pin.id} className="break-inside-avoid mb-3">
                                <PinCard pin={pin} />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <Modal
                isOpen={showCreateMoodboard}
                onClose={() => setShowCreateMoodboard(false)}
                width={420}
                height="auto"
                borderRadius={20}
            >
                <CreateMoodboardForm onSuccess={() => setShowCreateMoodboard(false)} />
            </Modal>
        </div>
    );
};

export default CollectionsPage;
