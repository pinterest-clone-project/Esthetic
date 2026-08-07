import { useEffect, useState } from "react";
import { CloseIcon } from "@/components/ui/Icons.tsx";
import { useGetMyMoodboardsQuery } from "../../services/moodboardService.ts";
import {useGetSavedLocationsQuery, useSavePinMutation, useUnsavePinMutation} from "../../services/pinService.ts";
import Modal from "./Modal.tsx";
import { APP_ENV } from "@/constants/env";
import { useToast } from "@/components/ui/Toast/UseToast.ts";
import { useTranslation } from "react-i18next";
import {useGetBoardSectionsQuery, useCreateBoardSectionMutation} from "@/services/boardSectionService.ts";

interface SaveModalProps {
    pinId: string;
    onClose: () => void;
}

const SaveModal = ({ pinId, onClose }: SaveModalProps) => {
    const { t } = useTranslation('boards');
    const { t: tc } = useTranslation('common');
    const { data: moodboards, isLoading: boardsLoading } = useGetMyMoodboardsQuery();
    const [savePin] = useSavePinMutation();
    const { showToast } = useToast();

    const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);
    const [createSectionOpen, setCreateSectionOpen] = useState(false);
    const [newSectionTitle, setNewSectionTitle] = useState("");

    const {data: sections, isLoading: sectionsLoading} = useGetBoardSectionsQuery(selectedBoardId!,{
        skip: !selectedBoardId
    });

    const { data: savedLocations = [] } =
        useGetSavedLocationsQuery(pinId);

    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        if (!selectedBoardId) {
            setIsSaved(false);
            return;
        }

        setIsSaved(
            savedLocations.some(
                location => location.boardId === selectedBoardId
            )
        );
    }, [savedLocations, selectedBoardId]);



    const [createSection] = useCreateBoardSectionMutation();

    const handleSave = async (sectionId?: string) => {
        if (!selectedBoardId) return;

        try {
            await savePin({
                pinId,
                boardId: selectedBoardId,
                sectionId
            }).unwrap();

            setIsSaved(true);

            showToast(
                tc('toast.savedToBoard'),
                "success"
            );

            onClose();

        } catch {
            showToast(
                tc('toast.somethingWentWrong'),
                "error"
            );
        }
    };

    const [unsavePin] = useUnsavePinMutation();

    const handleUnsave = async () => {
        if (!selectedBoardId) return;

        try {
            const locations = savedLocations.filter(
                x => x.boardId === selectedBoardId
            );

            await Promise.all(
                locations.map(location =>
                    unsavePin({
                        pinId,
                        boardId: location.boardId,
                        sectionId: location.sectionId ?? undefined
                    }).unwrap()
                )
            );

            setIsSaved(false);

            showToast(
                tc('toast.removedFromBoard'),
                "success"
            );

        } catch {
            showToast(
                tc('toast.somethingWentWrong'),
                "error"
            );
        }
    };


    const handleCreateSection = async () => {
        if (!selectedBoardId) return;
        if (!newSectionTitle.trim()) return;

        try {
            await createSection({
                boardId: selectedBoardId,
                title: newSectionTitle.trim()
            }).unwrap();

            setNewSectionTitle("");
            setCreateSectionOpen(false);

        } catch {
            showToast(
                tc('toast.somethingWentWrong'),
                "error"
            );
        }
    };



    const handleDone = () => {
        onClose();
    };

    const isLoading = boardsLoading;

    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            width={460}
            height="auto"
            borderRadius={16}
        >
            <div className="bg-black dark:bg-white rounded-2xl px-7 py-6 w-full">
                <div className="flex flex-col gap-5">

                    <div className="relative">
                        <h3 className="text-center text-white dark:text-black text-lg font-semibold">
                            {t('saveModal.title')}
                        </h3>
                        {selectedBoardId && (
                            <button
                                onClick={() => {
                                    setSelectedBoardId(null);
                                    setCreateSectionOpen(false);
                                }}
                                className="absolute left-0 text-xs text-gray-400 hover:text-white"
                            >
                                ← {tc('actions.back')}
                            </button>
                        )}

                        <button
                            onClick={onClose}
                            className="absolute top-0 right-0 w-7 h-7 flex items-center justify-center rounded-full bg-white/10 dark:bg-black/10 hover:bg-white/20 dark:hover:bg-black/20 transition-colors"
                        >
                            <CloseIcon size={12} strokeWidth={2.5} className="text-white dark:text-black" />
                        </button>
                    </div>


                    {isLoading && (
                        <div className="flex justify-center py-8">
                            <div className="w-6 h-6 rounded-full border-2 border-white/20 dark:border-black/20 border-t-[#1DB954] animate-spin" />
                        </div>
                    )}

                    {/* Empty */}
                    {!isLoading && !moodboards?.items?.length && (
                        <p className="text-gray-400 text-sm text-center py-8">{t('saveModal.noMoodboards')}</p>
                    )}

                    {/* Grid */}
                    {!selectedBoardId && !!moodboards?.items?.length && (
                        <div className="grid grid-cols-3 gap-3 mb-2 max-h-[340px] overflow-y-auto">
                            {moodboards.items.map(board => {
                                const thumb = board.coverImageUrl
                                    ? `${APP_ENV.IMAGES_400_URL}${board.coverImageUrl}`
                                    : null;

                                return (
                                    <div
                                        key={board.id}
                                        onClick={() => setSelectedBoardId(board.id)}
                                        className="cursor-pointer"
                                    >
                                        <div className="relative rounded-lg overflow-hidden aspect-square bg-white/30 dark:bg-black/10">
                                            {thumb ? (
                                                <img
                                                    src={thumb}
                                                    alt={board.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                                              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                    </svg>
                                                </div>
                                            )}

                                        </div>

                                        <p className="text-[11px] text-gray-400 truncate mt-1.5">
                                            {board.title}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {selectedBoardId && (
                        <div className="flex flex-col gap-3">

                            <button
                                onClick={() =>
                                    isSaved
                                        ? handleUnsave()
                                        : handleSave()
                                }
                                className="
        w-full py-3 rounded-xl
        bg-[#1DB954]
        dark:text-black text-white text-sm
        font-medium
    "
                            >
                                {isSaved
                                    ? t('saveModal.removeFromBoard')
                                    : t('saveModal.saveToBoard')}
                            </button>



                            <p className="text-xs text-gray-400">
                                Sections
                            </p>


                            {sectionsLoading && (
                                <p className="text-xs text-gray-400">
                                    Loading sections...
                                </p>
                            )}

                            {sections?.map(section => {
                                const sectionSaved = savedLocations.some(
                                    x =>
                                        x.boardId === selectedBoardId &&
                                        x.sectionId === section.id
                                );

                                return (
                                    <button
                                        key={section.id}
                                        onClick={() =>
                                            sectionSaved
                                                ? handleUnsave()
                                                : handleSave(section.id)
                                        }
                                        className="
                text-left px-4 py-3 rounded-xl dark:bg-gray-300 dark:hover:bg-gray-400 dark:text-black text-gray-300
                bg-white/30 hover:bg-white/20
            "
                                    >
                                        {sectionSaved
                                            ? `Remove from ${section.title}`
                                            : `Save to ${section.title}`
                                        }
                                    </button>
                                );
                            })}


                            <button
                                onClick={() => setCreateSectionOpen(true)}
                                className="text-[#1DB954] text-sm"
                            >
                                + Create section
                            </button>


                        </div>
                    )}

                    {createSectionOpen && (
                        <div className="flex gap-2">

                            <input
                                value={newSectionTitle}
                                onChange={(e)=>
                                    setNewSectionTitle(e.target.value)
                                }
                                placeholder="Section name"
                                className="
            flex-1 rounded-lg px-3 py-2 dark:text-black text-white
            bg-white/30 dark:bg-gray-300
            "
                            />

                            <button
                                onClick={handleCreateSection}
                                className="
        px-4 rounded-lg
        bg-[#1DB954]
        dark:text-black text-white text-sm
    "
                            >
                                Create
                            </button>


                        </div>
                    )}


                    <button
                        onClick={handleDone}
                        className="w-full h-10 bg-[#1DB954] hover:bg-[#1aa34a]
                        text-white dark:text-black text-sm font-medium rounded-lg transition-colors mt-1"
                    >
                        {t('saveModal.done')}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default SaveModal;
